import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JobDetail from './pages/JobDetail'
import JobList from './pages/JobList'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import SavedJobs from './pages/SavedJobs'
import Notifications from './pages/Notifications'
import CompanyDashboard from './pages/CompanyDashboard'
import PostJob from './pages/PostJob'
import Applicants from './pages/Applicants'
import CompanyProfile from './pages/CompanyProfile'
import CandidateSearch from './pages/CandidateSearch'
import AdminDashboard from './pages/AdminDashboard'
import SkillManagement from './pages/SkillManagement'
import UserManagement from './pages/UserManagement'
import CompanyVerification from './pages/CompanyVerification'
import JobApproval from './pages/JobApproval'
import Reports from './pages/Reports'

const AppContent = () => {
  const location = useLocation();
  const hideOnRoutes = ['/login', '/register'];
  const shouldHide = hideOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
