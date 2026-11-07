import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Lightbulb, 
  Clock, 
  Check, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  Mic, 
  Video, 
  Plus, 
  Columns, 
  Rows, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function QuestionEditor({ question, onSave, onCancel }) {
  // Loại câu hỏi: 'single' (Nhiều lựa chọn 1 đáp án), 'multiple' (Nhiều đáp án đúng)
  const [questionType, setQuestionType] = useState(
    Array.isArray(question.correctAnswer) ? 'multiple' : (question.type || 'single')
  );
  const [timeLimit, setTimeLimit] = useState(30); // 30 giây
  const [points, setPoints] = useState(1); // 1 điểm
  const [questionText, setQuestionText] = useState(question.question || '');
  const [explanation, setExplanation] = useState(question.explanation || '');
  const [showExplanationInput, setShowExplanationInput] = useState(!!question.explanation);
  const [imageUrl, setImageUrl] = useState(question.image || '');
  const [showImagePrompt, setShowImagePrompt] = useState(false);

  // 4 thẻ đáp án màu sắc đặc trưng của Wordwall/Kahoot:
  // Thẻ 1: Xanh dương (#2d70ae)
  // Thẻ 2: Xanh mòng két / Ngọc (#2e9e8f)
  // Thẻ 3: Vàng cam (#f4a425)
  // Thẻ 4: Hồng đỏ (#d95368)
  const defaultColors = [
    { bg: 'bg-[#2b6cb0]', border: 'border-[#23588f]' },
    { bg: 'bg-[#2c9688]', border: 'border-[#22796e]' },
    { bg: 'bg-[#eaa023]', border: 'border-[#be7e15]' },
    { bg: 'bg-[#d24a61]', border: 'border-[#aa364a]' },
    { bg: 'bg-[#7c3aed]', border: 'border-[#6229c7]' },
    { bg: 'bg-[#059669]', border: 'border-[#047857]' }
  ];

  const initialOptions = question.options && question.options.length > 0 
    ? question.options.map(opt => ({ id: opt.id, text: opt.text }))
    : [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
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
    Array.isArray(question.correctAnswer) || questionType === 'multiple'
  );
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  const handleToggleMultiCorrect = () => {
    const nextVal = !isMultiCorrect;
    setIsMultiCorrect(nextVal);
    if (!nextVal && correctAnswers.length > 1) {
      setCorrectAnswers([correctAnswers[0]]);
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
      alert("Câu hỏi cần ít nhất 2 phương án!");
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
    setOptions([...options, { id: nextLetter, text: '' }]);
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const updatedQuestion = {
      ...question,
      question: questionText,
      options: options,
      type: isMultiCorrect ? 'multiple' : 'single',
      correctAnswer: isMultiCorrect ? correctAnswers : correctAnswers[0] || 'A',
      explanation: explanation,
      image: imageUrl || undefined
    };

    onSave(updatedQuestion);
  };

  return (
    <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col antialiased select-none">
      
      {/* 1. TOP HEADER TOOLBAR (Chuẩn 100% Ảnh trên cùng) */}
      <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          {/* Nút quay lại < */}
          <button 
            onClick={onCancel}
            title="Quay lại"
            className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Dropdown loại câu hỏi */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white">
            <span className="w-4 h-4 rounded-sm bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            <span>Nhiều lựa chọn</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Các nút bên phải: Thêm giải thích, Thời gian, Điểm, Hủy, Lưu */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExplanationInput(prev => !prev)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Thêm giải thích cho đáp án</span>
          </button>

          {/* Chọn thời gian đếm ngược */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeLimit} giây</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Chọn điểm */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white">
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <span>{points} điểm</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          <button 
            onClick={onCancel}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hủy
          </button>

          {/* Nút LƯU MÀU TÍM WORDWALL (#7c3aed hoặc #6b21a8) */}
          <button 
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#78398e] hover:bg-[#632977] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      {/* 2. THANH FORMAT FONT CHỮ (A, B, I, U, S, X^1, X_1, Sigma, f(x), Bật định dạng nâng cao) */}
      <div className="h-10 border-b border-slate-200 px-6 flex items-center justify-between bg-white text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-5 font-serif text-sm">
          <span className="font-sans font-bold cursor-pointer hover:text-black">A</span>
          <span className="font-bold cursor-pointer hover:text-black">B</span>
          <span className="italic cursor-pointer hover:text-black">I</span>
          <span className="underline cursor-pointer hover:text-black">U</span>
          <span className="line-through cursor-pointer hover:text-black">S</span>
          <span className="cursor-pointer hover:text-black">X¹</span>
          <span className="cursor-pointer hover:text-black">X₁</span>
          <span className="cursor-pointer hover:text-black">Σ</span>
          <span className="cursor-pointer hover:text-black italic">f(x)</span>
        </div>

        <button 
          onClick={() => alert("Chế độ định dạng nâng cao!")}
          className="px-3 py-1 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Bật định dạng nâng cao
        </button>
      </div>

      {/* Ô nhập giải thích (Nếu được mở) */}
      {showExplanationInput && (
        <div className="bg-amber-50/70 border-b border-amber-200 px-6 py-2.5 flex items-center gap-3">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <input 
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Nhập lời giải thích hoặc gợi ý cho đáp án..."
            className="flex-1 bg-transparent text-xs text-amber-950 placeholder-amber-500 outline-none"
          />
        </div>
      )}

      {/* 3. KHÔNG GIAN SOẠN THẢO CHÍNH - TÔNG MÀU TÍM ĐEN HUYỀN BÍ (#43143c / #3b1135) */}
      <div className="flex-1 bg-[#471842] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
        
        {/* VÙNG NHẬP CÂU HỎI (HỘP TO MÀU TÍM ĐẬM CÓ VIỀN SÁNG) */}
        <div className="relative bg-[#2d0e2b] border-2 border-[#64245f] rounded-2xl p-8 mb-6 min-h-[220px] flex flex-col justify-center items-center shadow-lg group">
          
          {/* 3 nút Media góc trên bên trái: Ảnh, Mic, Video (có tia sét vàng) */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button 
              onClick={() => {
                const url = prompt("Nhập link ảnh (URL) hoặc chọn ảnh mẫu (/images/heroes/nakroth.jpg):", imageUrl);
                if (url !== null) setImageUrl(url);
              }}
              title="Thêm hình ảnh"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[9px] text-amber-400">⚡</span>
            </button>

            <button 
              onClick={() => alert("Tính năng thêm ghi âm giọng nói")}
              title="Thêm âm thanh"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative"
            >
              <Mic className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[9px] text-amber-400">⚡</span>
            </button>

            <button 
              onClick={() => alert("Tính năng chèn video")}
              title="Thêm video"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>

          {/* Nếu có ảnh thì hiển thị ảnh nhỏ bên trên câu hỏi */}
          {imageUrl && (
            <div className="mb-4 relative group/img">
              <img src={imageUrl} alt="Question Media" className="max-h-32 rounded-lg border border-white/20 object-contain shadow-md" />
              <button
                onClick={() => setImageUrl('')}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}

          {/* Ô nhập câu hỏi chữ to chính giữa màn hình */}
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Nhập nội dung câu hỏi tại đây..."
            rows={2}
            className="w-full max-w-3xl text-center bg-transparent text-white placeholder-white/30 text-lg md:text-2xl font-bold outline-none resize-none leading-relaxed"
          />
        </div>

        {/* VÙNG 4 Ô ĐÁP ÁN ĐA MÀU SẮC (Wordwall Style) */}
        <div className={`grid gap-4 mb-6 ${
          isVerticalLayout 
            ? 'grid-cols-1 max-w-xl mx-auto w-full' 
            : options.length <= 4 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3'
        }`}>
          {options.map((opt, idx) => {
            const color = defaultColors[idx % defaultColors.length];
            const isCorrect = correctAnswers.includes(opt.id);

            return (
              <div 
                key={opt.id}
                className={`${color.bg} border-2 ${color.border} rounded-2xl p-4 min-h-[170px] flex flex-col justify-between text-white relative shadow-md transition-all`}
              >
                {/* Thanh action góc trên thẻ: Icon Xóa, Icon Ảnh + Icon Dấu Tích Chọn Đúng */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
                    <button 
                      onClick={() => handleDeleteOption(idx)}
                      title="Xóa phương án này"
                      className="w-6 h-6 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white/80" />
                    </button>
                    <button 
                      onClick={() => {
                        const t = prompt("Chèn mô tả hình ảnh cho đáp án:", opt.text);
                        if (t !== null) handleOptionTextChange(idx, t);
                      }}
                      title="Chèn ảnh"
                      className="w-6 h-6 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-white/80" />
                    </button>
                  </div>

                  {/* Nút tròn đánh dấu ĐÁP ÁN ĐÚNG ✓ */}
                  <button
                    type="button"
                    onClick={() => handleToggleOptionCorrect(opt.id)}
                    title={isCorrect ? "Đây là đáp án đúng" : "Nhấp để chọn làm đáp án đúng"}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                      isCorrect 
                        ? 'bg-emerald-500 text-white ring-2 ring-white' 
                        : 'bg-black/20 text-white/40 hover:bg-black/40 hover:text-white'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

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

          {/* Nút thêm phương án mới (Nếu còn dưới 6 phương án) */}
          {options.length < 6 && !isVerticalLayout && (
            <button
              onClick={handleAddOption}
              className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-4 min-h-[170px] flex flex-col items-center justify-center text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10"
            >
              <Plus className="w-8 h-8 mb-1" />
              <span className="text-xs font-bold">Thêm đáp án</span>
            </button>
          )}
        </div>

        {/* 4. FOOTER CÔNG CỤ: Toggle Nhiều đáp án đúng & Chuyển bố cục */}
        <div className="flex items-center justify-between text-white text-xs pt-2 border-t border-white/10">
          {/* Toggle Nhiều đáp án đúng */}
          <div className="flex items-center gap-3">
            <span className="font-semibold">Nhiều đáp án đúng:</span>
            <button
              onClick={handleToggleMultiCorrect}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isMultiCorrect ? 'bg-emerald-500' : 'bg-white/30'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isMultiCorrect ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Nút đổi bố cục ngang / dọc */}
          <button
            onClick={() => setIsVerticalLayout(prev => !prev)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center gap-2 transition-colors"
          >
            {isVerticalLayout ? <Columns className="w-4 h-4" /> : <Rows className="w-4 h-4" />}
            <span>{isVerticalLayout ? 'Chuyển sang bố cục ngang' : 'Chuyển sang bố cục dọc'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}

