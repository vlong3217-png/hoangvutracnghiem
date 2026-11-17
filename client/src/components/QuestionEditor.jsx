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
  Palette,
  Loader2,
  AlertCircle,
  GripVertical
} from 'lucide-react';

// Màu sắc các cột phân loại (đồng bộ hoàn toàn với giao diện bài làm sinh viên: Xanh dương, Xanh màu lá...)
export const CATEGORY_STYLES = [
  { header: 'bg-[#1e6f9f]', border: 'border-[#1e6f9f]', text: 'text-sky-300', name: 'Xanh dương' },
  { header: 'bg-[#149184]', border: 'border-[#149184]', text: 'text-emerald-300', name: 'Xanh màu lá' },
  { header: 'bg-[#d97706]', border: 'border-[#d97706]', text: 'text-amber-300', name: 'Cam' },
  { header: 'bg-[#7c3aed]', border: 'border-[#7c3aed]', text: 'text-purple-300', name: 'Tím' },
  { header: 'bg-[#be185d]', border: 'border-[#be185d]', text: 'text-pink-300', name: 'Hồng' }
];

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
  const [isSaving, setIsSaving] = useState(false);

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
    question.categories && question.categories.length > 0
      ? question.categories
      : [
        { id: 'cat1', name: 'Nhóm 1' },
        { id: 'cat2', name: 'Nhóm 2' }
      ]
  );
  const [categoryItems, setCategoryItems] = useState(() => {
    if (Array.isArray(question.items)) {
      return question.items
        .filter(it => it.categoryId && it.categoryId !== 'distractor' && !it.isDistractor)
        .map((it, idx) => ({
          id: it.id || `item-${idx}`,
          text: it.text || it.name || `Mục ${idx + 1}`,
          categoryId: it.categoryId
        }));
    }
    return [
      { id: 'item1', text: 'Mục A', categoryId: 'cat1' },
      { id: 'item2', text: 'Mục B', categoryId: 'cat2' }
    ];
  });
  const [distractorItems, setDistractorItems] = useState(() => {
    if (Array.isArray(question.distractors) && question.distractors.length > 0) {
      return question.distractors.map((d, idx) => 
        typeof d === 'string' ? { id: `dist-${idx}`, text: d } : { id: d.id || `dist-${idx}`, text: d.text || d.name || String(d) }
      );
    }
    if (Array.isArray(question.items)) {
      return question.items
        .filter(it => it.isDistractor || !it.categoryId || it.categoryId === 'distractor')
        .map((it, idx) => ({ id: it.id || `dist-${idx}`, text: it.text || it.name || `Nhiễu ${idx + 1}` }));
    }
    return [];
  });

  const handleAddCategory = () => {
    if (categories.length >= 5) {
      alert('Tối đa 5 nhóm phân loại!');
      return;
    }
    const nextIdx = categories.length + 1;
    const newCat = { id: `cat-${Date.now()}`, name: `Nhóm ${nextIdx}` };
    setCategories([...categories, newCat]);
  };

  const handleRemoveCategory = (catId) => {
    if (categories.length <= 2) {
      alert('Cần có ít nhất 2 nhóm phân loại!');
      return;
    }
    setCategories(categories.filter(c => c.id !== catId));
    setCategoryItems(categoryItems.filter(it => it.categoryId !== catId));
  };

  const handleAddItemToCategory = (catId, catName) => {
    const text = prompt(`Nhập nội dung mục thuộc cột "${catName}":`);
    if (text && text.trim()) {
      setCategoryItems(prev => [
        ...prev,
        { id: `item-${Date.now()}`, text: text.trim(), categoryId: catId }
      ]);
    }
  };

  const handleRemoveCategoryItem = (itemId) => {
    setCategoryItems(prev => prev.filter(it => it.id !== itemId));
  };

  const handleUpdateCategoryItem = (itemId, newText) => {
    setCategoryItems(prev => prev.map(it => it.id === itemId ? { ...it, text: newText } : it));
  };

  const handleAddDistractorCategorize = () => {
    const text = prompt('Nhập nội dung đáp án gây nhiễu (mục này KHÔNG thuộc nhóm nào, xuất hiện để thử thách học sinh):');
    if (text && text.trim()) {
      setDistractorItems(prev => [
        ...prev,
        { id: `dist-${Date.now()}`, text: text.trim() }
      ]);
    }
  };

  const handleRemoveDistractorCategorize = (distId) => {
    setDistractorItems(prev => prev.filter(d => d.id !== distId));
  };

  const handleUpdateDistractorCategorize = (distId, newText) => {
    setDistractorItems(prev => prev.map(d => d.id === distId ? { ...d, text: newText } : d));
  };

  // Trạng thái cho dạng Kéo thả khớp câu / Ghép nối (drag_drop)
  const [sentences, setSentences] = useState(
    question.sentences && question.sentences.length > 0
      ? question.sentences
      : [
        { id: 1, prefix: 'Khái niệm 1 là ', correctWord: 'A', suffix: '' },
        { id: 2, prefix: 'Khái niệm 2 là ', correctWord: 'B', suffix: '' }
      ]
  );
  const [draggableItems, setDraggableItems] = useState(
    question.draggableItems && question.draggableItems.length > 0
      ? question.draggableItems
      : ['A', 'B']
  );

  const handleAddSentence = () => {
    const nextId = sentences.length + 1;
    const defaultWord = `Từ khóa ${nextId}`;
    const newSent = { id: nextId, prefix: `Mệnh đề ${nextId} là `, correctWord: defaultWord, suffix: '' };
    setSentences([...sentences, newSent]);
    if (!draggableItems.some(item => (typeof item === 'object' ? item.text : item) === defaultWord)) {
      setDraggableItems([...draggableItems, defaultWord]);
    }
  };

  const handleRemoveSentence = (idx) => {
    setSentences(sentences.filter((_, i) => i !== idx));
  };

  const handleSentenceChange = (idx, field, value) => {
    const oldWord = sentences[idx].correctWord;
    const updated = [...sentences];
    updated[idx] = { ...updated[idx], [field]: value };
    setSentences(updated);

    if (field === 'correctWord') {
      const updatedDraggables = draggableItems.map(item => {
        const itemText = typeof item === 'object' ? item.text : item;
        if (itemText === oldWord) {
          return typeof item === 'object' ? { ...item, text: value } : value;
        }
        return item;
      });
      if (!updatedDraggables.some(item => (typeof item === 'object' ? item.text : item) === value) && value.trim()) {
        updatedDraggables.push(value);
      }
      setDraggableItems(updatedDraggables);
    }
  };

  const handleAddDistractor = () => {
    const t = prompt('Nhập từ khóa gây nhiễu (thử thách thí sinh khi kéo thả):');
    if (t && t.trim()) {
      if (!draggableItems.some(item => (typeof item === 'object' ? item.text : item) === t.trim())) {
        setDraggableItems([...draggableItems, t.trim()]);
      }
    }
  };

  const handleRemoveDraggableItem = (idx) => {
    setDraggableItems(draggableItems.filter((_, i) => i !== idx));
  };

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
    } else if (typeId === 'drag_drop') {
      if (!sentences || sentences.length === 0) {
        setSentences([
          { id: 1, prefix: 'Khái niệm 1 là ', correctWord: 'A', suffix: '' },
          { id: 2, prefix: 'Khái niệm 2 là ', correctWord: 'B', suffix: '' }
        ]);
        setDraggableItems(['A', 'B']);
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
  const handleSave = async () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    setIsSaving(true);
    try {
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
        const allItems = [
          ...categoryItems.map(it => ({ id: it.id, text: it.text, categoryId: it.categoryId })),
          ...distractorItems.map(it => ({ id: it.id, text: it.text, categoryId: null, isDistractor: true }))
        ];
        updatedQuestion.items = allItems;
        updatedQuestion.distractors = distractorItems.map(d => d.text);
      } else if (questionType === 'drag_drop') {
        updatedQuestion.sentences = sentences;
        updatedQuestion.draggableItems = draggableItems;
      }

      await onSave(updatedQuestion);
    } catch (err) {
      alert("Lỗi khi lưu câu hỏi: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
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
            disabled={isSaving}
            className="px-3 sm:px-5 py-1.5 bg-[#78398e] hover:bg-[#632977] disabled:opacity-75 text-white text-xs font-bold rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Lưu</span>
              </>
            )}
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
            className="w-full max-w-3xl text-center bg-transparent text-white placeholder-white/30 text-base sm:text-xl md:text-2xl font-normal outline-none resize-none leading-relaxed"
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

                    {/* Nút tích đánh dấu ĐÁP ÁN ĐÚNG ✓ (Vuông cho Nhiều đáp án, Tròn cho 1 đáp án) */}
                    <button
                      type="button"
                      onClick={() => handleToggleOptionCorrect(opt.id)}
                      title={isCorrect ? "Đây là đáp án đúng" : "Nhấp để chọn làm đáp án đúng"}
                      className={`w-7 h-7 ${questionType === 'multiple' ? 'rounded-lg' : 'rounded-full'} flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer ${isCorrect
                        ? 'bg-emerald-500 text-white'
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
                      className="w-full bg-transparent text-center text-white placeholder-white/40 font-normal text-base md:text-lg outline-none resize-none leading-snug"
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
                    className="flex-1 bg-transparent text-white font-normal text-sm outline-none border-b border-white/20 focus:border-purple-400 py-1"
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
              className="w-full bg-white/10 border-2 border-indigo-500/50 rounded-xl px-4 py-3 text-white text-base font-normal outline-none focus:border-indigo-400"
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
          <div className="bg-[#240520] border-2 border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 text-white space-y-5 shadow-2xl">
            {/* Header thanh công cụ phân loại */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Thiết lập các nhóm và mục phân loại
                </span>
                <span className="text-[11px] text-slate-300 font-normal">
                  Giao diện mô phỏng trực quan theo bài làm học sinh (đồng bộ cột màu xanh dương, xanh màu lá...).
                </span>
              </div>
              <div className="flex items-center gap-2">
                {categories.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-white/15"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm cột nhóm</span>
                  </button>
                )}
              </div>
            </div>

            {/* Các cột nhóm phân loại (đồng bộ hoàn toàn giao diện học sinh) */}
            <div className={`grid grid-cols-1 ${categories.length === 2 ? 'sm:grid-cols-2' : categories.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-4'} gap-3 sm:gap-4`}>
              {categories.map((cat, cIdx) => {
                const assignedItems = categoryItems.filter(it => it.categoryId === cat.id);
                const colStyle = CATEGORY_STYLES[cIdx % CATEGORY_STYLES.length];

                return (
                  <div
                    key={cat.id || cIdx}
                    className="bg-[#240520] border-2 border-white/15 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-xl min-h-[220px]"
                  >
                    {/* Header cột có màu giống học sinh: Col 1 Xanh dương, Col 2 Xanh màu lá */}
                    <div className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white shadow-md flex items-center justify-between gap-2 ${colStyle.header}`}>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[cIdx].name = e.target.value;
                          setCategories(updated);
                        }}
                        placeholder={`Tên cột ${cIdx + 1}...`}
                        className="bg-black/25 hover:bg-black/35 focus:bg-black/45 text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg border border-white/20 outline-none flex-1 truncate placeholder:text-white/60"
                      />
                      <span className="text-[10px] sm:text-xs bg-black/30 px-2 py-0.5 rounded-full font-bold shrink-0">
                        {assignedItems.length}
                      </span>
                      {categories.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat.id)}
                          className="text-white/60 hover:text-white p-0.5 rounded hover:bg-black/20"
                          title="Xóa cột này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Danh sách các mục thuộc nhóm này */}
                    <div className="flex-1 p-2.5 sm:p-3 overflow-y-auto space-y-2 flex flex-col">
                      <div className="text-[11px] font-semibold text-slate-300">
                        Các mục thuộc nhóm này ({assignedItems.length}):
                      </div>

                      <div className="flex-1 space-y-2">
                        {assignedItems.length === 0 ? (
                          <div className="h-20 border border-dashed border-white/10 rounded-xl flex items-center justify-center p-2 text-center text-xs text-white/30">
                            Chưa có mục nào trong cột này
                          </div>
                        ) : (
                          assignedItems.map(item => (
                            <div
                              key={item.id}
                              className="p-2 sm:p-2.5 bg-white text-slate-900 rounded-xl shadow-md flex items-center justify-between text-xs sm:text-sm font-bold border border-slate-200 group hover:border-[#149184] transition-all"
                            >
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleUpdateCategoryItem(item.id, e.target.value)}
                                className="flex-1 outline-none font-bold text-slate-900 bg-transparent pr-2 text-xs sm:text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveCategoryItem(item.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0 transition-colors"
                                title="Xóa mục này"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddItemToCategory(cat.id, cat.name)}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm mục vào nhóm này</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KHUNG ĐÁP ÁN GÂY NHIỄU (DISTRACTORS) */}
            <div className="bg-[#230620] border-2 border-amber-500/30 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs sm:text-sm font-black text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Đáp án gây nhiễu ({distractorItems.length})</span>
                  <span className="text-[10px] text-amber-400/80 font-normal hidden sm:inline">
                    (Không thuộc bất kỳ nhóm nào, xuất hiện trong danh sách lựa chọn của thí sinh để thử thách)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddDistractorCategorize}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto shrink-0 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm đáp gây nhiễu</span>
                </button>
              </div>

              <div className="p-3 sm:p-4">
                {distractorItems.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-xs flex flex-col items-center justify-center gap-1">
                    <span>Chưa có đáp án gây nhiễu nào.</span>
                    <span className="text-[11px] text-white/40">Bấm nút "Thêm đáp gây nhiễu" ở góc phải để bổ sung các mục đánh lừa thí sinh.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {distractorItems.map((dist, dIdx) => (
                      <div
                        key={dist.id || dIdx}
                        className="p-2 sm:p-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-md flex items-center justify-between gap-2 text-slate-900 group hover:border-amber-400 transition-all"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <input
                            type="text"
                            value={dist.text}
                            onChange={(e) => handleUpdateDistractorCategorize(dist.id, e.target.value)}
                            className="flex-1 outline-none font-bold text-slate-900 bg-transparent text-xs sm:text-sm truncate"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDistractorCategorize(dist.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0 transition-colors"
                          title="Xóa mục gây nhiễu này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DẠNG 7: KÉO THẢ KHỚP CÂU / GHÉP NỐI (drag_drop) */}
        {questionType === 'drag_drop' && (
          <div className="bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-5 mb-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                  Danh sách câu ghép nối & từ khóa kéo thả
                </span>
                <span className="text-[11px] text-white/50">
                  Nhập vế trước và từ khóa đúng cần kéo vào ô trống của mỗi câu
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddSentence}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm câu mới</span>
              </button>
            </div>

            {/* Danh sách các câu */}
            <div className="space-y-3">
              {sentences.map((sent, sIdx) => (
                <div key={sent.id || sIdx} className="bg-white/5 border border-white/15 rounded-xl p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center font-bold">
                        {sIdx + 1}
                      </span>
                      <span>Câu ghép {sIdx + 1}</span>
                    </span>
                    {sentences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSentence(sIdx)}
                        className="text-white/40 hover:text-rose-400 cursor-pointer text-xs flex items-center gap-1"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Vế trước */}
                    <div className="sm:col-span-6">
                      <label className="text-[11px] text-white/60 block mb-1">Vế trước ô trống:</label>
                      <input
                        type="text"
                        value={sent.prefix}
                        onChange={(e) => handleSentenceChange(sIdx, 'prefix', e.target.value)}
                        placeholder="Ví dụ: Khái niệm 1 là..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-rose-400 font-normal"
                      />
                    </div>

                    {/* Từ khóa đúng (ô kéo thả) */}
                    <div className="sm:col-span-6">
                      <label className="text-[11px] text-rose-300 font-bold block mb-1">★ Từ khóa đúng (ô trống):</label>
                      <input
                        type="text"
                        value={sent.correctWord}
                        onChange={(e) => handleSentenceChange(sIdx, 'correctWord', e.target.value)}
                        placeholder="Ví dụ: Mạng LAN"
                        className="w-full bg-rose-500/20 border-2 border-rose-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-rose-200 font-bold outline-none focus:border-rose-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quản lý các thẻ từ khóa kéo thả */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    Danh sách thẻ từ khóa thí sinh thấy để kéo thả ({draggableItems.length}):
                  </span>
                  <span className="text-[10px] text-white/40">
                    Bao gồm các từ khóa đúng ở trên, bạn có thể thêm các từ gây nhiễu để tăng độ khó.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddDistractor}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm từ gây nhiễu</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {draggableItems.map((item, iIdx) => {
                  const itemText = typeof item === 'object' ? item.text : item;
                  const isFromSentence = sentences.some(s => (s.correctWord || '').trim() === itemText.trim());
                  return (
                    <div
                      key={iIdx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white shadow-2xs"
                    >
                      <span>{itemText}</span>
                      {isFromSentence ? (
                        <span className="text-[9px] bg-rose-500/50 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">Đáp án</span>
                      ) : (
                        <span className="text-[9px] bg-amber-500/50 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">Gây nhiễu</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveDraggableItem(iIdx)}
                        className="text-white/40 hover:text-rose-400 cursor-pointer ml-0.5"
                        title="Xóa thẻ từ khóa này"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
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
