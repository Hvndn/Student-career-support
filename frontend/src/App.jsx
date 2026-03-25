import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import PostJobSelection from './pages/PostJobSelection'
import PostJobAI from './pages/PostJobAI'
import PostJobJD from './pages/PostJobJD'
import CompanyJobManagement from './pages/CompanyJobManagement'
import Applicants from './pages/Applicants'
import CompanyProfile from './pages/CompanyProfile'
import CandidateSearch from './pages/CandidateSearch'
import EmployerHome from './pages/EmployerHome'
import EmployerPricing from './pages/EmployerPricing'
import AdminDashboard from './pages/AdminDashboard'
import SkillManagement from './pages/SkillManagement'
import UserManagement from './pages/UserManagement'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employer" element={<EmployerHome />} />
        <Route path="/employer/pricing" element={<EmployerPricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/applications" element={<Applications />} />
        <Route path="/student/saved" element={<SavedJobs />} />
        <Route path="/student/notifications" element={<Notifications />} />
        
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/management" element={<CompanyJobManagement />} />
        <Route path="/company/jobs/post" element={<PostJobSelection />} />
        <Route path="/company/jobs/create" element={<PostJob />} />
        <Route path="/company/jobs/edit/:id" element={<PostJob />} />
        <Route path="/company/jobs/create-ai" element={<PostJobAI />} />
        <Route path="/company/jobs/create-jd" element={<PostJobJD />} />
        <Route path="/company/management/jobs/:jobId/applicants" element={<Applicants />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/candidates/search" element={<CandidateSearch />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/skills" element={<SkillManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
      <Footer />
    </Router>
  )
}




export default App
