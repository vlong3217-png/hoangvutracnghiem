import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Edit3,
  GripVertical,
  Copy, 
  CheckCircle2, 
  Radio, 
  HelpCircle, 
  ArrowLeft, 
  ChevronRight, 
  FolderOpen, 
  Plus, 
  Trash2,
  Check,
  X,
  Settings,
  Shuffle
} from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import CreateResourceModal from './CreateResourceModal';
import QuizizzLogo from './QuizizzLogo';

export default function ExamDetailManage({ exam, onBack, onPlayExam, onUpdateExam, onAddExam }) {
  const [showAnswer, setShowAnswer] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null); // Câu hỏi đang được chỉnh sửa
  const [isFullEditMode, setIsFullEditMode] = useState(false); // Mở trang chỉnh sửa toàn diện (giống Thêm tài nguyên)
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Quản lý kéo thả sắp xếp lại thứ tự câu hỏi tại trang Chi tiết
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [reorderToast, setReorderToast] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch {}
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(draggedIndex, 1);
    updatedQuestions.splice(targetIndex, 0, movedQuestion);

    const fromNum = draggedIndex + 1;
    const toNum = targetIndex + 1;

    setDraggedIndex(null);
    setDragOverIndex(null);

    // Cập nhật ngay lập tức vào state cha và Backend Neon
    if (onUpdateExam) {
      await onUpdateExam({
        ...exam,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length
      });
    }

    // Popup thông báo
    setReorderToast({
      message: `Đã chuyển Câu ${fromNum} sang vị trí Câu ${toNum} và lưu thành công!`
    });
    setTimeout(() => setReorderToast(null), 3200);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Chức năng đổi tên đề thi trực tiếp
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(exam.title || '');

  // Modal Cài đặt bài thi (Đảo câu hỏi, Đảo đáp án, Thời gian, Môn học, Cấp độ)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [detailSubject, setDetailSubject] = useState(exam.subject || 'Khoa học');
  const [detailLevel, setDetailLevel] = useState(exam.level || exam.difficulty || 'Đại học');
  const [detailDuration, setDetailDuration] = useState(exam.duration || exam.durationMinutes || 30);
  const [detailShuffleQuestions, setDetailShuffleQuestions] = useState(exam.shuffleQuestions ?? false);
  const [detailShuffleAnswers, setDetailShuffleAnswers] = useState(exam.shuffleAnswers ?? false);

  useEffect(() => {
    setTempTitle(exam.title || '');
    setDetailSubject(exam.subject || 'Khoa học');
    setDetailLevel(exam.level || exam.difficulty || 'Đại học');
    setDetailDuration(exam.duration || exam.durationMinutes || 30);
    setDetailShuffleQuestions(exam.shuffleQuestions ?? false);
    setDetailShuffleAnswers(exam.shuffleAnswers ?? false);
  }, [exam]);

  const handleSaveSettings = () => {
    if (onUpdateExam) {
      onUpdateExam({
        ...exam,
        subject: detailSubject,
        level: detailLevel,
        difficulty: detailLevel,
        duration: Number(detailDuration) || 30,
        durationMinutes: Number(detailDuration) || 30,
        shuffleQuestions: detailShuffleQuestions,
        shuffleAnswers: detailShuffleAnswers
      });
    }
    setShowSettingsModal(false);
  };

  const handleSaveTitle = () => {
    if (!tempTitle.trim()) {
      setTempTitle(exam.title || '');
      setIsEditingTitle(false);
      return;
    }
    if (tempTitle.trim() !== exam.title) {
      const updated = {
        ...exam,
        title: tempTitle.trim()
      };
      if (onUpdateExam) {
        onUpdateExam(updated);
      }
    }
    setIsEditingTitle(false);
  };

  // Xử lý sao chép tạo đề thi mới từ đề hiện tại
  const handleDuplicateExam = () => {
    const timestamp = Date.now();
    const duplicatedExam = {
      ...exam,
      id: `exam-${timestamp}`,
      title: `${exam.title} (Bản sao)`,
      createdAt: new Date().toISOString()
    };
    if (onAddExam) {
      onAddExam(duplicatedExam);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
      alert(`Đã sao chép thành công thành đề thi mới: "${duplicatedExam.title}"! Bạn có thể xem trong danh sách đề thi.`);
    }
  };

  // Form thêm câu hỏi mới
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');

  const questions = exam.questions || [];
  const totalQuestions = questions.length;
  const totalPoints = totalQuestions;

  // NẾU BẤM VÀO "CHỈNH SỬA" -> MỞ TRANG TOÀN DIỆN (GIỐNG THÊM TÀI NGUYÊN KÈM CÁC DẠNG CÂU HỎI VÀ CÂU HỎI ĐÃ CÓ)
  if (isFullEditMode) {
    return (
      <CreateResourceModal
        initialExam={exam}
        onBack={() => setIsFullEditMode(false)}
        onSaveExam={async (updatedExam) => {
          if (onUpdateExam) {
            await onUpdateExam(updatedExam);
          }
          setIsFullEditMode(false);
        }}
      />
    );
  }

  // NẾU ĐANG BẤM VÀO NÚT "CHỈNH SỬA" CÂU HỎI -> MỞ GIAO DIỆN QUESTIONEDITOR (Chuẩn ảnh mới)
  if (editingQuestion) {
    return (
      <QuestionEditor
        question={editingQuestion}
        onSave={(updatedQ) => {
          const updatedQuestions = questions.map(q => q.id === updatedQ.id ? updatedQ : q);
          onUpdateExam({
            ...exam,
            questions: updatedQuestions
          });
          setEditingQuestion(null);
        }}
        onCancel={() => setEditingQuestion(null)}
      />
    );
  }

  const handleToggleAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: Date.now(),
      type: 'single',
      question: newQuestionText,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation
    };

    const updatedExam = {
      ...exam,
      questions: [...questions, newQ],
      totalQuestions: questions.length + 1
    };

    onUpdateExam(updatedExam);
    setShowAddModal(false);
    setNewQuestionText('');
    setNewOptions([
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ]);
    setNewCorrectAnswer('A');
    setNewExplanation('');
  };

  const handleDeleteQuestion = (qId) => {
    if (questions.length <= 1) {
      alert("Đề thi cần có ít nhất 1 câu hỏi!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      const updatedExam = {
        ...exam,
        questions: questions.filter(q => q.id !== qId),
        totalQuestions: questions.length - 1
      };
      onUpdateExam(updatedExam);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-[calc(100vh-64px)] p-6 lg:p-8 overflow-y-auto">
      {/* Nút quay lại danh sách đề thi */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Thư viện</span>
      </button>

      {/* HEADER CHI TIẾT ĐỀ THI */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
            <QuizizzLogo className="w-8 h-8 text-[#d82a7a]" />
          </div>

          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 max-w-xl">
                <input 
                  type="text"
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTempTitle(exam.title || '');
                      setIsEditingTitle(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-white border-2 border-[#d82a7a] rounded-lg text-lg md:text-xl font-bold text-slate-900 focus:outline-none w-full shadow-xs"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                  title="Lưu tên mới (Enter)"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTempTitle(exam.title || '');
                    setIsEditingTitle(false);
                  }}
                  className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Hủy (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl md:text-2xl font-bold text-slate-900 leading-snug cursor-pointer hover:text-[#d82a7a] transition-colors"
                  title="Bấm vào để đổi tên đề thi"
                >
                  {exam.title}
                </h1>
                <button 
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-60 hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#d82a7a] transition-all cursor-pointer"
                  title="Sửa tên đề thi"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Subtags */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                ✓ Đánh giá
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-slate-700 text-white text-[9px] flex items-center justify-center font-bold">
                  {(exam.author || 'L').charAt(0)}
                </div>
                <span className="text-slate-700 font-medium">{exam.author || 'Long Hoàng Vũ'}</span>
              </div>
              <span>•</span>
              <span>{exam.subject || 'Máy tính'}</span>
              <span>•</span>
              <span>{exam.level || 'Đại học'}</span>
              <span>•</span>
              <span>{exam.duration || exam.durationMinutes || 30} phút</span>
              {exam.shuffleQuestions && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[10px]">
                    <Shuffle className="w-2.5 h-2.5" /> Đảo câu hỏi
                  </span>
                </>
              )}
              {exam.shuffleAnswers && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded text-[10px]">
                    <Shuffle className="w-2.5 h-2.5" /> Đảo đáp án
                  </span>
                </>
              )}
              <span>•</span>
              <span className="text-rose-600 font-semibold">• Dễ</span>
            </div>
          </div>
        </div>

        {/* Nút hành động góc phải: Chỉ giữ Bắt đầu ngay (Đã bỏ Xem trước và Giao bài) */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onPlayExam(exam)}
            className="px-5 py-2.5 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Bắt đầu ngay</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR: Chỉ giữ Chỉnh sửa, Cài đặt, và Sao chép */}
      <div className="flex items-center justify-between py-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsFullEditMode(true)}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Mở trang chỉnh sửa và thêm các dạng câu hỏi mới cho đề thi"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chỉnh sửa</span>
          </button>

          {/* Nút Cài đặt bài thi */}
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Mở cài đặt bài thi (Đảo câu hỏi, Đảo đáp án, Thời gian)"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Cài đặt</span>
          </button>

          {/* Nút Sao chép đề thi mới */}
          <button 
            onClick={handleDuplicateExam}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Tạo đề thi mới bằng cách sao chép từ đề thi này"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedSuccess ? 'Đã sao chép!' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Nút bật/tắt Hiển thị đáp án */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-700">Hiển thị đáp án</span>
          <button
            onClick={handleToggleAnswer}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              showAnswer ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                showAnswer ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* BODY CHÍNH: Đã bỏ bảng Hành động AI và chữ Cải thiện hoạt động của bạn, mở rộng danh sách câu hỏi toàn màn hình */}
      <div className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-2">
            <span>{totalQuestions} câu hỏi • {totalPoints} Điểm</span>
            
            <button
              onClick={() => {
                const newQ = {
                  id: Date.now(),
                  type: 'single',
                  question: '',
                  options: [
                    { id: 'A', text: '' },
                    { id: 'B', text: '' },
                    { id: 'C', text: '' },
                    { id: 'D', text: '' }
                  ],
                  correctAnswer: 'A',
                  explanation: ''
                };
                setEditingQuestion(newQ);
              }}
              className="text-xs text-[#d82a7a] hover:text-[#b01e60] font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm câu hỏi mới
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isDragging = draggedIndex === idx;
              const isOver = dragOverIndex === idx && draggedIndex !== idx;

              return (
                <div 
                  key={q.id || idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-2xl p-5 transition-all shadow-2xs group relative border ${
                    isDragging
                      ? 'opacity-40 scale-[0.98] border-dashed border-[#d82a7a] bg-pink-50/50'
                      : isOver
                        ? 'border-2 border-[#d82a7a] bg-pink-50/30 shadow-md transform translate-y-1'
                        : 'bg-white border-slate-200 hover:border-[#d82a7a]/60 hover:shadow-xs'
                  } cursor-grab active:cursor-grabbing`}
                  title="Nhấn giữ và kéo để đổi thứ tự câu hỏi"
                >
                  {/* Top Bar câu hỏi: STT. NHIỀU LỰA CHỌN • 30 giây • 1 điểm + CỤM NÚT XEM TRƯỚC / CHỈNH SỬA / XÓA */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400 group-hover:text-[#d82a7a] cursor-grab active:cursor-grabbing p-0.5 hover:bg-slate-100 rounded" title="Kéo thả để sắp xếp">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-semibold uppercase tracking-wider text-slate-500">
                        {idx + 1}. {q.type === 'multiple' ? 'NHIỀU LỰA CHỌN' : q.type === 'true_false' ? 'ĐÚNG / SAI' : 'NHIỀU LỰA CHỌN'} • 30 giây • 1 điểm
                      </span>
                    </div>

                    {/* Cụm nút hành động bên phải từng câu: Chỉnh sửa và Xóa (Bỏ nút Xem trước thừa) */}
                    <div className="flex items-center gap-3">
                      {/* NÚT CHỈNH SỬA CÂU HỎI (MỞ GIAO DIỆN QUESTIONEDITOR) */}
                      <button 
                        onClick={() => setEditingQuestion(q)}
                        className="flex items-center gap-1 text-slate-700 hover:text-[#d82a7a] text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chỉnh sửa</span>
                      </button>

                      {/* Nút Xóa */}
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="flex items-center gap-1 text-rose-500 hover:text-rose-700 text-xs font-semibold px-1 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa câu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  {/* Nội dung đề bài & Hình ảnh */}
                  <div className="flex items-start gap-4 mb-5">
                    {q.image && (
                      <div className="w-24 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900 flex items-center justify-center">
                        <img src={q.image} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  {/* DANH SÁCH PHƯƠNG ÁN (GRID 2 CỘT) */}
                  {(!q.type || q.type === 'single' || q.type === 'multiple') && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 text-xs sm:text-sm">
                      {q.options.map((opt) => {
                        const isCorrect = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(opt.id)
                          : q.correctAnswer === opt.id;

                        const showAsCorrect = showAnswer && isCorrect;

                        return (
                          <div key={opt.id} className="flex items-center gap-3 py-1">
                            {showAsCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 fill-emerald-50" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                            )}

                            <span className={showAsCorrect ? 'font-bold text-slate-900' : 'text-slate-700'}>
                              {opt.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL CÀI ĐẶT BÀI THI */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#d82a7a]" />
                Cài đặt bài thi
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chủ đề môn học</label>
                <input 
                  type="text"
                  value={detailSubject}
                  onChange={(e) => setDetailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cấp độ</label>
                <input 
                  type="text"
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài (Phút)</label>
                <input 
                  type="number"
                  min="1"
                  max="180"
                  value={detailDuration}
                  onChange={(e) => setDetailDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#d82a7a]"
                />
              </div>

              {/* TÙY CHỌN ĐẢO CÂU HỎI VÀ ĐẢO ĐÁP ÁN */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tùy chọn xáo trộn bài thi
                </div>

                {/* 1. Đảo câu hỏi */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="pr-2">
                    <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Shuffle className="w-3.5 h-3.5 text-[#d82a7a]" />
                      <span>Đảo câu hỏi</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Xáo trộn ngẫu nhiên thứ tự các câu hỏi mỗi khi thí sinh làm bài
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailShuffleQuestions(prev => !prev)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      detailShuffleQuestions ? 'bg-[#d82a7a]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        detailShuffleQuestions ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Đảo đáp án */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="pr-2">
                    <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Shuffle className="w-3.5 h-3.5 text-purple-600" />
                      <span>Đảo đáp án</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Xáo trộn ngẫu nhiên thứ tự các phương án lựa chọn trong câu hỏi
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailShuffleAnswers(prev => !prev)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      detailShuffleAnswers ? 'bg-[#d82a7a]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        detailShuffleAnswers ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-[#d82a7a] hover:bg-[#c2226b] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP THÔNG BÁO HOÀN TẤT THAY ĐỔI THỨ TỰ CÂU HỎI */}
      {reorderToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-xs">{reorderToast.message}</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Thứ tự các câu hỏi đã được lưu tự động vào CSDL.</p>
          </div>
          <button 
            onClick={() => setReorderToast(null)} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
