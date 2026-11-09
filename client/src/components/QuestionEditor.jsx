import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Lightbulb,
  Clock,
  Check,
  Save,
  Trash2,
  Image as ImageIcon,
  Video,
  Plus,
  Columns,
  Rows,
  CheckCircle2,
  CheckSquare,
  Eye,
  Layers,
  GripHorizontal,
  Edit3,
  Sparkles,
  Upload,
  Link as LinkIcon,
  X,
  Palette
} from 'lucide-react';

// Danh sách các dạng câu hỏi hiện có trong hệ thống
const QUESTION_TYPES = [
  {
    id: 'single',
    name: 'Nhiều lựa chọn (1 đáp án)',
    tag: 'Phổ biến nhất',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle2,
    iconColor: 'bg-teal-600 text-white',
    desc: 'Câu hỏi trắc nghiệm truyền thống gồm các phương án A, B, C, D (chỉ 1 đáp án đúng).'
  },
  {
    id: 'multiple',
    name: 'Chọn nhiều đáp án đúng',
    tag: 'Nâng cao',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: CheckSquare,
    iconColor: 'bg-blue-600 text-white',
    desc: 'Cho phép thí sinh chọn 2 hoặc nhiều phương án đúng cùng lúc.'
  },
  {
    id: 'true_false_multi',
    name: 'Đúng / Sai theo ý',
    tag: 'Chuẩn Bộ GD&ĐT',
    badgeColor: 'bg-purple-100 text-purple-800',
    icon: Eye,
    iconColor: 'bg-purple-600 text-white',
    desc: 'Mỗi câu có nhiều ý nhỏ a), b), c), d). Thí sinh phải xác định Đúng hoặc Sai cho từng ý.'
  },
  {
    id: 'categorize',
    name: 'Phân loại vào cột',
    tag: 'Tương tác trực quan',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: Layers,
    iconColor: 'bg-amber-600 text-white',
    desc: 'Kéo thả hoặc phân loại các mục dữ liệu vào các nhóm/cột tương ứng.'
  },
  {
    id: 'drag_drop',
    name: 'Kéo thả khớp câu / Ghép nối',
    tag: 'Tương tác trực quan',
    badgeColor: 'bg-rose-100 text-rose-800',
    icon: GripHorizontal,
    iconColor: 'bg-rose-600 text-white',
    desc: 'Kéo thả các từ khóa hoặc ô định nghĩa vào đúng vị trí khuyết trong câu hoặc bảng.'
  },
  {
    id: 'short_answer',
    name: 'Điền từ / Trả lời ngắn',
    tag: 'Tư duy',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    icon: Edit3,
    iconColor: 'bg-indigo-600 text-white',
    desc: 'Thí sinh tự gõ câu trả lời ngắn vào ô nhập. Hệ thống tự động so khớp từ khóa.'
  },
  {
    id: 'essay',
    name: 'Tự luận (Chấm điểm AI)',
    tag: 'Tích hợp Gemini AI',
    badgeColor: 'bg-pink-100 text-pink-800',
    icon: Sparkles,
    iconColor: 'bg-pink-600 text-white',
    desc: 'Thí sinh làm bài tự luận. Gemini AI tự động chấm theo dàn ý và barem điểm.'
  }
];

// Danh sách các tùy chọn thời gian
const TIME_OPTIONS = [
  { value: 5, label: '5 giây' },
  { value: 10, label: '10 giây' },
  { value: 20, label: '20 giây' },
  { value: 30, label: '30 giây' },
  { value: 45, label: '45 giây' },
  { value: 60, label: '1 phút (60s)' },
  { value: 90, label: '1.5 phút (90s)' },
  { value: 120, label: '2 phút' },
  { value: 180, label: '3 phút' },
  { value: 300, label: '5 phút' },
  { value: 900, label: '15 phút' }
];

// Danh sách các tùy chọn điểm số
const POINT_OPTIONS = [
  { value: 0, label: '0 điểm (Không tính điểm)' },
  { value: 1, label: '1 điểm' },
  { value: 2, label: '2 điểm' },
  { value: 3, label: '3 điểm' },
  { value: 4, label: '4 điểm' },
  { value: 5, label: '5 điểm' },
  { value: 10, label: '10 điểm' },
  { value: 20, label: '20 điểm' }
];

// Các ký hiệu toán học & khoa học
const MATH_SYMBOLS = [
  '∑', '∫', '∂', '√', 'π', '∞', '±', '×', '÷', '=', '≠', '≈', '≤', '≥',
  '²', '³', 'ⁿ', '½', '¼', 'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'σ', 'ω',
  'Δ', 'Ω', '°', '→', '⇔', '∈', '∉', '⊂', '∪', '∩', '∅'
];

export default function QuestionEditor({ question, onSave, onCancel }) {
  // 1. Phân loại dạng câu hỏi ban đầu
  const initialType = question.type
    ? (question.type === 'true_false' ? 'true_false_multi' : question.type)
    : (Array.isArray(question.correctAnswer) ? 'multiple' : 'single');

  const [questionType, setQuestionType] = useState(initialType);
  const [timeLimit, setTimeLimit] = useState(question.timeLimit || 30);
  const [points, setPoints] = useState(question.points !== undefined ? question.points : 1);
  const [questionText, setQuestionText] = useState(question.question || '');
  const [explanation, setExplanation] = useState(question.explanation || '');
  const [showExplanationInput, setShowExplanationInput] = useState(!!question.explanation);
  const [imageUrl, setImageUrl] = useState(question.image || '');
  const [videoUrl, setVideoUrl] = useState(question.video || '');

  // Trạng thái mở menu dropdowns
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isPointsDropdownOpen, setIsPointsDropdownOpen] = useState(false);
  const [isSymbolPickerOpen, setIsSymbolPickerOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Modal thêm ảnh cho từng đáp án
  const [optionImageTargetIdx, setOptionImageTargetIdx] = useState(null);

  // Ref cho textarea câu hỏi để chèn định dạng & ký hiệu
  const questionInputRef = useRef(null);

  // 4 thẻ đáp án màu sắc đặc trưng Quizizz/Wordwall
  const defaultColors = [
    { bg: 'bg-[#2b6cb0]', border: 'border-[#23588f]' },
    { bg: 'bg-[#2c9688]', border: 'border-[#22796e]' },
    { bg: 'bg-[#eaa023]', border: 'border-[#be7e15]' },
    { bg: 'bg-[#d24a61]', border: 'border-[#aa364a]' },
    { bg: 'bg-[#7c3aed]', border: 'border-[#6229c7]' },
    { bg: 'bg-[#059669]', border: 'border-[#047857]' }
  ];

  // Khởi tạo các phương án lựa chọn
  const initialOptions = question.options && question.options.length > 0
    ? question.options.map(opt => ({ id: opt.id, text: opt.text, image: opt.image || '' }))
    : [
      { id: 'A', text: '', image: '' },
      { id: 'B', text: '', image: '' },
      { id: 'C', text: '', image: '' },
      { id: 'D', text: '', image: '' }
    ];

  const [options, setOptions] = useState(initialOptions);

  // Danh sách ID đáp án đúng
  const initialCorrect = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : question.correctAnswer
      ? [question.correctAnswer]
      : ['B'];

  const [correctAnswers, setCorrectAnswers] = useState(initialCorrect);
  const [isMultiCorrect, setIsMultiCorrect] = useState(
    Array.isArray(question.correctAnswer) || initialType === 'multiple'
  );
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  // Trạng thái cho dạng Đúng/Sai theo ý (true_false_multi)
  const [tfParts, setTfParts] = useState(
    question.parts && question.parts.length > 0
      ? question.parts
      : [
        { id: 'A', text: 'Mệnh đề 1', isCorrect: true },
        { id: 'B', text: 'Mệnh đề 2', isCorrect: false },
        { id: 'C', text: 'Mệnh đề 3', isCorrect: true },
        { id: 'D', text: 'Mệnh đề 4', isCorrect: false }
      ]
  );

  // Trạng thái cho dạng Điền từ / Trả lời ngắn (short_answer)
  const [shortAnswer, setShortAnswer] = useState(
    typeof question.correctAnswer === 'string' ? question.correctAnswer : ''
  );

  // Trạng thái cho dạng Tự luận (essay)
  const [sampleAnswer, setSampleAnswer] = useState(question.sampleAnswer || '');
  const [criteria, setCriteria] = useState(
    question.criteria || 'Tiêu chí chấm điểm: Tính chính xác (4đ), Lập luận (3đ), Cấu trúc (3đ)'
  );

  // Trạng thái cho dạng Phân loại vào cột (categorize)
  const [categories, setCategories] = useState(
    question.categories || [
      { id: 'cat1', name: 'Nhóm 1' },
      { id: 'cat2', name: 'Nhóm 2' }
    ]
  );
  const [categoryItems, setCategoryItems] = useState(
    question.items || [
      { id: 'item1', text: 'Mục A', categoryId: 'cat1' },
      { id: 'item2', text: 'Mục B', categoryId: 'cat2' }
    ]
  );

  // Chuyển đổi dạng câu hỏi
  const handleSelectQuestionType = (typeId) => {
    setQuestionType(typeId);
    setIsTypeDropdownOpen(false);

    if (typeId === 'single') {
      setIsMultiCorrect(false);
      if (correctAnswers.length > 1) {
        setCorrectAnswers([correctAnswers[0]]);
      }
    } else if (typeId === 'multiple') {
      setIsMultiCorrect(true);
      if (correctAnswers.length === 1 && options.length > 1) {
        setCorrectAnswers([correctAnswers[0], options[1].id]);
      }
    }
  };

  // Áp dụng định dạng văn bản cho ô soạn thảo câu hỏi
  const applyFormatting = (formatType, extraData = '') => {
    const textarea = questionInputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = questionText.substring(start, end);
    let replacement = '';

    switch (formatType) {
      case 'bold':
        replacement = selected ? `**${selected}**` : '**in đậm**';
        break;
      case 'italic':
        replacement = selected ? `*${selected}*` : '*in nghiêng*';
        break;
      case 'underline':
        replacement = selected ? `<u>${selected}</u>` : '<u>gạch chân</u>';
        break;
      case 'strikethrough':
        replacement = selected ? `~~${selected}~~` : '~~gạch ngang~~';
        break;
      case 'superscript':
        replacement = extraData || '²';
        break;
      case 'subscript':
        replacement = extraData || '₂';
        break;
      case 'symbol':
        replacement = extraData;
        break;
      case 'formula':
        replacement = extraData || 'f(x) = ax² + bx + c';
        break;
      case 'clear':
        replacement = selected.replace(/[*_~`]/g, '').replace(/<\/?u>/g, '');
        break;
      default:
        replacement = selected;
    }

    const newText = questionText.substring(0, start) + replacement + questionText.substring(end);
    setQuestionText(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + replacement.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  // Toggle Nhiều đáp án đúng ở footer
  const handleToggleMultiCorrect = () => {
    const nextVal = !isMultiCorrect;
    setIsMultiCorrect(nextVal);
    if (nextVal) {
      setQuestionType('multiple');
      if (correctAnswers.length === 1 && options.length > 1) {
        setCorrectAnswers([correctAnswers[0], options[1].id]);
      }
    } else {
      setQuestionType('single');
      if (correctAnswers.length > 1) {
        setCorrectAnswers([correctAnswers[0]]);
      }
    }
  };

  const handleOptionTextChange = (idx, text) => {
    const updated = [...options];
    updated[idx].text = text;
    setOptions(updated);
  };

  const handleToggleOptionCorrect = (optId) => {
    if (isMultiCorrect) {
      if (correctAnswers.includes(optId)) {
        if (correctAnswers.length > 1) {
          setCorrectAnswers(correctAnswers.filter(id => id !== optId));
        }
      } else {
        setCorrectAnswers([...correctAnswers, optId]);
      }
    } else {
      setCorrectAnswers([optId]);
    }
  };

  const handleDeleteOption = (idx) => {
    if (options.length <= 2) {
      alert("Câu hỏi cần ít nhất 2 phương án trả lời!");
      return;
    }
    const removedId = options[idx].id;
    const updated = options.filter((_, i) => i !== idx);
    setOptions(updated);
    if (correctAnswers.includes(removedId)) {
      setCorrectAnswers([updated[0].id]);
    }
  };

  const handleAddOption = () => {
    if (options.length >= 6) {
      alert("Tối đa 6 phương án trả lời!");
      return;
    }
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: nextLetter, text: '', image: '' }]);
  };

  // Xử lý tải ảnh từ máy tính (FileReader sang base64 data URL)
  const handleUploadLocalImage = (e, targetIdx = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Vui lòng chọn một tệp hình ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        if (targetIdx !== null) {
          const updated = [...options];
          updated[targetIdx].image = dataUrl;
          setOptions(updated);
          setOptionImageTargetIdx(null);
        } else {
          setImageUrl(dataUrl);
          setIsImageModalOpen(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Lưu câu hỏi
  const handleSave = () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const updatedQuestion = {
      ...question,
      question: questionText,
      type: questionType,
      timeLimit: Number(timeLimit) || 30,
      points: Number(points) || 1,
      explanation: explanation,
      image: imageUrl || undefined,
      video: videoUrl || undefined
    };

    if (questionType === 'single') {
      updatedQuestion.options = options;
      updatedQuestion.correctAnswer = correctAnswers[0] || options[0]?.id || 'A';
    } else if (questionType === 'multiple') {
      updatedQuestion.options = options;
      updatedQuestion.correctAnswer = correctAnswers;
    } else if (questionType === 'true_false_multi') {
      updatedQuestion.parts = tfParts;
    } else if (questionType === 'short_answer') {
      updatedQuestion.correctAnswer = shortAnswer;
    } else if (questionType === 'essay') {
      updatedQuestion.sampleAnswer = sampleAnswer;
      updatedQuestion.criteria = criteria;
      updatedQuestion.maxScore = points || 10;
    } else if (questionType === 'categorize') {
      updatedQuestion.categories = categories;
      updatedQuestion.items = categoryItems;
    }

    onSave(updatedQuestion);
  };

  // Lấy thông tin dạng câu hỏi hiện tại
  const currentTypeInfo = QUESTION_TYPES.find(t => t.id === questionType) || QUESTION_TYPES[0];
  const CurrentTypeIcon = currentTypeInfo.icon;

  return (
    <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col antialiased select-none">

      {/* 1. TOP HEADER TOOLBAR */}
      <div className="h-14 border-b border-slate-200 px-2.5 sm:px-4 flex items-center justify-between bg-white shrink-0 relative z-30 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Nút quay lại < */}
          <button
            onClick={onCancel}
            title="Quay lại danh sách câu hỏi"
            className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* NÚT DROPDOWN CÁC DẠNG CÂU HỎI HIỆN TẠI CỦA HỆ THỐNG */}
          <div className="relative min-w-0">
            <button
              onClick={() => {
                setIsTypeDropdownOpen(prev => !prev);
                setIsTimeDropdownOpen(false);
                setIsPointsDropdownOpen(false);
                setIsSymbolPickerOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-white transition-all shadow-2xs hover:bg-slate-50 cursor-pointer max-w-[140px] xs:max-w-[200px] sm:max-w-none"
            >
              <span className={`w-4 h-4 rounded-sm ${currentTypeInfo.iconColor} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                <CurrentTypeIcon className="w-3 h-3" />
              </span>
              <span className="truncate">{currentTypeInfo.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Popover danh sách dạng câu hỏi */}
            {isTypeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTypeDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Các dạng câu hỏi trong hệ thống
                  </div>
                  {QUESTION_TYPES.map((t) => {
                    const TypeIcon = t.icon;
                    const isSelected = t.id === questionType;

                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelectQuestionType(t.id)}
                        className={`w-full px-3.5 py-2.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${isSelected ? 'bg-purple-50/80 text-purple-950' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                      >
                        <div className={`w-7 h-7 rounded-lg ${t.iconColor} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate">{t.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${t.badgeColor}`}>
                              {t.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {t.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-purple-600 shrink-0 self-center" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CÁC NÚT BÊN PHẢI: Thời gian, Điểm, Hủy, Lưu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* DROPDOWN CHỌN THỜI GIAN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTimeDropdownOpen(prev => !prev);
                setIsTypeDropdownOpen(false);
                setIsPointsDropdownOpen(false);
                setIsSymbolPickerOpen(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-white shadow-2xs transition-all hover:bg-slate-50 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{timeLimit >= 60 ? `${timeLimit / 60} phút` : `${timeLimit} giây`}</span>
              <span className="sm:hidden">{timeLimit >= 60 ? `${timeLimit / 60}m` : `${timeLimit}s`}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {isTimeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTimeDropdownOpen(false)} />
                <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Thời gian làm bài
                  </div>
                  {TIME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setTimeLimit(opt.value);
                        setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${timeLimit === opt.value ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <span>{opt.label}</span>
                      {timeLimit === opt.value && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* DROPDOWN CHỌN ĐIỂM SỐ */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPointsDropdownOpen(prev => !prev);
                setIsTypeDropdownOpen(false);
                setIsTimeDropdownOpen(false);
                setIsSymbolPickerOpen(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-700 bg-white shadow-2xs transition-all hover:bg-slate-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">{points} điểm</span>
              <span className="sm:hidden">{points}đ</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {isPointsDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsPointsDropdownOpen(false)} />
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Thang điểm câu hỏi
                  </div>
                  {POINT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setPoints(opt.value);
                        setIsPointsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${points === opt.value ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <span>{opt.label}</span>
                      {points === opt.value && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Nút Hủy (Ẩn trên mobile vì đã có ArrowLeft) */}
          <button
            onClick={onCancel}
            className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Hủy
          </button>

          {/* Nút LƯU MÀU TÍM */}
          <button
            onClick={handleSave}
            className="px-3 sm:px-5 py-1.5 bg-[#78398e] hover:bg-[#632977] text-white text-xs font-bold rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      {/* 2. THANH FORMAT FONT CHỮ (A, B, I, U, S, X¹, X₁, ∑, f(x)) - HỖ TRỢ CUỘN NGANG TRÊN MOBILE */}
      <div className="h-10 border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between bg-white text-xs text-slate-700 shrink-0 relative z-20 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-3 sm:gap-4 font-serif text-sm">
          {/* Nút A: Xóa / Reset định dạng */}
          <button
            type="button"
            onClick={() => applyFormatting('clear')}
            title="Xóa định dạng"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center font-sans font-bold text-slate-800 transition-colors cursor-pointer"
          >
            A
          </button>

          {/* Nút B: In đậm */}
          <button
            type="button"
            onClick={() => applyFormatting('bold')}
            title="In đậm (**text**)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center font-bold text-slate-900 transition-colors cursor-pointer"
          >
            B
          </button>

          {/* Nút I: In nghiêng */}
          <button
            type="button"
            onClick={() => applyFormatting('italic')}
            title="In nghiêng (*text*)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center italic text-slate-900 transition-colors cursor-pointer"
          >
            I
          </button>

          {/* Nút U: Gạch chân */}
          <button
            type="button"
            onClick={() => applyFormatting('underline')}
            title="Gạch chân (<u>text</u>)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center underline text-slate-900 transition-colors cursor-pointer"
          >
            U
          </button>

          {/* Nút S: Gạch ngang */}
          <button
            type="button"
            onClick={() => applyFormatting('strikethrough')}
            title="Gạch ngang (~~text~~)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center line-through text-slate-900 transition-colors cursor-pointer"
          >
            S
          </button>

          {/* Nút X¹: Chỉ số trên */}
          <button
            type="button"
            onClick={() => applyFormatting('superscript', '²')}
            title="Chèn số mũ / Chỉ số trên (²)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-slate-900 transition-colors cursor-pointer"
          >
            X¹
          </button>

          {/* Nút X₁: Chỉ số dưới */}
          <button
            type="button"
            onClick={() => applyFormatting('subscript', '₂')}
            title="Chèn chỉ số dưới (₂)"
            className="w-7 h-7 rounded hover:bg-slate-100 flex items-center justify-center text-slate-900 transition-colors cursor-pointer"
          >
            X₁
          </button>

          {/* Nút ∑: Ký hiệu toán học */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSymbolPickerOpen(prev => !prev)}
              title="Bảng ký hiệu toán học & khoa học"
              className={`w-7 h-7 rounded flex items-center justify-center text-slate-900 transition-colors cursor-pointer ${isSymbolPickerOpen ? 'bg-purple-100 text-purple-700 font-bold' : 'hover:bg-slate-100'
                }`}
            >
              Σ
            </button>

            {isSymbolPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSymbolPickerOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Ký hiệu toán học & khoa học
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {MATH_SYMBOLS.map((sym, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          applyFormatting('symbol', sym);
                          setIsSymbolPickerOpen(false);
                        }}
                        className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-800 text-base font-semibold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Nút f(x): Công thức toán học */}
          <button
            type="button"
            onClick={() => applyFormatting('formula', 'f(x) = ax² + bx + c')}
            title="Chèn công thức toán học mẫu"
            className="px-2 h-7 rounded hover:bg-slate-100 flex items-center justify-center italic text-slate-900 transition-colors cursor-pointer font-serif"
          >
            f(x)
          </button>
        </div>
      </div>

      {/* Ô nhập giải thích (Nếu được mở) */}
      {showExplanationInput && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Nhập lời giải thích hoặc gợi ý cho đáp án..."
            className="flex-1 bg-transparent text-xs text-amber-950 placeholder-amber-500 outline-none"
          />
          <button
            onClick={() => setShowExplanationInput(false)}
            className="text-amber-500 hover:text-amber-800 text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. KHÔNG GIAN SOẠN THẢO CHÍNH - TÔNG MÀU TÍM ĐEN HUYỀN BÍ */}
      <div className="flex-1 bg-[#471842] p-3 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">

        {/* VÙNG NHẬP CÂU HỎI */}
        <div className="relative bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-4 pt-12 sm:p-8 mb-4 sm:mb-6 min-h-[160px] sm:min-h-[220px] flex flex-col justify-center items-center shadow-lg group">

          {/* CÁC NÚT MEDIA GÓC TRÊN BÊN TRÁI: ẢNH VÀ VIDEO (ĐÃ BỎ NÚT GHI ÂM) */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
            {/* Nút Thêm Hình ảnh */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              title="Thêm hình ảnh cho câu hỏi"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors relative cursor-pointer ${
                imageUrl ? 'bg-amber-500 text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 text-[9px] text-amber-400">⚡</span>
            </button>

            {/* Nút Thêm Video */}
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              title="Thêm video minh họa (YouTube / MP4)"
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                videoUrl ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Hiển thị ảnh minh họa câu hỏi nếu có */}
          {imageUrl && (
            <div className="mb-4 relative group/img">
              <img 
                src={imageUrl} 
                alt="Question Media" 
                className="max-h-28 sm:max-h-36 rounded-lg border border-white/20 object-contain shadow-md bg-black/20" 
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                title="Xóa hình ảnh"
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 hover:bg-rose-700 rounded-full text-white text-xs flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Hiển thị video minh họa nếu có */}
          {videoUrl && (
            <div className="mb-4 relative group/video">
              <div className="w-64 sm:w-72 h-36 sm:h-40 bg-black/40 rounded-lg overflow-hidden border border-white/20 flex items-center justify-center">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={videoUrl.replace('watch?v=', 'embed/')}
                    title="Video preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setVideoUrl('')}
                title="Xóa video"
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 hover:bg-rose-700 rounded-full text-white text-xs flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Ô nhập câu hỏi chữ to chính giữa màn hình */}
          <textarea
            ref={questionInputRef}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Nhập nội dung câu hỏi tại đây..."
            rows={2}
            className="w-full max-w-3xl text-center bg-transparent text-white placeholder-white/30 text-base sm:text-xl md:text-2xl font-bold outline-none resize-none leading-relaxed"
          />
        </div>

        {/* 4. KHU VỰC ĐÁP ÁN THEO TỪNG DẠNG CÂU HỎI */}

        {/* DẠNG 1 & 2: TRẮC NGHIỆM 1 HOẶC NHIỀU ĐÁP ÁN (single / multiple) */}
        {(questionType === 'single' || questionType === 'multiple') && (
          <div className={`grid gap-3 sm:gap-4 mb-4 sm:mb-6 ${
            isVerticalLayout 
              ? 'grid-cols-1 max-w-xl mx-auto w-full' 
              : options.length <= 4 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
            {options.map((opt, idx) => {
              const color = defaultColors[idx % defaultColors.length];
              const isCorrect = correctAnswers.includes(opt.id);

              return (
                <div
                  key={opt.id}
                  className={`${color.bg} border-2 ${color.border} rounded-2xl p-3 sm:p-4 min-h-[130px] sm:min-h-[170px] flex flex-col justify-between text-white relative shadow-md transition-all`}
                >
                  {/* Thanh action góc trên thẻ: Icon Xóa, Icon Ảnh + Icon Dấu Tích Chọn Đúng */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(idx)}
                        title="Xóa phương án này"
                        className="w-6 h-6 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white/80" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptionImageTargetIdx(idx)}
                        title="Chèn ảnh cho phương án này"
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${opt.image ? 'bg-amber-400 text-slate-900' : 'bg-black/20 hover:bg-black/40 text-white/80'
                          }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Nút tròn đánh dấu ĐÁP ÁN ĐÚNG ✓ */}
                    <button
                      type="button"
                      onClick={() => handleToggleOptionCorrect(opt.id)}
                      title={isCorrect ? "Đây là đáp án đúng" : "Nhấp để chọn làm đáp án đúng"}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer ${isCorrect
                        ? 'bg-emerald-500 text-white ring-2 ring-white'
                        : 'bg-black/20 text-white/40 hover:bg-black/40 hover:text-white'
                        }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  {/* Ảnh đính kèm phương án nếu có */}
                  {opt.image && (
                    <div className="relative mt-2 max-h-20 flex justify-center group/optimg">
                      <img src={opt.image} alt="Option Illustration" className="max-h-20 rounded border border-white/20 object-contain shadow-xs" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...options];
                          updated[idx].image = '';
                          setOptions(updated);
                        }}
                        className="absolute -top-1 right-2 w-4 h-4 bg-rose-600 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover/optimg:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Nội dung câu trả lời chính giữa thẻ */}
                  <div className="my-auto py-2">
                    <textarea
                      rows={2}
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Đáp án ${idx + 1}`}
                      className="w-full bg-transparent text-center text-white placeholder-white/40 font-bold text-base md:text-lg outline-none resize-none leading-snug"
                    />
                  </div>

                  {/* Chân thẻ hiển thị nhãn A, B, C, D */}
                  <div className="text-[11px] font-semibold text-white/60 text-right">
                    Lựa chọn {opt.id}
                  </div>
                </div>
              );
            })}

            {/* Nút thêm phương án mới */}
            {options.length < 6 && !isVerticalLayout && (
              <button
                type="button"
                onClick={handleAddOption}
                className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-4 min-h-[170px] flex flex-col items-center justify-center text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <Plus className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold">Thêm đáp án</span>
              </button>
            )}
          </div>
        )}

        {/* DẠNG 3: ĐÚNG / SAI THEO Ý (true_false_multi) */}
        {questionType === 'true_false_multi' && (
          <div className="bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-5 mb-6 text-white space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-amber-300">Danh sách các ý mệnh đề (Đúng / Sai)</span>
              <button
                type="button"
                onClick={() => {
                  const nextId = String.fromCharCode(65 + tfParts.length);
                  setTfParts([...tfParts, { id: nextId, text: `Mệnh đề ${tfParts.length + 1}`, isCorrect: true }]);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mệnh đề</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {tfParts.map((part, pIdx) => (
                <div key={part.id || pIdx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-purple-600/80 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {part.id}
                  </span>
                  <input
                    type="text"
                    value={part.text}
                    onChange={(e) => {
                      const updated = [...tfParts];
                      updated[pIdx].text = e.target.value;
                      setTfParts(updated);
                    }}
                    placeholder={`Nội dung mệnh đề ${part.id}...`}
                    className="flex-1 bg-transparent text-white font-semibold text-sm outline-none border-b border-white/20 focus:border-purple-400 py-1"
                  />
                  {/* Hai nút chuyển đổi Đúng / Sai */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...tfParts];
                        updated[pIdx].isCorrect = true;
                        setTfParts(updated);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${part.isCorrect
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                        }`}
                    >
                      ĐÚNG
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...tfParts];
                        updated[pIdx].isCorrect = false;
                        setTfParts(updated);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${!part.isCorrect
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                        }`}
                    >
                      SAI
                    </button>
                    {tfParts.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setTfParts(tfParts.filter((_, i) => i !== pIdx))}
                        className="w-7 h-7 rounded-lg text-white/40 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DẠNG 4: ĐIỀN TỪ / TRẢ LỜI NGẮN (short_answer) */}
        {questionType === 'short_answer' && (
          <div className="bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-6 mb-6 text-white space-y-4 max-w-2xl mx-auto w-full">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Đáp án chuẩn hoặc từ khóa hệ thống sẽ so khớp:
            </div>
            <input
              type="text"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              placeholder="Nhập đáp án đúng chuẩn (Ví dụ: LAN, Hệ điều hành, 1945)..."
              className="w-full bg-white/10 border-2 border-indigo-500/50 rounded-xl px-4 py-3 text-white text-base font-bold outline-none focus:border-indigo-400"
            />
            <p className="text-[11px] text-white/60">
              💡 Hệ thống sẽ tự động đối chiếu không phân biệt chữ hoa, chữ thường và khoảng trắng thừa.
            </p>
          </div>
        )}

        {/* DẠNG 5: TỰ LUẬN CHẤM ĐIỂM AI (essay) */}
        {questionType === 'essay' && (
          <div className="bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-6 mb-6 text-white space-y-4 max-w-3xl mx-auto w-full">
            <div>
              <div className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Dàn ý / Đáp án mẫu cho Gemini AI tham chiếu</span>
              </div>
              <textarea
                rows={3}
                value={sampleAnswer}
                onChange={(e) => setSampleAnswer(e.target.value)}
                placeholder="Nhập các luận điểm, từ khóa cốt lõi cần có trong bài làm của sinh viên..."
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-400 resize-none leading-relaxed"
              />
            </div>

            <div>
              <div className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                Barem tiêu chí chấm điểm (Thang điểm 10)
              </div>
              <input
                type="text"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder="Ví dụ: Tính chính xác (4đ), Lập luận sâu sắc (3đ), Cấu trúc rõ ràng (3đ)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-pink-400"
              />
            </div>
          </div>
        )}

        {/* DẠNG 6: PHÂN LOẠI VÀO CỘT (categorize) */}
        {questionType === 'categorize' && (
          <div className="bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-5 mb-6 text-white space-y-4">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Thiết lập các nhóm và mục phân loại
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, cIdx) => (
                <div key={cat.id || cIdx} className="bg-white/5 border border-white/15 rounded-xl p-3 space-y-2">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[cIdx].name = e.target.value;
                      setCategories(updated);
                    }}
                    placeholder={`Tên cột nhóm ${cIdx + 1}...`}
                    className="w-full bg-amber-500/20 text-amber-300 font-bold text-sm px-2.5 py-1 rounded border border-amber-500/40 outline-none"
                  />
                  <div className="text-[11px] text-white/50">Các mục thuộc nhóm này:</div>
                  <div className="space-y-1.5">
                    {categoryItems.filter(item => item.categoryId === cat.id).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-black/20 px-2.5 py-1.5 rounded text-xs">
                        <span className="flex-1 truncate">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => setCategoryItems(categoryItems.filter(i => i.id !== item.id))}
                          className="text-white/40 hover:text-rose-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const t = prompt(`Nhập nội dung mục thuộc cột "${cat.name}":`);
                        if (t && t.trim()) {
                          setCategoryItems([...categoryItems, { id: `item-${Date.now()}`, text: t.trim(), categoryId: cat.id }]);
                        }
                      }}
                      className="w-full py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Thêm mục vào nhóm này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FOOTER CÔNG CỤ: Toggle Nhiều đáp án đúng & Chuyển bố cục */}
        {(questionType === 'single' || questionType === 'multiple') && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-white text-xs pt-3 border-t border-white/10">
            {/* Toggle Nhiều đáp án đúng */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-semibold">Nhiều đáp án đúng:</span>
              <button
                type="button"
                onClick={handleToggleMultiCorrect}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isMultiCorrect ? 'bg-emerald-500' : 'bg-white/30'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isMultiCorrect ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Nút đổi bố cục ngang / dọc */}
            <button
              type="button"
              onClick={() => setIsVerticalLayout(prev => !prev)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isVerticalLayout ? <Columns className="w-4 h-4" /> : <Rows className="w-4 h-4" />}
              <span>{isVerticalLayout ? 'Chuyển sang bố cục ngang' : 'Chuyển sang bố cục dọc'}</span>
            </button>
          </div>
        )}

      </div>

      {/* MODAL CHÈN ẢNH CHO CÂU HỎI */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Chèn hình ảnh cho câu hỏi</span>
              </h3>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Tải tệp từ máy tính */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tải tệp ảnh từ máy tính:</label>
                <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-xs font-bold text-purple-800">Bấm để chọn file ảnh</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, GIF, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadLocalImage(e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Hoặc dán đường dẫn URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Hoặc dán đường link ảnh (URL):</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-xl text-xs">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      defaultValue={imageUrl}
                      id="inputQuestionImgUrl"
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const val = document.getElementById('inputQuestionImgUrl')?.value;
                      if (val) setImageUrl(val);
                      setIsImageModalOpen(false);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Dùng URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHÈN ẢNH CHO TỪNG ĐÁP ÁN */}
      {optionImageTargetIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Chèn hình ảnh cho Lựa chọn {options[optionImageTargetIdx]?.id}</span>
              </h3>
              <button
                onClick={() => setOptionImageTargetIdx(null)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tải tệp ảnh từ máy tính:</label>
                <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-xs font-bold text-purple-800">Bấm để chọn file ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadLocalImage(e, optionImageTargetIdx)}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Hoặc nhập link URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    id="inputOptionImgUrl"
                    defaultValue={options[optionImageTargetIdx]?.image}
                    placeholder="https://example.com/photo.png"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = document.getElementById('inputOptionImgUrl')?.value;
                      if (val) {
                        const updated = [...options];
                        updated[optionImageTargetIdx].image = val;
                        setOptions(updated);
                      }
                      setOptionImageTargetIdx(null);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Dùng URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHÈN VIDEO CHO CÂU HỎI */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Chèn video minh họa cho câu hỏi</span>
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Dán đường dẫn video (YouTube / MP4):</label>
              <input
                type="url"
                defaultValue={videoUrl}
                id="inputVideoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Hỗ trợ liên kết YouTube hoặc tệp video MP4 trực tiếp.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = document.getElementById('inputVideoUrl')?.value;
                    if (val) setVideoUrl(val);
                    setIsVideoModalOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Lưu video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
