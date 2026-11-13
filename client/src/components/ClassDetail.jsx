import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
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
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  fetchClassById, 
  updateClassApi, 
  addStudentsToClassApi, 
  deleteStudentFromClassApi,
  deleteMultipleStudentsFromClassApi 
} from '../services/api';

export default function ClassDetail({ classId, onBack }) {
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  // Sửa tên lớp học
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // Modal thêm sinh viên (mặc định tab single theo ảnh)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addMode, setAddMode] = useState('single'); // 'single' | 'bulk' | 'excel'
  
  // Single student form: 3 trường chuẩn: Mã sinh viên - Họ và tên - Ngày tháng năm sinh
  const [studentCode, setStudentCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentBirthDate, setStudentBirthDate] = useState('');

  // Bulk student form
  const [bulkInput, setBulkInput] = useState('');

  // Excel import in ClassDetail
  const [excelStudents, setExcelStudents] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelError, setExcelError] = useState('');
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const excelInputRef = useRef(null);

  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  // Tải thông tin lớp học và học sinh từ Backend Neon PostgreSQL
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

  // Mở modal thêm sinh viên
  const handleOpenAddModal = () => {
    setShowAddStudentModal(true);
    setAddMode('single');
    setStudentCode('');
    setStudentName('');
    setStudentBirthDate('');
    setBulkInput('');
    setExcelStudents([]);
    setExcelFileName('');
    setExcelError('');
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

  // Tải file Excel mẫu 3 cột chuẩn
  const handleDownloadExcelTemplate = () => {
    const wsData = [
      ['Mã sinh viên', 'Họ và tên', 'Ngày tháng năm sinh'],
      ['23IT001', 'Nguyễn Văn An', '15/08/2004'],
      ['23IT002', 'Trần Thị Bình', '20/11/2004'],
      ['23IT003', 'Lê Hoàng Cường', '05/03/2004'],
      ['23IT004', 'Phạm Thị Diệu', '12/09/2004'],
      ['23IT005', 'Hoàng Minh Đức', '28/01/2004']
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 18 }, { wch: 26 }, { wch: 22 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSinhVien');
    XLSX.writeFile(wb, `Mau_Danh_Sach_${classInfo?.name || 'Lop'}.xlsx`);
  };

  // Định dạng ngày tháng từ ô Excel
  const formatExcelDate = (val) => {
    if (!val) return '';
    if (typeof val === 'number') {
      try {
        const dateObj = XLSX.SSF.parse_date_code(val);
        if (dateObj) {
          const d = String(dateObj.d).padStart(2, '0');
          const m = String(dateObj.m).padStart(2, '0');
          const y = dateObj.y;
          return `${d}/${m}/${y}`;
        }
      } catch (e) {}
    }
    return String(val).trim();
  };

  // Đọc và phân tích file Excel
  const handleProcessExcel = async (file) => {
    if (!file) return;
    setExcelError('');
    setIsParsingExcel(true);
    setExcelFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!rawData || rawData.length === 0) {
        throw new Error('Tệp Excel rỗng hoặc không chứa dữ liệu.');
      }

      let codeCol = -1;
      let nameCol = -1;
      let dobCol = -1;
      let startRow = 0;

      for (let r = 0; r < Math.min(rawData.length, 6); r++) {
        const row = rawData[r];
        for (let c = 0; c < row.length; c++) {
          const cellStr = String(row[c]).toLowerCase().trim();
          if (cellStr.includes('mã') || cellStr.includes('mssv') || cellStr.includes('student') || cellStr.includes('code') || cellStr.includes('masv')) {
            codeCol = c;
          }
          if (cellStr.includes('họ') || cellStr.includes('tên') || cellStr.includes('name') || cellStr.includes('sinh viên')) {
            nameCol = c;
          }
          if (cellStr.includes('ngày') || cellStr.includes('sinh') || cellStr.includes('dob') || cellStr.includes('birth')) {
            dobCol = c;
          }
        }
        if (codeCol !== -1 && nameCol !== -1) {
          startRow = r + 1;
          break;
        }
      }

      if (codeCol === -1 || nameCol === -1) {
        codeCol = 0;
        nameCol = 1;
        dobCol = 2;
        const row0 = rawData[0];
        if (row0 && isNaN(row0[0]) && String(row0[0]).length > 0 && String(row0[1]).length > 0) {
          const firstVal = String(row0[0]).toLowerCase();
          if (firstVal.includes('mã') || firstVal.includes('họ') || firstVal.includes('stt')) {
            startRow = 1;
          }
        }
      }

      const extracted = [];
      for (let r = startRow; r < rawData.length; r++) {
        const row = rawData[r];
        if (!row || row.length === 0) continue;

        const codeVal = String(row[codeCol] !== undefined ? row[codeCol] : '').trim();
        const nameVal = String(row[nameCol] !== undefined ? row[nameCol] : '').trim();
        const dobVal = formatExcelDate(dobCol !== -1 ? row[dobCol] : '');

        if (!nameVal && !codeVal) continue;
        if (nameVal.toLowerCase().includes('họ và tên') || codeVal.toLowerCase().includes('mã sinh viên')) continue;

        extracted.push({
          student_code: codeVal || `SV-${Date.now().toString().slice(-4)}${r}`,
          name: nameVal || codeVal,
          birth_date: dobVal || '---',
          email: `${codeVal.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu.vn`
        });
      }

      if (extracted.length === 0) {
        throw new Error('Không trích xuất được sinh viên nào từ tệp. Vui lòng kiểm tra lại định dạng Excel.');
      }

      setExcelStudents(extracted);
    } catch (err) {
      console.error(err);
      setExcelError(err.message || 'Lỗi khi đọc file Excel.');
      setExcelStudents([]);
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Xác nhận nhập từ Excel vào lớp
  const handleConfirmExcelImport = async () => {
    if (excelStudents.length === 0) return;
    try {
      setIsSubmittingStudent(true);
      const res = await addStudentsToClassApi(classId, {
        students: excelStudents
      });

      if (res.success) {
        setShowAddStudentModal(false);
        await loadClassDetail();
        alert(`🎉 Đã nhập thành công ${excelStudents.length} sinh viên từ file Excel vào lớp!`);
      } else {
        alert(res.message || 'Lỗi khi nhập sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Thêm 1 sinh viên thủ công: Mã sinh viên - Họ và tên - Ngày tháng năm sinh
  const handleAddSingleStudent = async (e) => {
    e?.preventDefault();
    if (!studentCode.trim()) {
      alert('Vui lòng nhập mã sinh viên!');
      return;
    }
    if (!studentName.trim()) {
      alert('Vui lòng nhập họ và tên sinh viên!');
      return;
    }

    try {
      setIsSubmittingStudent(true);
      const res = await addStudentsToClassApi(classId, {
        student_code: studentCode.trim(),
        name: studentName.trim(),
        birth_date: studentBirthDate.trim(),
        email: `${studentCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu.vn`
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

  // Thêm nhiều sinh viên theo danh sách dòng: Mã sinh viên, Họ và tên, Ngày tháng năm sinh
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
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      // Định dạng chuẩn: Mã sinh viên, Họ và tên, Ngày tháng năm sinh
      let code = parts[0] || '';
      let name = parts[1] || '';
      let dob = parts[2] || '';

      // Tự động nhận diện nếu người dùng dán đảo Họ tên trước, Mã sau
      if (parts[0] && parts[0].includes(' ') && parts[1] && !parts[1].includes(' ')) {
        name = parts[0];
        code = parts[1];
      }

      return {
        student_code: code || `SV-${Date.now().toString().slice(-4)}`,
        name: name || code || 'Sinh viên',
        birth_date: dob || '---',
        email: `${code.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu.vn`
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

  // Lọc sinh viên theo tên, mã SV hoặc ngày sinh
  const filteredStudents = students.filter(s => 
    (s.name && s.name.toLowerCase().includes(searchStudentQuery.toLowerCase())) ||
    (s.student_code && s.student_code.toLowerCase().includes(searchStudentQuery.toLowerCase())) ||
    (s.birth_date && s.birth_date.toLowerCase().includes(searchStudentQuery.toLowerCase()))
  );

  // Chọn tất cả sinh viên
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Tích chọn 1 sinh viên
  const handleSelectOne = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(prev => prev.filter(item => item !== id));
    } else {
      setSelectedStudents(prev => [...prev, id]);
    }
  };

  // Xóa sinh viên khỏi lớp
  const handleDeleteStudent = async (studentId, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${name}" khỏi lớp này?`)) {
      return;
    }

    try {
      setDeletingStudentId(studentId);
      const res = await deleteStudentFromClassApi(classId, studentId);
      if (res.success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setSelectedStudents(prev => prev.filter(id => id !== studentId));
      } else {
        alert(res.message || 'Lỗi xóa sinh viên');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setDeletingStudentId(null);
    }
  };

  // Xóa hàng loạt sinh viên đã chọn
  const handleDeleteSelectedStudents = async () => {
    if (selectedStudents.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedStudents.length} sinh viên đã chọn khỏi lớp?`)) {
      return;
    }

    setIsBatchDeleting(true);
    try {
      const res = await deleteMultipleStudentsFromClassApi(classId, selectedStudents);
      if (res.success) {
        setStudents(prev => prev.filter(s => !selectedStudents.includes(s.id)));
        setSelectedStudents([]);
      } else {
        // Fallback: xóa từng sinh viên
        for (const sid of selectedStudents) {
          await deleteStudentFromClassApi(classId, sid);
        }
        setStudents(prev => prev.filter(s => !selectedStudents.includes(s.id)));
        setSelectedStudents([]);
      }
    } catch (err) {
      alert('Lỗi khi xóa sinh viên: ' + err.message);
    } finally {
      setIsBatchDeleting(false);
    }
  };

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
                      className="px-2.5 py-1 bg-[#d82a7a] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      {isSavingTitle ? '...' : 'Lưu'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTitle(false);
                        setEditTitleValue(classInfo?.name || '');
                      }}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
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
          /* NẾU ĐÃ CÓ HỌC SINH -> BẢNG DANH SÁCH HỌC SINH (BAO GỒM MÃ SV - HỌ VÀ TÊN - NGÀY SINH) */
          <div className="pt-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              {/* Thanh thao tác khi có ô được tích */}
              {selectedStudents.length > 0 && (
                <div className="px-5 py-2.5 border-b border-rose-200 bg-rose-50/70 flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150">
                  <div className="flex items-center gap-3">
                    <span className="text-rose-900 font-bold">
                      Đã chọn {selectedStudents.length} sinh viên
                    </span>
                    <button
                      onClick={() => setSelectedStudents([])}
                      className="text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer font-medium"
                    >
                      Bỏ chọn
                    </button>
                  </div>

                  <button
                    disabled={isBatchDeleting}
                    onClick={handleDeleteSelectedStudents}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBatchDeleting ? 'Đang xóa...' : `Xóa (${selectedStudents.length})`}</span>
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-[#d82a7a] focus:ring-[#d82a7a] accent-[#d82a7a] cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3">Mã SV</th>
                      <th className="px-4 py-3">Họ và tên</th>
                      <th className="px-4 py-3">Ngày tháng năm sinh</th>
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
                      filteredStudents.map((stu, idx) => {
                        const isChecked = selectedStudents.includes(stu.id);

                        return (
                          <tr 
                            key={stu.id || idx} 
                            className={`hover:bg-slate-50/60 transition-colors ${
                              isChecked ? 'bg-pink-50/20' : ''
                            }`}
                          >
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSelectOne(stu.id)}
                                className="w-4 h-4 rounded border-slate-300 text-[#d82a7a] focus:ring-[#d82a7a] accent-[#d82a7a] cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 text-slate-900 font-bold">
                              {stu.student_code || '---'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#d82a7a] font-bold flex items-center justify-center text-xs shrink-0">
                                  {stu.name ? stu.name.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <span className="font-semibold text-slate-900">{stu.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">
                              {stu.birth_date || '---'}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">
                              {stu.joined_at ? new Date(stu.joined_at).toLocaleDateString('vi-VN') : 'Vừa xong'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                disabled={deletingStudentId === stu.id}
                                onClick={() => handleDeleteStudent(stu.id, stu.name)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md transition-colors cursor-pointer"
                                title="Xóa sinh viên khỏi lớp"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL THÊM SINH VIÊN VÀO LỚP (ĐÃ XÓA CHỌN TỪ TÀI KHOẢN CÓ SẴN) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
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

            {/* Các tab chọn hình thức thêm: Thêm từng bạn | Dán danh sách | Nhập từ Excel */}
            <div className="flex border-b border-slate-100 px-5 pt-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setAddMode('single')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
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
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  addMode === 'bulk'
                    ? 'border-[#d82a7a] text-[#d82a7a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Dán danh sách nhiều bạn
              </button>
              <button
                type="button"
                onClick={() => setAddMode('excel')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  addMode === 'excel'
                    ? 'border-[#d82a7a] text-[#d82a7a]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nhập từ tệp Excel (.xlsx)</span>
              </button>
            </div>

            {/* Thân Modal theo từng chế độ */}
            <div className="p-5 overflow-y-auto flex-1">
              {/* CHẾ ĐỘ 1: THÊM TỪNG BẠN (MÃ SINH VIÊN - HỌ VÀ TÊN - NGÀY THÁNG NĂM SINH) */}
              {addMode === 'single' && (
                <form onSubmit={handleAddSingleStudent} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mã sinh viên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 23IT001"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                      autoFocus
                      required
                    />
                  </div>

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
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ngày tháng năm sinh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 15/08/2004"
                      value={studentBirthDate}
                      onChange={(e) => setStudentBirthDate(e.target.value)}
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
                      disabled={isSubmittingStudent || !studentName.trim() || !studentCode.trim()}
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Thêm học sinh</span>
                    </button>
                  </div>
                </form>
              )}

              {/* CHẾ ĐỘ 2: DÁN DANH SÁCH DÒNG (MÃ SINH VIÊN, HỌ VÀ TÊN, NGÀY THÁNG NĂM SINH) */}
              {addMode === 'bulk' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dán danh sách sinh viên vào ô bên dưới, mỗi học sinh trên một dòng (Định dạng: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#d82a7a]">Mã sinh viên, Họ và tên, Ngày tháng năm sinh</code>):
                  </p>
                  <textarea
                    rows={6}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="23IT001, Nguyễn Văn An, 15/08/2004&#10;23IT002, Trần Thị Bình, 20/11/2004&#10;23IT003, Lê Hoàng Cường, 05/03/2004"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a] leading-relaxed"
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
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Thêm danh sách</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CHẾ ĐỘ 3: NHẬP TỪ TỆP EXCEL */}
              {addMode === 'excel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Tệp Excel chứa danh sách sinh viên:</span>
                    <button
                      type="button"
                      onClick={handleDownloadExcelTemplate}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải file Excel mẫu (.xlsx)</span>
                    </button>
                  </div>

                  <div 
                    onClick={() => excelInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center"
                  >
                    <input
                      ref={excelInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleProcessExcel(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {excelFileName ? `Đã chọn: ${excelFileName}` : 'Nhấp để chọn tệp Excel (.xlsx, .xls, .csv)'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      3 cột chuẩn: Mã sinh viên - Họ và tên - Ngày tháng năm sinh
                    </p>
                  </div>

                  {excelError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{excelError}</span>
                    </div>
                  )}

                  {isParsingExcel ? (
                    <div className="py-6 flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                      <p className="text-xs">Đang đọc dữ liệu sinh viên...</p>
                    </div>
                  ) : excelStudents.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Đã nhận diện {excelStudents.length} sinh viên:</span>
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase sticky top-0 border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2 w-10 text-center">STT</th>
                              <th className="px-3 py-2">Mã SV</th>
                              <th className="px-3 py-2">Họ và tên</th>
                              <th className="px-3 py-2">Ngày sinh</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {excelStudents.map((st, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="px-3 py-1.5 text-center text-slate-500 text-[11px]">{idx + 1}</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900">{st.student_code}</td>
                                <td className="px-3 py-1.5 font-medium text-slate-800">{st.name}</td>
                                <td className="px-3 py-1.5 text-slate-700">{st.birth_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmExcelImport}
                      disabled={isSubmittingStudent || excelStudents.length === 0}
                      className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingStudent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Xác nhận nhập {excelStudents.length > 0 ? `${excelStudents.length} bạn` : ''}</span>
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
