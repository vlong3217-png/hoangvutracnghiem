import crypto from 'node:crypto';

// Secret key dùng để ký HMAC-SHA256 cho Admin Session Token
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'hoangvu_quizizz_secure_jwt_secret_token_2026';
export const ADMIN_EMAIL = 'vlong3217@gmail.com';

/**
 * Tạo Admin Token có chữ ký số mật mã HMAC-SHA256
 */
export function signAdminToken(user) {
  const payload = {
    email: (user.email || '').toLowerCase().trim(),
    role: user.role || 'admin',
    name: user.name || 'Long Hoàng Vũ',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // Hạn dùng 7 ngày
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

/**
 * Xác thực Admin Token (chống can thiệp, chống giả mạo, kiểm tra hạn dùng)
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(body).digest('base64url');
    // So sánh thời gian không đổi (timingSafeEqual) chống timing attack
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    if (payload.role !== 'admin' || (payload.email || '').toLowerCase() !== ADMIN_EMAIL) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Kiểm tra xem request có phải từ Admin hợp lệ hay không
 */
export function isAuthorizedAdmin(req) {
  const headers = req.headers || {};
  const token = headers['x-admin-token'] || 
                (headers['authorization'] ? headers['authorization'].replace(/^Bearer\s+/i, '') : null);
  if (!token) return false;
  return Boolean(verifyAdminToken(token));
}

/**
 * Xác minh tính hợp lệ của token trực tiếp với máy chủ Google OAuth
 */
export async function verifyGoogleTokenWithServers({ credential, accessToken }) {
  try {
    if (credential) {
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.email) {
          return {
            email: data.email.toLowerCase().trim(),
            name: data.name || 'Long Hoàng Vũ',
            picture: data.picture
          };
        }
      }
    }
    if (accessToken) {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.email) {
          return {
            email: data.email.toLowerCase().trim(),
            name: data.name || 'Long Hoàng Vũ',
            picture: data.picture
          };
        }
      }
    }
  } catch (err) {
    console.error('Lỗi kết nối máy chủ Google OAuth:', err);
  }
  return null;
}
