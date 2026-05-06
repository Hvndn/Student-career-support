import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// components
import LoadingSpinner from './components/common/LoadingSpinner';
import NavbarSelector from './components/common/NavbarSelector';

import ProtectedRoute from './components/common/ProtectedRoute';
import StudentLayout from './components/layout/StudentLayout';

// common pages
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import LoginSuccess from './pages/common/LoginSuccess'
import Register from './pages/common/Register'
import JobDetail from './pages/common/JobDetail'
import JobList from './pages/common/JobList'
import ForgotPassword from './pages/common/ForgotPassword'
import ResetPassword from './pages/common/ResetPassword'
import PublicCvView from './pages/common/PublicCvView'

// student pages
import Dashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import Applications from './pages/student/Applications'
import SavedJobs from './pages/student/SavedJobs'
import Notifications from './pages/student/Notifications'
import Interviews from './pages/student/Interviews'
import CVManagement from './pages/student/CVManagement'
import CVBuilder from './pages/student/CVBuilder'
import CompanyList from './pages/student/CompanyList'
import CompanyDetail from './pages/student/CompanyDetail'

// company pages
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyJobManagement from './pages/company/CompanyJobManagement'
import PostJob from './pages/company/PostJob'
import Applicants from './pages/company/Applicants'
import CompanyCandidates from './pages/company/CompanyCandidates'
import CompanyProfile from './pages/company/CompanyProfile'

import CompanyCandidateNotifications from './pages/company/CompanyCandidateNotifications'
import CompanyBooking from './pages/company/CompanyBooking'


// admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import SkillManagement from './pages/admin/SkillManagement'
import UserManagement from './pages/admin/UserManagement'
import JobApproval from './pages/admin/JobApproval'
import Reports from './pages/admin/Reports'
import AdminPasswordRequests from './pages/admin/AdminPasswordRequests'
import ManageStudent from './pages/admin/ManageStudent'
import ManageCompany from './pages/admin/ManageCompany'
import ManageAppointment from './pages/admin/ManageAppointment'
import ManageCVTemplates from './pages/admin/ManageCVTemplates'
import ManageProjects from './pages/admin/ManageProjects'
import ManageProjectStudents from './pages/admin/ManageProjectStudents'
import WebsiteConfig from './pages/admin/WebsiteConfig'
import ManageCategories from './pages/admin/ManageCategories'
import ManageAdminAccounts from './pages/admin/ManageAdminAccounts'

// Thành phần xử lý hiệu ứng load trang khi chuyển route
const RouteChangeHandler = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    const EXCLUDED_PREFIXES = ['/jobs', '/student', '/company', '/admin'];
    const isExcluded = EXCLUDED_PREFIXES.some(prefix =>
      location.pathname === prefix || location.pathname.startsWith(prefix + '/')
    );

    if (!isExcluded) {
      setIsLoading(true);
    }

    const handleStop = () => {
      setIsLoading(false);
    };

    const timeout = setTimeout(handleStop, 800);

    return () => {
      clearTimeout(timeout);
      handleStop();
    };
  }, [location, setIsLoading]);

  return null;
};

// Wrapper để kiểm tra nếu là sinh viên thì bọc trong StudentLayout
const StudentLayoutWrapper = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'ROLE_STUDENT') {
    return <StudentLayout>{children}</StudentLayout>;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const hideOnRoutes = ['/login', '/register', '/login-success', '/forgot-password', '/reset-password'];
  const shouldHide = hideOnRoutes.includes(location.pathname);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{ zIndex: 10001 }}
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
            style: {
              background: '#fff',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: {
              background: '#fff',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
      <RouteChangeHandler setIsLoading={setIsLoading} />
      {isLoading && <LoadingSpinner />}

      <NavbarSelector />

      <Routes>
        {/* Công khai */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cv/view/:appId" element={<PublicCvView />} />

        {/* Nhà tuyển dụng (Landing) */}
        <Route path="/employer" element={<CompanyDashboard />} />

        {/* Bảo vệ cho Sinh viên */}
        <Route path="/student/*" element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <StudentLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="applications" element={<Applications />} />
                <Route path="saved" element={<SavedJobs />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="interviews" element={<Interviews />} />
                <Route path="cv-management" element={<CVManagement />} />
                <Route path="cv-builder/:id" element={<CVBuilder />} />
              </Routes>
            </StudentLayout>
          </ProtectedRoute>
        } />

        {/* Cập nhật các route chung để hỗ trợ Layout Sinh viên nếu đã đăng nhập */}
        <Route path="/jobs" element={<StudentLayoutWrapper><JobList /></StudentLayoutWrapper>} />
        <Route path="/jobs/:id" element={<StudentLayoutWrapper><JobDetail /></StudentLayoutWrapper>} />
        <Route path="/companies" element={<StudentLayoutWrapper><CompanyList /></StudentLayoutWrapper>} />
        <Route path="/companies/:id" element={<StudentLayoutWrapper><CompanyDetail /></StudentLayoutWrapper>} />

        {/* Bảo vệ cho Doanh nghiệp (Dashboard & Management) */}
        <Route path="/company/*" element={
          <ProtectedRoute requiredRole="ROLE_COMPANY">
            <Routes>
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="management" element={<CompanyJobManagement />} />
              <Route path="jobs/create" element={<PostJob />} />
              <Route path="jobs/edit/:id" element={<PostJob />} />
              <Route path="management/jobs/:jobId/applicants" element={<Applicants />} />
              <Route path="management/candidates" element={<CompanyCandidates />} />

              <Route path="candidates/notifications" element={<CompanyCandidateNotifications />} />
              <Route path="booking" element={<CompanyBooking />} />
              <Route path="profile" element={<CompanyProfile />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Bảo vệ cho Admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="cv-templates" element={<ManageCVTemplates />} />
              <Route path="skills" element={<SkillManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="students" element={<ManageStudent />} />
              <Route path="appointments" element={<ManageAppointment />} />
              <Route path="companies" element={<ManageCompany />} />
              <Route path="jobs" element={<JobApproval />} />
              <Route path="password-requests" element={<AdminPasswordRequests />} />
              <Route path="reports" element={<Reports />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="project-students" element={<ManageProjectStudents />} />
              <Route path="website/config" element={<WebsiteConfig />} />
              <Route path="website/categories" element={<ManageCategories />} />
              <Route path="accounts" element={<ManageAdminAccounts />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
