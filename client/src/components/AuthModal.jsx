import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, registeredUsers }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Vui lòng điền đầy đủ các trường thông tin.');
        return;
      }
      const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setError('Email này đã được sử dụng!');
        return;
      }

      const roleNameMap = {
        student: 'Học viên',
        teacher: 'Giáo viên',
        admin: 'Admin'
      };

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role,
        roleName: roleNameMap[role]
      };

      onRegister(newUser);
      onClose();
    } else {
      // Đăng nhập
      const found = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        setError('Email hoặc mật khẩu không chính xác!');
        return;
      }

      onLogin(found);
      onClose();
    }
  };

  // Nút đăng nhập nhanh bằng tài khoản có sẵn
  const handleQuickLogin = (user) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            {isRegisterMode ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegisterMode ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegisterMode 
              ? 'Tạo tài khoản để tham gia làm bài hoặc quản lý đề thi' 
              : 'Nhập email và mật khẩu của bạn để tiếp tục'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò mong muốn</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="student">Học viên (Làm bài thi & xem điểm)</option>
                <option value="teacher">Giáo viên (Tạo & soạn đề thi)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors mt-2"
          >
            {isRegisterMode ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Chuyển đổi giữa Đăng nhập / Đăng ký */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {isRegisterMode ? (
            <span>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(''); }}
                className="text-blue-600 font-bold hover:underline"
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
                className="text-blue-600 font-bold hover:underline"
              >
                Đăng ký tài khoản
              </button>
            </span>
          )}
        </div>

        {/* Gợi ý đăng nhập nhanh để người dùng test tiện lợi */}
        {!isRegisterMode && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-[11px] text-slate-400 font-medium mb-2.5 text-center">
              Tài khoản mẫu thử nghiệm (Mật khẩu: <code className="text-slate-600 font-mono">123</code>):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {registeredUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-left transition-all"
                >
                  <span className="block text-[11px] font-bold text-slate-800 truncate">{u.name}</span>
                  <span className="block text-[10px] text-blue-600 font-medium">{u.roleName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

