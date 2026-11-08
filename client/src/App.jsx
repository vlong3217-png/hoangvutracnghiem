import React, { useState, useEffect } from 'react';
import { fetchExams, fetchExamById, submitExamResult, updateExamApi, deleteExamApi } from './services/api';
import ExamList from './components/ExamList';
import ExamRoom from './components/ExamRoom';
import ExamResult from './components/ExamResult';
import TeacherManage from './components/TeacherManage';
import AdminManage from './components/AdminManage';
import LoginPage from './components/LoginPage';
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

export default function App() {
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
      id: "user-admin",
      name: "Quản trị viên",
      email: "admin@test.com",
      password: "123",
      role: "admin",
      roleName: "Admin"
    }
  ]);
  
  // Lưu trạng thái đăng nhập vào localStorage để khi F5 / load lại trang KHÔNG bị đẩy ra màn hình đăng nhập
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('WAYGROUND_CURRENT_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [exams, setExams] = useState([]);

  // Tải danh sách đề thi thời gian thực từ Neon PostgreSQL Backend
  useEffect(() => {
    async function loadExamsFromDatabase() {
      const dbExams = await fetchExams();
      if (dbExams && dbExams.length > 0) {
        setExams(dbExams);
      }
    }
    loadExamsFromDatabase();
  }, []);

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const savedUser = localStorage.getItem('WAYGROUND_CURRENT_USER');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return u.role === 'admin' ? 'teacher' : 'exams';
      }
      return 'exams';
    } catch {
      return 'exams';
    }
  }); // 'exams' | 'teacher' | 'admin' | 'reports' | 'students'
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'room' | 'result'
  const [activeExam, setActiveExam] = useState(null);
  const [examResult, setExamResult] = useState(null);

  // Lưu thông tin người dùng mỗi khi đăng nhập thành công
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('WAYGROUND_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('WAYGROUND_CURRENT_USER');
    }
  }, [currentUser]);

  // KHI ĐANG THI HOẶC Ở TRANG KẾT QUẢ: NẾU BẤM F5 / LOAD LẠI TRANG
  // -> HIỆN POPUP CẢNH BÁO CỦA TRÌNH DUYỆT "Bạn có muốn rời khỏi trang này không?"
  // -> NẾU RỜI ĐI THÌ TỰ ĐỘNG CHUYỂN VỀ TRANG CHỦ (LIST)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentView === 'room' || currentView === 'result') {
        e.preventDefault();
        e.returnValue = 'Bạn có muốn thoát khỏi phòng thi? Mọi tiến trình bài làm có thể bị gián đoạn.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentView]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Nếu là admin thì vào thẳng màn hình quản lý hoạt động/đề thi
    if (user.role === 'admin') {
      setCurrentTab('teacher');
    } else {
      setCurrentTab('exams');
    }
    setCurrentView('list');
  };

  const handleRegister = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    if (newUser.role === 'admin') {
      setCurrentTab('teacher');
    } else {
      setCurrentTab('exams');
    }
    setCurrentView('list');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveExam(null);
    setExamResult(null);
    setCurrentTab('exams');
    setCurrentView('list');
  };

  const handleAddExam = (newExam) => {
    setExams([newExam, ...exams]);
  };

  const handleUpdateExam = async (updatedExam) => {
    setExams(exams.map(e => e.id === updatedExam.id ? updatedExam : e));
    // Đồng bộ trực tiếp thay đổi câu hỏi của đề thi vào CSDL Neon
    await updateExamApi(updatedExam.id, {
      title: updatedExam.title,
      description: updatedExam.description,
      subject: updatedExam.subject,
      difficulty: updatedExam.level || updatedExam.difficulty,
      durationMinutes: updatedExam.duration || updatedExam.durationMinutes,
      questions: updatedExam.questions
    });
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hoạt động này?")) {
      setExams(exams.filter(e => e.id !== examId));
      // Xóa trực tiếp khỏi CSDL Neon
      await deleteExamApi(examId);
    }
  };

  const handleUpdateUserRole = (userId, newRole) => {
    const roleNameMap = {
      student: 'Sinh viên',
      admin: 'Admin'
    };
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, roleName: roleNameMap[newRole] } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole, roleName: roleNameMap[newRole] }));
    }
  };

  const handleDeleteUser = (userId) => {
    if (users.length <= 1) {
      alert("Không thể xóa tài khoản cuối cùng!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      const remaining = users.filter(u => u.id !== userId);
      setUsers(remaining);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
      }
    }
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleSelectExam = async (exam) => {
    // Nếu exam chưa có questions (chỉ có metadata từ list), lấy đầy đủ từ Backend
    if (!exam.questions || exam.questions.length === 0) {
      const fullExam = await fetchExamById(exam.id);
      if (fullExam && fullExam.questions && fullExam.questions.length > 0) {
        setActiveExam(fullExam);
        setCurrentView('room');
        return;
      }
    }
    setActiveExam(exam);
    setCurrentView('room');
  };

  const handleSubmitExam = async (resultData) => {
    setExamResult(resultData);
    setCurrentView('result');

    // Tự động đồng bộ và lưu kết quả bài thi lên Neon PostgreSQL
    if (activeExam) {
      await submitExamResult({
        examId: activeExam.id,
        username: currentUser?.name || currentUser?.email || 'Thí sinh',
        score: resultData.score || 0,
        accuracyPercent: resultData.accuracyPercent || 0,
        timeSpentSeconds: resultData.timeSpent || 0,
        answers: resultData.selectedAnswers || {}
      });
    }
  };

  const handleRetry = () => {
    setCurrentView('room');
  };

  const handleGoHome = () => {
    setActiveExam(null);
    setExamResult(null);
    setCurrentView('list');
  };

  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onRegister={handleRegister}
        registeredUsers={users}
      />
    );
  }

  const canAccessManagement = currentUser.role === 'admin';
  const canAccessAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-row antialiased relative">
      {/* CỘT SIDEBAR TRÁI CHO VAI TRÒ ADMIN (Hiện khi đăng nhập với vai trò Admin và ở ngoài phòng thi) */}
      {currentView !== 'room' && currentUser.role === 'admin' && (
        <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between shrink-0 z-30 select-none">
          <div className="flex flex-col items-center gap-5 w-full">
            {/* Logo Wordwall biểu tượng 4 cột hồng */}
            <div 
              onClick={() => { setCurrentTab('teacher'); handleGoHome(); }}
              title="Wordwall - Trang chủ"
              className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-90 mb-1"
            >
              <div className="flex items-end gap-1 h-6">
                <div className="w-1.5 bg-[#d82a7a] h-4 rounded-xs" />
                <div className="w-1.5 bg-[#d82a7a] h-6 rounded-xs" />
                <div className="w-1.5 bg-[#d82a7a] h-3.5 rounded-xs" />
                <div className="w-1.5 bg-[#d82a7a] h-5 rounded-xs" />
              </div>
            </div>

            {/* Mục duy nhất: Trang chủ (Gộp Trang chủ + Thư viện làm 1, mở thẳng giao diện danh sách đề thi / hoạt động) */}
            <button
              onClick={() => { setCurrentTab('teacher'); handleGoHome(); }}
              className={`flex flex-col items-center gap-1 text-[10px] w-full py-2.5 transition-all cursor-pointer ${
                currentTab === 'teacher'
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

      {/* VÙNG NỘI DUNG CHÍNH (MAIN VIEW) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1">
          {currentView === 'room' && activeExam && (
            <ExamRoom 
              exam={activeExam} 
              onSubmitExam={handleSubmitExam} 
              onBack={handleGoHome} 
            />
          )}

          {currentView === 'result' && activeExam && examResult && (
            <ExamResult 
              exam={activeExam} 
              result={examResult} 
              onRetry={handleRetry} 
              onGoHome={handleGoHome} 
            />
          )}

          {currentView === 'list' && (
            <>
              {currentTab === 'exams' && (
                <ExamList 
                  exams={exams} 
                  onSelectExam={handleSelectExam}
                  onOpenTeacherManage={() => setCurrentTab('teacher')}
                  onLogout={handleLogout}
                />
              )}

              {currentTab === 'teacher' && canAccessManagement && (
                <TeacherManage 
                  exams={exams} 
                  onAddExam={handleAddExam} 
                  onDeleteExam={handleDeleteExam}
                  onPlayExam={handleSelectExam}
                  onUpdateExam={handleUpdateExam}
                />
              )}

              {currentTab === 'admin' && canAccessAdmin && (
                <AdminManage 
                  users={users} 
                  onUpdateUserRole={handleUpdateUserRole} 
                  onDeleteUser={handleDeleteUser} 
                  onAddUser={handleAddUser} 
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Nút dấu chấm hỏi tím ở góc dưới cùng bên phải chuẩn Wordwall */}
      {currentView !== 'room' && (
        <button 
          onClick={() => alert("Trung tâm trợ giúp & Hướng dẫn sử dụng Wordwall")}
          className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-[#8c1d76] hover:bg-[#721560] text-white flex items-center justify-center font-bold text-sm shadow-lg z-50 transition-transform hover:scale-105"
        >
          ?
        </button>
      )}
    </div>
  );
}
