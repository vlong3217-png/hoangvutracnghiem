import { pool } from './db.js';
import { initialExams, mockUsers } from './data/mockExams.js';

async function seedData() {
  const client = await pool.connect();
  try {
    const examsList = initialExams || [];
    const usersList = mockUsers || [];

    console.log(`📦 Tìm thấy ${examsList.length} đề thi và ${usersList.length} tài khoản trong server/src/data/mockExams.js. Bắt đầu đẩy lên Neon PostgreSQL...`);

    // 0. Nạp tài khoản người dùng
    for (const u of usersList) {
      await client.query(`
        INSERT INTO users (username, password, full_name, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          role = EXCLUDED.role;
      `, [
        u.email || u.id,
        u.password || '123',
        u.name,
        u.role || 'student'
      ]);
    }
    console.log('  ✓ Đã import tài khoản mặc định.');

    for (const exam of examsList) {
      // 1. Thêm đề thi vào bảng exams
      await client.query(`
        INSERT INTO exams (id, title, description, subject, difficulty, duration_minutes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          subject = EXCLUDED.subject,
          difficulty = EXCLUDED.difficulty,
          duration_minutes = EXCLUDED.duration_minutes,
          updated_at = CURRENT_TIMESTAMP;
      `, [
        exam.id,
        exam.title,
        exam.description || exam.className || '',
        exam.subject || '',
        exam.level || exam.difficulty || 'Trung bình',
        exam.duration || exam.durationMinutes || 45
      ]);

      // 2. Thêm từng câu hỏi vào bảng questions
      for (const q of (exam.questions || [])) {
        await client.query(`
          INSERT INTO questions (id, exam_id, question_text, type, options, correct_answer, data)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (exam_id, id) DO UPDATE SET
            question_text = EXCLUDED.question_text,
            type = EXCLUDED.type,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            data = EXCLUDED.data;
        `, [
          String(q.id),
          exam.id,
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
            maxScore: q.maxScore || null
          })
        ]);
      }
      console.log(`  ✓ Đã import đề: ${exam.title} (${exam.questions.length} câu)`);
    }

    console.log('🎉 Toàn bộ đề thi đã được nạp lên Neon PostgreSQL thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedData();
