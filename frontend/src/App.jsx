import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/common/Home'

import Login from './pages/common/Login'
import Register from './pages/common/Register'
import JobDetail from './pages/common/JobDetail'
import JobList from './pages/common/JobList'

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
import CompanyProfile from './pages/company/CompanyProfile'
import CandidateSearch from './pages/company/CandidateSearch'
import EmployerHome from './pages/company/EmployerHome'
import EmployerPricing from './pages/company/EmployerPricing'

// admin
import AdminDashboard from './pages/admin/AdminDashboard'
import SkillManagement from './pages/admin/SkillManagement'
import UserManagement from './pages/admin/UserManagement'
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
