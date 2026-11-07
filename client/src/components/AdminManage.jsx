import React, { useState } from 'react';
import { Users, Shield, Plus, Trash2, KeyRound } from 'lucide-react';

export default function AdminManage({ users, onUpdateUserRole, onDeleteUser, onAddUser }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const roleNameMap = {
      student: 'Sinh viên',
      admin: 'Admin'
    };

    onAddUser({
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      roleName: roleNameMap[role]
    });

    setName('');
    setEmail('');
    setRole('student');
    setShowAddModal(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản Trị Người Dùng</h1>
          <p className="text-sm text-slate-500 mt-1">
            Dành cho Admin: Quản lý danh sách tài khoản và phân quyền chức năng.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm tài khoản
        </button>
      </div>

      {/* Danh sách người dùng */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-12 text-xs font-bold text-slate-600 uppercase tracking-wide">
          <div className="col-span-4">Người dùng</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Vai trò / Quyền</div>
          <div className="col-span-1 text-right">Thao tác</div>
        </div>

        <div className="divide-y divide-slate-100">
          {users.map((u) => (
            <div key={u.id} className="px-6 py-4 grid grid-cols-12 items-center text-sm hover:bg-slate-50/50 transition-colors">
              <div className="col-span-4 font-semibold text-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {u.name.charAt(0)}
                </div>
                <span>{u.name}</span>
              </div>

              <div className="col-span-4 text-slate-500 text-xs">
                {u.email}
              </div>

              <div className="col-span-3">
                <select
                  value={u.role}
                  onChange={(e) => onUpdateUserRole(u.id, e.target.value)}
                  className={`text-xs border rounded-lg px-2.5 py-1.5 font-medium outline-none cursor-pointer ${getRoleBadge(u.role)}`}
                >
                  <option value="student">Sinh viên</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="col-span-1 text-right">
                <button
                  onClick={() => onDeleteUser(u.id)}
                  title="Xóa người dùng"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal thêm người dùng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-4">Thêm Người Dùng Mới</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Lê Thị Thu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phân quyền</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="student">Sinh viên (Làm bài thi & xem kết quả)</option>
                  <option value="admin">Quản trị viên (Toàn quyền hệ thống & quản lý đề thi)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                >
                  Thêm tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
