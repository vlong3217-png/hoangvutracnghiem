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
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại!' });
    }

    const user = userRes.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
    }

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

// -------------------------------------------------------------
// 3. EXAMS API (Lấy danh sách đề thi & chi tiết đề thi kèm câu hỏi)
// -------------------------------------------------------------
app.get('/api/exams', async (req, res) => {
  try {
    const examsRes = await pool.query(`
      SELECT e.*, COUNT(q.id) as question_count 
      FROM exams e 
      LEFT JOIN questions q ON e.id = q.exam_id 
      GROUP BY e.id 
      ORDER BY e.created_at ASC
    `);

    const formatted = examsRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      level: row.difficulty,
      duration: row.duration_minutes,
      totalQuestions: parseInt(row.question_count, 10),
      statusBadge: `${row.question_count} Qs`
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/exams/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const examRes = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
    if (examRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đề thi' });
    }

    const exam = examRes.rows[0];
    const questionsRes = await pool.query('SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC', [id]);

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

    res.json({
      success: true,
      data: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        subject: exam.subject,
        difficulty: exam.difficulty,
        durationMinutes: exam.duration_minutes,
        questions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

// Khởi chạy server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer();
