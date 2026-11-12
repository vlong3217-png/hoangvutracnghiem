import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Pencil, 
  Search, 
  UserPlus, 
  Folder, 
  Users, 
  X, 
  Trash2, 
  Loader2, 
  Check, 
  Upload, 
  Mail, 
  User, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { 
  fetchClassById, 
  updateClassApi, 
  addStudentsToClassApi, 
  deleteStudentFromClassApi,
  fetchUsers
} from '../services/api';

export default function ClassDetail({ classId, onBack }) {
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  // Sửa tên lớp học
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // Modal thêm sinh viên
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addMode, setAddMode] = useState('single'); // 'single' | 'bulk' | 'existing'
  
  // Single student form
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentCode, setStudentCode] = useState('');

  // Bulk student form
  const [bulkInput, setBulkInput] = useState('');

  // Existing system users
  const [systemUsers, setSystemUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  // Tải thông tin lớp học và học sinh
  const loadClassDetail = async () => {
    if (!classId) return;
    try {
      setIsLoading(true);
      const data = await fetchClassById(classId);
      if (data) {
        setClassInfo(data);
        setEditTitleValue(data.name || '');
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết lớp học:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassDetail();
  }, [classId]);

  // Tải danh sách user có sẵn trong hệ thống khi mở tab existing
  const handleOpenAddModal = async () => {
    setShowAddStudentModal(true);
    setStudentName('');
    setStudentEmail('');
    setStudentCode('');
    setBulkInput('');
    setSelectedUserIds([]);
    try {
      const uList = await fetchUsers();
      if (Array.isArray(uList)) {
        setSystemUsers(uList.filter(u => u.role === 'student' || !u.role));
      }
    } catch (e) {
      console.warn('Lỗi lấy users:', e);
    }
  };

  // Lưu tên lớp sau khi sửa
  const handleSaveTitle = async () => {
    if (!editTitleValue.trim()) {
      alert('Tên lớp không được để trống');
      return;
    }
    try {
      setIsSavingTitle(true);
      const res = await updateClassApi(classId, { name: editTitleValue.trim() });
      if (res.success && res.data) {
        setClassInfo(prev => ({ ...prev, name: res.data.name }));
        setIsEditingTitle(false);
      } else {
        alert(res.message || 'Lỗi cập nhật tên lớp');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSavingTitle(false);
    }
  };

  // Thêm 1 sinh viên
  const handleAddSingleStudent = async (e) => {
    e?.preventDefault();
    if (!studentName.trim()) {
      alert('Vui lòng nhập họ và tên sinh viên!');
      return;
    }

    try {
      setIsSubmittingStudent(true);
      const res = await addStudentsToClassApi(classId, {
        name: studentName.trim(),
        email: studentEmail.trim(),
        student_code: studentCode.trim()
      });

      if (res.success) {
        setShowAddStudentModal(false);
        await loadClassDetail();
      } else {
        alert(res.message || 'Lỗi thêm sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Thêm nhiều sinh viên theo danh sách dòng
  const handleAddBulkStudents = async () => {
    if (!bulkInput.trim()) {
      alert('Vui lòng nhập danh sách sinh viên');
      return;
    }

    const lines = bulkInput
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const parsedStudents = lines.map(line => {
      // Hỗ trợ phân cách bằng dấu phẩy, tab hoặc chấm phẩy
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      return {
        name: parts[0] || 'Sinh viên',
        email: parts[1] || '',
        student_code: parts[2] || ''
      };
    });

    try {
      setIsSubmittingStudent(true);
      const res = await addStudentsToClassApi(classId, {
        students: parsedStudents
      });

      if (res.success) {
        setShowAddStudentModal(false);
        await loadClassDetail();
        alert(`Đã thêm thành công ${parsedStudents.length} sinh viên vào lớp!`);
      } else {
        alert(res.message || 'Lỗi khi thêm danh sách sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Thêm từ tài khoản sinh viên đã có trong hệ thống
  const handleAddExistingUsers = async () => {
    if (selectedUserIds.length === 0) {
      alert('Vui lòng chọn ít nhất một sinh viên');
      return;
    }

    const selectedList = systemUsers
      .filter(u => selectedUserIds.includes(u.id))
      .map(u => ({
        name: u.name || u.email.split('@')[0],
        email: u.email,
        student_code: `SV-${u.id}`
      }));

    try {
      setIsSubmittingStudent(true);
      const res = await addStudentsToClassApi(classId, {
        students: selectedList
      });

      if (res.success) {
        setShowAddStudentModal(false);
        await loadClassDetail();
      } else {
        alert(res.message || 'Lỗi khi thêm sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Xóa sinh viên khỏi lớp
  const handleDeleteStudent = async (studentId, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${name}" khỏi lớp này?`)) {
      return;
    }

    try {
      const res = await deleteStudentFromClassApi(classId, studentId);
      if (res.success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      } else {
        alert(res.message || 'Lỗi xóa sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Lọc sinh viên theo tên hoặc email
  const filteredStudents = students.filter(s => 
    (s.name && s.name.toLowerCase().includes(searchStudentQuery.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(searchStudentQuery.toLowerCase())) ||
    (s.student_code && s.student_code.toLowerCase().includes(searchStudentQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-white text-slate-800 font-sans">
      {/* 1. THANH PHỤ (SUB-SIDEBAR) BÊN TRÁI: HỌC SINH -> CÁC LỚP HỌC */}
      <aside className="hidden lg:flex w-52 border-r border-slate-200 bg-white flex-col py-5 px-3 shrink-0 select-none">
        <h2 className="text-sm font-bold text-slate-900 px-3 mb-3">Học sinh</h2>
        <nav className="space-y-1">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Folder className="w-4 h-4 text-slate-700" />
            <span>Các lớp học</span>
          </button>
        </nav>
      </aside>

      {/* 2. VÙNG NỘI DUNG CHÍNH (MAIN AREA) */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto flex flex-col">
        {/* HEADER CHI TIẾT LỚP HỌC (CHUẨN ẢNH 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Nút mũi tên quay lại danh sách các lớp */}
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Quay lại danh sách lớp học"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Tên lớp học & Icon chỉnh sửa tên */}
            <div>
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editTitleValue}
                      onChange={(e) => setEditTitleValue(e.target.value)}
                      className="px-2 py-1 text-base sm:text-lg font-bold border border-[#d82a7a] rounded-lg focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={isSavingTitle}
                      className="px-2.5 py-1 bg-[#d82a7a] text-white text-xs font-bold rounded-lg"
                    >
                      {isSavingTitle ? '...' : 'Lưu'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTitle(false);
                        setEditTitleValue(classInfo?.name || '');
                      }}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {classInfo?.name || 'Chi tiết lớp học'}
                    </h1>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                      title="Đổi tên lớp học"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Dòng số lượng học sinh dưới tên lớp */}
              <p className="text-xs text-slate-500 mt-0.5">
                {students.length} học sinh
              </p>
            </div>
          </div>

          {/* Ô tìm kiếm theo tên học sinh & Nút "Thêm sinh viên" bo tròn viền xám theo chuẩn Ảnh 2 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên học sinh"
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full w-48 sm:w-64 focus:outline-none focus:border-[#d82a7a] transition-all"
              />
              {searchStudentQuery && (
                <button
                  onClick={() => setSearchStudentQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              Thêm sinh viên
            </button>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH: NẾU 0 HỌC SINH -> HIỂN THỊ EMPTY STATE Y HỆT ẢNH 2 */}
        {isLoading ? (
          <div className="py-28 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#d82a7a] mb-2" />
            <p className="text-xs">Đang tải danh sách học sinh...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-200">
            {/* Icon người dấu cộng màu hồng lớn giữa màn hình chuẩn Ảnh 2 */}
            <div className="w-14 h-14 rounded-full bg-[#fce7f3] text-[#d82a7a] flex items-center justify-center mb-3">
              <UserPlus className="w-7 h-7" />
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#d82a7a] mb-1">
              Thêm học sinh vào lớp của bạn
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Mời học sinh và bắt đầu
            </p>

            {/* Nút hồng bo góc chuẩn Ảnh 2 */}
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        ) : (
          /* NẾU ĐÃ CÓ HỌC SINH -> BẢNG DANH SÁCH HỌC SINH */
          <div className="pt-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">STT</th>
                      <th className="px-4 py-3">Họ và tên</th>
                      <th className="px-4 py-3">Mã SV</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Ngày thêm</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          Không tìm thấy sinh viên nào khớp với từ khóa "{searchStudentQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((stu, idx) => (
                        <tr key={stu.id || idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 text-center text-slate-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-pink-100 text-[#d82a7a] font-bold flex items-center justify-center text-xs shrink-0">
                                {stu.name ? stu.name.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <span className="font-semibold text-slate-900">{stu.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono">
                            {stu.student_code || '---'}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {stu.email || '---'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px]">
                            {stu.joined_at ? new Date(stu.joined_at).toLocaleDateString('vi-VN') : 'Vừa xong'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteStudent(stu.id, stu.name)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                              title="Xóa sinh viên khỏi lớp"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL THÊM SINH VIÊN VÀO LỚP */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Thêm học sinh vào lớp {classInfo?.name}</h2>
                <p className="text-[11px] text-slate-400">Chọn cách bạn muốn thêm học sinh</p>
              </div>
              <button 
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Các tab chọn hình thức thêm */}
            <div className="flex border-b border-slate-100 px-5 pt-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setAddMode('single')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  addMode === 'single'
                    ? 'border-[#d82a7a] text-[#d82a7a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Thêm từng bạn
              </button>
              <button
                type="button"
                onClick={() => setAddMode('bulk')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  addMode === 'bulk'
                    ? 'border-[#d82a7a] text-[#d82a7a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Dán danh sách nhiều bạn
              </button>
              <button
                type="button"
                onClick={() => setAddMode('existing')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  addMode === 'existing'
                    ? 'border-[#d82a7a] text-[#d82a7a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Chọn từ tài khoản có sẵn
              </button>
            </div>

            {/* Thân Modal theo từng chế độ */}
            <div className="p-5 overflow-y-auto flex-1">
              {addMode === 'single' && (
                <form onSubmit={handleAddSingleStudent} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên học sinh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn An"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email học sinh (Tùy chọn)
                    </label>
                    <input
                      type="email"
                      placeholder="VD: student@test.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã sinh viên / Số báo danh (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 23IT001"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingStudent || !studentName.trim()}
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Thêm học sinh</span>
                    </button>
                  </div>
                </form>
              )}

              {addMode === 'bulk' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dán danh sách sinh viên vào ô bên dưới, mỗi học sinh trên một dòng (Định dạng: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#d82a7a]">Họ và tên, email, mã_sinh_viên</code> hoặc chỉ cần <code className="bg-slate-100 px-1 py-0.5 rounded text-[#d82a7a]">Họ và tên</code>):
                  </p>
                  <textarea
                    rows={6}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Nguyễn Văn An, an@test.com, 23001&#10;Trần Thị Bình, binh@test.com, 23002&#10;Lê Hoàng Cường"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a] font-mono leading-relaxed"
                  />

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddBulkStudents}
                      disabled={isSubmittingStudent || !bulkInput.trim()}
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Thêm danh sách</span>
                    </button>
                  </div>
                </div>
              )}

              {addMode === 'existing' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-500">
                    Chọn các tài khoản sinh viên đã có trong hệ thống để đưa vào lớp:
                  </p>

                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {systemUsers.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Chưa có tài khoản sinh viên nào khác
                      </div>
                    ) : (
                      systemUsers.map((u) => {
                        const isSelected = selectedUserIds.includes(u.id);
                        return (
                          <label
                            key={u.id}
                            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                              isSelected ? 'bg-pink-50/30' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedUserIds(prev => prev.filter(id => id !== u.id));
                                  } else {
                                    setSelectedUserIds(prev => [...prev, u.id]);
                                  }
                                }}
                                className="w-4 h-4 text-[#d82a7a] rounded border-slate-300 focus:ring-[#d82a7a]"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-900">{u.name || 'Chưa đặt tên'}</p>
                                <p className="text-[11px] text-slate-400">{u.email}</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              Sinh viên
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddExistingUsers}
                      disabled={isSubmittingStudent || selectedUserIds.length === 0}
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Thêm {selectedUserIds.length} bạn vào lớp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
