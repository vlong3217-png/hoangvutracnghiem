import React, { useState } from 'react';
import { Mail, Asterisk, Eye, EyeOff, AlertCircle, UserPlus, X, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
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

export default function LoginPage({ onLogin, onRegister, registeredUsers }) {
  const [emailOrUser, setEmailOrUser] = useState('student@test.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Chế độ đăng ký tài khoản (nếu cần)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [regRole, setRegRole] = useState('student');

  // Modal Đăng nhập bằng Google (chỉ dành cho Admin: vlong3217@gmail.com)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [showOtherAccountInput, setShowOtherAccountInput] = useState(false);
  const [otherGoogleEmail, setOtherGoogleEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!name.trim() || !emailOrUser.trim() || !password.trim()) {
        setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
        return;
      }
      setLoading(true);
      const res = await registerUser({
        name,
        email: emailOrUser,
        password,
        role: regRole
      });
      setLoading(false);

      if (!res.success) {
        setError(res.message || 'Lỗi khi đăng ký tài khoản.');
        return;
      }

      onRegister({
        ...res.user,
        roleName: res.user.role === 'admin' ? 'Admin' : 'Sinh viên'
      });
    } else {
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
    }
  };

  // Xử lý đăng nhập Google dành riêng cho Admin (vlong3217@gmail.com)
  const handleGoogleAdminLogin = (accountEmail = 'vlong3217@gmail.com') => {
    const emailNormalized = accountEmail.trim().toLowerCase();

    if (emailNormalized !== 'vlong3217@gmail.com') {
      setGoogleError(
        `Tài khoản Google "${accountEmail}" không có quyền Quản trị viên! Đăng nhập bằng Google chỉ dành riêng cho Admin (vlong3217@gmail.com). Sinh viên vui lòng đăng nhập bằng biểu mẫu bên dưới.`
      );
      return;
    }

    const adminUser = {
      id: "user-admin-vlong",
      name: "Long Hoàng Vũ",
      email: "vlong3217@gmail.com",
      role: "admin",
      roleName: "Admin",
      authProvider: "google"
    };

    setIsGoogleModalOpen(false);
    onLogin(adminUser);
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

      {/* 2. BACKGROUND CÁC CARD MINH HỌA NGHỆ THUẬT HAI BÊN (DECORATION) */}
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
          {/* Tiêu đề "Đăng nhập" */}
          <h1 className="text-[26px] font-bold text-center text-slate-900 mb-6 tracking-tight">
            {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập Quizizz'}
          </h1>

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* NÚT ĐĂNG NHẬP BẰNG GOOGLE (DÀNH CHO ADMIN) */}
          {!isRegisterMode && (
            <div className="mb-5 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setGoogleError('');
                  setShowOtherAccountInput(false);
                  setIsGoogleModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl font-bold text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer group"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Đăng nhập bằng Google</span>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full ml-0.5">
                  Admin
                </span>
              </button>

              {/* Đường phân cách */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  hoặc đăng nhập Sinh viên
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </div>
          )}

          {/* HỘP GỢI Ý ĐĂNG NHẬP MẪU CHO SINH VIÊN */}
          {!isRegisterMode && (
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
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nếu đang ở chế độ đăng ký */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 pl-0.5">
                  Họ và tên của bạn
                </label>
                <div className="border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-[#d82a7a] transition-all">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Input 1: Nhập địa chỉ email hoặc tên người dùng */}
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

            {/* Input 2: Nhập mật khẩu của bạn */}
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
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nếu đang đăng ký: chọn vai trò */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 pl-0.5">
                  Vai trò tài khoản
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 border border-slate-300 rounded-xl outline-none focus:border-[#d82a7a] bg-white"
                >
                  <option value="student">Sinh viên (Làm bài thi & xem kết quả)</option>
                  <option value="admin">Quản trị viên (Admin - Quản lý toàn diện)</option>
                </select>
              </div>
            )}

            {/* Nút bấm "Tiếp tục" màu hồng fuchsia / magenta đặc trưng */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c71e72] hover:bg-[#b01763] active:bg-[#971253] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang kiểm tra...' : isRegisterMode ? 'Đăng ký ngay' : 'Tiếp tục đăng nhập'}
              </button>
            </div>
          </form>

          {/* Quên mật khẩu & Chuyển đổi đăng ký/đăng nhập */}
          <div className="mt-5 text-center space-y-2">
            {!isRegisterMode && (
              <button
                type="button"
                onClick={() => alert("Mật khẩu tài khoản sinh viên mẫu là: 123")}
                className="text-xs font-semibold text-blue-600 hover:underline block mx-auto cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            )}

            <div className="text-xs text-slate-500">
              {isRegisterMode ? (
                <span>
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setError(''); }}
                    className="text-[#c71e72] font-bold hover:underline cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </span>
              ) : (
                <span>
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setError(''); }}
                    className="text-[#c71e72] font-bold hover:underline cursor-pointer"
                  >
                    Đăng ký tài khoản mới
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ĐĂNG NHẬP BẰNG GOOGLE CHUẨN (DÀNH RIÊNG CHO ADMIN) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header Google */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <GoogleIcon className="w-7 h-7 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Đăng nhập bằng Google
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn tài khoản Google để vào quyền Quản trị viên
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsGoogleModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông báo lỗi nếu chọn tài khoản khác */}
            {googleError && (
              <div className="my-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 leading-relaxed animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{googleError}</span>
              </div>
            )}

            {/* Danh sách tài khoản Google */}
            <div className="py-4 space-y-3">
              {/* 1. Tài khoản Admin chính thức: vlong3217@gmail.com */}
              <button
                type="button"
                onClick={() => handleGoogleAdminLogin('vlong3217@gmail.com')}
                className="w-full p-3.5 border-2 border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl flex items-center justify-between transition-all cursor-pointer group text-left shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar chữ L màu tím */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    L
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                      Long Hoàng Vũ
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      vlong3217@gmail.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-full shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                    Admin
                  </span>
                </div>
              </button>

              {/* 2. Lựa chọn tài khoản Google khác */}
              {!showOtherAccountInput ? (
                <button
                  type="button"
                  onClick={() => setShowOtherAccountInput(true)}
                  className="w-full p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center gap-3 text-left transition-colors cursor-pointer text-xs font-semibold text-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span>Sử dụng một tài khoản Google khác</span>
                </button>
              ) : (
                <div className="p-3.5 border border-slate-200 rounded-2xl space-y-2.5 bg-slate-50/50">
                  <label className="block text-xs font-bold text-slate-700">
                    Nhập địa chỉ email Google:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={otherGoogleEmail}
                      onChange={(e) => setOtherGoogleEmail(e.target.value)}
                      placeholder="vd: tenban@gmail.com"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleGoogleAdminLogin(otherGoogleEmail)}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shrink-0"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer lưu ý bảo mật */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center">
              Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email của bạn với Quizizz để xác thực phân quyền Quản trị viên.
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BẢN QUYỀN */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 Quizizz · Hệ thống thi trắc nghiệm
      </footer>
    </div>
  );
}
