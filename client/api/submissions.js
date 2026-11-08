import { getPool } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();

  try {
    if (req.method === 'POST') {
      const { examId, username, score, accuracyPercent, timeSpentSeconds, answers } = req.body;
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

      return res.status(200).json({ success: true, submission: result.rows[0] });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

