/**
 * Quản lý lưu trữ và đồng bộ tiến độ làm bài thi của học sinh
 */

export function getUserKey(user) {
  if (!user) {
    try {
      const saved = localStorage.getItem('QUIZIZZ_CURRENT_USER') || localStorage.getItem('WAYGROUND_CURRENT_USER');
      if (saved) {
        const u = JSON.parse(saved);
        return (u.student_code || u.email || u.id || 'guest').toString().toLowerCase().trim();
      }
    } catch (e) {}
    return 'guest';
  }
  return (user.student_code || user.email || user.id || 'guest').toString().toLowerCase().trim();
}

export function getExamProgressKey(user, examId) {
  const uKey = getUserKey(user);
  return `QUIZIZZ_PROGRESS_${uKey}_${examId}`;
}

export function getExamProgress(user, examId) {
  if (!examId) return null;
  try {
    const key = getExamProgressKey(user, examId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Lỗi đọc tiến độ bài thi:', e);
    return null;
  }
}

export function saveExamProgress(user, examId, data) {
  if (!examId) return;
  try {
    const key = getExamProgressKey(user, examId);
    const existing = getExamProgress(user, examId) || {};
    const updated = {
      ...existing,
      ...data,
      examId,
      userKey: getUserKey(user),
      updatedAt: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('exam-progress-updated', { detail: { examId, progress: updated } }));
    return updated;
  } catch (e) {
    console.warn('Lỗi lưu tiến độ bài thi:', e);
  }
}

export function clearExamProgress(user, examId) {
  if (!examId) return;
  try {
    const key = getExamProgressKey(user, examId);
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('exam-progress-updated', { detail: { examId, progress: null } }));
  } catch (e) {}
}

export function getAllUserProgress(user) {
  const uKey = getUserKey(user);
  const prefix = `QUIZIZZ_PROGRESS_${uKey}_`;
  const result = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const examId = k.replace(prefix, '');
        try {
          result[examId] = JSON.parse(localStorage.getItem(k));
        } catch (e) {}
      }
    }
  } catch (e) {}
  return result;
}
