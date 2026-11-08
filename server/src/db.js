import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Hàm khởi tạo các bảng CSDL
export async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('📡 Đang kết nối tới Neon PostgreSQL...');

    // 1. Bảng Người dùng (Users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(150),
        role VARCHAR(20) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Bảng Đề thi (Exams)
    await client.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        difficulty VARCHAR(50),
        duration_minutes INT DEFAULT 45,
        shuffle_questions BOOLEAN DEFAULT FALSE,
        shuffle_answers BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE exams ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT FALSE;
      ALTER TABLE exams ADD COLUMN IF NOT EXISTS shuffle_answers BOOLEAN DEFAULT FALSE;
    `);

    // 3. Bảng Câu hỏi (Khóa chính gồm exam_id + id để các đề thi có thể đánh số câu từ 1, 2, 3 độc lập)
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(100) NOT NULL,
        exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'single',
        options JSONB,
        correct_answer JSONB,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (exam_id, id)
      );
    `);

    // 4. Bảng Kết quả nộp bài (Submissions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        exam_id VARCHAR(100) REFERENCES exams(id) ON DELETE CASCADE,
        username VARCHAR(100),
        score INT DEFAULT 0,
        accuracy_percent NUMERIC(5,2) DEFAULT 0,
        time_spent_seconds INT DEFAULT 0,
        answers JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Khởi tạo các bảng PostgreSQL trên Neon thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo CSDL:', error);
    throw error;
  } finally {
    client.release();
  }
}

