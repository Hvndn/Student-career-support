import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import LoginSuccess from './pages/common/LoginSuccess'
import Register from './pages/common/Register'
import JobDetail from './pages/common/JobDetail'
import JobList from './pages/common/JobList'
import Profile from './pages/student/Profile'
import Applications from './pages/student/Applications'
import SavedJobs from './pages/student/SavedJobs'
import Notifications from './pages/student/Notifications'
import CompanyDashboard from './pages/company/CompanyDashboard'
import PostJob from './pages/company/PostJob'
import Applicants from './pages/company/Applicants'
import CompanyProfile from './pages/company/CompanyProfile'
import CandidateSearch from './pages/company/CandidateSearch'
import AdminDashboard from './pages/admin/AdminDashboard'
import SkillManagement from './pages/admin/SkillManagement'
import UserManagement from './pages/admin/UserManagement'
import CompanyVerification from './pages/admin/CompanyVerification'
import JobApproval from './pages/admin/JobApproval'
import Reports from './pages/admin/Reports'

const AppContent = () => {
  const location = useLocation();
  const hideOnRoutes = ['/login', '/register', '/login-success'];
  const shouldHide = hideOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/applications" element={<Applications />} />
        <Route path="/student/saved" element={<SavedJobs />} />
        <Route path="/student/notifications" element={<Notifications />} />

        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/jobs/post" element={<PostJob />} />
        <Route path="/company/management/jobs/:jobId/applicants" element={<Applicants />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/candidates/search" element={<CandidateSearch />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/skills" element={<SkillManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/companies" element={<CompanyVerification />} />
        <Route path="/admin/jobs" element={<JobApproval />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
      {!shouldHide && <Footer />}
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
