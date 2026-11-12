import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Folder, 
  Search, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  UserPlus, 
  ChevronDown, 
  Upload, 
  X, 
  Loader2, 
  BookOpen, 
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { 
  fetchClasses, 
  createClassApi, 
  updateClassApi, 
  deleteClassApi 
} from '../services/api';

export default function ClassList({ onSelectClass }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Modal tạo lớp học
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassColor, setNewClassColor] = useState('#22c55e');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown / Modal Nhập lớp
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // Dropdown menu thẻ lớp học
  const [activeMenuClassId, setActiveMenuClassId] = useState(null);

  // Modal đổi tên lớp học
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassColor, setEditClassColor] = useState('#22c55e');

  const colorPalette = [
    { name: 'Xanh lá', value: '#22c55e' },
    { name: 'Xanh dương', value: '#3b82f6' },
    { name: 'Tím', value: '#8b5cf6' },
    { name: 'Hồng', value: '#ec4899' },
    { name: 'Cam', value: '#f97316' },
    { name: 'Đỏ', value: '#ef4444' }
  ];

  // Tải danh sách lớp từ Backend
  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClasses();
      if (Array.isArray(data)) {
        setClasses(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách lớp học:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Xử lý tạo lớp học mới
  const handleCreateClass = async (e) => {
    e?.preventDefault();
    if (!newClassName.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createClassApi({
        name: newClassName.trim(),
        description: newClassDesc.trim(),
        color: newClassColor
      });

      if (res.success && res.data) {
        setClasses(prev => [res.data, ...prev]);
        setShowCreateModal(false);
        setNewClassName('');
        setNewClassDesc('');
        setNewClassColor('#22c55e');
      } else {
        alert(res.message || 'Lỗi khi tạo lớp học');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý đổi tên / cập nhật lớp học
  const handleUpdateClass = async (e) => {
    e?.preventDefault();
    if (!editingClass || !editClassName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await updateClassApi(editingClass.id, {
        name: editClassName.trim(),
        color: editClassColor
      });

      if (res.success && res.data) {
        setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...res.data } : c));
        setEditingClass(null);
      } else {
        alert(res.message || 'Lỗi khi cập nhật lớp học');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý xóa lớp học
  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}" và toàn bộ danh sách sinh viên trong lớp này?`)) {
      return;
    }

    try {
      const res = await deleteClassApi(classId);
      if (res.success) {
        setClasses(prev => prev.filter(c => c.id !== classId));
      } else {
        alert(res.message || 'Lỗi khi xóa lớp');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Xử lý nhập nhiều lớp nhanh bằng văn bản (mỗi dòng 1 tên lớp)
  const handleImportClasses = async () => {
    if (!importText.trim()) {
      alert('Vui lòng nhập danh sách tên lớp!');
      return;
    }

    const lines = importText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return;

    try {
      setIsSubmitting(true);
      for (const line of lines) {
        await createClassApi({
          name: line,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)].value
        });
      }
      setShowImportModal(false);
      setImportText('');
      await loadClasses();
      alert(`Đã thêm thành công ${lines.length} lớp học!`);
    } catch (err) {
      alert('Lỗi khi nhập lớp: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lọc theo từ khóa tìm kiếm
  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-row min-h-screen bg-white text-slate-800 font-sans">
      {/* 1. THANH PHỤ (SUB-SIDEBAR) BÊN TRÁI: HỌC SINH -> CÁC LỚP HỌC */}
      <aside className="hidden lg:flex w-52 border-r border-slate-200 bg-white flex-col py-5 px-3 shrink-0 select-none">
        <h2 className="text-sm font-bold text-slate-900 px-3 mb-3">Học sinh</h2>
        <nav className="space-y-1">
          <button 
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-900 transition-colors"
          >
            <Folder className="w-4 h-4 text-slate-700" />
            <span>Các lớp học</span>
          </button>
        </nav>
      </aside>

      {/* 2. VÙNG NỘI DUNG CHÍNH (MAIN AREA) */}
      <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
        {/* THANH TIÊU ĐỀ TRÊN CÙNG: CÁC LỚP HỌC CỦA TÔI & CÁC NÚT HÀNH ĐỘNG */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Các lớp học của tôi
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Nút tìm kiếm / Ô tìm kiếm */}
            {showSearchInput ? (
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Tìm lớp học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-44 sm:w-56 focus:outline-none focus:border-[#d82a7a]"
                  autoFocus
                />
                <button 
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                title="Tìm kiếm lớp học"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Nút Nhập lớp với menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowImportDropdown(!showImportDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <span>Nhập lớp</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showImportDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-20"
                    onClick={() => setShowImportDropdown(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                    <button
                      onClick={() => {
                        setShowImportDropdown(false);
                        setShowImportModal(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Dán danh sách tên lớp</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowImportDropdown(false);
                        alert('Tính năng đồng bộ Google Classroom đang được kết nối với tài khoản giảng viên.');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Nhập từ Google Classroom</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Nút Tạo một lớp học (Màu hồng cánh sen nổi bật chuẩn Quizizz) */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Tạo một lớp học</span>
            </button>
          </div>
        </div>

        {/* 3. DANH SÁCH THẺ LỚP HỌC (CLASS CARDS) */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#d82a7a] mb-2" />
            <p className="text-xs">Đang tải danh sách lớp học...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-[#d82a7a] flex items-center justify-center mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Không tìm thấy lớp học nào</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {searchQuery ? 'Không có lớp học nào khớp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách tạo một lớp học mới để quản lý sinh viên và theo dõi kết quả.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                + Tạo một lớp học
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((item) => {
              const studentCount = Number(item.student_count) || 0;
              const cardColor = item.color || '#22c55e';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectClass && onSelectClass(item.id)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col relative group"
                >
                  {/* Thanh màu nhận diện nhỏ trên góc trái theo chuẩn ảnh 1 */}
                  <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                    <div 
                      className="w-6 h-1 rounded-full" 
                      style={{ backgroundColor: cardColor }} 
                    />
                    
                    {/* Nút 3 chấm menu góc trên bên phải */}
                    <div 
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveMenuClassId(activeMenuClassId === item.id ? null : item.id)}
                        className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuClassId === item.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuClassId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                            <button
                              onClick={() => {
                                setActiveMenuClassId(null);
                                setEditingClass(item);
                                setEditClassName(item.name);
                                setEditClassColor(item.color || '#22c55e');
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-500" />
                              <span>Đổi tên lớp</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuClassId(null);
                                handleDeleteClass(item.id, item.name);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Xóa lớp học</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tên lớp học */}
                  <div className="px-4 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 hover:text-[#d82a7a] transition-colors truncate">
                      {item.name}
                    </h3>
                    
                    {/* Số lượng học sinh có icon người theo ảnh 1 */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{studentCount}</span>
                    </div>
                  </div>

                  {/* Thanh dưới cùng: Thêm học sinh để có được thông tin chi tiết về cấp lớp */}
                  <div className="mt-auto border-t border-slate-100 px-4 py-2.5 flex items-center gap-2 text-[11px] text-slate-500 group-hover:text-slate-700 bg-slate-50/40">
                    <UserPlus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Thêm học sinh để có được thông tin chi tiết về cấp lớp</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. MODAL TẠO LỚP HỌC MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Tạo một lớp học</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên lớp học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: CNTT K23A, Toán cao cấp..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mô tả / Ngành học (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khóa 23 Công nghệ thông tin"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Màu sắc nhận diện
                </label>
                <div className="flex items-center gap-2.5">
                  {colorPalette.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setNewClassColor(col.value)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        newClassColor === col.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    >
                      {newClassColor === col.value && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newClassName.trim()}
                  className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Tạo lớp học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL ĐỔI TÊN LỚP HỌC */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Đổi tên lớp học</h2>
              <button 
                onClick={() => setEditingClass(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên lớp học
                </label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Màu sắc nhận diện
                </label>
                <div className="flex items-center gap-2.5">
                  {colorPalette.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setEditClassColor(col.value)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        editClassColor === col.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    >
                      {editClassColor === col.value && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editClassName.trim()}
                  className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL DÁN DANH SÁCH LỚP HỌC NHANH */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Nhập danh sách nhiều lớp học</h2>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500">
                Dán danh sách các lớp học vào bên dưới (mỗi dòng là một tên lớp):
              </p>
              <textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="CNTT K23A&#10;CNTT K23B&#10;Kinh tế K22..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a] font-mono leading-relaxed"
              />

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportClasses}
                  disabled={isSubmitting || !importText.trim()}
                  className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Thêm lớp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
