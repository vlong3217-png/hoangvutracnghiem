import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { 
  ArrowLeft, 
  Settings, 
  Sparkles, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Radio, 
  CheckSquare, 
  ToggleLeft, 
  GripHorizontal, 
  Edit3, 
  PenTool, 
  X, 
  Loader2, 
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { parseQuestionsWithGemini } from '../services/geminiService';

import QuestionEditor from './QuestionEditor';

export default function CreateResourceModal({ onBack, onSaveExam, initialExam }) {
  const [examTitle, setExamTitle] = useState(initialExam?.title || 'Bài Quiz không có tiêu đề');
  const [subject, setSubject] = useState(initialExam?.subject || 'Khoa học Xã hội');
  const [level, setLevel] = useState(initialExam?.level || initialExam?.difficulty || 'Đại học');
  const [duration, setDuration] = useState(initialExam?.duration || initialExam?.durationMinutes || 30);

  // Danh sách câu hỏi đã được tạo / trích xuất
  const [questions, setQuestions] = useState(initialExam?.questions || []);
  const [hoveredType, setHoveredType] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null); // Câu hỏi đang mở QuestionEditor chi tiết

  // Với đề thi đã có câu hỏi, mặc định thu gọn các ô loại câu hỏi để tập trung vào danh sách câu hỏi
  const [isTypePanelExpanded, setIsTypePanelExpanded] = useState(
    !(initialExam?.questions && initialExam.questions.length > 0)
  );

  // Modal / Drawer Nhập từ tài liệu & AI
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Trạng thái xử lý file
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [importError, setImportError] = useState('');

  // 1. Danh sách 7 dạng câu hỏi trong hệ thống
  const QUESTION_TYPES = [
    {
      id: 'single',
      name: 'Nhiều lựa chọn (1 đáp án)',
      tag: 'Phổ biến nhất',
      color: 'bg-emerald-500',
      icon: Radio,
      desc: 'Câu hỏi trắc nghiệm truyền thống gồm 4 phương án A, B, C, D và chỉ có 1 đáp án chính xác duy nhất.',
      preview: {
        q: 'Thủ đô của Việt Nam là gì?',
        opts: ['A. Hà Nội (Đúng)', 'B. TP. Hồ Chí Minh', 'C. Đà Nẵng', 'D. Hải Phòng']
      }
    },
    {
      id: 'multiple',
      name: 'Chọn nhiều đáp án đúng',
      tag: 'Nâng cao',
      color: 'bg-blue-500',
      icon: CheckSquare,
      desc: 'Cho phép thí sinh chọn 2 hoặc nhiều phương án đúng cùng lúc để đạt điểm trọn vẹn.',
      preview: {
        q: 'Những ngôn ngữ nào chạy được trên trình duyệt?',
        opts: ['☑ JavaScript', '☑ WebAssembly', '☐ C++', '☐ Python']
      }
    },
    {
      id: 'true_false_multi',
      name: 'Đúng / Sai theo ý',
      tag: 'Chuẩn Bộ GD&ĐT',
      color: 'bg-purple-500',
      icon: ToggleLeft,
      desc: 'Mỗi câu hỏi có nhiều ý nhỏ a), b), c), d). Thí sinh phải xác định từng ý là Đúng hay Sai.',
      preview: {
        q: 'Nhận định về giao thức HTTP:',
        opts: ['a) Chạy trên cổng 80: ĐÚNG', 'b) Mã hóa mặc định: SAI', 'c) Là giao thức phi trạng thái: ĐÚNG']
      }
    },
    {
      id: 'categorize',
      name: 'Phân loại vào cột',
      tag: 'Tương tác trực quan',
      color: 'bg-amber-500',
      icon: Layers,
      desc: 'Thí sinh kéo thả hoặc phân loại các mục dữ liệu vào các nhóm/cột tương ứng.',
      preview: {
        q: 'Phân loại phần mềm:',
        opts: ['Hệ thống: Windows, Linux', 'Ứng dụng: Word, Excel']
      }
    },
    {
      id: 'drag_drop',
      name: 'Kéo thả khớp câu / Ghép nối',
      tag: 'Tương tác Wordwall',
      color: 'bg-rose-500',
      icon: GripHorizontal,
      desc: 'Kéo thả các từ khóa hoặc ô định nghĩa vào đúng vị trí khuyết trong câu hoặc bảng.',
      preview: {
        q: 'Hoàn thành câu định nghĩa:',
        opts: ['[RAM] là bộ nhớ truy xuất ngẫu nhiên.', '[ROM] là bộ nhớ chỉ đọc.']
      }
    },
    {
      id: 'short_answer',
      name: 'Điền từ / Trả lời ngắn',
      tag: 'Tư duy',
      color: 'bg-indigo-500',
      icon: Edit3,
      desc: 'Thí sinh tự gõ câu trả lời ngắn vào ô nhập. Hệ thống tự động so khớp từ khóa.',
      preview: {
        q: 'Tên viết tắt của mạng cục bộ là gì?',
        opts: ['Đáp án chuẩn: LAN']
      }
    },
    {
      id: 'essay',
      name: 'Tự luận (Chấm điểm AI)',
      tag: 'Tích hợp Gemini AI',
      color: 'bg-pink-600',
      icon: PenTool,
      desc: 'Thí sinh trình bày bài viết tự luận. Hệ thống kết nối Gemini AI để chấm điểm, nhận xét ưu/nhược điểm theo barem.',
      preview: {
        q: 'Phân tích ưu nhược điểm của kiến trúc Microservices.',
        opts: ['Gemini AI tự động chấm theo thang điểm 10 & phân tích chuyên sâu.']
      }
    }
  ];

  // NẾU ĐANG BẤM VÀO SỬA 1 CÂU HỎI TRONG DANH SÁCH -> MỞ QUESTIONEDITOR
  if (editingQuestion) {
    return (
      <QuestionEditor
        question={editingQuestion}
        onSave={(updatedQ) => {
          const updated = questions.map(q => q.id === updatedQ.id ? updatedQ : q);
          setQuestions(updated);
          setEditingQuestion(null);
        }}
        onCancel={() => setEditingQuestion(null)}
      />
    );
  }

  // Thêm nhanh 1 câu hỏi mẫu theo dạng được chọn
  const handleAddQuestionByType = (typeId) => {
    const qCount = questions.length + 1;
    let newQ = {
      id: `q-${Date.now()}-${qCount}`,
      type: typeId,
      question: `Câu hỏi ${qCount}: Nội dung câu hỏi mới...`,
      explanation: ''
    };

    if (typeId === 'single') {
      newQ.options = [
        { id: 'A', text: 'Đáp án A' },
        { id: 'B', text: 'Đáp án B' },
        { id: 'C', text: 'Đáp án C' },
        { id: 'D', text: 'Đáp án D' }
      ];
      newQ.correctAnswer = 'A';
    } else if (typeId === 'multiple') {
      newQ.options = [
        { id: 'A', text: 'Đáp án A (Đúng)' },
        { id: 'B', text: 'Đáp án B (Đúng)' },
        { id: 'C', text: 'Đáp án C' },
        { id: 'D', text: 'Đáp án D' }
      ];
      newQ.correctAnswer = ['A', 'B'];
    } else if (typeId === 'true_false_multi') {
      newQ.parts = [
        { id: 'A', text: 'Mệnh đề 1', isCorrect: true },
        { id: 'B', text: 'Mệnh đề 2', isCorrect: false },
        { id: 'C', text: 'Mệnh đề 3', isCorrect: true },
        { id: 'D', text: 'Mệnh đề 4', isCorrect: false }
      ];
    } else if (typeId === 'categorize') {
      newQ.categories = [
        { id: 'cat1', name: 'Nhóm 1' },
        { id: 'cat2', name: 'Nhóm 2' }
      ];
      newQ.items = [
        { id: 'item1', text: 'Mục A', categoryId: 'cat1' },
        { id: 'item2', text: 'Mục B', categoryId: 'cat2' }
      ];
    } else if (typeId === 'drag_drop') {
      newQ.sentences = [
        { id: 1, prefix: 'Khái niệm 1 là ', correctWord: 'A', suffix: '.' },
        { id: 2, prefix: 'Khái niệm 2 là ', correctWord: 'B', suffix: '.' }
      ];
      newQ.draggableItems = ['A', 'B'];
    } else if (typeId === 'short_answer') {
      newQ.correctAnswer = 'Đáp án mẫu';
    } else if (typeId === 'essay') {
      newQ.maxScore = 10;
      newQ.sampleAnswer = 'Dàn ý trả lời chi tiết...';
      newQ.criteria = 'Tiêu chí chấm điểm: Tính chính xác (4đ), Lập luận (3đ), Cấu trúc (3đ)';
    }

    setQuestions([...questions, newQ]);
  };

  // 2. Xử lý tải và đọc file (Word .docx, Excel .xlsx, PDF/Text)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setImportError('');
    setImportStatus(`Đang đọc tệp "${file.name}"...`);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        extractedText = XLSX.utils.sheet_to_txt(sheet);
      } else if (ext === 'txt') {
        extractedText = await file.text();
      } else if (ext === 'pdf') {
        // Đọc text thô từ PDF
        extractedText = await file.text();
        if (!extractedText || extractedText.length < 50) {
          extractedText = `Tài liệu PDF: ${file.name}`;
        }
      } else {
        throw new Error('Định dạng tệp chưa được hỗ trợ. Vui lòng chọn file Word (.docx), Excel (.xlsx, .csv) hoặc văn bản (.txt).');
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Tệp không có nội dung văn bản để phân tích!');
      }

      setImportStatus('Đang gửi dữ liệu tới Gemini AI để phân tích câu hỏi & đáp án...');
      
      const parsed = await parseQuestionsWithGemini(extractedText);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động gán ID duy nhất
        const formatted = parsed.map((q, idx) => ({
          ...q,
          id: `q-imported-${Date.now()}-${idx + 1}`
        }));

        setQuestions(prev => [...prev, ...formatted]);
        setShowImportModal(false);
        setImportStatus('');
        alert(`🎉 AI đã phân tích thành công ${formatted.length} câu hỏi từ tệp "${file.name}"!`);
      } else {
        throw new Error('AI không tìm thấy câu hỏi hợp lệ trong tệp.');
      }
    } catch (err) {
      console.error(err);
      setImportError(err.message || 'Lỗi khi xử lý tệp.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  // 3. Hoàn tất và xuất bản bài thi
  const handlePublish = async () => {
    if (!examTitle.trim()) {
      alert('Vui lòng nhập tên đề thi!');
      return;
    }
    if (questions.length === 0) {
      alert('Đề thi cần có ít nhất 1 câu hỏi! Vui lòng chọn 1 dạng câu hỏi hoặc nhập từ tài liệu.');
      return;
    }

    const savedExam = {
      ...initialExam,
      id: initialExam?.id || `exam-${Date.now()}`,
      title: examTitle.trim(),
      subject: subject || 'Khoa học Xã hội',
      level: level || 'Đại học',
      difficulty: level || 'Đại học',
      duration: Number(duration) || 30,
      durationMinutes: Number(duration) || 30,
      totalQuestions: questions.length,
      createdAtText: initialExam?.createdAtText || 'Vừa xong',
      author: initialExam?.author || 'Tôi',
      questions
    };

    if (onSaveExam) {
      await onSaveExam(savedExam);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col font-sans text-slate-800">
      {/* 1. TOPBAR CHUẨN THEO ẢNH NGƯỜI DÙNG CUNG CẤP */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Nút quay lại bo tròn viền xám mỏng */}
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Ô nhập tiêu đề "Bài Quiz không có tiêu đề" */}
          <div className="relative">
            <input 
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Bài Quiz không có tiêu đề"
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#d82a7a] rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-colors w-56 sm:w-80 shadow-2xs"
            />
          </div>
        </div>

        {/* Nút Cài đặt & Nút Xuất bản màu hồng cánh sen */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </button>

          <button 
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xuất bản</span>
          </button>
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG CHÍNH (CANVAS TRẮNG Ở GIỮA) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col">
        {/* NÚT "NHẬP TỪ TÀI LIỆU (AI PHÂN TÍCH)" ĐỒNG BỘ NỀN TRẮNG VIỀN XÁM NHẸ */}
        <div className="mb-5 p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-[#d82a7a] flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-5 h-5 text-[#d82a7a]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Nhập câu hỏi từ tệp (Word, Excel, PDF)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-50 text-[#d82a7a] border border-pink-100">
                  AI Hỗ trợ
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                Tự động nhận diện câu hỏi, lựa chọn và đáp án đúng từ file tài liệu của bạn.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all shrink-0 hover:scale-[1.02] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>Tải tệp & Phân tích</span>
          </button>
        </div>

        {/* CONTAINER CHÍNH: TẬP TRUNG VÀO DANH SÁCH CÂU HỎI */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex-1 flex flex-col space-y-6">
          {/* PHẦN 1: DANH SÁCH CÂU HỎI TRONG ĐỀ (ĐƯA LÊN TRÊN HẾT CHO DỄ QUẢN LÝ) */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Danh sách câu hỏi trong đề ({questions.length})
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">• Bấm vào câu hỏi để sửa chi tiết phương án</span>
              </div>
              
              <button
                onClick={() => handleAddQuestionByType('single')}
                className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-[#d82a7a] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm nhanh trắc nghiệm</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-pink-100 text-[#d82a7a] flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Đề thi chưa có câu hỏi nào</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Chọn một dạng câu hỏi bên dưới hoặc tải tệp tài liệu để AI tự động trích xuất</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div 
                    key={q.id || idx} 
                    className="p-3 bg-slate-50 hover:bg-pink-50/20 border border-slate-200 hover:border-[#d82a7a]/50 rounded-xl flex items-center justify-between text-xs transition-all group shadow-2xs"
                  >
                    <div 
                      onClick={() => setEditingQuestion(q)}
                      className="flex items-center gap-3 min-w-0 pr-4 flex-1 cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-200 group-hover:bg-[#d82a7a] group-hover:text-white text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate group-hover:text-[#d82a7a] transition-colors">
                        {q.question}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                        {q.type === 'multiple' ? 'Chọn nhiều' : q.type === 'true_false_multi' ? 'Đúng/Sai' : q.type === 'essay' ? 'Tự luận' : q.type === 'categorize' ? 'Phân loại' : q.type === 'drag_drop' ? 'Kéo thả' : q.type === 'short_answer' ? 'Điền từ' : 'Trắc nghiệm'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingQuestion(q)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[#d82a7a] bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="Chỉnh sửa câu này"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Xóa câu này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PHẦN 2: CÁC NÚT THÊM DẠNG CÂU HỎI (THIẾT KẾ GỌN GÀNG, CÓ THỂ THU GỌN / MỞ RỘNG) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Thêm dạng câu hỏi khác
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (Bấm trực tiếp vào dạng câu hỏi để thêm ngay vào đề)
                </span>
              </div>

              <button
                onClick={() => setIsTypePanelExpanded(!isTypePanelExpanded)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{isTypePanelExpanded ? 'Thu gọn' : 'Xem dạng đầy đủ'}</span>
                {isTypePanelExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* DẠNG GỌN (PILLS NẰM NGANG KHI THU GỌN) */}
            {!isTypePanelExpanded ? (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUESTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleAddQuestionByType(type.id)}
                      className="px-3 py-2 bg-slate-50 hover:bg-pink-50/30 border border-slate-200 hover:border-[#d82a7a] rounded-xl flex items-center gap-2 shrink-0 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                      title={type.desc}
                    >
                      <div className={`w-5 h-5 rounded-md ${type.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-[#d82a7a] transition-colors whitespace-nowrap">
                        + {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* DẠNG LƯỚI CHI TIẾT (KHI MỞ RỘNG HOẶC KHI ĐỀ ĐANG TRỐNG CÂU HỎI) */
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {QUESTION_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div 
                        key={type.id}
                        onMouseEnter={() => setHoveredType(type)}
                        onMouseLeave={() => setHoveredType(null)}
                        onClick={() => handleAddQuestionByType(type.id)}
                        className="p-3 border border-slate-200 hover:border-[#d82a7a] rounded-xl bg-white hover:bg-pink-50/20 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`w-7 h-7 rounded-lg ${type.color} text-white flex items-center justify-center shadow-xs`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                              {type.tag}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#d82a7a] transition-colors">
                            {type.name}
                          </h4>
                          <p className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-1 leading-normal">
                            {type.desc}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-[#d82a7a]">
                          <span>+ Thêm dạng này</span>
                          <Plus className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* VÙNG XEM TRƯỚC (PREVIEW HOVER) */}
                {hoveredType && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Xem trước ({hoveredType.name})
                    </div>
                    <div className="text-xs font-bold text-slate-800">{hoveredType.preview.q}</div>
                    <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px] text-slate-600">
                      {hoveredType.preview.opts.map((opt, i) => (
                        <div key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md">
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL NHẬP TỪ TÀI LIỆU (AI PHÂN TÍCH) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#d82a7a] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Nhập câu hỏi từ tài liệu với AI</h3>
                  <p className="text-[11px] text-slate-500">Hỗ trợ tệp Word (.docx), Excel (.xlsx, .csv), PDF & Text</p>
                </div>
              </div>
              <button 
                onClick={() => { if (!isProcessingFile) setShowImportModal(false); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Vùng chọn file kéo thả */}
              <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isProcessingFile ? 'border-pink-300 bg-pink-50/30 cursor-wait' : 'border-slate-300 hover:border-[#d82a7a] hover:bg-slate-50'
              }`}>
                <input 
                  type="file" 
                  accept=".docx,.xlsx,.xls,.csv,.txt,.pdf"
                  disabled={isProcessingFile}
                  onChange={handleFileUpload}
                  className="hidden" 
                />

                {isProcessingFile ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#d82a7a] animate-spin mb-3" />
                    <p className="text-xs font-bold text-slate-800">{importStatus}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Quá trình này có thể mất vài giây tùy vào độ dài của tệp.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-pink-50 text-[#d82a7a] flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Bấm để chọn tệp hoặc kéo thả tệp vào đây
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Word (.docx), Excel (.xlsx), PDF hoặc tệp văn bản (.txt)
                    </p>
                  </>
                )}
              </label>

              {/* Thông báo lỗi nếu có */}
              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{importError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CÀI ĐẶT THÔNG SỐ ĐỀ THI */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#d82a7a]" />
                Cài đặt bài thi
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chủ đề môn học</label>
                <input 
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cấp độ</label>
                <input 
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài (Phút)</label>
                <input 
                  type="number"
                  min="1"
                  max="180"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

