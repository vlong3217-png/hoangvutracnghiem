import React from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  X, 
  Maximize2, 
  HelpCircle
} from 'lucide-react';
import { evaluateUserAnswers } from '../services/examEvaluation';

export default function ExamResult({ exam, result, onRetry, onGoHome }) {
  // Lấy dữ liệu đề thi và câu hỏi từ exam hoặc result
  const currentExam = (exam?.questions && exam.questions.length > 0)
    ? exam
    : ((result?.exam?.questions && result.exam.questions.length > 0) ? result.exam : exam || {});

  const questions = (currentExam.questions && currentExam.questions.length > 0)
    ? currentExam.questions
    : (result?.questions || []);

  const { 
    selectedAnswers = {}, 
    score = 0, 
    timeSpent = 0, 
    streak = 0 
  } = (result || {});

  // Đánh giá chính xác 100% từng câu hỏi theo chuẩn các định dạng
  const evaluation = evaluateUserAnswers(questions, selectedAnswers);
  const {
    evaluatedQuestions,
    correctCount,
    totalQuestions,
    incorrectCount,
    accuracyPercent,
    maxStreak: computedMaxStreak
  } = evaluation;

  // Chuỗi câu đúng liên tiếp dài nhất
  const streakDisplay = streak > 0 ? streak : (result?.maxStreak > 0 ? result.maxStreak : computedMaxStreak);
  const avgTimePerQ = totalQuestions > 0 ? Math.max(1, Math.round(timeSpent / totalQuestions)) : 0;

  // Lời nhắn chúc mừng sinh động dựa trên kết quả thực tế
  const getMotivationalMessage = () => {
    if (accuracyPercent >= 90) return 'Xuất sắc! Bạn đã làm chủ hoàn toàn kiến thức bài thi!';
    if (accuracyPercent >= 70) return `Làm tốt lắm! Bạn đã đạt độ chính xác ${accuracyPercent}%, hãy tiếp tục phát huy!`;
    if (accuracyPercent >= 50) return `Khá tốt! Bạn đã đạt độ chính xác ${accuracyPercent}%, ôn tập thêm chút nữa nhé!`;
    return `Bạn đã hoàn thành bài làm với độ chính xác ${accuracyPercent}%. Hãy thử lại để bứt phá hơn!`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e051c] text-white flex flex-col justify-between font-sans select-none overflow-hidden">
      
      {/* 1. TOPBAR CÓ NÚT THOÁT [X] VÀ FULLSCREEN PHẢI */}
      <header className="h-12 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <button
          onClick={onGoHome}
          className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Đóng & Về trang chủ"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toàn màn hình"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </header>

      {/* 2. BODY KHÔNG GIAN KẾT QUẢ CUỘN ĐƯỢC CHUẨN QUIZIZZ */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 max-w-4xl w-full mx-auto">
        <div className="space-y-4 pb-12">
            
            {/* CARD 1: BANNER ĐIỂM SỐ & CHÚC MỪNG CHÍNH */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                <div className="flex-1">
                  {/* Tiêu đề bài kiểm tra */}
                  <div className="text-xs font-black tracking-widest uppercase text-slate-300 mb-2">
                    {currentExam.title || 'KẾT QUẢ BÀI THI'}
                  </div>

                  {/* Lời khen chúc mừng */}
                  <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-white mb-6">
                    <span>{accuracyPercent >= 70 ? '🎉' : accuracyPercent >= 50 ? '👏' : '💪'}</span>
                    <span>
                      {getMotivationalMessage()}
                    </span>
                  </div>

                  {/* Thứ hạng & Điểm số & Độ chính xác % (TỐI ƯU MOBILE GRID) */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 md:gap-8 mb-6">
                    {/* Ô ĐỘ CHÍNH XÁC PHẦN TRĂM NỔI BẬT */}
                    <div className="col-span-2 sm:col-span-1 px-3.5 py-2 rounded-2xl bg-[#18baa5]/20 border border-[#18baa5]/40 flex flex-col">
                      <div className="text-2xl sm:text-3xl font-black text-[#2fe59e]">
                        {accuracyPercent}%
                      </div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                        Độ chính xác ({correctCount}/{totalQuestions} câu)
                      </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 hidden sm:block"></div>

                    {/* Thứ hạng */}
                    <div className="px-3 py-1.5 rounded-xl bg-black/20 sm:bg-transparent">
                      <div className="text-xl sm:text-3xl font-black text-white flex items-baseline gap-1">
                        <span>1</span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-400">/1</span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>Thứ hạng</span>
                        <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 hidden sm:block"></div>

                    {/* Điểm số */}
                    <div className="px-3 py-1.5 rounded-xl bg-black/20 sm:bg-transparent">
                      <div className="text-xl sm:text-3xl font-black text-white">
                        {score > 0 ? score.toLocaleString() : '0'}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
                        Điểm số
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động: [Chơi lại], [Tìm bài kiểm tra mới] */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={onRetry}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Chơi lại</span>
                    </button>

                    <button
                      onClick={onGoHome}
                      className="px-4 py-2 bg-[#42113c] hover:bg-[#52164b] border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Tìm bài kiểm tra mới</span>
                    </button>
                  </div>
                </div>

                {/* Nhân vật Chibi 3D góc phải của card */}
                <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-28 relative flex items-center justify-center text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    🧍
                  </div>
                </div>

              </div>
            </div>

            {/* CARD 2: THANH TIẾN ĐỘ "CÂU ĐÚNG" (ĐỘ CHÍNH XÁC XANH LÁ + HỒNG) */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span>Câu đúng</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Progress bar hai màu chuẩn ảnh: Xanh ngọc (#20d48f) và Hồng dâu (#f24e75) */}
              <div className="w-full h-4 bg-[#f24e75] rounded-full overflow-hidden flex p-0.5 shadow-inner">
                <div 
                  className="h-full bg-[#20d48f] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(correctCount > 0 ? 5 : 0, accuracyPercent))}%` }}
                ></div>
                <div className="ml-auto pr-2 text-[10px] font-black text-white self-center">
                  {accuracyPercent}%
                </div>
              </div>
            </div>

            {/* CARD 3: SỐ LIỆU THỐNG KÊ HIỆU SUẤT */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-slate-200">Số liệu thống kê hiệu suất</span>
                <span className="font-mono">{totalQuestions} câu hỏi</span>
              </div>

              {/* 4 Pill trạng thái chuẩn 100% Ảnh */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-black">
                {/* Câu đúng */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#113a26] text-[#2fe59e] border border-[#2fe59e]/30 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{correctCount} Câu đúng</span>
                </div>

                {/* Câu sai */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#3e131d] text-[#ff5c7c] border border-[#ff5c7c]/30 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{incorrectCount} Sai</span>
                </div>

                {/* Thời gian trung bình mỗi câu */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#142838] text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{avgTimePerQ} s thời gian/câu hỏi</span>
                </div>

                {/* Chuỗi liên tiếp (Vệt) */}
                <div className="px-3.5 py-1.5 rounded-full bg-[#3a2512] text-[#fbbf24] border border-[#fbbf24]/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-[#fbbf24]" />
                  <span>{streakDisplay} Vệt.</span>
                </div>
              </div>
            </div>

            {/* CARD 4: XEM LẠI CÂU HỎI (REVIEW QUESTIONS LIST) */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Xem lại Câu hỏi ({evaluatedQuestions.length})</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nhấp vào các câu hỏi để xem chi tiết bài làm và đáp án</p>
                </div>
                <button
                  onClick={() => alert("Bộ thẻ ôn tập Flashcards câu hỏi sẽ sớm ra mắt!")}
                  className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Nghiên cứu flashcards.
                </button>
              </div>

              {/* Danh sách các card câu hỏi review màu trắng với viền trái xanh/hồng */}
              <div className="space-y-3 pt-1">
                {evaluatedQuestions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                    Không có câu hỏi nào để hiển thị xem lại.
                  </div>
                ) : (
                  evaluatedQuestions.map((q, qIndex) => {
                    const isCorrect = q.isCorrect;
                    const borderSideColor = isCorrect ? 'border-l-[#2fe59e]' : 'border-l-[#ff5c7c]';

                    return (
                      <div 
                        key={q.id || qIndex}
                        className={`bg-white rounded-2xl p-4 text-slate-900 border-l-[6px] ${borderSideColor} shadow-md transition-all hover:shadow-lg`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Hình ảnh câu hỏi nếu có */}
                          {q.image && (
                            <img 
                              src={q.image} 
                              alt="Minh họa câu hỏi" 
                              className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Tiêu đề câu hỏi & trạng thái đúng/sai */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                Câu {qIndex + 1}: {q.question}
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isCorrect ? '✓ Đúng' : '✕ Sai'}
                              </span>
                            </div>

                            {/* NỘI DUNG TỪNG DẠNG CÂU HỎI */}

                            {/* 1. Dạng Trắc nghiệm đơn & nhiều đáp án */}
                            {q.options && q.options.length > 0 ? (
                              <div className="space-y-1.5 pl-1">
                                {q.options.map(opt => {
                                  const isUserPicked = Array.isArray(q.userAns)
                                    ? q.userAns.includes(opt.id)
                                    : (q.userAns === opt.id || String(q.userAns) === String(opt.id));

                                  const isCorrectChoice = Array.isArray(q.correctAnswer)
                                    ? q.correctAnswer.includes(opt.id)
                                    : (q.correctAnswer === opt.id || String(q.correctAnswer) === String(opt.id));

                                  return (
                                    <div 
                                      key={opt.id}
                                      className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors ${
                                        isCorrectChoice 
                                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300 font-bold' 
                                          : isUserPicked 
                                          ? 'text-rose-700 bg-rose-50 border-rose-200 line-through' 
                                          : 'text-slate-600 border-slate-100 bg-slate-50/50'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isCorrectChoice ? 'border-emerald-600 bg-emerald-600 text-white' : (isUserPicked ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300')
                                      }`}>
                                        {isCorrectChoice ? (
                                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        ) : isUserPicked ? (
                                          <X className="w-2.5 h-2.5 stroke-[3]" />
                                        ) : null}
                                      </div>
                                      <span className="font-mono text-slate-500 font-bold">{opt.id}.</span>
                                      <span className="flex-1">{opt.text}</span>
                                      {isUserPicked && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 text-slate-600">
                                          Bạn chọn
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (q.type === 'true_false_multi' || q.type === 'true_false') && q.parts ? (
                              <div className="space-y-1.5 pl-1">
                                {q.parts.map(part => {
                                  const userPick = (q.userAns || {})[part.id];
                                  const expected = part.isCorrect !== undefined ? Boolean(part.isCorrect) : Boolean(part.correct);
                                  const isPartRight = userPick !== undefined && Boolean(userPick) === expected;

                                  return (
                                    <div 
                                      key={part.id}
                                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-semibold rounded-lg p-2 border ${
                                        isPartRight ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900' : 'border-rose-200 bg-rose-50/70 text-rose-900'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <span className="font-bold shrink-0">{part.id}.</span>
                                        <span>{part.text}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px] shrink-0 font-bold self-end sm:self-auto">
                                        <span className={userPick === undefined ? 'text-slate-500' : isPartRight ? 'text-emerald-700' : 'text-rose-600'}>
                                          Bạn chọn: {userPick === true ? 'ĐÚNG' : userPick === false ? 'SAI' : 'Chưa chọn'}
                                        </span>
                                        <span className="text-slate-400">|</span>
                                        <span className="text-emerald-700 font-extrabold">Đáp án: {expected ? 'ĐÚNG' : 'SAI'}</span>
                                        {isPartRight ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                        ) : (
                                          <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : q.type === 'drag_drop' && q.sentences ? (
                              <div className="space-y-1.5 pl-1">
                                {q.sentences.map((sent, sIdx) => {
                                  const userWord = (q.userAns || {})[sent.id] || '';
                                  const correctWord = sent.correctWord || sent.correctItemId || sent.correctAnswer || '';
                                  const isMatch = String(userWord).trim().toLowerCase() === String(correctWord).trim().toLowerCase();
                                  return (
                                    <div key={sIdx} className={`p-2 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-1.5 ${
                                      isMatch ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900' : 'border-rose-200 bg-rose-50/70 text-rose-900'
                                    }`}>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold">{sIdx + 1}.</span>
                                        <span>{sent.prefix}</span>
                                        <span className={`px-2 py-0.5 rounded font-bold border ${isMatch ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-rose-100 border-rose-300 text-rose-800'}`}>
                                          [{userWord || 'Chưa điền'}]
                                        </span>
                                        <span>{sent.suffix}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                        {!isMatch && <span className="text-emerald-700">Đáp án: [{correctWord}]</span>}
                                        {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : q.type === 'categorize' && q.categories ? (
                              <div className="space-y-1.5 pl-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {q.categories.map((cat, cIdx) => (
                                    <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                      <span className="font-bold text-slate-800 block mb-1.5">Cột: {cat.name || cat.title}</span>
                                      <div className="space-y-1">
                                        {(((q.userAns || {})[cat.id]) || []).map((uItem, uIdx) => {
                                          const originalItem = (q.items || []).find(it => it.id === uItem.id || it.text === uItem.text);
                                          const isItemCorrect = originalItem && (originalItem.categoryId === cat.id || originalItem.targetCategory === cat.id);
                                          return (
                                            <div key={uIdx} className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center justify-between border ${
                                              isItemCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                            }`}>
                                              <span>{uItem.text}</span>
                                              {isItemCorrect ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (q.type === 'short_answer' || q.type === 'fill_blank') && q.blanks ? (
                              <div className="space-y-1.5 pl-1">
                                {q.blanks.map((b, bIdx) => {
                                  const clozeAns = typeof q.userAns === 'object' && q.userAns !== null ? q.userAns : {};
                                  const userText = (clozeAns[b.id] || '').trim();
                                  const accepted = Array.isArray(b.correctAnswer)
                                    ? b.correctAnswer.map(c => String(c).toLowerCase().trim())
                                    : [String(b.correctAnswer || '').toLowerCase().trim()];
                                  const isBlankCorrect = userText.length > 0 && accepted.includes(userText.toLowerCase());

                                  return (
                                    <div key={bIdx} className={`p-2 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-1.5 ${
                                      isBlankCorrect ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900' : 'border-rose-200 bg-rose-50/70 text-rose-900'
                                    }`}>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold">Chỗ trống {bIdx + 1}:</span>
                                        <span className={`px-2 py-0.5 rounded font-bold border ${
                                          isBlankCorrect ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-rose-100 border-rose-300 text-rose-800'
                                        }`}>
                                          [{userText || 'Chưa điền'}]
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                        {!isBlankCorrect && (
                                          <span className="text-emerald-700">Đáp án: [{Array.isArray(b.correctAnswer) ? b.correctAnswer.join(' / ') : b.correctAnswer}]</span>
                                        )}
                                        {isBlankCorrect ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (q.type === 'short_answer' || q.type === 'fill_blank') ? (
                              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-medium">Bạn đã trả lời:</span>
                                    <span className={`font-bold px-2 py-0.5 rounded border ${
                                      q.isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}>
                                      {String(q.userAns || 'Chưa trả lời')}
                                    </span>
                                  </div>
                                  {q.isCorrect ? (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Chính xác
                                    </span>
                                  ) : (
                                    <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                                      <X className="w-3.5 h-3.5 stroke-[3]" /> Chưa đúng
                                    </span>
                                  )}
                                </div>
                                {!q.isCorrect && (
                                  <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                                    Đáp án chuẩn: <span className="font-bold">{Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer}</span>
                                  </div>
                                )}
                              </div>
                            ) : q.type === 'essay' ? (
                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <div>
                                  <span className="text-slate-500 font-semibold block mb-1">Bài làm của bạn:</span>
                                  <p className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {typeof q.userAns === 'object' ? (q.userAns?.text || 'Chưa nộp bài') : (q.userAns || 'Chưa nộp bài')}
                                  </p>
                                </div>
                                {typeof q.userAns === 'object' && q.userAns?.aiResult && (
                                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 space-y-1">
                                    <div className="flex items-center justify-between font-bold text-purple-900">
                                      <span>Điểm số chấm tự động:</span>
                                      <span>{q.userAns.aiResult.score}/{q.maxScore || 10} điểm</span>
                                    </div>
                                    {q.userAns.aiResult.feedback && (
                                      <p className="text-[11px] text-purple-800 leading-relaxed pt-1">
                                        {q.userAns.aiResult.feedback}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                            ) : (
                              <div className="text-xs text-slate-600 font-medium">
                                {q.explanation || 'Đã ghi nhận kết quả bài làm.'}
                              </div>
                            )}

                            {/* Lời giải thích chi tiết nếu có */}
                            {q.explanation && (
                              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                                <span className="font-bold text-slate-700 shrink-0">Giải thích:</span>
                                <span className="leading-relaxed">{q.explanation}</span>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

        </div>
      </main>

    </div>
  );
}
