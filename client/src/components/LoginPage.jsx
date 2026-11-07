import React, { useState } from 'react';
import { Mail, Asterisk, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin, onRegister, registeredUsers }) {
  const [emailOrUser, setEmailOrUser] = useState('student@test.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Chế độ đăng ký tài khoản (nếu cần)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [regRole, setRegRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!name.trim() || !emailOrUser.trim() || !password.trim()) {
        setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
        return;
      }
      const existing = registeredUsers.find(
        u => u.email.toLowerCase() === emailOrUser.toLowerCase()
      );
      if (existing) {
        setError('Email này đã tồn tại trong hệ thống!');
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email: emailOrUser,
        password,
        role: regRole,
        roleName: regRole === 'admin' ? 'Admin' : 'Sinh viên'
      };

      onRegister(newUser);
    } else {
      const found = registeredUsers.find(
        u => (u.email.toLowerCase() === emailOrUser.toLowerCase() || u.name.toLowerCase() === emailOrUser.toLowerCase()) && 
             u.password === password
      );

      if (!found) {
        setError('Email/Tên người dùng hoặc mật khẩu không chính xác!');
        return;
      }

      onLogin(found);
    }
  };

  const handleQuickLogin = (user) => {
    setEmailOrUser(user.email);
    setPassword(user.password);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col justify-between font-sans select-none overflow-x-hidden">
      {/* 1. LOGO GÓC TRÊN BÊN TRÁI WAYGROUND */}
      <div className="absolute top-6 left-8 z-20">
        <div className="flex items-center cursor-pointer">
          <span className="text-[#d82a7a] font-black text-2xl tracking-tighter">
            WAYGROUND
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium italic -mt-0.5">
          formerly Quizizz
        </div>
      </div>

      {/* 2. BACKGROUND CÁC CARD MINH HỌA NGHỆ THUẬT HAI BÊN (DECORATION) */}
      {/* Cụm trang trí bên trái */}
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

      {/* Cụm trang trí bên phải */}
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

      {/* 3. KHU VỰC FORM ĐĂNG NHẬP Ở TRUNG TÂM (CHUẨN 100% THEO ẢNH) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 z-10">
        <div className="w-full max-w-[430px]">
          {/* Tiêu đề "Đăng nhập" */}
          <h1 className="text-[26px] font-bold text-center text-slate-900 mb-8 tracking-tight">
            {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </h1>

          {/* Thông báo lỗi nếu có */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
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
                className="w-full py-3 bg-[#c71e72] hover:bg-[#b01763] active:bg-[#971253] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                {isRegisterMode ? 'Đăng ký ngay' : 'Tiếp tục'}
              </button>
            </div>
          </form>

          {/* Quên mật khẩu & Chuyển đổi đăng ký/đăng nhập */}
          <div className="mt-5 text-center space-y-2">
            {!isRegisterMode && (
              <button
                type="button"
                onClick={() => alert("Chức năng khôi phục mật khẩu qua Email")}
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

          {/* 4. KHU VỰC TÀI KHOẢN MẪU PHÍA DƯỚI (THEO YÊU CẦU CỦA USER) */}
          <div className="mt-10 pt-5 border-t border-slate-200">
            <span className="block text-[11px] text-slate-500 font-medium mb-3 text-center">
              Chọn nhanh tài khoản mẫu để đăng nhập ngay (Pass: <code className="text-slate-800 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">123</code>):
            </span>
            <div className="grid grid-cols-2 gap-3">
              {registeredUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-3 border border-slate-200 hover:border-[#c71e72] hover:bg-pink-50/40 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-[#c71e72] truncate">
                      {u.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c71e72] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="block text-[10.5px] text-[#c71e72] font-semibold mt-0.5">
                    {u.roleName}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    {u.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BẢN QUYỀN */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 WAYGROUND · formerly Quizizz
      </footer>
    </div>
  );
}
