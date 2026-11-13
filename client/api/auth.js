import { getPool } from './db.js';

function normalizeBirthDate(val) {
  if (!val) return '';
  const str = val.toString().trim();
  // Check if standard yyyy-mm-dd (ISO)
  const isoMatch = str.match(/^(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})$/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}${m}${y}`;
  }
  // Check if dd/mm/yyyy or d/m/yyyy
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  const { action } = req.query;

  try {
    // 1. ĐĂNG NHẬP
    if (action === 'login' && req.method === 'POST') {
      const { email, password } = req.body;
      const cleanLogin = (email || '').toString().trim();
      const cleanPassword = (password || '').toString().trim();

      if (!cleanLogin || !cleanPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ mã sinh viên/tài khoản và mật khẩu!' });
      }

      // 1.1 Kiểm tra đăng nhập sinh viên trong bảng class_students theo mã SV hoặc email
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
        // Xác thực mật khẩu với ngày tháng năm sinh (hỗ trợ cả 05012006 lẫn 05/01/2006)
        if (matchBirthDate(cleanPassword, stu.birth_date)) {
          return res.status(200).json({
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

      // 1.2 Nếu không tìm thấy sinh viên, kiểm tra tài khoản quản trị trong bảng users
      const userRes = await pool.query('SELECT * FROM users WHERE LOWER(TRIM(username)) = LOWER($1)', [cleanLogin]);
      if (userRes.rows.length > 0) {
        const user = userRes.rows[0];
        if (user.password !== cleanPassword) {
          return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        return res.status(200).json({
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
    }

    // 2. ĐĂNG KÝ
    if (action === 'register' && req.method === 'POST') {
      const { name, email, password, role } = req.body;
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
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.username,
          name: user.full_name,
          role: user.role
        }
      });
    }

    // 3. LẤY DANH SÁCH USERS
    if (req.method === 'GET') {
      const usersRes = await pool.query('SELECT id, username as email, full_name as name, role FROM users ORDER BY id ASC');
      return res.status(200).json({ success: true, data: usersRes.rows });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

