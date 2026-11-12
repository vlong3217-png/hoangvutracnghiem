import { getPool } from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  const { id, studentId, action } = req.query;

  try {
    // Đảm bảo bảng classes và class_students tồn tại
    const initClient = await pool.connect();
    try {
      await initClient.query(`
        CREATE TABLE IF NOT EXISTS classes (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          color VARCHAR(50) DEFAULT '#22c55e',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS class_students (
          id VARCHAR(100) PRIMARY KEY,
          class_id VARCHAR(100) REFERENCES classes(id) ON DELETE CASCADE,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150),
          student_code VARCHAR(50),
          birth_date VARCHAR(50),
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE class_students ADD COLUMN IF NOT EXISTS birth_date VARCHAR(50);
      `);
    } finally {
      initClient.release();
    }

    // 1. GET: Danh sách lớp hoặc chi tiết 1 lớp kèm danh sách học sinh
    if (req.method === 'GET') {
      if (id) {
        // Chi tiết 1 lớp
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

        return res.json({
          success: true,
          data: {
            ...classRes.rows[0],
            student_count: studentsRes.rows.length,
            students: studentsRes.rows
          }
        });
      } else {
        // Danh sách toàn bộ lớp học
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
        return res.json({ success: true, data: result.rows });
      }
    }

    // 2. POST: Tạo lớp mới HOẶC Thêm học sinh vào lớp (từ form hoặc Excel)
    if (req.method === 'POST') {
      // Trường hợp thêm học sinh vào lớp đã có: có query id hoặc body classId
      if (id || action === 'add_student' || (req.body.classId && !req.body.createWithStudents)) {
        const targetClassId = id || req.body.classId;
        const { name: stuName, email: stuEmail, student_code, birth_date, students } = req.body;

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
                `, [sid, targetClassId, s.name.trim(), s.email || '', s.student_code || '', s.birth_date || '']);
                inserted.push(r.rows[0]);
              }
            }
          } else if (stuName && stuName.trim()) {
            const sid = `stu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const r = await client.query(`
              INSERT INTO class_students (id, class_id, name, email, student_code, birth_date)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING *
            `, [sid, targetClassId, stuName.trim(), stuEmail || '', student_code || '', birth_date || '']);
            inserted.push(r.rows[0]);
          } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Thông tin sinh viên không hợp lệ' });
          }

          await client.query('COMMIT');
          return res.json({
            success: true,
            data: inserted,
            message: `Đã thêm ${inserted.length} sinh viên vào lớp`
          });
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      }

      // Tạo lớp học mới (có thể kèm danh sách học sinh từ file Excel)
      const { name, description, color, students } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Tên lớp học không được để trống' });
      }

      const classId = `class-${Date.now()}`;
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const classRes = await client.query(`
          INSERT INTO classes (id, name, description, color)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [classId, name.trim(), description || '', color || '#22c55e']);

        let studentCount = 0;
        if (Array.isArray(students) && students.length > 0) {
          for (const s of students) {
            if (s.name && s.name.trim()) {
              const sid = `stu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
              await client.query(`
                INSERT INTO class_students (id, class_id, name, email, student_code, birth_date)
                VALUES ($1, $2, $3, $4, $5, $6)
              `, [sid, classId, s.name.trim(), s.email || '', s.student_code || '', s.birth_date || '']);
              studentCount++;
            }
          }
        }

        await client.query('COMMIT');
        return res.json({
          success: true,
          data: {
            ...classRes.rows[0],
            student_count: studentCount
          }
        });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    // 3. PUT: Cập nhật thông tin lớp (đổi tên, màu, mô tả)
    if (req.method === 'PUT') {
      const targetId = id || req.body.id;
      const { name, description, color } = req.body;

      if (!targetId) {
        return res.status(400).json({ success: false, message: 'Thiếu id lớp học cần cập nhật' });
      }

      const result = await pool.query(`
        UPDATE classes 
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          color = COALESCE($3, color),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `, [name ? name.trim() : null, description, color, targetId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
      }

      return res.json({ success: true, data: result.rows[0] });
    }

    // 4. DELETE: Xóa lớp học HOẶC Xóa học sinh khỏi lớp
    if (req.method === 'DELETE') {
      if (studentId) {
        // Xóa học sinh khỏi lớp
        await pool.query('DELETE FROM class_students WHERE id = $1', [studentId]);
        return res.json({ success: true, message: 'Đã xóa sinh viên khỏi lớp' });
      }

      if (id) {
        // Xóa lớp học
        await pool.query('DELETE FROM classes WHERE id = $1', [id]);
        return res.json({ success: true, message: 'Đã xóa lớp học thành công' });
      }

      return res.status(400).json({ success: false, message: 'Thiếu thông tin cần xóa' });
    }

    return res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
  } catch (err) {
    console.error('Lỗi API /api/classes:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

