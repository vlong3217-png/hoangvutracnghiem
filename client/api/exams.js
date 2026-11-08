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
    // 1. LẤY CHI TIẾT 1 ĐỀ THI KÈM CÂU HỎI
    if (id) {
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
          questions
        }
      });
    }

    // 2. LẤY DANH SÁCH TOÀN BỘ ĐỀ THI
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
        totalQuestions: parseInt(row.question_count, 10),
        statusBadge: `${row.question_count} Qs`,
        theme: themes[idx % themes.length],
        author: row.subject ? `Bộ môn ${row.subject}` : 'Giáo viên',
        className: row.description || 'Lớp học phần'
      }));

      return res.status(200).json({ success: true, data: formatted });
    }

    // 3. XÓA ĐỀ THI
    if (req.method === 'DELETE') {
      const { examId } = req.query;
      await pool.query('DELETE FROM exams WHERE id = $1', [examId]);
      return res.status(200).json({ success: true, message: 'Đã xóa đề thi' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
