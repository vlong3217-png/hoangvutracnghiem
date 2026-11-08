import { getPool } from './db.js';

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
      const userRes = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại!' });
      }

      const user = userRes.rows[0];
      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
      }

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

