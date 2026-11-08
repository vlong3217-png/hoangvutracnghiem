import React, { useState } from 'react';
import { fetchExamById } from '../services/api';
import { 
  Plus, 
  Trash2, 
  Play, 
  Share2, 
  MoreVertical, 
  Search, 
  ChevronDown, 
  Clock, 
  Share, 
  LayoutGrid, 
  Edit3, 
  FileText, 
  ArrowUpDown,
  FolderOpen
} from 'lucide-react';
import ExamDetailManage from './ExamDetailManage';

export default function TeacherManage({ exams, onAddExam, onDeleteExam, onPlayExam, onUpdateExam }) {
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'history' | 'shared' | 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExams, setSelectedExams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Đề thi đang xem chi tiết (quản lý từng câu hỏi theo ảnh mẫu)
  const [selectedExamDetail, setSelectedExamDetail] = useState(null);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  // Khi click vào xem chi tiết đề thi: Tải đầy đủ danh sách câu hỏi từ CSDL Backend nếu chưa có
  const handleOpenExamDetail = async (exam) => {
    if (exam.questions && exam.questions.length > 0) {
      setSelectedExamDetail(exam);
      return;
    }

    setLoadingDetailId(exam.id);
    try {
      const fullExam = await fetchExamById(exam.id);
      if (fullExam && fullExam.questions) {
        setSelectedExamDetail(fullExam);
      } else {
        setSelectedExamDetail(exam);
      }
    } catch {
      setSelectedExamDetail(exam);
    } finally {
      setLoadingDetailId(null);
    }
  };

  // Form state tạo đề thi
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Máy tính');
  const [level, setLevel] = useState('Đại học');
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'single',
      question: 'Phần mềm máy tính trong hình chia thành mấy loại?',
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
        { id: 'C', text: '3' },
        { id: 'D', text: '4' },
      ],
      correctAnswer: 'B',
      explanation: 'Phần mềm máy tính thường được chia thành 2 loại chính: Phần mềm hệ thống và Phần mềm ứng dụng.'
    },
    {
      id: 2,
      type: 'single',
      question: 'Phần mềm nào quản lý hoạt động máy tính?',
      options: [
        { id: 'A', text: 'Ứng dụng' },
        { id: 'B', text: 'Hệ thống' },
        { id: 'C', text: 'Tiện ích' },
        { id: 'D', text: 'Văn phòng' },
      ],
      correctAnswer: 'B',
      explanation: 'Phần mềm hệ thống (Hệ điều hành) chịu trách nhiệm quản lý toàn bộ tài nguyên và hoạt động của máy tính.'
    },
    {
      id: 3,
      type: 'single',
      question: 'Word và Media Player thuộc loại phần mềm nào?',
      options: [
        { id: 'A', text: 'Hệ điều hành' },
        { id: 'B', text: 'Phần mềm ứng dụng' },
        { id: 'C', text: 'Driver' },
        { id: 'D', text: 'Firmware' },
      ],
      correctAnswer: 'B',
      explanation: 'Word và Media Player phục vụ trực tiếp nhu cầu người dùng nên là phần mềm ứng dụng.'
    }
  ]);

  // Nếu đang click vào xem chi tiết một hoạt động/đề thi -> Mở giao diện ExamDetailManage (Ảnh 1 & 2)
  if (selectedExamDetail) {
    return (
      <ExamDetailManage
        exam={selectedExamDetail}
        onBack={() => setSelectedExamDetail(null)}
        onPlayExam={onPlayExam}
        onUpdateExam={(updated) => {
          setSelectedExamDetail(updated);
          if (onUpdateExam) onUpdateExam(updated);
        }}
      />
    );
  }

  // Lọc theo search
  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.subject && e.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExams(filteredExams.map(ex => ex.id));
    } else {
      setSelectedExams([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedExams.includes(id)) {
      setSelectedExams(selectedExams.filter(item => item !== id));
    } else {
      setSelectedExams([...selectedExams, id]);
    }
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'single',
        question: '',
        options: [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' },
        ],
        correctAnswer: 'A',
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmitNewExam = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newExam = {
      id: `exam-${Date.now()}`,
      title,
      subject: subject || 'Khoa học',
      level: level || 'Đại học',
      duration: Number(duration) || 15,
      totalQuestions: questions.length,
      createdAtText: 'Vừa xong',
      author: 'Tôi',
      questions
    };

    onAddExam(newExam);
    setShowCreateModal(false);
    setTitle('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex">
      {/* CỘT SUB-SIDEBAR BÊN TRÁI (Thư viện) */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 px-3 py-2 mb-2">Thư viện</h2>
          
          <nav className="space-y-1">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Tạo</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors text-left ${
                activeTab === 'history' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Trước đây đã sử dụng</span>
            </button>

            <button
              onClick={() => setActiveTab('shared')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors text-left ${
                activeTab === 'shared' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Share className="w-4 h-4 text-slate-400" />
              <span>Được chia sẻ với tôi</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-colors text-left ${
                activeTab === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <span>Tất cả các hoạt động</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 px-3">
          Wordwall Studio v2.6
        </div>
      </aside>

      {/* VÙNG NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <main className="flex-1 p-6 lg:p-8 max-w-6xl">
        {/* THANH TÌM KIẾM BO TRÒN TRÊN CÙNG */}
        <div className="relative mb-8">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên hoạt động"
            className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d82a7a] shadow-2xs"
          />
        </div>

        {/* TIÊU ĐỀ SECTION & NÚT THÊM TÀI NGUYÊN MÀU HỒNG CÁNH SEN */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Được tạo bởi tôi</h1>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài nguyên</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

        {/* PILL LỌC ĐÃ TẠO (X/50) */}
        <div className="mb-6">
          <button 
            onClick={() => setActiveTab('created')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeTab === 'created'
                ? 'bg-white border-slate-300 text-slate-800 shadow-2xs'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đã tạo ({exams.length}/50)
          </button>
        </div>

        {/* BẢNG DANH SÁCH HOẠT ĐỘNG KIỂU WORDWALL */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          {/* Header Bảng */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-white grid grid-cols-12 items-center text-xs font-semibold text-slate-500">
            <div className="col-span-8 flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedExams.length === filteredExams.length && filteredExams.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-[#d82a7a] focus:ring-[#d82a7a] accent-[#d82a7a] cursor-pointer"
              />
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                Chi tiết hoạt động
                <ArrowUpDown className="w-3 h-3" />
              </span>
            </div>

            <div className="col-span-4 flex items-center justify-end gap-1 cursor-pointer hover:text-slate-700 text-right pr-28">
              <span>Thời gian tạo</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Danh sách các hàng */}
          <div className="divide-y divide-slate-100">
            {filteredExams.map((exam, idx) => {
              const isChecked = selectedExams.includes(exam.id);
              const isDropdownOpen = openDropdownId === exam.id;

              return (
                <div 
                  key={exam.id} 
                  className={`px-5 py-4 grid grid-cols-12 items-center hover:bg-slate-50/70 transition-colors ${
                    isChecked ? 'bg-pink-50/20' : ''
                  }`}
                >
                  {/* Cột trái: Checkbox + Icon logo + Tiêu đề & Subtag */}
                  <div className="col-span-7 flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectOne(exam.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#d82a7a] focus:ring-[#d82a7a] accent-[#d82a7a] cursor-pointer"
                    />

                    {/* Thumbnail Icon vuông bo tròn với biểu tượng Wordwall (dạng cột biểu đồ W) */}
                    <div 
                      onClick={() => handleOpenExamDetail(exam)}
                      className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:border-[#d82a7a]"
                    >
                      <div className="flex items-end gap-0.5 h-4">
                        <div className="w-1 bg-[#d82a7a] h-3 rounded-xs" />
                        <div className="w-1 bg-[#d82a7a] h-4 rounded-xs" />
                        <div className="w-1 bg-[#d82a7a] h-2 rounded-xs" />
                        <div className="w-1 bg-[#d82a7a] h-3.5 rounded-xs" />
                      </div>
                    </div>

                    {/* Chi tiết tiêu đề -> BẤM VÀO ĐỂ XEM QUẢN LÝ TỪNG CÂU HỎI */}
                    <div 
                      onClick={() => handleOpenExamDetail(exam)}
                      className="min-w-0 pr-2 cursor-pointer group"
                    >
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-[#d82a7a] transition-colors flex items-center gap-2">
                        <span>{exam.title}</span>
                        {loadingDetailId === exam.id && (
                          <span className="text-[10px] text-amber-600 font-normal">Đang tải...</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          ✓ {exam.questions ? exam.questions.length : exam.totalQuestions || 0} Qs
                        </span>
                        <span>•</span>
                        <span>{exam.subject || 'Khoa học Xã hội'}</span>
                        <span>•</span>
                        <span>{exam.level || 'Đại học'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cột giữa: Thời gian tạo */}
                  <div className="col-span-2 text-right text-xs text-slate-500 pr-4">
                    {exam.createdAtText || `${idx + 1} tháng trước`}
                  </div>

                  {/* Cột phải: Các nút Thao tác (Chơi, Share, More) */}
                  <div className="col-span-3 flex items-center justify-end gap-2 relative">
                    <button
                      onClick={() => onPlayExam ? onPlayExam(exam) : null}
                      className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-slate-700" />
                      <span>Chơi</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert("Đã sao chép liên kết hoạt động!");
                      }}
                      title="Chia sẻ"
                      className="p-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-600 rounded-lg shadow-2xs transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : exam.id)}
                        className="p-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-600 rounded-lg shadow-2xs transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 top-9 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs text-slate-700 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setSelectedExamDetail(exam);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            Quản lý câu hỏi
                          </button>
                          <button
                            onClick={() => {
                              onDeleteExam(exam.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa hoạt động
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExams.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không tìm thấy hoạt động nào phù hợp.
            </div>
          )}
        </div>
      </main>

      {/* MODAL SOẠN ĐỀ THI MỚI (TẠO TÀI NGUYÊN) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d82a7a]" />
                Tạo Hoạt Động / Đề Thi Mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewExam} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên hoạt động / Đề thi *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: [BỔ TRỢ] HỆ ĐIỀU HÀNH – BÀI 1 P1"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chủ đề *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Máy tính"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cấp độ</label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Đại học"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                  />
                </div>
              </div>

              {/* Danh sách câu hỏi */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Danh sách câu hỏi ({questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs text-[#d82a7a] hover:text-[#b01e60] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-5">
                  {questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#d82a7a]">Câu {qIdx + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                          >
                            Xóa câu
                          </button>
                        )}
                      </div>

                      <textarea
                        required
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].question = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Nhập nội dung câu hỏi..."
                        rows={2}
                        className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                      />

                      {/* 4 đáp án */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt) => (
                          <div key={opt.id} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === opt.id}
                              onChange={() => {
                                const updated = [...questions];
                                updated[qIdx].correctAnswer = opt.id;
                                setQuestions(updated);
                              }}
                              className="accent-[#d82a7a]"
                            />
                            <span className="text-xs font-bold text-slate-600">{opt.id}:</span>
                            <input
                              type="text"
                              required
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...questions];
                                const targetOpt = updated[qIdx].options.find(o => o.id === opt.id);
                                if (targetOpt) targetOpt.text = e.target.value;
                                setQuestions(updated);
                              }}
                              placeholder={`Đáp án ${opt.id}`}
                              className="w-full text-xs outline-none bg-transparent"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Lời giải */}
                      <div>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIdx].explanation = e.target.value;
                            setQuestions(updated);
                          }}
                          placeholder="Lời giải thích / ghi chú chi tiết..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-[#d82a7a] hover:bg-[#c2226b] text-white rounded-lg font-semibold shadow-xs"
                >
                  Lưu & Xuất bản hoạt động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
