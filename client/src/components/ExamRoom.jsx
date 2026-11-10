import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Menu,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Send,
  ZoomIn,
  Eye,
  Lightbulb,
  GripVertical,
  Layers,
  Hand,
  CheckCircle2,
  Bot,
  Loader2,
  Key,
  Shuffle
} from 'lucide-react';
import { gradeEssayWithGemini, getGeminiApiKey, setGeminiApiKey } from '../services/geminiService';

export default function ExamRoom({ exam, onSubmitExam, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' | 'prev'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answeredState, setAnsweredState] = useState(null);
  const [shortInputText, setShortInputText] = useState('');
  const [showInstantAnswer, setShowInstantAnswer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // STATE DÀNH CHO DẠNG ĐÚNG/SAI NHIỀU PHẦN (A, B, C, D)
  // activePartId: 'A' | 'B' | 'C' | 'D'
  const [activePartId, setActivePartId] = useState('A');
  // multiTfAnswers: { [partId]: true | false }
  const [multiTfAnswers, setMultiTfAnswers] = useState({});

  // STATE DÀNH CHO DẠNG PHÂN LOẠI VÀO CỘT (Categorize)
  const [columnAssignments, setColumnAssignments] = useState({});
  const [unassignedItems, setUnassignedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedCategorizeItem, setSelectedCategorizeItem] = useState(null);

  // STATE DÀNH CHO DẠNG KÉO THẢ KHỚP CÂU (Drag & Drop Fill Blank)
  const [sentenceSlots, setSentenceSlots] = useState({});
  const [availableDropItems, setAvailableDropItems] = useState([]);
  const [selectedDropItem, setSelectedDropItem] = useState(null);

  // STATE DÀNH CHO DẠNG TRẮC NGHIỆM CHỌN NHIỀU ĐÁP ÁN (Multiple choice)
  const [multiSelectedOpts, setMultiSelectedOpts] = useState([]);

  // STATE DÀNH CHO DẠNG ĐIỀN CHỖ TRỐNG ĐỤC LỖ (Fill in the Blanks / Cloze)
  const [clozeAnswers, setClozeAnswers] = useState({});

  // STATE DANH SÁCH CÁC CÂU HỎI ĐÃ BỎ QUA ĐỂ LÀM LẠI
  const [skippedQuestionIds, setSkippedQuestionIds] = useState([]);
  const [showSkippedModal, setShowSkippedModal] = useState(false);

  // STATE DÀNH CHO DẠNG TỰ LUẬN CHẤM BẰNG GEMINI (Essay)
  const [essayAnswer, setEssayAnswer] = useState('');
  const [isGradingEssay, setIsGradingEssay] = useState(false);
  const [essayAiResult, setEssayAiResult] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(getGeminiApiKey());

  // CHUẨN BỊ DANH SÁCH CÂU HỎI LÀM BÀI (ĐỒNG BỘ CÀI ĐẶT ĐẢO CÂU HỎI & ĐẢO ĐÁP ÁN)
  const [questions] = useState(() => {
    let list = exam.questions && Array.isArray(exam.questions) ? [...exam.questions] : [];

    // 1. Nếu đề thi bật "Đảo câu hỏi" (shuffleQuestions)
    if (exam.shuffleQuestions && list.length > 1) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }

    // 2. Nếu đề thi bật "Đảo đáp án" (shuffleAnswers)
    if (exam.shuffleAnswers) {
      list = list.map(q => {
        if (q.options && Array.isArray(q.options) && q.options.length > 1) {
          const shuffledOpts = [...q.options];
          for (let i = shuffledOpts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
          }
          return {
            ...q,
            options: shuffledOpts
          };
        }
        return q;
      });
    }

    return list;
  });
  const currentQ = questions[currentIdx] || {
    id: 1,
    type: 'single',
    question: 'Túi khí được trang bị trên xe ô tô có tác dụng gì dưới đây?',
    options: [
      { id: 'A', text: 'Giữ chặt người lái và hành khách trên ghế ngồi khi xe ô tô đột ngột dừng lại.' },
      { id: 'B', text: 'Giảm khả năng va đập của một số bộ phận cơ thể quan trọng với các vật thể trong xe.' },
      { id: 'C', text: 'Hấp thụ một phần lực va đập lên người lái và hành khách.' },
      { id: 'D', text: 'Ý 2 và ý 3.' }
    ],
    correctAnswer: 'D',
    explanation: 'Túi khí giúp giảm va đập và hấp thụ lực va đập, bảo vệ các bộ phận trọng yếu của cơ thể.'
  };

  useEffect(() => {
    setShowInstantAnswer(false);
    setAnsweredState(null);
    setMultiSelectedOpts(Array.isArray(selectedAnswers[currentQ.id]) ? selectedAnswers[currentQ.id] : []);

    if (currentQ.type === 'true_false_multi' || currentQ.type === 'true_false') {
      setActivePartId(currentQ.parts?.[0]?.id || 'A');
      setMultiTfAnswers(selectedAnswers[currentQ.id] || {});
    } else if (currentQ.type === 'categorize') {
      const cats = currentQ.categories || [];
      const initialCats = {};
      cats.forEach(c => initialCats[c.id] = []);
      setColumnAssignments(initialCats);
      const rawItems = currentQ.items ? [...currentQ.items] : [];
      setUnassignedItems(rawItems.map((it, idx) => ({
        id: it.id || `item-${idx}`,
        text: it.text || it.name || `Mục ${idx + 1}`,
        categoryId: it.categoryId || it.targetCategory || cats[0]?.id
      })));
      setSelectedCategorizeItem(null);
    } else if (currentQ.type === 'drag_drop') {
      setSentenceSlots({});
      const rawItems = currentQ.draggableItems || [];
      const normalized = rawItems.map((d, idx) => {
        if (typeof d === 'string') return { id: d, text: d };
        return { id: d.id || d.text || `drop-${idx}`, text: d.text || d.id || String(d) };
      });
      setAvailableDropItems(normalized);
      setSelectedDropItem(null);
    } else if (currentQ.type === 'short_answer' || currentQ.type === 'fill_blank') {
      setShortInputText(selectedAnswers[currentQ.id] || '');
      setClozeAnswers(typeof selectedAnswers[currentQ.id] === 'object' ? selectedAnswers[currentQ.id] : {});
    } else if (currentQ.type === 'essay') {
      const existing = selectedAnswers[currentQ.id];
      if (typeof existing === 'object' && existing !== null) {
        setEssayAnswer(existing.text || '');
        setEssayAiResult(existing.aiResult || null);
      } else {
        setEssayAnswer(existing || '');
        setEssayAiResult(null);
      }
    }
  }, [currentIdx, currentQ.id]);

  const playSound = (isWin) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (isWin) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) { }
  };

  // -------------------------------------------------------------
  // XỬ LÝ DẠNG ĐÚNG/SAI NHIỀU PHẦN A, B, C, D (Hiển thị Đúng/Sai NGAY LẬP TỨC từng phần)
  // -------------------------------------------------------------
  const handleSelectTrueFalsePart = (partId, boolValue) => {
    if (answeredState) return;

    const partObj = (currentQ.parts || []).find(p => p.id === partId);
    if (!partObj) return;

    // Đồng bộ chính xác với QuestionEditor và CreateResourceModal: part.isCorrect (hoặc fallback part.correct)
    const expectedBool = partObj.isCorrect !== undefined
      ? Boolean(partObj.isCorrect)
      : (partObj.correct !== undefined ? Boolean(partObj.correct) : true);

    const isPartCorrect = expectedBool === Boolean(boolValue);

    const updated = {
      ...multiTfAnswers,
      [partId]: boolValue
    };
    setMultiTfAnswers(updated);
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: updated }));

    // Hiện thông báo Đúng hay Sai NGAY LẬP TỨC tại footer
    setAnsweredState({
      isCorrect: isPartCorrect,
      isPartStep: true,
      answeredPartId: partId
    });

    if (isPartCorrect) {
      playSound(true);
      setScore(prev => prev + 150);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch (e) { }
    } else {
      playSound(false);
    }

    // Tự động chuyển sau 2 giây
    setTimeout(() => {
      handleNextPartOrQuestion(partId);
    }, 2000);
  };

  // Chuyển sang phần tiếp theo hoặc câu tiếp theo khi hết 2 giây ở Đúng/Sai
  const handleNextPartOrQuestion = (currentPart = activePartId) => {
    const parts = currentQ.parts || [];
    const currentPartIndex = parts.findIndex(p => p.id === currentPart);

    // Nếu còn phần con tiếp theo trong câu Đúng/Sai (A -> B -> C -> D)
    if (currentPartIndex < parts.length - 1) {
      setActivePartId(parts[currentPartIndex + 1].id);
      setAnsweredState(null); // Reset footer để làm tiếp phần mới
    } else {
      // Đã xong phần cuối cùng (D) -> Chuyển sang câu hỏi tiếp theo của đề thi
      handleNext();
    }
  };

  // -------------------------------------------------------------
  // XỬ LÝ DẠNG PHÂN LOẠI
  // -------------------------------------------------------------
  const handleDropIntoCategory = (catId, item) => {
    if (!item || answeredState) return;
    const remainingUnassigned = unassignedItems.filter(i => i.id !== item.id);
    setUnassignedItems(remainingUnassigned);

    const nextColumnAssignments = {
      ...columnAssignments,
      [catId]: [...(columnAssignments[catId] || []), item]
    };
    setColumnAssignments(nextColumnAssignments);
    setDraggedItem(null);
    setSelectedCategorizeItem(null);

    // Nếu đã phân loại hết tất cả các mục => Tự động đánh giá Đúng/Sai toàn câu
    if (remainingUnassigned.length === 0) {
      const allItems = currentQ.items || [];
      const isAllMatch = allItems.every(it => {
        const targetColId = it.categoryId || it.targetCategory;
        const targetCol = nextColumnAssignments[targetColId] || [];
        return targetCol.some(cItem => cItem.id === it.id || cItem.text === it.text);
      });

      setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: nextColumnAssignments }));
      setAnsweredState({ isCorrect: isAllMatch });
      if (isAllMatch) {
        playSound(true);
        setScore(prev => prev + 600);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch (e) { }
      } else {
        playSound(false);
      }

      // Tự động chuyển câu sau 2 giây
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleReturnToOptions = (catId, item) => {
    if (answeredState) return;
    setColumnAssignments(prev => ({
      ...prev,
      [catId]: prev[catId].filter(i => i.id !== item.id)
    }));
    setUnassignedItems(prev => [...prev, item]);
  };

  // -------------------------------------------------------------
  // XỬ LÝ DẠNG KÉO THẢ KHỚP CÂU
  // -------------------------------------------------------------
  const handleDropIntoSlot = (slotId, item) => {
    if (!item || answeredState) return;
    const existingItemId = sentenceSlots[slotId];
    if (existingItemId) {
      const normalizedAll = (currentQ.draggableItems || []).map((d, idx) => {
        if (typeof d === 'string') return { id: d, text: d };
        return { id: d.id || d.text || `drop-${idx}`, text: d.text || d.id || String(d) };
      });
      const oldItem = normalizedAll.find(d => (d.id || d.text) === existingItemId);
      if (oldItem) {
        setAvailableDropItems(prev => [...prev, oldItem]);
      }
    }

    const itemId = item.id || item.text;
    const nextSlots = { ...sentenceSlots, [slotId]: itemId };
    setSentenceSlots(nextSlots);
    const nextAvailable = availableDropItems.filter(d => (d.id || d.text) !== itemId);
    setAvailableDropItems(nextAvailable);
    setDraggedItem(null);
    setSelectedDropItem(null);

    // Nếu đã điền đủ tất cả các ô trống => Tự động đánh giá Đúng/Sai
    const sentences = currentQ.sentences || [];
    const isAllFilled = sentences.every(s => nextSlots[s.id] !== undefined);
    if (isAllFilled) {
      const isAllCorrect = sentences.every(s => {
        const userChoice = String(nextSlots[s.id] || '').trim().toLowerCase();
        const correctChoice = String(s.correctItemId || s.correctWord || s.correctAnswer || '').trim().toLowerCase();
        return userChoice === correctChoice;
      });
      setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: nextSlots }));
      setAnsweredState({ isCorrect: isAllCorrect });
      if (isAllCorrect) {
        playSound(true);
        setScore(prev => prev + 600);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch (e) { }
      } else {
        playSound(false);
      }

      // Tự động chuyển câu sau 2 giây
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleRemoveFromSlot = (slotId) => {
    if (answeredState) return;
    const itemId = sentenceSlots[slotId];
    if (!itemId) return;
    const normalizedAll = (currentQ.draggableItems || []).map((d, idx) => {
      if (typeof d === 'string') return { id: d, text: d };
      return { id: d.id || d.text || `drop-${idx}`, text: d.text || d.id || String(d) };
    });
    const itemObj = normalizedAll.find(d => (d.id || d.text) === itemId) || { id: itemId, text: itemId };
    setAvailableDropItems(prev => [...prev, itemObj]);
    setSentenceSlots(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  // -------------------------------------------------------------
  // XỬ LÝ TRẮC NGHIỆM 4 ĐÁP ÁN (HỖ TRỢ CẢ 1 ĐÁP ÁN VÀ NHIỀU ĐÁP ÁN)
  // -------------------------------------------------------------
  const handleSelectOption = (optId) => {
    if (answeredState) return;

    // NẾU LÀ CÂU TRẮC NGHIỆM NHIỀU ĐÁP ÁN (currentQ.type === 'multiple')
    if (currentQ.type === 'multiple') {
      const isAlready = multiSelectedOpts.includes(optId);
      const nextList = isAlready
        ? multiSelectedOpts.filter(id => id !== optId)
        : [...multiSelectedOpts, optId];

      setMultiSelectedOpts(nextList);
      setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: nextList }));
      return;
    }

    // CÂU TRẮC NGHIỆM ĐƠN (1 ĐÁP ÁN ĐÚNG)
    const isCorrect = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.includes(optId)
      : currentQ.correctAnswer === optId;

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    setAnsweredState({ selectedOptId: optId, isCorrect });

    if (isCorrect) {
      playSound(true);
      setScore(prev => prev + 600);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) { }
    } else {
      playSound(false);
    }

    // Tự động chuyển câu sau 2 giây
    setTimeout(() => {
      // Khi đã làm xong câu này, nếu nó từng nằm trong danh sách bỏ qua thì bỏ nó ra
      setSkippedQuestionIds(prev => prev.filter(id => id !== currentQ.id));
      handleNext();
    }, 2000);
  };

  // Nộp câu trắc nghiệm nhiều đáp án
  const handleSubmitMultipleChoice = () => {
    if (multiSelectedOpts.length === 0 || answeredState) return;

    const correctList = [...(currentQ.correctAnswer || [])].sort();
    const userList = [...multiSelectedOpts].sort();
    const isAllMatch = JSON.stringify(correctList) === JSON.stringify(userList);

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: multiSelectedOpts }));
    setAnsweredState({
      isCorrect: isAllMatch,
      isMultiple: true,
      selectedList: multiSelectedOpts,
      correctList
    });

    if (isAllMatch) {
      playSound(true);
      setScore(prev => prev + 600);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) { }
    } else {
      playSound(false);
    }

    setTimeout(() => {
      setSkippedQuestionIds(prev => prev.filter(id => id !== currentQ.id));
      handleNext();
    }, 2000);
  };

  // -------------------------------------------------------------
  // XỬ LÝ BỎ QUA CÂU HỎI VÀ ĐƯA VÀO DANH SÁCH BỎ QUA
  // -------------------------------------------------------------
  const handleSkipQuestion = () => {
    if (!skippedQuestionIds.includes(currentQ.id)) {
      setSkippedQuestionIds(prev => [...prev, currentQ.id]);
    }
    handleNext();
  };

  // Nhảy trực tiếp tới câu đã bỏ qua để làm lại
  const handleJumpToQuestion = (targetIdx) => {
    setCurrentIdx(targetIdx);
    setShowSkippedModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ ĐIỀN VÀO CHỖ TRỐNG (CẢ GÕ TỰ DO VÀ KIỂU ĐỤC LỖ)
  // -------------------------------------------------------------
  const handleShortAnswerSubmit = (e) => {
    if (e) e.preventDefault();
    if (answeredState) return;

    // Trường hợp câu đục lỗ nhiều vị trí (blanks: [{ id: 1, correctAnswer: '...' }])
    if (currentQ.blanks && currentQ.blanks.length > 0) {
      const isAllFilled = currentQ.blanks.every(b => (clozeAnswers[b.id] || '').trim().length > 0);
      if (!isAllFilled) return;

      const isAllCorrect = currentQ.blanks.every(b => {
        const val = (clozeAnswers[b.id] || '').trim().toLowerCase();
        const accepted = Array.isArray(b.correctAnswer)
          ? b.correctAnswer.map(c => c.toLowerCase().trim())
          : [String(b.correctAnswer || '').toLowerCase().trim()];
        return accepted.includes(val);
      });

      setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: clozeAnswers }));
      setAnsweredState({ isCorrect: isAllCorrect, clozeAnswers });

      if (isAllCorrect) {
        playSound(true);
        setScore(prev => prev + 600);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch (err) { }
      } else {
        playSound(false);
      }

      setTimeout(() => {
        handleNext();
      }, 2000);
      return;
    }

    // Trường hợp gõ đơn thông thường
    if (!shortInputText.trim()) return;

    const userVal = shortInputText.trim().toLowerCase();
    const correctAnswers = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.map(c => c.toString().trim().toLowerCase())
      : [currentQ.correctAnswer.toString().trim().toLowerCase()];

    const isCorrect = correctAnswers.some(ans => ans === userVal);

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: shortInputText }));
    setAnsweredState({ isCorrect, userAnswer: shortInputText });

    if (isCorrect) {
      playSound(true);
      setScore(prev => prev + 600);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (err) { }
    } else {
      playSound(false);
    }

    setTimeout(() => {
      setSkippedQuestionIds(prev => prev.filter(id => id !== currentQ.id));
      handleNext();
    }, 2000);
  };

  // -------------------------------------------------------------
  // XỬ LÝ NỘP CÂU HỎI TỰ LUẬN CHẤM BẰNG GEMINI 2.5 FLASH
  // -------------------------------------------------------------
  const handleGradeEssayWithAI = async () => {
    if (!essayAnswer.trim() || isGradingEssay || answeredState) return;

    setIsGradingEssay(true);
    try {
      const result = await gradeEssayWithGemini({
        question: currentQ.question,
        essayAnswer,
        rubric: currentQ.rubric || currentQ.criteria || '',
        sampleAnswer: currentQ.sampleAnswer || currentQ.correctAnswer || '',
        maxScore: currentQ.maxScore || 10
      });

      setEssayAiResult(result);
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQ.id]: {
          text: essayAnswer,
          aiResult: result
        }
      }));

      const isPass = result.score >= ((currentQ.maxScore || 10) * 0.5);
      setAnsweredState({
        isCorrect: isPass,
        isEssay: true,
        score: result.score,
        maxScore: result.maxScore || 10,
        feedback: result.feedback
      });

      if (isPass) {
        playSound(true);
        setScore(prev => prev + Math.round((result.score / (currentQ.maxScore || 10)) * 600));
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        } catch (err) { }
      } else {
        playSound(false);
      }

      // Tự động chuyển câu sau 2 giây cho dạng tự luận
      setTimeout(() => {
        setSkippedQuestionIds(prev => prev.filter(id => id !== currentQ.id));
        handleNext();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGradingEssay(false);
    }
  };

  const handleNext = () => {
    setSlideDirection('next');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onSubmitExam({
        selectedAnswers,
        score,
        timeSpent: 600,
        warnings: 0
      });
    }
  };

  const handlePrev = () => {
    setSlideDirection('prev');
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Lấy dữ liệu phần đang kích hoạt cho câu hỏi Đúng/Sai nhiều phần
  const activePartIndex = (currentQ.parts || []).findIndex(p => p.id === activePartId);
  const activePartObj = (currentQ.parts || [])[activePartIndex !== -1 ? activePartIndex : 0];

  // Kiểm tra xem câu hiện tại đã hoàn thành hay chưa
  const hasAnsweredCurrent = Boolean(
    answeredState ||
    selectedAnswers[currentQ.id] ||
    ((currentQ.type === 'true_false_multi' || currentQ.type === 'true_false') && Object.keys(multiTfAnswers).length >= (currentQ.parts || []).length) ||
    (currentQ.type === 'categorize' && unassignedItems.length === 0) ||
    (currentQ.type === 'drag_drop' && Object.keys(sentenceSlots).length >= (currentQ.sentences || []).length) ||
    (currentQ.type === 'essay' && essayAnswer.trim().length > 0) ||
    ((currentQ.type === 'short_answer' || currentQ.type === 'fill_blank') && (
      currentQ.blanks
        ? currentQ.blanks.every(b => (clozeAnswers[b.id] || '').trim().length > 0)
        : shortInputText.trim().length > 0
    ))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#220720] text-white flex flex-col justify-between select-none overflow-hidden font-sans">

      {/* 1. THANH TOPBAR (HOÀN TOÀN TRONG SUỐT, KHÔNG GÂY TỐI NỀN - TỐI ƯU MOBILE) */}
      <header className="h-12 sm:h-14 px-3 sm:px-4 bg-transparent border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-white/5 text-xs font-bold text-slate-200 border border-white/10 font-mono">
            {currentIdx + 1}/{questions.length}
          </div>

          <span className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-white/5 border border-white/10 text-slate-200 font-bold text-[11px] sm:text-xs rounded-lg shadow-sm">
            {(currentQ.type === 'true_false_multi' || currentQ.type === 'true_false')
              ? 'Đúng / Sai'
              : currentQ.type === 'categorize'
                ? 'Phân loại'
                : currentQ.type === 'drag_drop'
                  ? 'Kéo thả'
                  : currentQ.type === 'essay'
                    ? 'Tự luận (AI)'
                    : (currentQ.type === 'short_answer' || currentQ.type === 'fill_blank')
                      ? 'Điền từ'
                      : 'Trắc nghiệm'}
          </span>

          {exam.shuffleQuestions && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 font-bold text-[10px] rounded-lg">
              <Shuffle className="w-2.5 h-2.5" /> Đảo câu hỏi
            </span>
          )}
          {exam.shuffleAnswers && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 font-bold text-[10px] rounded-lg">
              <Shuffle className="w-2.5 h-2.5" /> Đảo đáp án
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* NÚT DANH SÁCH CÂU HỎI ĐÃ BỎ QUA NỔI BẬT */}
          {skippedQuestionIds.length > 0 && (
            <button
              onClick={() => setShowSkippedModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 hover:text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
              title="Xem danh sách các câu đã bỏ qua để làm lại"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              <span>Đã bỏ qua ({skippedQuestionIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-8 h-8 rounded-lg bg-transparent hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Thoát phòng thi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. BODY KHÔNG GIAN BÀI THI CHÍNH (CÓ HIỆU ỨNG CHUYỂN CÂU HỎI TRƯỢT MƯỢT MÀ) */}
      <main
        key={currentIdx}
        className={`flex-1 p-3 sm:p-5 lg:px-8 lg:py-6 flex flex-col justify-start items-center overflow-y-auto relative bg-[#42143d] bg-[radial-gradient(#611f5a_1.2px,transparent_1.2px)] [background-size:18px_18px] pb-24 pt-3 sm:pt-5 ${slideDirection === 'next' ? 'anim-question-enter' : 'anim-question-prev'
          }`}
      >

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP A: DẠNG ĐÚNG/SAI NHIỀU PHẦN (RỘNG RÃI TOÀN MÀN HÌNH, TỐI ƯU CẢ MOBILE & PC) */}
        {/* ============================================================== */}
        {(currentQ.type === 'true_false_multi' || currentQ.type === 'true_false') && (
          <div className="w-full max-w-5xl px-2 sm:px-6 flex flex-col justify-between gap-3 sm:gap-5 h-full max-h-[84vh]">

            {/* Box 1: ĐỀ BÀI CÂU HỎI CHÍNH Ở TRÊN (TRONG SUỐT MỜ NHẸ) */}
            <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-center shadow-2xl relative shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-400 block font-mono mb-1">
                {currentIdx + 1}/{questions.length}
              </span>
              <h2 className="text-sm sm:text-xl md:text-2xl font-normal text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Ảnh minh họa câu hỏi nếu có */}
              {currentQ.image && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={currentQ.image}
                    alt="Question visual"
                    className="max-h-48 sm:max-h-64 rounded-xl border border-white/20 shadow-lg object-contain bg-black/40"
                  />
                </div>
              )}

              {/* Video minh họa câu hỏi nếu có */}
              {currentQ.video && (
                <div className="mt-3 flex justify-center">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                      <iframe
                        src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title="Video minh họa"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={currentQ.video} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pill nhỏ ngăn cách: Phần 1 / Phần 2 / Phần 3 / Phần 4 */}
            <div className="flex justify-center -my-1 sm:-my-2 relative z-10">
              <span className="px-4 py-1 sm:px-5 sm:py-1.5 rounded-full bg-[#4a1240]/80 backdrop-blur-xs border border-white/20 text-xs sm:text-sm font-semibold text-slate-100 tracking-wider shadow-md">
                Phần {activePartIndex >= 0 ? activePartIndex + 1 : 1}
              </span>
            </div>

            {/* Box 2: NỘI DUNG CÂU PHÁT BIỂU CỤ THỂ CỦA PHẦN ĐANG CHỌN */}
            <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-center shadow-2xl flex items-center justify-center min-h-[100px] sm:min-h-[160px] flex-1">
              <p className="text-base sm:text-2xl md:text-3xl font-normal text-white leading-relaxed max-w-4xl">
                {activePartObj?.text}
              </p>
            </div>

            {/* Box 3: 2 NÚT ĐÁP ÁN LỚN: [ĐÚNG] VÀ [SAI] MỞ RỘNG TOÀN DIỆN */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 shrink-0">
              <button
                onClick={() => handleSelectTrueFalsePart(activePartObj?.id || activePartId, true)}
                className={`h-16 sm:h-24 md:h-28 rounded-2xl sm:rounded-3xl text-white font-black text-xl sm:text-3xl shadow-2xl border-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 cursor-pointer ${multiTfAnswers[activePartObj?.id || activePartId] === true
                    ? 'bg-[#9cb800] border-white ring-4 ring-white/50'
                    : 'bg-[#9cb800] hover:bg-[#8ca500] border-[#819900]'
                  }`}
              >
                <span>ĐÚNG</span>
                {multiTfAnswers[activePartObj?.id || activePartId] === true && <Check className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />}
              </button>

              <button
                onClick={() => handleSelectTrueFalsePart(activePartObj?.id || activePartId, false)}
                className={`h-16 sm:h-24 md:h-28 rounded-2xl sm:rounded-3xl text-white font-black text-xl sm:text-3xl shadow-2xl border-2 transition-all active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 cursor-pointer ${multiTfAnswers[activePartObj?.id || activePartId] === false
                    ? 'bg-[#9b51e0] border-white ring-4 ring-white/50'
                    : 'bg-[#9b51e0] hover:bg-[#8c40d1] border-[#7d32c3]'
                  }`}
              >
                <span>SAI</span>
                {multiTfAnswers[activePartObj?.id || activePartId] === false && <Check className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />}
              </button>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP B: DẠNG PHÂN LOẠI VÀO CỘT (Categorize - TỐI ƯU TOÀN DIỆN CHO DI ĐỘNG & MÁY TÍNH) */}
        {/* ============================================================== */}
        {currentQ.type === 'categorize' && (
          <div className="w-full max-w-5xl px-2 sm:px-6 flex flex-col gap-4">
            {/* Box đề bài */}
            <div className="bg-black/60 border border-white/15 rounded-2xl p-4 sm:p-5 text-center shadow-lg relative">
              <span className="text-xs text-slate-400 block font-mono mb-1">
                {currentIdx + 1}/{questions.length}
              </span>
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>
              {currentQ.image && (
                <div className="mt-2.5 flex justify-center">
                  <img src={currentQ.image} alt="Visual" className="max-h-40 rounded-xl border border-white/20 object-contain" />
                </div>
              )}
              {currentQ.video && (
                <div className="mt-2.5 flex justify-center">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                      <iframe
                        src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title="Video"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={currentQ.video} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              )}
              {selectedCategorizeItem && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#d82a7a]/20 border border-[#d82a7a] text-pink-200 text-xs font-bold rounded-full animate-pulse">
                  <span>Đang chọn: <strong>"{selectedCategorizeItem.text}"</strong></span>
                  <span>➔ Chạm vào 1 nhóm bên dưới để xếp vào</span>
                </div>
              )}
            </div>

            {/* Các nhóm phân loại (Columns) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {(currentQ.categories || []).map((cat, cIdx) => {
                const assigned = columnAssignments[cat.id] || [];
                const isHeaderTeal = cIdx % 2 === 1;
                const catName = cat.name || cat.title || `Nhóm ${cIdx + 1}`;
                const isHighlight = selectedCategorizeItem !== null;

                return (
                  <div
                    key={cat.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropIntoCategory(cat.id, draggedItem)}
                    onClick={() => {
                      if (selectedCategorizeItem) {
                        handleDropIntoCategory(cat.id, selectedCategorizeItem);
                      }
                    }}
                    className={`bg-[#240520] border-2 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl min-h-[160px] sm:min-h-[220px] transition-all ${
                      isHighlight
                        ? 'border-[#d82a7a] ring-2 ring-[#d82a7a]/60 cursor-pointer scale-[1.01]'
                        : 'border-white/15'
                    }`}
                  >
                    <div className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-base font-black text-white shadow-md truncate flex items-center justify-between ${
                      isHeaderTeal ? 'bg-[#149184]' : 'bg-[#1e6f9f]'
                    }`}>
                      <span className="truncate">{catName}</span>
                      <span className="text-[10px] sm:text-xs bg-black/30 px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1">
                        {assigned.length}
                      </span>
                    </div>

                    <div className="flex-1 p-2 sm:p-3 overflow-y-auto space-y-2">
                      {assigned.length === 0 ? (
                        <div className={`h-full min-h-[80px] border border-dashed rounded-xl flex items-center justify-center p-2 text-center text-[11px] sm:text-xs transition-colors ${
                          isHighlight ? 'border-[#d82a7a] text-pink-300 font-bold bg-[#d82a7a]/10' : 'border-white/10 text-white/30'
                        }`}>
                          {isHighlight ? '+ Chạm để xếp vào đây' : 'Chưa có mục nào'}
                        </div>
                      ) : (
                        assigned.map(item => (
                          <div
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReturnToOptions(cat.id, item);
                            }}
                            title="Bấm vào để bỏ ra ngoài"
                            className="p-2 sm:p-2.5 bg-white text-slate-900 rounded-xl shadow-md cursor-pointer hover:bg-rose-50 transition-all flex items-center justify-between text-xs sm:text-sm font-bold leading-snug border border-slate-200"
                          >
                            <span className="truncate pr-1">{item.text}</span>
                            <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600 shrink-0" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Khung chứa các mục cần phân loại (Options) */}
            <div className="bg-[#230620] border-2 border-white/15 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-white/10 text-xs sm:text-sm font-black text-slate-200 flex items-center justify-between">
                <span>Mục cần phân loại ({unassignedItems.length})</span>
                <span className="text-[11px] text-slate-400 font-normal sm:hidden">Chạm 1 nút để xếp nhanh, hoặc chạm mục rồi chạm cột</span>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Kéo thả mục vào cột hoặc click để chọn</span>
              </div>

              <div className="p-2.5 sm:p-3.5 overflow-y-auto max-h-[220px]">
                {unassignedItems.length === 0 ? (
                  <div className="text-center py-4 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Đã xếp xong tất cả các mục!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {unassignedItems.map(item => {
                      const isSelected = selectedCategorizeItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => setDraggedItem(item)}
                          onClick={() => {
                            setSelectedCategorizeItem(isSelected ? null : item);
                          }}
                          className={`p-2.5 sm:p-3 rounded-xl shadow-lg cursor-pointer transition-all flex flex-col justify-between border ${
                            isSelected
                              ? 'bg-pink-50 border-2 border-[#d82a7a] ring-2 ring-[#d82a7a]/60 text-[#d82a7a] scale-[1.01]'
                              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#d82a7a]" />
                            <span className="text-xs sm:text-sm font-bold flex-1 leading-snug break-words">{item.text}</span>
                          </div>

                          {/* Các nút bấm 1 chạm xếp nhanh vào nhóm (chỉ hiển thị trên thiết bị di động, ẩn trên máy tính) */}
                          <div className="flex sm:hidden items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-medium">Xếp vào:</span>
                            {(currentQ.categories || []).map((cat, cIdx) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDropIntoCategory(cat.id, item);
                                }}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg text-white transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                                  cIdx % 2 === 1 ? 'bg-[#149184] hover:bg-[#0f7267]' : 'bg-[#1e6f9f] hover:bg-[#155377]'
                                }`}
                              >
                                ➔ {cat.name || cat.title || `Nhóm ${cIdx + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP C: DẠNG KÉO THẢ KHỚP CÂU (Drag & Drop Blank - TỐI ƯU TOÀN DIỆN CHO DI ĐỘNG & MÁY TÍNH) */}
        {/* ============================================================== */}
        {currentQ.type === 'drag_drop' && (
          <div className="w-full max-w-4xl px-2 sm:px-6 flex flex-col gap-5 sm:gap-6">
            <div className="bg-[#240520] border-2 border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl space-y-5">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-mono mb-1.5">
                  {currentIdx + 1}/{questions.length}
                </span>
                <h2 className="text-sm sm:text-xl font-black text-slate-200">
                  {currentQ.question}
                </h2>
                {currentQ.image && (
                  <div className="mt-2.5 flex justify-center">
                    <img src={currentQ.image} alt="Visual" className="max-h-40 rounded-xl border border-white/20 object-contain" />
                  </div>
                )}
                {currentQ.video && (
                  <div className="mt-2.5 flex justify-center">
                    <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                      {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                        <iframe
                          src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                          title="Video"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={currentQ.video} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                )}
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  Chạm vào từ khóa bên dưới để tự động điền vào chỗ trống, hoặc kéo thả vào ô.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {(currentQ.sentences || []).map((sent) => {
                  const droppedItemId = sentenceSlots[sent.id];
                  // Lấy thông tin từ khóa đã điền
                  const droppedItemObj = droppedItemId ? (
                    (currentQ.draggableItems || []).map((d, idx) => {
                      if (typeof d === 'string') return { id: d, text: d };
                      return { id: d.id || d.text || `drop-${idx}`, text: d.text || d.id || String(d) };
                    }).find(d => (d.id || d.text) === droppedItemId) || { id: droppedItemId, text: droppedItemId }
                  ) : null;

                  return (
                    <div
                      key={sent.id}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-base font-semibold text-slate-200 leading-relaxed text-center"
                    >
                      <span>{sent.prefix}</span>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropIntoSlot(sent.id, draggedItem)}
                        onClick={() => {
                          if (droppedItemId) {
                            handleRemoveFromSlot(sent.id);
                          } else if (selectedDropItem) {
                            handleDropIntoSlot(sent.id, selectedDropItem);
                          }
                        }}
                        className={`min-w-[150px] sm:min-w-[200px] max-w-full h-11 sm:h-12 px-3 sm:px-4 rounded-xl border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                          droppedItemObj
                            ? 'bg-white text-slate-900 border-white font-bold shadow-xl'
                            : selectedDropItem
                              ? 'bg-[#d82a7a]/20 border-[#d82a7a] text-pink-200 ring-2 ring-[#d82a7a]/40 animate-pulse'
                              : 'bg-black/40 border-white/40 text-white/40 hover:border-white/70'
                        }`}
                      >
                        {droppedItemObj ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm">{droppedItemObj.text}</span>
                            <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600 shrink-0" />
                          </div>
                        ) : (
                          <span className="text-[11px] sm:text-xs font-mono text-white/50">
                            {selectedDropItem ? '+ Chạm để đặt vào đây' : '...................'}
                          </span>
                        )}
                      </div>
                      <span>{sent.suffix}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danh sách các từ khóa có thể kéo / chạm */}
            <div className="p-3 sm:p-4 bg-black/40 border border-white/15 rounded-2xl sm:rounded-3xl flex flex-col items-center gap-2">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                Các từ khóa lựa chọn ({availableDropItems.length}):
              </span>

              <div className="flex items-center justify-center flex-wrap gap-2.5">
                {availableDropItems.length === 0 ? (
                  <span className="text-emerald-400 text-xs font-bold py-1 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Đã điền xong tất cả chỗ trống!
                  </span>
                ) : (
                  availableDropItems.map((item, idx) => {
                    const isSelected = selectedDropItem?.id === item.id;
                    return (
                      <div
                        key={item.id || idx}
                        draggable
                        onDragStart={() => setDraggedItem(item)}
                        onClick={() => {
                          // Tự động tìm ô trống đầu tiên để điền ngay
                          const sentences = currentQ.sentences || [];
                          const firstEmpty = sentences.find(s => !sentenceSlots[s.id]);
                          if (firstEmpty) {
                            handleDropIntoSlot(firstEmpty.id, item);
                          } else {
                            setSelectedDropItem(isSelected ? null : item);
                          }
                        }}
                        className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border font-bold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 ${
                          isSelected
                            ? 'bg-[#d82a7a] text-white border-white ring-2 ring-white shadow-2xl scale-105'
                            : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100 hover:scale-[1.02]'
                        }`}
                      >
                        <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP D: DẠNG TRẮC NGHIỆM 4 ĐÁP ÁN (RỘNG RÃI TOÀN MÀN HÌNH) */}
        {/* ============================================================== */}
        {(!currentQ.type || currentQ.type === 'single' || currentQ.type === 'multiple') && (
          <div className="w-full max-w-full px-2 sm:px-4 md:px-6 flex flex-col items-center relative">
            {/* Box Đề bài: Rộng rãi toàn màn hình, trong suốt mờ nhẹ nhàng */}
            <div className="w-full bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center shadow-2xl mb-4 sm:mb-6 relative shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-400 block font-mono mb-1.5 sm:mb-2">
                {currentIdx + 1}/{questions.length}
              </span>
              <h2 className="text-base sm:text-2xl md:text-3xl font-normal text-white leading-relaxed max-w-6xl mx-auto">
                {currentQ.question}
              </h2>

              {/* Ảnh minh họa câu hỏi nếu có */}
              {currentQ.image && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={currentQ.image}
                    alt="Question visual"
                    className="max-h-48 sm:max-h-64 rounded-xl border border-white/20 shadow-lg object-contain bg-black/40"
                  />
                </div>
              )}

              {/* Video minh họa câu hỏi nếu có */}
              {currentQ.video && (
                <div className="mt-3 flex justify-center">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                      <iframe
                        src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title="Video minh họa"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={currentQ.video} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* LƯỚI 4 CARD ĐÁP ÁN: FULL CHIỀU NGANG, CHIỀU CAO VỪA VẶN THANH THOÁT */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {currentQ.options.map((opt, idx) => {
                const cardColors = ['bg-[#98b809]', 'bg-[#a359ea]', 'bg-[#f46f1b]', 'bg-[#18baa5]'];
                const defaultColor = cardColors[idx % 4];
                const animClass = !answeredState ? `anim-card-${(idx % 4) + 1}` : '';

                // Trạng thái khi đã bấm hoặc đang chọn
                const isMulti = currentQ.type === 'multiple';
                const isSelected = isMulti
                  ? multiSelectedOpts.includes(opt.id)
                  : answeredState?.selectedOptId === opt.id;

                const isCorrect = Array.isArray(currentQ.correctAnswer)
                  ? currentQ.correctAnswer.includes(opt.id)
                  : opt.id === currentQ.correctAnswer;

                let cardBg = defaultColor;
                let extraStyles = '';

                if (answeredState) {
                  if (isSelected) {
                    // Ô người dùng chọn: nếu đúng thì xanh lá, sai thì đỏ (không kèm viền trắng)
                    cardBg = isCorrect ? 'bg-[#1cb059]' : 'bg-[#e53e3e]';
                    extraStyles = 'shadow-2xl scale-[1.01] sm:scale-[1.02] z-10';
                  } else if (isCorrect) {
                    // Đáp án đúng mà chưa chọn: hiện xanh lá để người học biết
                    cardBg = 'bg-[#1cb059]';
                    extraStyles = 'shadow-2xl scale-[1.01] sm:scale-[1.02] z-10';
                  } else {
                    extraStyles = 'opacity-35 scale-[0.98]';
                  }
                } else if (isMulti && isSelected) {
                  // Đang trong lúc chọn nhiều đáp án: bỏ viền trắng ring-4 ring-white
                  extraStyles = 'shadow-2xl scale-[1.01] brightness-105';
                }

                return (
                  <div key={opt.id} className="relative w-full">
                    <button
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={Boolean(answeredState)}
                      className={`${cardBg} ${animClass} ${extraStyles} w-full min-h-[90px] sm:min-h-[170px] md:min-h-[210px] lg:h-[220px] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white border-2 border-white/20 flex items-center justify-center text-center font-normal text-sm sm:text-lg md:text-xl lg:text-2xl shadow-xl transition-all duration-300 cursor-pointer relative ${!answeredState ? 'active:scale-[0.98] hover:brightness-105 hover:-translate-y-1' : ''
                        }`}
                    >
                      {/* Ô tích vuông nhỏ ở góc phải dành cho câu hỏi có nhiều đáp án đúng */}
                      {isMulti && (
                        <div
                          className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-all shadow-md ${
                            isSelected
                              ? 'bg-white text-slate-900 border-white'
                              : 'bg-black/25 border-white/50'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3.5]" />}
                        </div>
                      )}

                      {/* Ảnh minh họa của từng đáp án nếu có */}
                      {opt.image && (
                        <img
                          src={opt.image}
                          alt="Option visual"
                          className="max-h-16 sm:max-h-24 max-w-full rounded-lg object-contain mb-1.5 border border-white/20 shadow-xs"
                        />
                      )}
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP E: DẠNG ĐIỀN VÀO CHỖ TRỐNG (KIỂU ĐỤC LỖ & GÕ TỰ DO) */}
        {/* ============================================================== */}
        {(currentQ.type === 'short_answer' || currentQ.type === 'fill_blank') && (
          <div className="w-full max-w-5xl px-2 sm:px-6 flex flex-col items-center">
            {/* Box Đề bài đục lỗ hoặc câu hỏi */}
            <div className="w-full bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-10 text-center shadow-2xl mb-4 sm:mb-8 relative">
              <span className="text-[11px] sm:text-xs text-slate-400 block font-mono mb-2">
                {currentIdx + 1}/{questions.length}
              </span>

              {currentQ.image && (
                <div className="mb-3 flex justify-center">
                  <img src={currentQ.image} alt="Visual" className="max-h-40 rounded-xl border border-white/20 object-contain" />
                </div>
              )}
              {currentQ.video && (
                <div className="mb-3 flex justify-center">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                      <iframe
                        src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title="Video"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={currentQ.video} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              )}

              {/* Nếu là dạng Đục lỗ (có mảng blanks và template) */}
              {currentQ.blanks && currentQ.template ? (
                <div className="text-sm sm:text-xl md:text-2xl font-normal text-white leading-loose max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {currentQ.template.split(/(\[\.\.\.\])/g).map((part, pIdx) => {
                    if (part === '[...]') {
                      // Tìm vị trí blank thứ mấy
                      const blankIndex = currentQ.template.split(/(\[\.\.\.\])/g).slice(0, pIdx).filter(x => x === '[...]').length;
                      const blankObj = currentQ.blanks[blankIndex] || { id: blankIndex + 1 };
                      const isFilled = (clozeAnswers[blankObj.id] || '').trim().length > 0;

                      return (
                        <span key={pIdx} className="inline-flex items-center mx-1 my-0.5 sm:mx-1.5 sm:my-1">
                          <input
                            type="text"
                            disabled={Boolean(answeredState)}
                            value={clozeAnswers[blankObj.id] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setClozeAnswers(prev => ({ ...prev, [blankObj.id]: val }));
                            }}
                            placeholder={`[chỗ trống ${blankIndex + 1}]`}
                            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[110px] sm:min-w-[180px] text-center font-normal text-sm sm:text-lg rounded-xl sm:rounded-2xl border-2 transition-all outline-none ${answeredState
                                ? answeredState.isCorrect
                                  ? 'bg-emerald-600/80 border-emerald-400 text-white'
                                  : 'bg-rose-600/80 border-rose-400 text-white'
                                : isFilled
                                  ? 'bg-black/60 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
                                  : 'bg-black/40 border-white/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-black/70'
                              }`}
                          />
                        </span>
                      );
                    }
                    return <span key={pIdx} className="inline">{part}</span>;
                  })}
                </div>
              ) : (
                /* Dạng gõ câu trả lời ngắn tự do */
                <>
                  <h2 className="text-sm sm:text-xl md:text-2xl font-normal text-white mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed">
                    {currentQ.question}
                  </h2>
                  <form onSubmit={handleShortAnswerSubmit} className="w-full max-w-2xl mx-auto">
                    <input
                      type="text"
                      autoFocus
                      disabled={Boolean(answeredState)}
                      value={shortInputText}
                      onChange={(e) => setShortInputText(e.target.value)}
                      placeholder="Gõ đáp án của bạn vào đây..."
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-center text-sm sm:text-base font-normal bg-black/40 border-2 border-white/20 text-white outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 shadow-inner"
                    />
                  </form>
                </>
              )}
            </div>

            {/* Hướng dẫn hoặc gợi ý khi làm đục lỗ */}
            {currentQ.blanks && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-white/5 border border-white/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl backdrop-blur-md">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Hãy điền đầy đủ các ô trống rồi bấm <b>"Gửi câu trả lời"</b> ở góc dưới.</span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TRƯỜNG HỢP F: DẠNG TỰ LUẬN - CHẤM ĐIỂM BẰNG AI GEMINI */}
        {/* ============================================================== */}
        {currentQ.type === 'essay' && (
          <div className="w-full max-w-5xl px-2 sm:px-6 flex flex-col items-center">
            {/* Box Đề bài tự luận - Thêm padding và margin an toàn */}
            <div className="w-full bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl mb-4 sm:mb-6 relative mt-1">
              <span className="text-[11px] sm:text-xs text-slate-400 block font-mono mb-2">
                {currentIdx + 1}/{questions.length}
              </span>
              <h2 className="text-sm sm:text-xl md:text-2xl font-normal text-white leading-relaxed max-w-4xl mx-auto">
                {currentQ.question}
              </h2>

              {currentQ.image && (
                <div className="mt-3 flex justify-center">
                  <img src={currentQ.image} alt="Visual" className="max-h-48 rounded-xl border border-white/20 object-contain" />
                </div>
              )}
              {currentQ.video && (
                <div className="mt-3 flex justify-center">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    {currentQ.video.includes('youtube.com') || currentQ.video.includes('youtu.be') ? (
                      <iframe
                        src={currentQ.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title="Video"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={currentQ.video} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Khung Soạn thảo tự luận TO RỘNG */}
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl flex flex-col gap-2.5 sm:gap-3">
              <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                <span>Khung làm bài:</span>
                <span className="font-mono text-slate-400 text-[11px] sm:text-xs">
                  {essayAnswer.trim().length === 0 ? 0 : essayAnswer.trim().split(/\s+/).length} từ | {essayAnswer.length} ký tự
                </span>
              </div>

              <textarea
                rows={6}
                disabled={Boolean(answeredState) || isGradingEssay}
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                placeholder="Nhập nội dung bài làm tự luận của bạn tại đây..."
                className="w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-normal leading-relaxed bg-[#240620]/90 border-2 border-white/15 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all resize-y min-h-[140px] sm:min-h-[180px]"
              />
            </div>

            {/* Khung kết quả đánh giá của AI nếu đã chấm */}
            {essayAiResult && (
              <div className="w-full mt-3 sm:mt-4 bg-[#230922]/90 border border-emerald-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300 text-xs sm:text-base">
                      Đánh giá từ AI:
                    </span>
                  </div>
                  <div className="px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs sm:text-base">
                    Điểm số: {essayAiResult.score}/{essayAiResult.maxScore || 10}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2.5">
                  {essayAiResult.feedback}
                </p>

                {essayAiResult.strengths?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-teal-300 block mb-0.5">✓ Điểm mạnh:</span>
                    <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-300 space-y-0.5">
                      {essayAiResult.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {essayAiResult.improvements?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-amber-300 block mb-0.5">✎ Góp ý cải thiện:</span>
                    <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-300 space-y-0.5">
                      {essayAiResult.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. THANH FOOTER (TỐI ƯU RESPONSIVE CHO MOBILE) */}
      {answeredState ? (
        <footer className={`h-14 sm:h-16 px-4 sm:px-8 ${answeredState.isCorrect ? 'bg-[#1cb059]' : 'bg-[#e53e3e]'} flex items-center justify-center shrink-0 z-30 transition-colors shadow-2xl`}>
          {/* Cụm "Câu đúng" / "Câu sai" được căn chính giữa thanh trạng thái */}
          <div className="flex items-center gap-2 sm:gap-3 text-white font-black text-lg sm:text-2xl tracking-wide">
            {answeredState.isCorrect ? (
              <>
                <Check className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3.5]" />
                <span>Câu đúng</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3.5]" />
                <span>Câu sai</span>
              </>
            )}
          </div>
        </footer>
      ) : (
        <footer className="h-14 sm:h-16 px-4 sm:px-8 bg-transparent border-t border-white/5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            {/* Nút BỎ QUA câu hỏi ở góc trái */}
            <button
              onClick={handleSkipQuestion}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer border border-white/10 backdrop-blur-xs"
              title="Bỏ qua câu hỏi này để làm sau"
            >
              Bỏ qua câu này
            </button>

            {/* Nút mở danh sách các câu đã bỏ qua ở ngay cạnh nút Bỏ qua */}
            {skippedQuestionIds.length > 0 && (
              <button
                onClick={() => setShowSkippedModal(true)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 backdrop-blur-xs"
                title="Xem danh sách các câu đã bỏ qua"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                <span>Câu đã bỏ qua ({skippedQuestionIds.length})</span>
              </button>
            )}
          </div>

          <div>
            {/* NÚT GỬI CÂU TRẢ LỜI Ở GÓC PHẢI:
                - Đối với trắc nghiệm 1 đáp án (type === 'single' hoặc không set type): KHÔNG hiển thị nút này (người dùng bấm chọn đáp án là chấm ngay).
                - Đối với tất cả các dạng khác (multiple, short_answer, fill_blank, essay, categorize, drag_drop, true_false_multi): hiển thị nút Gửi câu trả lời.
            */}
            {currentQ.type === 'multiple' ? (
              <button
                onClick={handleSubmitMultipleChoice}
                disabled={multiSelectedOpts.length === 0 || Boolean(answeredState)}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
              >
                Gửi câu trả lời
              </button>
            ) : (currentQ.type === 'short_answer' || currentQ.type === 'fill_blank') ? (
              <button
                onClick={handleShortAnswerSubmit}
                disabled={
                  currentQ.blanks
                    ? !currentQ.blanks.every(b => (clozeAnswers[b.id] || '').trim().length > 0)
                    : !shortInputText.trim()
                }
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
              >
                Gửi câu trả lời
              </button>
            ) : currentQ.type === 'essay' ? (
              <button
                onClick={essayAiResult ? handleNext : handleGradeEssayWithAI}
                disabled={!essayAnswer.trim() || isGradingEssay}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
              >
                {isGradingEssay ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white" />
                    <span>Đang chấm...</span>
                  </>
                ) : (
                  <span>Gửi câu trả lời</span>
                )}
              </button>
            ) : (!currentQ.type || currentQ.type === 'single') ? (
              /* Trắc nghiệm 1 đáp án: KHÔNG hiển thị nút Gửi câu trả lời */
              null
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
              >
                Gửi câu trả lời
              </button>
            )}
          </div>
        </footer>
      )}

      {/* MODAL DANH SÁCH CÁC CÂU HỎI ĐÃ BỎ QUA ĐỂ LÀM LẠI */}
      {showSkippedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#240520] border border-white/20 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 mb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Danh sách câu hỏi đã bỏ qua ({skippedQuestionIds.length})
                </h3>
              </div>
              <button
                onClick={() => setShowSkippedModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3 shrink-0">
              Bấm vào câu hỏi bất kỳ dưới đây để nhảy tới và làm lại:
            </p>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {skippedQuestionIds.map((qId) => {
                const targetIdx = questions.findIndex(q => q.id === qId);
                const qObj = questions[targetIdx];
                if (!qObj) return null;

                return (
                  <div
                    key={qId}
                    onClick={() => handleJumpToQuestion(targetIdx)}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-400/40">
                        {targetIdx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 font-normal group-hover:text-white">
                        {qObj.question}
                      </p>
                    </div>

                    <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 shadow-md transition-all">
                      Làm lại
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 mt-3 flex justify-end shrink-0">
              <button
                onClick={() => setShowSkippedModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THOÁT KHỎI PHÒNG THI */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#240520] border border-white/20 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-2">Bạn muốn dừng bài thi?</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn quay trở lại trang quản lý hoạt động?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Tiếp tục thi
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#d82a7a] hover:bg-[#c2226b] text-white transition-colors shadow-md"
              >
                Thoát ra
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
