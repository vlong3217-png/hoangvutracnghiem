import React, { useState } from 'react';
import { 
  Play, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  Radio, 
  HelpCircle, 
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  Plus,
  Trash2
} from 'lucide-react';
import QuestionEditor from './QuestionEditor';

export default function ExamDetailManage({ exam, onBack, onPlayExam, onUpdateExam, onAddExam }) {
  const [showAnswer, setShowAnswer] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null); // Câu hỏi đang được chỉnh sửa
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

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
            <div className="flex items-end gap-1 h-6">
              <div className="w-1.5 bg-[#d82a7a] h-4 rounded-xs" />
              <div className="w-1.5 bg-[#d82a7a] h-6 rounded-xs" />
              <div className="w-1.5 bg-[#d82a7a] h-3.5 rounded-xs" />
              <div className="w-1.5 bg-[#d82a7a] h-5 rounded-xs" />
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
              {exam.title}
            </h1>

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
              <span>11 lần chơi</span>
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

      {/* TOOLBAR: Chỉ giữ Chỉnh sửa, thay Lưu/Chia sẻ/Bảng tính/3 chấm bằng nút Sao chép */}
      <div className="flex items-center justify-between py-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => {
              if (questions.length > 0) {
                setEditingQuestion(questions[0]);
              } else {
                setShowAddModal(true);
              }
            }}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chỉnh sửa</span>
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
              return (
                <div 
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-2xs group relative"
                >
                  {/* Top Bar câu hỏi: STT. NHIỀU LỰA CHỌN • 30 giây • 1 điểm + CỤM NÚT XEM TRƯỚC / CHỈNH SỬA / XÓA */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-semibold uppercase tracking-wider text-slate-500">
                      {idx + 1}. {q.type === 'multiple' ? 'NHIỀU LỰA CHỌN' : q.type === 'true_false' ? 'ĐÚNG / SAI' : 'NHIỀU LỰA CHỌN'} • 30 giây • 1 điểm
                    </span>

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

                  {q.explanation && showAnswer && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed bg-slate-50/60 p-3 rounded-xl">
                      <strong className="text-blue-700">💡 Giải thích chi tiết:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
