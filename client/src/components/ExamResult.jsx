import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  X, 
  Maximize2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';

export default function ExamResult({ exam, result, onRetry, onGoHome }) {
  const { selectedAnswers = {}, score = 13720, timeSpent = 600 } = result;

  // Đánh giá từng câu hỏi trong đề thi
  const questions = exam.questions || [];
  let correctCount = 0;

  const evaluatedQuestions = questions.map(q => {
    const userAns = selectedAnswers[q.id];
    let isCorrect = false;

    if (!q.type || q.type === 'single') {
      isCorrect = userAns === q.correctAnswer;
    } else if (q.type === 'multiple') {
      const correctList = [...(q.correctAnswer || [])].sort();
      const userList = Array.isArray(userAns) ? [...userAns].sort() : [];
      isCorrect = JSON.stringify(correctList) === JSON.stringify(userList);
    } else if (q.type === 'true_false_multi' || q.type === 'true_false') {
      const subAns = userAns || {};
      const parts = q.parts || [];
      const correctParts = parts.filter(p => {
        const expected = p.isCorrect !== undefined ? Boolean(p.isCorrect) : (p.correct !== undefined ? Boolean(p.correct) : true);
        return Boolean(subAns[p.id]) === expected;
      });
      isCorrect = parts.length > 0 && correctParts.length === parts.length;
    } else if (q.type === 'short_answer' || q.type === 'fill_blank') {
      if (q.blanks && q.blanks.length > 0) {
        const clozeAns = typeof userAns === 'object' ? (userAns || {}) : {};
        isCorrect = q.blanks.every(b => {
          const val = (clozeAns[b.id] || '').trim().toLowerCase();
          const accepted = Array.isArray(b.correctAnswer)
            ? b.correctAnswer.map(c => c.toLowerCase().trim())
            : [String(b.correctAnswer || '').toLowerCase().trim()];
          return accepted.includes(val);
        });
      } else {
        const formattedUser = (userAns || '').toString().trim().toLowerCase();
        const correctPossible = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        isCorrect = correctPossible.some(c => c.toString().trim().toLowerCase() === formattedUser);
      }
    } else if (q.type === 'drag_drop') {
      const userSlots = typeof userAns === 'object' && userAns !== null ? userAns : {};
      const sentences = q.sentences || [];
      isCorrect = sentences.length > 0 && sentences.every(s => {
        const userChoice = String(userSlots[s.id] || '').trim().toLowerCase();
        const correctChoice = String(s.correctWord || s.correctItemId || s.correctAnswer || '').trim().toLowerCase();
        return userChoice === correctChoice;
      });
    } else if (q.type === 'categorize') {
      const userAssignments = typeof userAns === 'object' && userAns !== null ? userAns : {};
      const items = q.items || [];
      isCorrect = items.length > 0 && items.every(it => {
        const targetColId = it.categoryId || it.targetCategory;
        const targetCol = userAssignments[targetColId] || [];
        return targetCol.some(cItem => cItem.id === it.id || cItem.text === it.text);
      });
    } else if (q.type === 'essay') {
      const essayObj = typeof userAns === 'object' && userAns !== null ? userAns : { text: userAns };
      const aiScore = essayObj?.aiResult?.score ?? 5;
      const maxScore = q.maxScore || 10;
      isCorrect = aiScore >= (maxScore * 0.5);
    } else {
      isCorrect = Boolean(userAns);
    }

    if (isCorrect) correctCount += 1;

    return {
      ...q,
      userAns,
      isCorrect
    };
  });

  const totalQuestions = questions.length || 1;
  const incorrectCount = totalQuestions - correctCount;
  const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
  const avgTimePerQ = Math.round(timeSpent / totalQuestions) || 49;

  return (
    <div className="fixed inset-0 z-50 bg-[#1e051c] text-white flex flex-col justify-between font-sans select-none overflow-hidden">
      
      {/* 1. TOPBAR CÓ NÚT THOÁT [X] VÀ FULLSCREEN PHẢI */}
      <header className="h-12 px-6 flex items-center justify-between shrink-0 z-20">
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

      {/* 2. BODY KHÔNG GIAN KẾT QUẢ CUỘN ĐƯỢC CHUẨN THEO ẢNH */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-12">
          
          {/* CỘT TRÁI (8 CỘT): KẾT QUẢ CHÍNH & DANH SÁCH CÂU HỎI */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* CARD 1: BANNER ĐIỂM SỐ & CHÚC MỪNG CHÍNH */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                <div className="flex-1">
                  {/* Tiêu đề bài kiểm tra */}
                  <div className="text-xs font-black tracking-widest uppercase text-slate-300 mb-2">
                    {exam.title || 'GRADE 3 - REVIEW'}
                  </div>

                  {/* Lời khen chúc mừng */}
                  <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-white mb-6">
                    <span>🎉</span>
                    <span>
                      Xin chúc mừng, bạn đã tiến gần đến độ chính xác {accuracyPercent}%, Sinh viên!
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

                    <div className="px-3 py-1.5 rounded-xl bg-black/20 sm:bg-transparent">
                      <div className="text-xl sm:text-3xl font-black text-white flex items-baseline gap-1">
                        <span>{correctCount > 0 ? (totalQuestions - correctCount + 1) : totalQuestions}</span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-400">/{totalQuestions}</span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>Thứ hạng</span>
                        <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 hidden sm:block"></div>

                    <div className="px-3 py-1.5 rounded-xl bg-black/20 sm:bg-transparent">
                      <div className="text-xl sm:text-3xl font-black text-white">
                        {score > 0 ? score.toLocaleString() : '0'}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
                        Điểm số
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động: [Chơi lại], [Tìm bài kiểm tra mới], [Cửa hàng] */}
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

                    <button
                      onClick={() => alert("Cửa hàng vật phẩm và avatar Quizizz!")}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <span>Cửa hàng</span>
                    </button>
                  </div>

                  {/* Badge kiếm xu */}
                  <div className="mt-3.5 flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
                    <span>🪙</span>
                    <span>Kiếm lên đến 690 đồng xu</span>
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
                  style={{ width: `${Math.max(8, accuracyPercent)}%` }}
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
                  <span>4 Vệt.</span>
                </div>
              </div>
            </div>

            {/* CARD 4: XEM LẠI CÂU HỎI (REVIEW QUESTIONS LIST) */}
            <div className="bg-[#2b0827] border-2 border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Xem lại Câu hỏi</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nhấp vào các câu hỏi để xem câu trả lời</p>
                </div>
                <button
                  onClick={() => alert("Mở bộ thẻ ôn tập Flashcards câu hỏi này")}
                  className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Nghiên cứu flashcards.
                </button>
              </div>

              {/* Danh sách các card câu hỏi review màu trắng với viền trái xanh/hồng */}
              <div className="space-y-3 pt-1">
                {evaluatedQuestions.map((q, qIndex) => {
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
                            alt="Question illustration" 
                            className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Đề bài câu hỏi */}
                          <div className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-snug">
                            {qIndex + 1}. {q.question}
                          </div>

                          {/* Lựa chọn hoặc đáp án */}
                          {q.options ? (
                            <div className="space-y-1.5 pl-1">
                              {q.options.map(opt => {
                                const isUserPicked = q.userAns === opt.id;
                                const isCorrectChoice = opt.id === q.correctAnswer;

                                return (
                                  <div 
                                    key={opt.id}
                                    className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-2 py-1 ${
                                      isCorrectChoice 
                                        ? 'text-emerald-700 bg-emerald-50 font-bold' 
                                        : isUserPicked 
                                        ? 'text-rose-600 bg-rose-50 line-through' 
                                        : 'text-slate-600'
                                    }`}
                                  >
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                                      isCorrectChoice ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                                    }`}>
                                      {isCorrectChoice && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                    </div>
                                    <span>{opt.text}</span>
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
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold rounded-lg p-2 border ${
                                      isPartRight ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900' : 'border-rose-200 bg-rose-50/70 text-rose-900'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="font-bold shrink-0">{part.id}.</span>
                                      <span>{part.text}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] shrink-0 font-bold self-end sm:self-auto">
                                      <span className={userPick === undefined ? 'text-slate-500' : isPartRight ? 'text-emerald-700' : 'text-rose-600'}>
                                        Bạn: {userPick === true ? 'ĐÚNG' : userPick === false ? 'SAI' : 'Chưa chọn'}
                                      </span>
                                      <span className="text-slate-400">|</span>
                                      <span className="text-emerald-700">Đ.Án: {expected ? 'ĐÚNG' : 'SAI'}</span>
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
                                const correctWord = sent.correctWord || sent.correctItemId || '';
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
                                      {!isMatch && <span className="text-emerald-700">Đ.Án: [{correctWord}]</span>}
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
                                  <div key={cIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                                    <span className="font-bold text-slate-800 block mb-1">Cột: {cat.name || cat.title}</span>
                                    <div className="space-y-1">
                                      {((q.userAns || {})[cat.id] || []).map((uItem, uIdx) => {
                                        const originalItem = (q.items || []).find(it => it.id === uItem.id || it.text === uItem.text);
                                        const isItemCorrect = originalItem && (originalItem.categoryId === cat.id || originalItem.targetCategory === cat.id);
                                        return (
                                          <div key={uIdx} className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center justify-between border ${
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
                          ) : (
                            <div className="text-xs text-slate-600 font-medium">
                              {q.explanation || 'Đã ghi nhận câu trả lời.'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (4 CỘT): BANNER QUẢNG CÁO QUESTS & FORUM SINH VIÊN */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* CARD SIDEBAR 1: QUESTS (Kiếm hàng ngàn xu) */}
            <div className="bg-gradient-to-b from-[#3d1a08] to-[#250d03] border-2 border-amber-500/30 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[220px]">
              <div className="text-[11px] font-bold text-amber-200">
                Kiếm hàng ngàn xu với
              </div>

              {/* Logo QUESTS chữ vàng 3D cực lớn */}
              <div className="my-3 text-4xl sm:text-5xl font-black text-amber-400 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] scale-110">
                QUESTS
              </div>

              {/* Đồng xu vàng bay lơ lửng */}
              <div className="absolute top-4 left-4 text-xl opacity-75">🪙</div>
              <div className="absolute bottom-10 right-4 text-xl opacity-75">🪙</div>

              <button
                onClick={() => alert("Tham gia nhiệm vụ Quests")}
                className="mt-2 text-xs font-black text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Đi thôi!</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="flex gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              </div>
            </div>

            {/* CARD SIDEBAR 2: DIỄN ĐÀN SINH VIÊN QUIZIZZ */}
            <div className="bg-[#181126] border-2 border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
              <div className="text-xs font-black text-white mb-3">
                Kết nối, học hỏi và tham gia!
              </div>

              {/* Tranh minh họa sinh viên hoạt hình trò chuyện */}
              <div className="bg-[#241a38] rounded-2xl p-4 flex items-center justify-center text-4xl mb-3 shadow-inner">
                🧑‍🎓👩‍💻👨‍🏫
              </div>

              <button
                onClick={() => alert("Diễn đàn cộng đồng sinh viên")}
                className="w-full py-2.5 bg-black/50 hover:bg-black/70 text-white font-extrabold text-xs rounded-xl border border-white/10 transition-colors text-center cursor-pointer"
              >
                Tham gia diễn đàn sinh viên Quizizz
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
