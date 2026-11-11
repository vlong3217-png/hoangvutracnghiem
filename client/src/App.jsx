import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { fetchExams, fetchExamById, submitExamResult, updateExamApi, deleteExamApi, createExamApi } from './services/api';
import { evaluateUserAnswers } from './services/examEvaluation';
import ExamList from './components/ExamList';
import ExamRoom from './components/ExamRoom';
import ExamResult from './components/ExamResult';
import TeacherManage from './components/TeacherManage';
import ExamDetailManage from './components/ExamDetailManage';
import CreateResourceModal from './components/CreateResourceModal';
import LoginPage from './components/LoginPage';
import QuizizzLogo from './components/QuizizzLogo';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  Users, 
  Award, 
  Crown, 
  LogOut,
  HelpCircle 
} from 'lucide-react';

// Wrapper component để xử lý route /exam/:id trực tiếp (khi truy cập hoặc F5 trang bài thi)
function ExamRoomRoute({ onBack, onSubmitExam, isOpeningExam, onLoadedExam }) {
  const { examId } = useParams();
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    fetchExamById(examId)
      .then(full => {
        if (!isMounted) return;
        if (full && full.id) {
          setExamData(full);
          if (onLoadedExam) onLoadedExam(full);
        } else {
          setLoadError('Không tìm thấy bài thi hoặc bài thi đã bị xóa.');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setLoadError(err.message || 'Lỗi khi tải dữ liệu bài thi.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [examId]);

  if (isLoading || isOpeningExam) {
    return (
      <div className="fixed inset-0 z-50 bg-[#160413] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#d82a7a] animate-spin mb-3"></div>
        <p className="text-sm font-bold tracking-wide">Đang tải đề thi...</p>
        <p className="text-xs text-white/70 mt-1">Đang đồng bộ dữ liệu câu hỏi từ CSDL</p>
      </div>
    );
  }

  if (loadError || !examData) {
    return (
      <div className="fixed inset-0 z-50 bg-[#160413] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold mb-4 border border-rose-500/30">
          ✕
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Không thể tải bài thi</h3>
        <p className="text-xs text-slate-300 max-w-sm mb-6">{loadError || 'Đề thi không tồn tại.'}</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
        >
          Quay lại Thư viện
        </button>
      </div>
    );
  }

  return (
    <ExamRoom
      exam={examData}
      onSubmitExam={(resultData) => {
        onSubmitExam({
          ...resultData,
          exam: examData,
          questions: examData.questions
        });
      }}
      onBack={onBack}
    />
  );
}

// Wrapper component cho route xem chi tiết đề thi: /manage/exam/:examId
function ExamDetailRoute({ onPlayExam, onUpdateExam, onAddExam }) {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    fetchExamById(examId)
      .then(full => {
        if (!isMounted) return;
        if (full && full.id) {
          setExamData(full);
        } else {
          setLoadError('Không tìm thấy bài thi hoặc bài thi đã bị xóa.');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setLoadError(err.message || 'Lỗi khi tải dữ liệu bài thi.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [examId]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-3.5 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-2xs max-w-sm text-center">
          <div className="w-10 h-10 rounded-full border-4 border-pink-100 border-t-[#d82a7a] animate-spin"></div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Đang tải đề thi...</h4>
            <p className="text-xs text-slate-400 mt-1">Đang đồng bộ dữ liệu câu hỏi từ CSDL</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !examData) {
    return (
      <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xl font-bold mb-3 border border-rose-100">
          ✕
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">Không tìm thấy đề thi</h4>
        <p className="text-xs text-slate-500 mb-5">{loadError || 'Đề thi không tồn tại.'}</p>
        <button
          onClick={() => navigate('/manage')}
          className="px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Quay lại Quản lý
        </button>
      </div>
    );
  }

  return (
    <ExamDetailManage
      exam={examData}
      onBack={() => navigate('/manage')}
      onPlayExam={onPlayExam}
      onUpdateExam={async (updated) => {
        setExamData(updated);
        if (onUpdateExam) await onUpdateExam(updated);
      }}
      onAddExam={onAddExam}
    />
  );
}

// Wrapper component cho route chỉnh sửa toàn diện đề thi: /manage/edit/:examId
function ExamEditRoute({ onUpdateExam }) {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    fetchExamById(examId)
      .then(full => {
        if (!isMounted) return;
        if (full && full.id) {
          setExamData(full);
        } else {
          setLoadError('Không tìm thấy bài thi để chỉnh sửa.');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setLoadError(err.message || 'Lỗi khi tải dữ liệu bài thi.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [examId]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-3.5 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-2xs max-w-sm text-center">
          <div className="w-10 h-10 rounded-full border-4 border-pink-100 border-t-[#d82a7a] animate-spin"></div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Đang tải trang chỉnh sửa...</h4>
            <p className="text-xs text-slate-400 mt-1">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !examData) {
    return (
      <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 text-center">
        <h4 className="text-sm font-bold text-slate-800 mb-1">Không thể mở trang chỉnh sửa</h4>
        <p className="text-xs text-slate-500 mb-5">{loadError || 'Đề thi không tồn tại.'}</p>
        <button
          onClick={() => navigate('/manage')}
          className="px-4 py-2 bg-[#d82a7a] hover:bg-[#c2226b] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Quay lại Quản lý
        </button>
      </div>
    );
  }

  return (
    <CreateResourceModal
      initialExam={examData}
      onBack={() => navigate(`/manage/exam/${examId}`)}
      onSaveExam={async (updated) => {
        setExamData(updated);
        if (onUpdateExam) await onUpdateExam(updated);
      }}
    />
  );
}

// Wrapper component cho route tạo đề thi mới: /manage/create
function ExamCreateRoute({ onAddExam }) {
  const navigate = useNavigate();

  return (
    <CreateResourceModal
      onBack={() => navigate('/manage')}
      onSaveExam={async (newExam) => {
        if (onAddExam) await onAddExam(newExam);
        navigate('/manage');
      }}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([
    {
      id: "user-student",
      name: "Nguyễn Văn An",
      email: "student@test.com",
      password: "123",
      role: "student",
      roleName: "Sinh viên"
    },
    {
      id: "user-admin-vlong",
      name: "Long Hoàng Vũ",
      email: "vlong3217@gmail.com",
      password: "123",
      role: "admin",
      roleName: "Admin"
    }
  ]);
  
  // Lưu trạng thái đăng nhập vào localStorage để khi F5 / load lại trang KHÔNG bị đẩy ra màn hình đăng nhập
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('QUIZIZZ_CURRENT_USER') || localStorage.getItem('WAYGROUND_CURRENT_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isOpeningExam, setIsOpeningExam] = useState(false);
  const [activeExam, setActiveExam] = useState(() => {
    try {
      const saved = sessionStorage.getItem('QUIZIZZ_ACTIVE_EXAM');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [examResult, setExamResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem('QUIZIZZ_EXAM_RESULT');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Tải danh sách đề thi thời gian thực từ Neon PostgreSQL Backend
  useEffect(() => {
    async function loadExamsFromDatabase() {
      setIsLoadingExams(true);
      try {
        const dbExams = await fetchExams();
        if (dbExams && Array.isArray(dbExams)) {
          setExams(dbExams);
        }
      } catch (err) {
        console.error("Lỗi tải đề thi từ CSDL:", err);
      } finally {
        setIsLoadingExams(false);
      }
    }
    loadExamsFromDatabase();
  }, []);

  // Lưu thông tin người dùng mỗi khi đăng nhập thành công
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('QUIZIZZ_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('QUIZIZZ_CURRENT_USER');
      localStorage.removeItem('WAYGROUND_CURRENT_USER');
    }
  }, [currentUser]);

  // Cảnh báo khi người dùng đang thi mà cố đóng/tải lại tab
  const isExamRoomPath = location.pathname.startsWith('/exam/');
  const isResultPath = location.pathname.startsWith('/result');

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isExamRoomPath || isResultPath) {
        e.preventDefault();
        e.returnValue = 'Bạn có muốn thoát khỏi phòng thi? Mọi tiến trình bài làm có thể bị gián đoạn.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExamRoomPath, isResultPath]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigate('/manage');
    } else {
      navigate('/exams');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveExam(null);
    setExamResult(null);
    try {
      sessionStorage.removeItem('QUIZIZZ_ACTIVE_EXAM');
      sessionStorage.removeItem('QUIZIZZ_EXAM_RESULT');
    } catch (e) {}
    navigate('/login');
  };

  const handleAddExam = async (newExam) => {
    setExams([newExam, ...exams]);
    // Đồng bộ đề thi mới (hoặc bản sao chép) vào CSDL Neon Cloud
    await createExamApi({
      id: newExam.id,
      title: newExam.title,
      description: newExam.description || newExam.className || '',
      subject: newExam.subject || 'Khoa học',
      difficulty: newExam.level || newExam.difficulty || 'Đại học',
      durationMinutes: newExam.duration || newExam.durationMinutes || 45,
      shuffleQuestions: newExam.shuffleQuestions ?? false,
      shuffleAnswers: newExam.shuffleAnswers ?? false,
      questions: newExam.questions || []
    });
  };

  const handleUpdateExam = async (updatedExam) => {
    const totalQ = Array.isArray(updatedExam.questions) ? updatedExam.questions.length : (updatedExam.totalQuestions || 0);
    const normalized = {
      ...updatedExam,
      totalQuestions: totalQ,
      statusBadge: `${totalQ} Qs`
    };
    setExams(prev => prev.map(e => e.id === updatedExam.id ? normalized : e));

    // Đồng bộ trực tiếp thay đổi câu hỏi của đề thi vào CSDL Neon
    await updateExamApi(updatedExam.id, {
      title: updatedExam.title,
      description: updatedExam.description,
      subject: updatedExam.subject,
      difficulty: updatedExam.level || updatedExam.difficulty,
      durationMinutes: updatedExam.duration || updatedExam.durationMinutes,
      shuffleQuestions: updatedExam.shuffleQuestions ?? false,
      shuffleAnswers: updatedExam.shuffleAnswers ?? false,
      questions: updatedExam.questions
    });

    // Làm mới lại danh sách từ CSDL để đảm bảo tất cả số lượng câu hỏi đều chuẩn xác
    const freshExams = await fetchExams();
    if (freshExams && Array.isArray(freshExams)) {
      setExams(freshExams);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hoạt động này?")) {
      setExams(exams.filter(e => e.id !== examId));
      // Xóa trực tiếp khỏi CSDL Neon
      await deleteExamApi(examId);
    }
  };

  const handleSelectExam = (exam) => {
    setActiveExam(exam);
    navigate(`/exam/${exam.id}`);
  };

  const handleSubmitExam = async (resultData) => {
    const fullExam = resultData.exam || activeExam;
    if (fullExam) {
      setActiveExam(fullExam);
      try {
        sessionStorage.setItem('QUIZIZZ_ACTIVE_EXAM', JSON.stringify(fullExam));
      } catch (e) {}
    }

    const questions = fullExam?.questions || resultData?.questions || [];
    const evaluation = evaluateUserAnswers(questions, resultData.selectedAnswers || {});

    const enrichedResult = {
      ...resultData,
      exam: fullExam,
      questions,
      correctCount: evaluation.correctCount,
      incorrectCount: evaluation.incorrectCount,
      totalQuestions: evaluation.totalQuestions,
      accuracyPercent: evaluation.accuracyPercent,
      maxStreak: evaluation.maxStreak,
      evaluatedQuestions: evaluation.evaluatedQuestions
    };

    setExamResult(enrichedResult);
    try {
      sessionStorage.setItem('QUIZIZZ_EXAM_RESULT', JSON.stringify(enrichedResult));
    } catch (e) {}
    navigate('/result');

    // Tự động đồng bộ và lưu kết quả bài thi lên Neon PostgreSQL
    if (fullExam) {
      await submitExamResult({
        examId: fullExam.id,
        username: currentUser?.name || currentUser?.email || 'Thí sinh',
        score: enrichedResult.score || 0,
        accuracyPercent: enrichedResult.accuracyPercent || 0,
        timeSpentSeconds: enrichedResult.timeSpent || 0,
        answers: enrichedResult.selectedAnswers || {}
      });
    }
  };

  const handleRetry = () => {
    if (activeExam) {
      navigate(`/exam/${activeExam.id}`);
    } else {
      navigate('/exams');
    }
  };

  const handleGoHome = () => {
    setActiveExam(null);
    setExamResult(null);
    try {
      sessionStorage.removeItem('QUIZIZZ_ACTIVE_EXAM');
      sessionStorage.removeItem('QUIZIZZ_EXAM_RESULT');
    } catch (e) {}
    if (currentUser?.role === 'admin') {
      navigate('/manage');
    } else {
      navigate('/exams');
    }
  };

  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        registeredUsers={users}
      />
    );
  }

  const canAccessManagement = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-row antialiased relative">
      {/* CỘT SIDEBAR TRÁI CHO VAI TRÒ ADMIN (Hiện trên máy tính md:flex) */}
      {!isExamRoomPath && !isResultPath && currentUser.role === 'admin' && (
        <aside className="hidden md:flex w-16 bg-white border-r border-slate-200 flex-col items-center py-4 justify-between shrink-0 z-30 select-none">
          <div className="flex flex-col items-center gap-5 w-full">
            {/* Logo Quizizz biểu tượng chữ Q màu hồng */}
            <div 
              onClick={() => navigate('/manage')}
              title="Quizizz - Trang chủ"
              className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-90 mb-1"
            >
              <QuizizzLogo className="w-8 h-8 text-[#d82a7a]" />
            </div>

            {/* Mục duy nhất: Trang chủ (Quản lý đề thi) */}
            <button
              onClick={() => navigate('/manage')}
              className={`flex flex-col items-center gap-1 text-[10px] w-full py-2.5 transition-all cursor-pointer ${
                location.pathname === '/manage'
                  ? 'text-slate-900 font-bold border-l-2 border-[#d82a7a] bg-pink-50/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Trang chủ - Quản lý danh sách đề thi"
            >
              <Home className="w-5 h-5 text-[#d82a7a]" />
              <span className="scale-90 font-bold">Trang chủ</span>
            </button>
          </div>

          {/* Dưới cùng: Avatar Admin & Nút Đăng xuất */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col items-center gap-2">
              <div 
                title={`${currentUser.name} (${currentUser.roleName})`}
                className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold border border-slate-200 cursor-pointer shadow-xs"
              >
                {currentUser.name.charAt(0)}
              </div>

              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* THANH ĐIỀU HƯỚNG DƯỚI ĐÁY CHO DI ĐỘNG (Mobile Bottom Bar) */}
      {!isExamRoomPath && !isResultPath && currentUser.role === 'admin' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-around px-4 shadow-lg select-none">
          <button
            onClick={() => navigate('/manage')}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold cursor-pointer ${
              location.pathname === '/manage' ? 'text-[#d82a7a]' : 'text-slate-500'
            }`}
          >
            <QuizizzLogo className="w-5 h-5 text-[#d82a7a]" />
            <span className="text-[10px]">Trang chủ</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-800 text-xs font-semibold">
            <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <span className="max-w-[120px] truncate">{currentUser.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-0.5 text-xs text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px]">Đăng xuất</span>
          </button>
        </nav>
      )}

      {/* VÙNG NỘI DUNG CHÍNH (MAIN VIEW) DỰA TRÊN ROUTES */}
      <div className="flex-1 flex flex-col min-w-0 bg-white pb-14 md:pb-0">
        <main className="flex-1">
          <Routes>
            {/* Route mặc định / chuyển hướng dựa theo vai trò */}
            <Route 
              path="/" 
              element={<Navigate to={currentUser.role === 'admin' ? '/manage' : '/exams'} replace />} 
            />

            {/* Danh sách đề thi cho sinh viên */}
            <Route 
              path="/exams" 
              element={
                <ExamList 
                  exams={exams} 
                  onSelectExam={handleSelectExam}
                  onOpenTeacherManage={() => navigate('/manage')}
                  onLogout={handleLogout}
                  isLoading={isLoadingExams}
                />
              } 
            />

            {/* Quản lý đề thi của giáo viên / admin */}
            <Route 
              path="/manage" 
              element={
                canAccessManagement ? (
                  <TeacherManage 
                    exams={exams} 
                    onAddExam={handleAddExam} 
                    onDeleteExam={handleDeleteExam}
                    onPlayExam={handleSelectExam}
                    onUpdateExam={handleUpdateExam}
                    isLoading={isLoadingExams}
                  />
                ) : (
                  <Navigate to="/exams" replace />
                )
              } 
            />

            {/* Chi tiết đề thi & danh sách câu hỏi: /manage/exam/:examId */}
            <Route
              path="/manage/exam/:examId"
              element={
                canAccessManagement ? (
                  <ExamDetailRoute
                    onPlayExam={handleSelectExam}
                    onUpdateExam={handleUpdateExam}
                    onAddExam={handleAddExam}
                  />
                ) : (
                  <Navigate to="/exams" replace />
                )
              }
            />

            {/* Chỉnh sửa toàn diện đề thi: /manage/edit/:examId */}
            <Route
              path="/manage/edit/:examId"
              element={
                canAccessManagement ? (
                  <ExamEditRoute
                    onUpdateExam={handleUpdateExam}
                  />
                ) : (
                  <Navigate to="/exams" replace />
                )
              }
            />

            {/* Tạo đề thi mới: /manage/create */}
            <Route
              path="/manage/create"
              element={
                canAccessManagement ? (
                  <ExamCreateRoute
                    onAddExam={handleAddExam}
                  />
                ) : (
                  <Navigate to="/exams" replace />
                )
              }
            />

            {/* Phòng làm bài thi theo ID: /exam/:examId */}
            <Route 
              path="/exam/:examId" 
              element={
                <ExamRoomRoute 
                  onSubmitExam={handleSubmitExam}
                  onBack={handleGoHome}
                  onLoadedExam={(full) => {
                    setActiveExam(full);
                    try {
                      sessionStorage.setItem('QUIZIZZ_ACTIVE_EXAM', JSON.stringify(full));
                    } catch (e) {}
                  }}
                  isOpeningExam={isOpeningExam}
                />
              } 
            />

            {/* Trang xem kết quả bài thi */}
            <Route 
              path="/result" 
              element={
                (activeExam || examResult?.exam) && examResult ? (
                  <ExamResult 
                    exam={activeExam || examResult.exam} 
                    result={examResult} 
                    onRetry={handleRetry} 
                    onGoHome={handleGoHome} 
                  />
                ) : (
                  <Navigate to="/exams" replace />
                )
              } 
            />

            {/* Fallback bắt mọi URL không tồn tại quay lại trang chủ */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>

      {/* Nút dấu chấm hỏi tím ở góc dưới cùng bên phải chuẩn Quizizz */}
      {!isExamRoomPath && (
        <button 
          onClick={() => alert("Trung tâm trợ giúp & Hướng dẫn sử dụng Quizizz")}
          className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-[#8c1d76] hover:bg-[#721560] text-white flex items-center justify-center font-bold text-sm shadow-lg z-50 transition-transform hover:scale-105"
        >
          ?
        </button>
      )}

      {/* Overlay hiệu ứng đang tải đề thi khi click vào phòng thi */}
      {isOpeningExam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#d82a7a] animate-spin mb-3"></div>
          <p className="text-sm font-bold tracking-wide">Đang tải đề thi...</p>
          <p className="text-xs text-white/70 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      )}
    </div>
  );
}
