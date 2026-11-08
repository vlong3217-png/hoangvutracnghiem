// Cấu hình Base API URL kết nối tới Backend
// Trên Vercel hoặc production, tự động dùng Serverless Functions (/api/...)
// Khi chạy localhost dev cục bộ, tự động kết nối cổng 5000 hoặc /api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api');

/**
 * Lấy danh sách toàn bộ đề thi từ CSDL Neon PostgreSQL
 * Có cơ chế tự động thử lại (retry) khi Neon PostgreSQL đang khởi động (cold start)
 */
export async function fetchExams(retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams`);
      if (!res.ok && attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        continue;
      }
      const json = await res.json();
      if (json.success) return json.data;
      throw new Error(json.message || 'Lỗi tải đề thi');
    } catch (err) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        continue;
      }
      console.warn('⚠️ Lỗi gọi Backend:', err);
      return null;
    }
  }
}

/**
 * Lấy chi tiết đề thi kèm câu hỏi theo ID từ CSDL Neon PostgreSQL
 */
export async function fetchExamById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/exams?id=${id}`);
    const json = await res.json();
    if (json.success) return json.data;
    throw new Error(json.message || 'Không tìm thấy đề thi');
  } catch (err) {
    console.warn(`⚠️ Lỗi tải chi tiết đề thi ${id} từ Backend:`, err);
    return null;
  }
}

/**
 * Đăng nhập người dùng qua Backend CSDL
 */
export async function loginUser(email, password) {
  try {
    const endpoint = API_BASE_URL.startsWith('http://localhost:5000') 
      ? `${API_BASE_URL}/auth/login`
      : `${API_BASE_URL}/auth?action=login`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Không thể kết nối đến máy chủ Backend' };
  }
}

/**
 * Đăng ký người dùng qua Backend CSDL
 */
export async function registerUser({ name, email, password, role }) {
  try {
    const endpoint = API_BASE_URL.startsWith('http://localhost:5000') 
      ? `${API_BASE_URL}/auth/register`
      : `${API_BASE_URL}/auth?action=register`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Không thể kết nối đến máy chủ Backend' };
  }
}

/**
 * Lấy danh sách toàn bộ người dùng từ CSDL
 */
export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth`);
    const json = await res.json();
    if (json.success) return json.data;
    return [];
  } catch (err) {
    return [];
  }
}

/**
 * Xóa đề thi trên CSDL
 */
export async function deleteExamApi(examId) {
  try {
    const res = await fetch(`${API_BASE_URL}/exams?examId=${examId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật đề thi trên CSDL
 */
export async function updateExamApi(examId, examData) {
  try {
    const res = await fetch(`${API_BASE_URL}/exams?id=${examId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Lưu lịch sử kết quả thi vào CSDL Neon PostgreSQL
 */
export async function submitExamResult(resultData) {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultData)
    });
    return await res.json();
  } catch (err) {
    console.error('Lỗi lưu kết quả bài thi:', err);
    return null;
  }
}

