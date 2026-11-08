import React, { useState } from 'react';
import { 
  Search, 
  Home, 
  RotateCcw, 
  Bookmark, 
  Hourglass, 
  Edit3, 
  Check, 
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';
import QuizizzLogo from './QuizizzLogo';

export default function ExamList({ exams, onSelectExam, onOpenTeacherManage, onLogout, isLoading }) {
  const [activeTab, setActiveTab] = useState('running'); // 'running' (Đang chạy), 'completed' (Hoàn thành), 'created' (Tạo)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(null);

  const handleCardClick = (exam) => {
    setSelectedExamId(exam.id);
    // Tạo hiệu ứng click nảy và chuyển cảnh mượt
    setTimeout(() => {
      onSelectExam(exam);
    }, 280);
  };

  // Lọc theo search
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exam.author && exam.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

      {/* 2. TAB SUB-NAV (Đang chạy, Hoàn thành, Tạo) */}
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
          </button>

          <button 
            onClick={() => setActiveTab('created')}
            className={`pb-3 flex items-center gap-1.5 sm:gap-2 relative transition-colors ${
              activeTab === 'created' 
                ? 'text-slate-900 font-bold border-b-2 border-amber-500' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Tạo</span>
            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
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
        ) : filteredExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl mb-4 text-[#d82a7a] shadow-xs">
              📝
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Chưa có đề thi nào</h2>
            <p className="text-xs text-slate-500 max-w-sm">
              Dữ liệu mẫu đã được xóa sạch. Hệ thống sẵn sàng để bạn tải lên các đề thi mới!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredExams.map((exam, idx) => {
              const hasBanner = exam.cardTheme === 'image' && exam.bannerImage;
              const isClicked = selectedExamId === exam.id;

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
                    {exam.bottomType === 'green_accuracy' && (
                      <div className="w-full py-1.5 px-3 bg-[#42d99d] text-[#0d593c] text-[10px] font-bold rounded-md text-center shadow-2xs">
                        {exam.accuracy || 'Độ chính xác 85%'}
                      </div>
                    )}

                    {exam.bottomType === 'dark_accuracy' && (
                      <div className="w-full py-1.5 px-3 bg-[#2d3748] text-amber-300 text-[10px] font-bold rounded-md text-center shadow-2xs flex items-center justify-center gap-1">
                        <span>{exam.accuracy || 'Độ chính xác 100%'}</span>
                      </div>
                    )}

                    {(exam.bottomType === 'purple_pill' || !exam.bottomType) && (
                      <div className="w-full py-1 px-3 bg-purple-100 text-purple-700 text-[10px] font-medium rounded-full text-center truncate">
                        {exam.bottomText || 'Bắt đầu làm bài'}
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
