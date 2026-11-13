import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// 1. HEALTH CHECK API
// -------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      message: 'Backend và Neon PostgreSQL kết nối tốt!',
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// -------------------------------------------------------------
// 2. AUTH API (Đăng nhập / Đăng ký)
// -------------------------------------------------------------
function normalizeBirthDate(val) {
  if (!val) return '';
  const str = val.toString().trim();
  const isoMatch = str.match(/^(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})$/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}${m}${y}`;
  }
  const dmyMatch = str.match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${d}${m}${y}`;
  }
  return str.replace(/\D/g, '');
}

function matchBirthDate(inputPassword, studentBirthDate) {
  if (!inputPassword || !studentBirthDate) return false;
  const rawInput = inputPassword.toString().trim();
  const rawDb = studentBirthDate.toString().trim();

  if (rawInput.toLowerCase() === rawDb.toLowerCase()) return true;

  const normInput = normalizeBirthDate(rawInput);
  const normDb = normalizeBirthDate(rawDb);

  if (normInput && normDb && normInput === normDb) return true;

  return false;
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const cleanLogin = (email || '').toString().trim();
  const cleanPassword = (password || '').toString().trim();

  if (!cleanLogin || !cleanPassword) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mã sinh viên/tài khoản và mật khẩu!' });
  }

  try {
    // 1. Kiểm tra trong danh sách sinh viên theo mã SV hoặc email
    const studentRes = await pool.query(`
      SELECT cs.*, c.name as class_name 
      FROM class_students cs
      LEFT JOIN classes c ON cs.class_id = c.id
      WHERE LOWER(TRIM(cs.student_code)) = LOWER($1)
         OR LOWER(TRIM(cs.email)) = LOWER($1)
      LIMIT 1
    `, [cleanLogin]);

    if (studentRes.rows.length > 0) {
      const stu = studentRes.rows[0];
      if (matchBirthDate(cleanPassword, stu.birth_date)) {
        return res.json({
          success: true,
          user: {
            id: stu.id,
            student_code: stu.student_code,
            name: stu.name,
            email: stu.email || `${stu.student_code}@student.edu.vn`,
            birth_date: stu.birth_date,
            class_id: stu.class_id,
            class_name: stu.class_name,
            role: 'student',
            roleName: 'Sinh viên'
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Mật khẩu (ngày tháng năm sinh) không chính xác! Ví dụ: 05012006 hoặc 05/01/2006' 
        });
      }
    }

    // 2. Kiểm tra tài khoản admin/giáo viên trong users
    const userRes = await pool.query('SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER($1)', [cleanLogin]);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      if (user.password !== cleanPassword) {
        return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.username,
          name: user.full_name,
          role: user.role,
          roleName: user.role === 'admin' ? 'Admin' : 'Giáo viên'
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Mã sinh viên hoặc tài khoản không tồn tại trên hệ thống!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email này đã tồn tại trong hệ thống!' });
    }

    const insertRes = await pool.query(`
      INSERT INTO users (username, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, full_name, role;
    `, [email, password, name, role || 'student']);

    const user = insertRes.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.username,
        name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách tài khoản (dành cho Admin)
app.get('/api/users', async (req, res) => {
  try {
    const usersRes = await pool.query('SELECT id, username as email, full_name as name, role, created_at FROM users ORDER BY id ASC');
    res.json({ success: true, data: usersRes.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. EXAMS API (Lấy danh sách đề thi & chi tiết đề thi kèm câu hỏi)
// -------------------------------------------------------------
// Hàm xử lý lấy chi tiết 1 đề thi kèm toàn bộ câu hỏi
function parseAssignedClasses(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const p = JSON.parse(val);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

async function getExamDetailById(id, res) {
  try {
    const examRes = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
    if (examRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề thi' });
    }

    const exam = examRes.rows[0];
    const questionsRes = await pool.query('SELECT * FROM questions WHERE exam_id = $1 ORDER BY COALESCE(sort_order, 0) ASC, created_at ASC', [id]);

    const questions = questionsRes.rows.map(q => {
      const extraData = q.data || {};
      return {
        id: q.id,
        question: q.question_text,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correct_answer,
        ...extraData
      };
    });

    return res.json({
      success: true,
      data: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        subject: exam.subject,
        difficulty: exam.difficulty,
        durationMinutes: exam.duration_minutes,
        shuffleQuestions: Boolean(exam.shuffle_questions),
        shuffleAnswers: Boolean(exam.shuffle_answers),
        assigned_classes: parseAssignedClasses(exam.assigned_classes),
        questions
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

app.get('/api/exams', async (req, res) => {
  const { id } = req.query;
  if (id) {
    return getExamDetailById(id, res);
  }

  try {
    const examsRes = await pool.query(`
      SELECT e.*, COUNT(q.id) as question_count 
      FROM exams e 
      LEFT JOIN questions q ON e.id = q.exam_id 
      GROUP BY e.id 
      ORDER BY e.created_at ASC
    `);

    // Danh sách theme màu sắc đẹp mắt
    const themes = ['blue', 'teal', 'coral', 'orange', 'purple'];

    const formatted = examsRes.rows.map((row, idx) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      level: row.difficulty,
      duration: row.duration_minutes,
      shuffleQuestions: Boolean(row.shuffle_questions),
      shuffleAnswers: Boolean(row.shuffle_answers),
      assigned_classes: parseAssignedClasses(row.assigned_classes),
      totalQuestions: parseInt(row.question_count, 10),
      statusBadge: `${row.question_count} Qs`,
      theme: themes[idx % themes.length],
      author: row.subject ? `Bộ môn ${row.subject}` : 'Giáo viên',
      className: row.description || 'Lớp học phần'
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/exams/:id', async (req, res) => {
  const { id } = req.params;
  return getExamDetailById(id, res);
});

// Xóa đề thi khỏi CSDL
app.delete('/api/exams/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM exams WHERE id = $1', [id]);
    res.json({ success: true, message: 'Đã xóa đề thi thành công' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cập nhật câu hỏi của đề thi
app.put(['/api/exams', '/api/exams/:id'], async (req, res) => {
  const id = req.params.id || req.query.id || req.body.id || req.body.examId;
  const { title, description, subject, difficulty, durationMinutes, shuffleQuestions, shuffleAnswers, questions, assigned_classes, assignedClasses } = req.body;
  const rawAssigned = assigned_classes !== undefined ? assigned_classes : assignedClasses;
  const jsonAssigned = rawAssigned !== undefined ? (Array.isArray(rawAssigned) ? JSON.stringify(rawAssigned) : String(rawAssigned)) : null;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Thiếu exam id' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE exams 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          subject = COALESCE($3, subject),
          difficulty = COALESCE($4, difficulty),
          duration_minutes = COALESCE($5, duration_minutes),
          shuffle_questions = COALESCE($6, shuffle_questions),
          shuffle_answers = COALESCE($7, shuffle_answers),
          assigned_classes = COALESCE($8, assigned_classes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
    `, [
      title, 
      description, 
      subject, 
      difficulty, 
      durationMinutes,
      shuffleQuestions !== undefined ? Boolean(shuffleQuestions) : null,
      shuffleAnswers !== undefined ? Boolean(shuffleAnswers) : null,
      jsonAssigned,
      id
    ]);

    if (Array.isArray(questions)) {
      await client.query('DELETE FROM questions WHERE exam_id = $1', [id]);
      for (let qIdx = 0; qIdx < questions.length; qIdx++) {
        const q = questions[qIdx];
        await client.query(`
          INSERT INTO questions (id, exam_id, question_text, type, options, correct_answer, data, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          String(q.id),
          id,
          q.question || '',
          q.type || 'single',
          JSON.stringify(q.options || []),
          JSON.stringify(q.correctAnswer ?? null),
          JSON.stringify({
            parts: q.parts || null,
            categories: q.categories || null,
            items: q.items || null,
            sentences: q.sentences || null,
            draggableItems: q.draggableItems || null,
            blanks: q.blanks || null,
            sampleAnswer: q.sampleAnswer || null,
            criteria: q.criteria || q.rubric || null,
            maxScore: q.maxScore || null,
            explanation: q.explanation || null,
            image: q.image || null,
            video: q.video || null,
            timeLimit: q.timeLimit || null,
            points: q.points || null
          }),
          qIdx
        ]);
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Cập nhật đề thi thành công' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// -------------------------------------------------------------
// 4. SUBMISSIONS API (Nộp bài thi & Lịch sử thi)
// -------------------------------------------------------------
app.post('/api/submissions', async (req, res) => {
  const { examId, username, score, accuracyPercent, timeSpentSeconds, answers } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO submissions (exam_id, username, score, accuracy_percent, time_spent_seconds, answers)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [
      examId,
      username || 'Thí sinh',
      score || 0,
      accuracyPercent || 0,
      timeSpentSeconds || 0,
      JSON.stringify(answers || {})
    ]);

    res.json({ success: true, submission: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/submissions/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, e.title as exam_title 
      FROM submissions s
      JOIN exams e ON s.exam_id = e.id
      WHERE s.username = $1
      ORDER BY s.created_at DESC
    `, [username]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. CLASSES & STUDENTS API (Quản lý Lớp học & Sinh viên)
// -------------------------------------------------------------

// Lấy danh sách toàn bộ lớp học kèm số lượng học sinh
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.description, 
        c.color, 
        c.created_at, 
        c.updated_at,
        COUNT(cs.id)::int as student_count
      FROM classes c
      LEFT JOIN class_students cs ON c.id = cs.class_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tạo lớp học mới
app.post('/api/classes', async (req, res) => {
  const { name, description, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Tên lớp học không được để trống' });
  }

  const id = `class-${Date.now()}`;
  try {
    const result = await pool.query(`
      INSERT INTO classes (id, name, description, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *, 0 as student_count
    `, [id, name.trim(), description || '', color || '#22c55e']);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy thông tin chi tiết 1 lớp học kèm danh sách sinh viên
app.get('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const classRes = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
    if (classRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
    }

    const studentsRes = await pool.query(`
      SELECT id, class_id, name, email, student_code, birth_date, joined_at
      FROM class_students
      WHERE class_id = $1
      ORDER BY joined_at DESC
    `, [id]);

    const classData = {
      ...classRes.rows[0],
      student_count: studentsRes.rows.length,
      students: studentsRes.rows
    };

    res.json({ success: true, data: classData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cập nhật thông tin lớp học (đổi tên, màu, mô tả)
app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, color } = req.body;

  try {
    const result = await pool.query(`
      UPDATE classes 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        color = COALESCE($3, color),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [name ? name.trim() : null, description, color, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xóa lớp học
app.delete('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Đã xóa lớp học thành công' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Thêm sinh viên vào lớp (hỗ trợ 1 hoặc nhiều sinh viên từ form hoặc Excel)
app.post('/api/classes/:id/students', async (req, res) => {
  const { id: classId } = req.params;
  const { name, email, student_code, birth_date, students } = req.body;

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const inserted = [];
      if (Array.isArray(students) && students.length > 0) {
        for (const s of students) {
          if (s.name && s.name.trim()) {
            const sid = `stu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const r = await client.query(`
              INSERT INTO class_students (id, class_id, name, email, student_code, birth_date)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING *
            `, [sid, classId, s.name.trim(), s.email || '', s.student_code || '', s.birth_date || '']);
            inserted.push(r.rows[0]);
          }
        }
      } else if (name && name.trim()) {
        const sid = `stu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const r = await client.query(`
          INSERT INTO class_students (id, class_id, name, email, student_code, birth_date)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [sid, classId, name.trim(), email || '', student_code || '', birth_date || '']);
        inserted.push(r.rows[0]);
      } else {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Thông tin sinh viên không hợp lệ' });
      }

      await client.query('COMMIT');
      res.json({ success: true, data: inserted, message: `Đã thêm ${inserted.length} sinh viên vào lớp` });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xóa nhiều sinh viên khỏi lớp
app.delete('/api/classes/:id/students', async (req, res) => {
  const { id: classId } = req.params;
  const { studentIds } = req.query;
  const bodyIds = req.body?.studentIds;
  try {
    const raw = studentIds || bodyIds || '';
    const ids = (Array.isArray(raw) ? raw : raw.split(',')).map(s => s.trim()).filter(Boolean);
    if (ids.length > 0) {
      await pool.query('DELETE FROM class_students WHERE class_id = $1 AND id = ANY($2)', [classId, ids]);
      return res.json({ success: true, message: `Đã xóa ${ids.length} sinh viên khỏi lớp` });
    }
    return res.status(400).json({ success: false, message: 'Không có sinh viên nào để xóa' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xóa sinh viên khỏi lớp
app.delete('/api/classes/:id/students/:studentId', async (req, res) => {
  const { id: classId, studentId } = req.params;
  try {
    await pool.query('DELETE FROM class_students WHERE class_id = $1 AND id = $2', [classId, studentId]);
    res.json({ success: true, message: 'Đã xóa sinh viên khỏi lớp' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Khởi chạy server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer();

