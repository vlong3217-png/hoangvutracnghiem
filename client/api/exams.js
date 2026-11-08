import { getPool } from './db.js';

export default async function handler(req, res) {
  // Bật CORS cho mọi thiết bị
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  const { id } = req.query;

  try {
    // 1. TẠO HOẶC SAO CHÉP ĐỀ THI MỚI (POST /api/exams)
    if (req.method === 'POST') {
      const { id: newExamId, title, description, subject, difficulty, durationMinutes, shuffleQuestions, shuffleAnswers, questions } = req.body;
      const examId = newExamId || `exam-${Date.now()}`;
      
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(`
          INSERT INTO exams (id, title, description, subject, difficulty, duration_minutes, shuffle_questions, shuffle_answers)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            subject = EXCLUDED.subject,
            difficulty = EXCLUDED.difficulty,
            duration_minutes = EXCLUDED.duration_minutes,
            shuffle_questions = EXCLUDED.shuffle_questions,
            shuffle_answers = EXCLUDED.shuffle_answers,
            updated_at = CURRENT_TIMESTAMP
        `, [
          examId, 
          title || 'Đề thi mới', 
          description || '', 
          subject || 'Khoa học', 
          difficulty || 'Đại học', 
          Number(durationMinutes) || 45,
          Boolean(shuffleQuestions),
          Boolean(shuffleAnswers)
        ]);

        if (Array.isArray(questions) && questions.length > 0) {
          for (const q of questions) {
            await client.query(`
              INSERT INTO questions (id, exam_id, question_text, type, options, correct_answer, data)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (exam_id, id) DO UPDATE SET
                question_text = EXCLUDED.question_text,
                type = EXCLUDED.type,
                options = EXCLUDED.options,
                correct_answer = EXCLUDED.correct_answer,
                data = EXCLUDED.data
            `, [
              String(q.id),
              examId,
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
                explanation: q.explanation || null
              })
            ]);
          }
        }

        await client.query('COMMIT');
        return res.status(200).json({ success: true, message: 'Đã tạo đề thi thành công', examId });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    // 2. CẬP NHẬT ĐỀ THI & CÂU HỎI (PUT /api/exams?id=...)
    if (req.method === 'PUT' && id) {
      const { title, description, subject, difficulty, durationMinutes, shuffleQuestions, shuffleAnswers, questions } = req.body;
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
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $8
        `, [
          title, 
          description, 
          subject, 
          difficulty, 
          durationMinutes,
          shuffleQuestions !== undefined ? Boolean(shuffleQuestions) : null,
          shuffleAnswers !== undefined ? Boolean(shuffleAnswers) : null,
          id
        ]);

        if (Array.isArray(questions)) {
          await client.query('DELETE FROM questions WHERE exam_id = $1', [id]);
          for (const q of questions) {
            await client.query(`
              INSERT INTO questions (id, exam_id, question_text, type, options, correct_answer, data)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
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
                explanation: q.explanation || null
              })
            ]);
          }
        }

        await client.query('COMMIT');
        return res.status(200).json({ success: true, message: 'Cập nhật đề thi thành công' });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    // 3. XÓA ĐỀ THI (DELETE /api/exams?examId=...)
    if (req.method === 'DELETE') {
      const examIdToDelete = req.query.examId || id;
      if (examIdToDelete) {
        await pool.query('DELETE FROM exams WHERE id = $1', [examIdToDelete]);
        return res.status(200).json({ success: true, message: 'Đã xóa đề thi' });
      }
      return res.status(400).json({ success: false, message: 'Thiếu examId để xóa' });
    }

    // 4. LẤY CHI TIẾT 1 ĐỀ THI KÈM CÂU HỎI (GET /api/exams?id=...)
    if (req.method === 'GET' && id) {
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

      return res.status(200).json({
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
          questions
        }
      });
    }

    // 5. LẤY DANH SÁCH TOÀN BỘ ĐỀ THI (GET /api/exams)
    if (req.method === 'GET') {
      const examsRes = await pool.query(`
        SELECT e.*, COUNT(q.id) as question_count 
        FROM exams e 
        LEFT JOIN questions q ON e.id = q.exam_id 
        GROUP BY e.id 
        ORDER BY e.created_at ASC
      `);

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
        totalQuestions: parseInt(row.question_count, 10),
        statusBadge: `${row.question_count} Qs`,
        theme: themes[idx % themes.length],
        author: row.subject ? `Bộ môn ${row.subject}` : 'Giáo viên',
        className: row.description || 'Lớp học phần'
      }));

      return res.status(200).json({ success: true, data: formatted });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

