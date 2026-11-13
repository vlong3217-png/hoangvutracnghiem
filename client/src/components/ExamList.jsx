import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Home, 
  RotateCcw, 
  Bookmark, 
  Hourglass, 
  Check, 
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';
import QuizizzLogo from './QuizizzLogo';
import { getExamProgress, getAllUserProgress } from '../services/examProgress';

export default function ExamList({ exams, currentUser, onSelectExam, onOpenTeacherManage, onLogout, isLoading }) {
  const [activeTab, setActiveTab] = useState('running'); // 'running' (Đang chạy), 'completed' (Hoàn thành)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(null);

  // Đọc danh sách tiến độ làm bài của học sinh hiện tại
  const [userProgressMap, setUserProgressMap] = useState(() => getAllUserProgress(currentUser));

  useEffect(() => {
    setUserProgressMap(getAllUserProgress(currentUser));
    const handleProgressUpdate = () => {
      setUserProgressMap(getAllUserProgress(currentUser));
    };
    window.addEventListener('exam-progress-updated', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);
    return () => {
      window.removeEventListener('exam-progress-updated', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, [currentUser]);

  const handleCardClick = (exam) => {
    setSelectedExamId(exam.id);
    // Tạo hiệu ứng click nảy và chuyển cảnh mượt
    setTimeout(() => {
      onSelectExam(exam);
    }, 280);
  };

  // Tính toán thông tin tiến độ của một đề thi
  const getExamProgressInfo = (exam) => {
    const prog = userProgressMap[exam.id] || getExamProgress(currentUser, exam.id);
    const totalQ = (exam.questions && exam.questions.length) || Number(exam.totalQuestions) || 0;
    const answeredCount = prog?.answeredCount ?? (prog?.selectedAnswers ? Object.keys(prog.selectedAnswers).length : 0);
    const isCompleted = Boolean(prog?.completed || (totalQ > 0 && answeredCount >= totalQ));
    const percent = isCompleted 
      ? 100 
      : (totalQ > 0 ? Math.min(99, Math.round((answeredCount / totalQ) * 100)) : 0);
    const hasStarted = answeredCount > 0 || (prog && prog.currentIdx > 0);
    return { prog, totalQ, answeredCount, isCompleted, percent, hasStarted };
  };

  // Lọc theo search
  const searchedExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exam.author && exam.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Phân loại theo tab Đang chạy và Hoàn thành
  const runningExams = searchedExams.filter(exam => !getExamProgressInfo(exam).isCompleted);
  const completedExams = searchedExams.filter(exam => getExamProgressInfo(exam).isCompleted);

  const displayedExams = activeTab === 'running' ? runningExams : completedExams;

  // Theme màu sắc của thẻ chuẩn theo ảnh Quizizz / Wayground
  const getCardHeaderBg = (theme) => {
    switch (theme) {
      case 'teal':
        return 'bg-[#14958f]'; // Teal lục lam
      case 'orange':
        return 'bg-[#d89725]'; // Vàng cam ấm
      case 'coral':
      case 'pink':
        return 'bg-[#cc4d63]'; // Đỏ san hô / dâu tây
      case 'purple':
        return 'bg-[#6b3582]'; // Tím mận
      case 'blue':
        return 'bg-[#2978bb]'; // Xanh dương
      default:
        return 'bg-[#2978bb]';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-slate-800">
      {/* 1. TOPBAR CHUẨN QUIZIZZ - TỐI ƯU RESPONSIVE */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          {/* Logo Quizizz */}
          <div className="flex items-center gap-1.5 cursor-pointer shrink-0">
            <QuizizzLogo className="w-6 h-6 text-[#d82a7a]" />
            <span className="text-[#d82a7a] font-black text-lg sm:text-xl tracking-tight">
              Quizizz
            </span>
          </div>

          {/* Ô tìm kiếm "Tìm quiz" */}
          <div className="relative w-full max-w-[200px] sm:max-w-xs md:max-w-sm">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm quiz..."
              className="w-full pl-3 sm:pl-4 pr-8 sm:pr-9 py-1 sm:py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
          </div>
        </div>

        {/* Navigation links giữa/phải: Giữ Trang chủ và Đăng xuất */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-600 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#883494] bg-purple-50 font-bold transition-colors">
            <Home className="w-4 h-4 text-[#883494]" />
            <span>Trang chủ</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>

          {/* Nút Đăng xuất tiện lợi */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-xs font-bold cursor-pointer"
            title="Đăng xuất khỏi tài khoản"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* 2. TAB SUB-NAV (Đang chạy, Hoàn thành) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 pt-3 sm:pt-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-600 min-w-max">
          <button 
            onClick={() => setActiveTab('running')}
            className={`pb-3 flex items-center gap-1.5 sm:gap-2 relative transition-colors ${
              activeTab === 'running' 
                ? 'text-slate-900 font-bold border-b-2 border-amber-500' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Đang chạy</span>
            <Hourglass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
              {runningExams.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('completed')}
            className={`pb-3 flex items-center gap-1.5 sm:gap-2 relative transition-colors ${
              activeTab === 'completed' 
                ? 'text-slate-900 font-bold border-b-2 border-amber-500' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Hoàn thành</span>
            <Hourglass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 rotate-180" />
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
              {completedExams.length}
            </span>
          </button>
        </div>
      </div>

      {/* 3. LƯỚI THẺ BÀI THI CHUẨN QUIZIZZ (RESPONSIVE TOÀN DIỆN CHO MOBILE) */}
      <main className="flex-1 px-4 sm:px-8 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center animate-in fade-in duration-300">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-pink-100 border-t-[#d82a7a] animate-spin"></div>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">Đang tải...</h2>
            <p className="text-xs text-slate-500 max-w-sm">
              Đang kết nối và đồng bộ dữ liệu đề thi từ CSDL đám mây. Vui lòng chờ trong giây lát!
            </p>
          </div>
        ) : displayedExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl mb-4 text-[#d82a7a] shadow-xs">
              {activeTab === 'completed' ? '🏆' : '📝'}
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              {activeTab === 'completed' ? 'Chưa có bài thi nào hoàn thành' : 'Chưa có đề thi nào'}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm">
              {activeTab === 'completed' 
                ? 'Hãy hoàn thành các bài thi ở mục "Đang chạy" để theo dõi kết quả tại đây!'
                : 'Hiện không có bài thi nào phù hợp với bộ lọc tìm kiếm.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedExams.map((exam, idx) => {
              const hasBanner = exam.cardTheme === 'image' && exam.bannerImage;
              const isClicked = selectedExamId === exam.id;
              const progressInfo = getExamProgressInfo(exam);

              return (
                <div 
                  key={exam.id}
                  onClick={() => handleCardClick(exam)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group anim-pop-in ${
                    isClicked ? 'scale-95 ring-4 ring-[#d82a7a] opacity-80' : 'hover:-translate-y-2'
                  }`}
                >
                {/* PHẦN ĐẦU THẺ (BANNER HOẶC NỀN MÀU VỚI LOGO Q MỜ) */}
                <div className={`h-24 relative overflow-hidden flex items-center justify-center ${
                  hasBanner ? 'bg-slate-100' : getCardHeaderBg(exam.cardTheme)
                }`}>
                  {hasBanner ? (
                    <img 
                      src={exam.bannerImage} 
                      alt={exam.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    /* Chữ Q lớn viền mờ nghệ thuật của Quizizz */
                    <div className="w-16 h-16 rounded-full border-[6px] border-white/20 flex items-center justify-center relative">
                      <div className="w-3.5 h-3.5 bg-white/20 rounded-full absolute -bottom-1 -right-1"></div>
                    </div>
                  )}

                  {/* Tag "Được giao" góc trên bên trái */}
                  {exam.assigned && (
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <Bookmark className="w-2.5 h-2.5 fill-white" />
                      <span>Được giao</span>
                    </div>
                  )}

                  {/* Badge số lượng thẻ / câu hỏi góc dưới bên trái của banner */}
                  <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs">
                    {exam.statusBadge || `${exam.questions?.length || exam.totalQuestions} Qs`}
                  </div>
                </div>

                {/* THÂN THẺ */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tên bài thi */}
                    <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 min-h-[32px] group-hover:text-purple-700 transition-colors">
                      {exam.title}
                    </h3>

                    {/* Metadata giáo viên & lớp học */}
                    <div className="mt-2 text-[10.5px] text-slate-500 leading-tight space-y-0.5">
                      {exam.author && (
                        <p className="truncate">Qua: {exam.author}</p>
                      )}
                      {exam.className && (
                        <p className="truncate">Lớp học: {exam.className}</p>
                      )}
                      {exam.dueText && (
                        <p className="text-slate-400 truncate">{exam.dueText}</p>
                      )}
                    </div>
                  </div>

                  {/* CHÂN THẺ - THANH TIẾN ĐỘ / BADGE TRẠNG THÁI */}
                  <div className="mt-3.5 pt-2">
                    {progressInfo.isCompleted ? (
                      <div className="w-full py-1.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold rounded-full text-center flex items-center justify-center gap-1.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hoàn thành (100%)</span>
                      </div>
                    ) : progressInfo.hasStarted && progressInfo.percent > 0 ? (
                      <div className="w-full py-1.5 px-3 bg-purple-100/90 text-purple-900 text-[10.5px] font-bold rounded-full text-center relative overflow-hidden shadow-2xs border border-purple-200/60">
                        {/* Lớp màu tiến độ % mờ phía sau */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-[#d82a7a]/20 rounded-full transition-all duration-300"
                          style={{ width: `${progressInfo.percent}%` }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-1">
                          <span>Bắt đầu làm bài ({progressInfo.percent}%)</span>
                        </span>
                      </div>
                    ) : (
                      <div className="w-full py-1 px-3 bg-purple-100 text-purple-700 text-[10px] font-medium rounded-full text-center truncate">
                        Bắt đầu làm bài
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </main>
    </div>
  );
}
