import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/common/LoadingSpinner';
import NavbarSelector from './components/common/NavbarSelector';
import Home from './pages/common/Home'

import Login from './pages/common/Login'
import Register from './pages/common/Register'
import JobDetail from './pages/common/JobDetail'
import JobList from './pages/common/JobList'
import ProtectedRoute from './components/common/ProtectedRoute';

// student
import Profile from './pages/student/Profile'
import Applications from './pages/student/Applications'
import SavedJobs from './pages/student/SavedJobs'
import Notifications from './pages/student/Notifications'

// company
import CompanyDashboard from './pages/company/CompanyDashboard'
import PostJob from './pages/company/PostJob'
import PostJobSelection from './pages/company/PostJobSelection'
import PostJobAI from './pages/company/PostJobAI'
import PostJobJD from './pages/company/PostJobJD'
import CompanyJobManagement from './pages/company/CompanyJobManagement'
import Applicants from './pages/company/Applicants'
import CompanyCandidates from './pages/company/CompanyCandidates'
import CompanyProfile from './pages/company/CompanyProfile'
import CompanySearchCandidates from './pages/company/CompanySearchCandidates'
import CompanySavedCandidates from './pages/company/CompanySavedCandidates'
import CompanyCandidateTags from './pages/company/CompanyCandidateTags'
import CompanyCandidateNotifications from './pages/company/CompanyCandidateNotifications'
// Removed EmployerHome and EmployerPricing as requested

// admin
import AdminDashboard from './pages/admin/AdminDashboard'
import SkillManagement from './pages/admin/SkillManagement'
import UserManagement from './pages/admin/UserManagement'
import JobManagement from './pages/admin/JobManagement'
import CompanyApproval from './pages/admin/CompanyApproval'
// Thành phần xử lý hiệu ứng load trang khi chuyển route
const RouteChangeHandler = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    // Các bộ route đã có spinner nội bộ hoặc load dữ liệu phức tạp cần giữ spinner cũ
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
    
    // Giả lập tiến trình lâu hơn một chút để tạo cảm giác mượt mà (800ms)
    const timeout = setTimeout(handleStop, 800);

    return () => {
      clearTimeout(timeout);
      handleStop();
    };
  }, [location, setIsLoading]);

  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
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
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Bảo vệ cho Sinh viên */}
        <Route path="/student/*" element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Routes>
              <Route path="profile" element={<Profile />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<SavedJobs />} />
              <Route path="notifications" element={<Notifications />} />
            </Routes>
          </ProtectedRoute>
        } />
        
        {/* Bảo vệ cho Doanh nghiệp */}
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
              <Route path="jobs" element={<JobManagement />} />
              <Route path="companies/pending" element={<CompanyApproval />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}




export default App
