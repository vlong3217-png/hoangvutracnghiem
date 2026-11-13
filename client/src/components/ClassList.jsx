import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
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
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  fetchClasses, 
  createClassApi, 
  updateClassApi, 
  deleteClassApi,
  addStudentsToClassApi 
} from '../services/api';

export default function ClassList({ onSelectClass }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Modal tạo lớp học thông thường
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassColor, setNewClassColor] = useState('#22c55e');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown Nhập lớp
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // Modal Nhập từ Excel
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelTargetMode, setExcelTargetMode] = useState('existing'); // 'existing' | 'new'
  const [excelTargetClassId, setExcelTargetClassId] = useState('');
  const [excelNewClassName, setExcelNewClassName] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelParseError, setExcelParseError] = useState('');
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const fileInputRef = useRef(null);

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

  // Tải danh sách lớp từ Backend Neon PostgreSQL
  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClasses();
      if (Array.isArray(data)) {
        setClasses(data);
        if (data.length > 0 && !excelTargetClassId) {
          setExcelTargetClassId(data[0].id);
        }
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

  // -------------------------------------------------------------
  // TÍNH NĂNG NHẬP SINH VIÊN TỪ EXCEL (MÃ SV - HỌ VÀ TÊN - NGÀY SINH)
  // -------------------------------------------------------------

  // Tải file Excel mẫu
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
    // Định dạng độ rộng cột
    ws['!cols'] = [{ wch: 18 }, { wch: 26 }, { wch: 22 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSinhVien');
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Sinh_Vien.xlsx');
  };

  // Định dạng ngày tháng từ ô Excel (hỗ trợ số serial date hoặc text chuỗi)
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
    const str = String(val).trim();
    return str;
  };

  // Đọc và phân tích file Excel
  const handleProcessExcelFile = async (file) => {
    if (!file) return;
    setExcelParseError('');
    setIsParsingExcel(true);
    setExcelFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!rawData || rawData.length === 0) {
        throw new Error('Tệp Excel rỗng hoặc không chứa dữ liệu hợp lệ.');
      }

      // Xác định chỉ số các cột: Mã SV, Họ và tên, Ngày tháng năm sinh
      let codeCol = -1;
      let nameCol = -1;
      let dobCol = -1;
      let startRow = 0;

      // Quét các dòng đầu tiên để tìm tiêu đề
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

      // Nếu không tìm thấy hàng tiêu đề rõ ràng, gán mặc định: Cột 0: Mã SV, Cột 1: Họ tên, Cột 2: Ngày sinh
      if (codeCol === -1 || nameCol === -1) {
        codeCol = 0;
        nameCol = 1;
        dobCol = 2;
        // Kiểm tra xem dòng 0 có phải tiêu đề text không
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

        // Bỏ qua dòng trống hoặc dòng chỉ có STT
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
        throw new Error('Không trích xuất được sinh viên nào từ tệp. Vui lòng kiểm tra lại định dạng tệp Excel.');
      }

      setParsedStudents(extracted);
      // Tự động gợi ý tên lớp mới từ tên file nếu chưa có
      const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setExcelNewClassName(defaultName);
    } catch (err) {
      console.error(err);
      setExcelParseError(err.message || 'Lỗi khi đọc tệp Excel.');
      setParsedStudents([]);
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Xác nhận nhập sinh viên từ Excel vào hệ thống CSDL
  const handleConfirmImportExcel = async () => {
    if (parsedStudents.length === 0) {
      alert('Chưa có danh sách sinh viên nào được phân tích từ Excel!');
      return;
    }

    try {
      setIsSubmitting(true);
      let targetId = excelTargetClassId;

      // Nếu người dùng chọn Tạo lớp mới từ tệp Excel
      if (excelTargetMode === 'new') {
        if (!excelNewClassName.trim()) {
          alert('Vui lòng nhập tên lớp học mới!');
          return;
        }

        const createRes = await createClassApi({
          name: excelNewClassName.trim(),
          description: `Nhập từ tệp ${excelFileName} (${parsedStudents.length} sinh viên)`,
          color: colorPalette[Math.floor(Math.random() * colorPalette.length)].value,
          students: parsedStudents
        });

        if (createRes.success) {
          setShowExcelModal(false);
          setParsedStudents([]);
          setExcelFileName('');
          await loadClasses();
          alert(`🎉 Đã tạo lớp "${excelNewClassName}" và nhập thành công ${parsedStudents.length} sinh viên vào CSDL Neon!`);
          return;
        } else {
          throw new Error(createRes.message || 'Lỗi khi tạo lớp mới');
        }
      }

      // Nếu chọn nhập vào lớp đã có sẵn (vd: CNTT K23A)
      if (!targetId) {
        alert('Vui lòng chọn lớp học cần nhập sinh viên!');
        return;
      }

      const addRes = await addStudentsToClassApi(targetId, {
        students: parsedStudents
      });

      if (addRes.success) {
        setShowExcelModal(false);
        setParsedStudents([]);
        setExcelFileName('');
        await loadClasses();
        alert(`🎉 Đã nhập thành công ${parsedStudents.length} sinh viên vào lớp học trên CSDL Neon!`);
      } else {
        throw new Error(addRes.message || 'Lỗi khi thêm sinh viên vào lớp');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
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

            {/* Nút Nhập lớp với menu dropdown chuẩn */}
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
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                    {/* Mục 1: Nhập từ tệp Excel chuẩn yêu cầu: Mã SV - Họ tên - Ngày sinh */}
                    <button
                      onClick={() => {
                        setShowImportDropdown(false);
                        setShowExcelModal(true);
                        setParsedStudents([]);
                        setExcelParseError('');
                        setExcelFileName('');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 rounded-lg flex items-start gap-2.5 text-slate-800 font-medium group transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700">Nhập từ tệp Excel (.xlsx, .csv)</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Mã SV - Họ và tên - Ngày sinh</div>
                      </div>
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
              {searchQuery ? 'Không có lớp học nào khớp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách tạo một lớp học mới hoặc nhập sinh viên từ tệp Excel.'}
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

      {/* 4. MODAL NHẬP SINH VIÊN TỪ EXCEL (MÃ SINH VIÊN - HỌ VÀ TÊN - NGÀY SINH) */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-emerald-50/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Nhập sinh viên từ tệp Excel</h2>
                  <p className="text-[11px] text-slate-500">Định dạng chuẩn 3 cột: Mã sinh viên - Họ và tên - Ngày tháng năm sinh</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExcelModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* 1. Chọn đích đến: Lớp học có sẵn hay Tạo lớp mới */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Lựa chọn đích đến:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    excelTargetMode === 'existing' ? 'bg-white border-[#d82a7a] shadow-xs' : 'border-slate-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="excelTargetMode"
                      checked={excelTargetMode === 'existing'}
                      onChange={() => setExcelTargetMode('existing')}
                      className="text-[#d82a7a] focus:ring-[#d82a7a]"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Nhập vào lớp đã có</div>
                      <div className="text-[10px] text-slate-400">Chọn lớp có sẵn trong danh sách</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    excelTargetMode === 'new' ? 'bg-white border-[#d82a7a] shadow-xs' : 'border-slate-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="excelTargetMode"
                      checked={excelTargetMode === 'new'}
                      onChange={() => setExcelTargetMode('new')}
                      className="text-[#d82a7a] focus:ring-[#d82a7a]"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Tạo lớp học mới</div>
                      <div className="text-[10px] text-slate-400">Tạo lớp và thêm sinh viên ngay</div>
                    </div>
                  </label>
                </div>

                {/* Chọn lớp có sẵn */}
                {excelTargetMode === 'existing' && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Chọn lớp học tiếp nhận:
                    </label>
                    <select
                      value={excelTargetClassId}
                      onChange={(e) => setExcelTargetClassId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.student_count || 0} sinh viên)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Nhập tên lớp mới */}
                {excelTargetMode === 'new' && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tên lớp học mới:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: CNTT K23A, Kế toán K24..."
                      value={excelNewClassName}
                      onChange={(e) => setExcelNewClassName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                    />
                  </div>
                )}
              </div>

              {/* 2. Vùng Tải tệp Excel hoặc Tải file mẫu */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Chọn tệp Excel (.xlsx, .xls, .csv)
                  </label>
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
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleProcessExcelFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {excelFileName ? `Đã chọn: ${excelFileName}` : 'Nhấp để tải lên tệp Excel hoặc kéo thả vào đây'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ tệp .xlsx, .xls, .csv có cột: Mã sinh viên - Họ và tên - Ngày tháng năm sinh
                  </p>
                </div>
              </div>

              {/* Báo lỗi nếu có */}
              {excelParseError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{excelParseError}</span>
                </div>
              )}

              {/* 3. Bảng xem trước dữ liệu sau khi đọc Excel */}
              {isParsingExcel ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                  <p className="text-xs">Đang đọc và phân tích cấu trúc cột Excel...</p>
                </div>
              ) : parsedStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Xem trước danh sách ({parsedStudents.length} sinh viên hợp lệ):</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Sẵn sàng nhập
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2 w-10 text-center">STT</th>
                          <th className="px-3 py-2">Mã SV</th>
                          <th className="px-3 py-2">Họ và tên</th>
                          <th className="px-3 py-2">Ngày tháng năm sinh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedStudents.map((st, idx) => (
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
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmImportExcel}
                disabled={isSubmitting || parsedStudents.length === 0}
                className="px-5 py-2 bg-[#d82a7a] hover:bg-[#c2226b] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {parsedStudents.length > 0 
                    ? `Xác nhận nhập ${parsedStudents.length} sinh viên`
                    : 'Chọn tệp Excel để nhập'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL TẠO LỚP HỌC MỚI */}
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

      {/* 6. MODAL ĐỔI TÊN LỚP HỌC */}
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

      {/* 7. MODAL DÁN DANH SÁCH LỚP HỌC NHANH */}
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
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a] leading-relaxed"
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
