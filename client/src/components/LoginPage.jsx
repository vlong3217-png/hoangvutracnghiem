import React, { useState, useEffect } from 'react';
import { Mail, Asterisk, Eye, EyeOff, AlertCircle, ShieldCheck, KeyRound, ExternalLink, HelpCircle } from 'lucide-react';
import { loginUser } from '../services/api';
import QuizizzLogo from './QuizizzLogo';
// Biểu tượng Google chuẩn vector 4 màu chính thức
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
// Giải mã JWT credential token từ Google OAuth
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
export default function LoginPage({ onLogin, registeredUsers }) {
  const [emailOrUser, setEmailOrUser] = useState('student@test.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Quản lý Google Client ID
  const defaultClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('QUIZIZZ_GOOGLE_CLIENT_ID') || '249147434256-tlu69jjva0l5gl7sorsh05b7rlbmembo.apps.googleusercontent.com';
  const [googleClientId, setGoogleClientId] = useState(defaultClientId);
  const [googleStatus, setGoogleStatus] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // Xử lý khi nhận được token từ Google OAuth thật
  const handleGoogleCredentialResponse = async (response) => {
    setIsGoogleLoading(true);
    setGoogleStatus('Đang xác thực thông tin tài khoản Google...');
    setError('');
    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) {
      setError('Không thể đọc thông tin tài khoản từ Google. Vui lòng thử lại!');
      setIsGoogleLoading(false);
      setGoogleStatus('');
      return;
    }
    const email = payload.email.toLowerCase().trim();
    const fullName = payload.name || 'Long Hoàng Vũ';
    // KIỂM TRA PHÂN QUYỀN: Chỉ cho phép Admin vlong3217@gmail.com
    if (email !== 'vlong3217@gmail.com') {
      setError('⛔ Tài khoản này không có quyền Quản trị viên. Đăng nhập Google chỉ dành riêng cho Admin.');
      setIsGoogleLoading(false);
      setGoogleStatus('');
      return;
    }
    // Đăng nhập thành công với quyền Admin
    const adminUser = {
      id: "user-admin-vlong",
      name: fullName,
      email: email,
      role: "admin",
      roleName: "Admin",
      picture: payload.picture,
      authProvider: "google"
    };
    onLogin(adminUser);
  };
  // Khởi tạo Google Identity Services khi có googleClientId
  useEffect(() => {
    if (!googleClientId) return;
    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false
          });
          // Render nút Google thật chuẩn vào container nếu có
          const btnDiv = document.getElementById('googleRealButtonContainer');
          if (btnDiv) {
            btnDiv.innerHTML = '';
            window.google.accounts.id.renderButton(btnDiv, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center'
            });
          }
        } catch (err) {
          console.warn("Lỗi khởi tạo Google GSI:", err);
        }
      } else {
        setTimeout(checkGsi, 300);
      }
    };
    checkGsi();
  }, [googleClientId]);
  // Bấm nút "Đăng nhập bằng Google"
  const handleTriggerGoogleLogin = () => {
    setError('');
    // Dùng Google OAuth2 Token Client để luôn mở popup đăng nhập chính thức của Google
    if (window.google?.accounts?.oauth2) {
      try {
        setIsGoogleLoading(true);
        setGoogleStatus('Đang mở cửa sổ đăng nhập Google...');
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                setGoogleStatus('Đang xác thực thông tin tài khoản Google...');
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await userInfoRes.json();
                if (userInfo && userInfo.email) {
                  const email = userInfo.email.toLowerCase().trim();
                  if (email !== 'vlong3217@gmail.com') {
      setError('⛔ Tài khoản này không có quyền Quản trị viên. Đăng nhập Google chỉ dành riêng cho Admin.');
                    setIsGoogleLoading(false);
                    setGoogleStatus('');
                    return;
                  }
                  onLogin({
                    id: "user-admin-vlong",
                    name: userInfo.name || "Long Hoàng Vũ",
                    email: email,
                    role: "admin",
                    roleName: "Admin",
                    picture: userInfo.picture,
                    authProvider: "google"
                  });
                }
              } catch (e) {
                setError("Lỗi lấy thông tin Google User: " + e.message);
                setIsGoogleLoading(false);
                setGoogleStatus('');
              }
            } else {
              setIsGoogleLoading(false);
              setGoogleStatus('');
            }
          },
          error_callback: (err) => {
            console.error("Lỗi Google Auth:", err);
            setError("Đăng nhập Google bị hủy hoặc gặp sự cố.");
            setIsGoogleLoading(false);
            setGoogleStatus('');
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        console.error("Lỗi kích hoạt Google OAuth:", err);
        setError("Không thể mở cửa sổ đăng nhập Google: " + err.message);
        setIsGoogleLoading(false);
        setGoogleStatus('');
      }
    } else if (window.google?.accounts?.id) {
      // Fallback GSI Prompt
      try {
        window.google.accounts.id.prompt();
      } catch {
        setError("Đang tải thư viện Google, vui lòng thử lại sau 2 giây!");
      }
    } else {
      setError("Đang kết nối tới dịch vụ Google, vui lòng tải lại trang nếu chờ quá lâu!");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginUser(emailOrUser, password);
    setLoading(false);
    if (!res.success) {
      const found = registeredUsers.find(
        u => (u.email.toLowerCase() === emailOrUser.toLowerCase() || u.name.toLowerCase() === emailOrUser.toLowerCase()) && 
             u.password === password
      );
      if (!found) {
        setError(res.message || 'Email/Tên người dùng hoặc mật khẩu không chính xác!');
        return;
      }
      onLogin(found);
      return;
    }
    onLogin({
      ...res.user,
      roleName: res.user.role === 'admin' ? 'Admin' : 'Sinh viên'
    });
  };
  return (
    <div className="min-h-screen bg-white relative flex flex-col justify-between font-sans select-none overflow-x-hidden">
      {/* 1. LOGO GÓC TRÊN BÊN TRÁI QUIZIZZ */}
      <div className="absolute top-6 left-8 z-20 flex items-center gap-2 cursor-pointer">
        <QuizizzLogo className="w-8 h-8 text-[#d82a7a]" />
        <span className="text-[#d82a7a] font-black text-2xl tracking-tight">
          Quizizz
        </span>
      </div>
      {/* 2. BACKGROUND CÁC CARD MINH HỌA NGHỆ THUẬT HAI BÊN */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 w-64 opacity-60 pointer-events-none select-none space-y-4">
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 shadow-2xs transform -rotate-3 scale-95">
          <div className="w-16 h-2 bg-amber-200 rounded mb-2"></div>
          <div className="w-32 h-1.5 bg-slate-200 rounded mb-1.5"></div>
          <div className="w-24 h-1.5 bg-slate-200 rounded"></div>
        </div>
        <div className="bg-purple-50/60 border border-purple-200/60 rounded-xl p-3 shadow-2xs transform rotate-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-200 flex items-center justify-center text-[10px] font-bold text-purple-700">AI</div>
            <div className="w-20 h-2 bg-purple-200 rounded"></div>
          </div>
          <div className="w-full h-12 bg-purple-100/50 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-purple-300"></div>
          </div>
        </div>
        <div className="bg-teal-50/70 border border-teal-200/60 rounded-xl p-3 shadow-2xs transform -rotate-1">
          <div className="w-20 h-2 bg-teal-200 rounded mb-2"></div>
          <div className="h-10 border border-dashed border-teal-300 rounded-lg flex items-center justify-center text-[9px] text-teal-600">
            Bản đồ / Phân loại
          </div>
        </div>
      </div>
      <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-64 opacity-60 pointer-events-none select-none space-y-4">
        <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-3 shadow-2xs transform rotate-3">
          <div className="w-20 h-2 bg-rose-200 rounded mb-2"></div>
          <div className="h-14 bg-white/70 rounded-lg border border-rose-200 flex items-center justify-center text-[11px] font-mono text-rose-500">
            x² + 2xy + y²
          </div>
        </div>
        <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3 shadow-2xs transform -rotate-2">
          <div className="w-16 h-2 bg-blue-200 rounded mb-2"></div>
          <div className="h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] text-slate-400">
            VIDEO LESSON
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs transform rotate-1">
          <div className="w-16 h-2 bg-slate-300 rounded mb-1"></div>
          <div className="w-28 h-1.5 bg-slate-200 rounded"></div>
        </div>
      </div>
      {/* 3. KHU VỰC FORM ĐĂNG NHẬP Ở TRUNG TÂM */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-14 z-10">
        <div className="w-full max-w-[430px]">
          <h1 className="text-[26px] font-bold text-center text-slate-900 mb-6 tracking-tight">
            Đăng nhập Quizizz
          </h1>
          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {/* NÚT ĐĂNG NHẬP BẰNG GOOGLE THẬT (DÀNH CHO ADMIN) */}
          <div className="mb-5 space-y-4">
            {/* Nơi render nút Google GSI thật nếu có Client ID */}
            <div id="googleRealButtonContainer" className="w-full min-h-[44px]">
              <button
                type="button"
                onClick={handleTriggerGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl font-bold text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer group"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Đăng nhập bằng Google</span>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full ml-0.5">
                  Admin
                </span>
              </button>
            </div>
            {googleStatus && (
              <p className="text-[11px] text-center text-purple-700 font-semibold animate-pulse">
                {googleStatus}
              </p>
            )}
            {/* Đường phân cách */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                hoặc đăng nhập Sinh viên
              </span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          </div>
          {/* HỘP GỢI Ý ĐĂNG NHẬP MẪU CHO SINH VIÊN */}
          <div className="mb-4 p-3 bg-pink-50/50 border border-pink-200/70 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
            <span className="text-base leading-none">💡</span>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-800">Tài khoản Sinh viên: </span>
              <span className="text-[#c71e72] font-mono font-bold">student@test.com</span>
              <span className="mx-1.5 text-slate-300">•</span>
              <span className="font-bold text-slate-800">Mật khẩu: </span>
              <span className="text-[#c71e72] font-mono font-bold">123</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 pl-0.5">
                Nhập địa chỉ email hoặc tên người dùng
              </label>
              <div className="border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white flex items-center gap-2.5 focus-within:border-[#d82a7a] focus-within:ring-1 focus-within:ring-[#d82a7a]/20 transition-all">
                <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                <input
                  type="text"
                  required
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="name@example.com hoặc username"
                  className="w-full text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
            </div>
            {/* Input Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 pl-0.5">
                Nhập mật khẩu của bạn
              </label>
              <div className="border border-[#e77a9e] rounded-xl px-3.5 py-2.5 bg-white flex items-center gap-2.5 focus-within:border-[#d82a7a] focus-within:ring-1 focus-within:ring-[#d82a7a]/20 transition-all">
                <Asterisk className="w-4 h-4 text-slate-600 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu của bạn"
                  className="w-full text-xs text-slate-900 placeholder:text-slate-400 outline-none bg-transparent tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Nút đăng nhập Sinh viên */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c71e72] hover:bg-[#b01763] active:bg-[#971253] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang kiểm tra...' : 'Tiếp tục đăng nhập'}
              </button>
            </div>
          </form>
          {/* Quên mật khẩu */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => alert("Mật khẩu tài khoản sinh viên mẫu là: 123")}
              className="text-xs font-semibold text-blue-600 hover:underline block mx-auto cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
        </div>
    </div>
  );
}