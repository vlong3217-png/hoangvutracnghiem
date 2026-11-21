/**
 * Trích xuất timestamp (milliseconds) thực tế của bài thi
 * Ưu tiên: createdAt / created_at / updatedAt / ID có chứa timestamp
 */
export function getExamTimestamp(exam) {
  if (!exam) return 0;

  // 1. Kiểm tra các trường ngày tháng chuẩn từ CSDL
  const candidates = [
    exam.createdAt,
    exam.created_at,
    exam.updatedAt,
    exam.updated_at
  ];

  for (const cand of candidates) {
    if (cand) {
      if (typeof cand === 'number' && cand > 1000000000) return cand;
      const t = new Date(cand).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
  }

  // 2. Trích xuất timestamp từ id nếu có dạng exam-1795248621496
  if (typeof exam.id === 'string') {
    const match = exam.id.match(/(\d{10,13})/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 1000000000) return num;
    }
  }

  return 0;
}

/**
 * Định dạng thời gian tạo bài thi theo thời gian thực (Vietnamese relative time)
 */
export function formatExamTimeAgo(exam) {
  if (!exam) return '';

  const timestamp = getExamTimestamp(exam);
  if (!timestamp) {
    return exam.createdAtText || 'Gần đây';
  }

  const now = Date.now();
  const diffMs = now - timestamp;

  // Nếu bài vừa tạo trong tương lai vài giây (lệch đồng hồ) hoặc < 60 giây
  if (diffMs < 60 * 1000) {
    return 'Vừa xong';
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'Hôm qua';
  }
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks} tuần trước`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} tháng trước`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} năm trước`;
}
