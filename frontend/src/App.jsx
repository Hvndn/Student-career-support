import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// components
import LoadingSpinner from './components/common/LoadingSpinner';
import NavbarSelector from './components/common/NavbarSelector';

import ProtectedRoute from './components/common/ProtectedRoute';

// common pages
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import LoginSuccess from './pages/common/LoginSuccess'
import Register from './pages/common/Register'
import JobDetail from './pages/common/JobDetail'
import JobList from './pages/common/JobList'
import ForgotPassword from './pages/common/ForgotPassword'
import ResetPassword from './pages/common/ResetPassword'

// student pages
import Dashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import Applications from './pages/student/Applications'
import SavedJobs from './pages/student/SavedJobs'
import Notifications from './pages/student/Notifications'
import Interviews from './pages/student/Interviews'

// company pages
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyJobManagement from './pages/company/CompanyJobManagement'
import PostJobSelection from './pages/company/PostJobSelection'
import PostJob from './pages/company/PostJob'
import PostJobAI from './pages/company/PostJobAI'
import PostJobJD from './pages/company/PostJobJD'
import Applicants from './pages/company/Applicants'
import CompanyCandidates from './pages/company/CompanyCandidates'
import CompanyProfile from './pages/company/CompanyProfile'
import CompanySearchCandidates from './pages/company/CompanySearchCandidates'
import CompanySavedCandidates from './pages/company/CompanySavedCandidates'
import CompanyCandidateTags from './pages/company/CompanyCandidateTags'
import CompanyCandidateNotifications from './pages/company/CompanyCandidateNotifications'
// import EmployerHome from './pages/company/EmployerHome' (Đã đổi tên sang CompanyDashboard)
import EmployerPricing from './pages/company/EmployerPricing'

// admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import SkillManagement from './pages/admin/SkillManagement'
import UserManagement from './pages/admin/UserManagement'
import JobApproval from './pages/admin/JobApproval'
import Reports from './pages/admin/Reports'
import AdminPasswordRequests from './pages/admin/AdminPasswordRequests'

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
        toastOptions={{
          className: 'react-hot-toast',
          duration: 4000,
          success: {
            className: 'react-hot-toast react-hot-toast-success',
          },
          error: {
            className: 'react-hot-toast react-hot-toast-error',
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
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        
        {/* Nhà tuyển dụng (Landing & Pricing) */}
        <Route path="/employer" element={<CompanyDashboard />} />
        <Route path="/employer/pricing" element={<EmployerPricing />} />

        {/* Bảo vệ cho Sinh viên */}
        <Route path="/student/*" element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<SavedJobs />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="interviews" element={<Interviews />} />
            </Routes>
          </ProtectedRoute>
        } />
        
        {/* Bảo vệ cho Doanh nghiệp (Dashboard & Management) */}
        <Route path="/company/*" element={
          <ProtectedRoute requiredRole="ROLE_COMPANY">
            <Routes>
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="management" element={<CompanyJobManagement />} />
              <Route path="jobs/post" element={<PostJobSelection />} />
              <Route path="jobs/create" element={<PostJob />} />
              <Route path="jobs/edit/:id" element={<PostJob />} />
              <Route path="jobs/create-ai" element={<PostJobAI />} />
              <Route path="jobs/create-jd" element={<PostJobJD />} />
              <Route path="management/jobs/:jobId/applicants" element={<Applicants />} />
              <Route path="management/candidates" element={<CompanyCandidates />} />
              <Route path="candidates/saved" element={<CompanySavedCandidates />} />
              <Route path="candidates/search" element={<CompanySearchCandidates />} />
              <Route path="candidates/tags" element={<CompanyCandidateTags />} />
              <Route path="candidates/notifications" element={<CompanyCandidateNotifications />} />
              <Route path="profile" element={<CompanyProfile />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Bảo vệ cho Admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="skills" element={<SkillManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="jobs" element={<JobApproval />} />
              <Route path="password-requests" element={<AdminPasswordRequests />} />
              <Route path="reports" element={<Reports />} />
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
