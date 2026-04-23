import React, { useState, useEffect } from 'react';
import { recruitmentApi, companyApi } from '../../api';
import toast from 'react-hot-toast';
import StudentProfileModal from '../../components/company/StudentProfileModal';
import '../../assets/css/company/SuggestedCandidates.css';

import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import '../../assets/css/company/CompanyDashboard.css'; // Import layout styles

const SuggestedCandidates = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await companyApi.getJobs();
            if (response.data.status === 'success') {
                const openJobs = response.data.data.filter(job => job.status === 'open');
                setJobs(openJobs);
                if (openJobs.length > 0) {
                    setSelectedJobId(openJobs[0].id);
                    fetchRecommendations(openJobs[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Không thể tải danh sách công việc');
        }
    };

    const fetchRecommendations = async (jobId) => {
        if (!jobId) return;
        setIsLoading(true);
        try {
            const response = await recruitmentApi.getRecommendations(jobId);
            if (response.data.status === 'success') {
                setRecommendations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            toast.error('Lỗi khi lấy danh sách ứng viên gợi ý');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJobChange = (e) => {
        const jobId = e.target.value;
        setSelectedJobId(jobId);
        fetchRecommendations(jobId);
    };

    const viewStudentDetail = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const getAvatarUrl = (url, name) => {
        if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        if (url.startsWith('http')) return url;
        // Kiểm tra xem có dấu / ở đầu không
        const path = url.startsWith('/') ? url : `/${url}`;
        return `http://localhost:8080${path}`;
    }

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar activeTab="Gợi ý ứng viên" />
                
                <div className="suggested-candidates-container intro-y">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Gợi ý ứng viên thông minh</h1>
                            <p className="page-subtitle">Tìm kiếm những ứng viên phù hợp nhất với yêu cầu của bạn</p>
                        </div>
                        <div className="job-selector">
                            <label>Chọn tin tuyển dụng:</label>
                            <select value={selectedJobId} onChange={handleJobChange} className="form-select">
                                <option value="">-- Chọn công việc --</option>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Đang phân tích ứng viên phù hợp...</p>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="recommendations-grid">
                            {recommendations.map((candidate, index) => (
                                <div key={candidate.id} className="candidate-card intro-x" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="match-badge" style={{ backgroundColor: getScoreColor(candidate.matchScore) }}>
                                        {Math.round(candidate.matchScore)}% Phù hợp
                                    </div>
                                    <div className="card-content">
                                        <div className="candidate-avatar">
                                            <img 
                                                src={getAvatarUrl(candidate.avatarUrl, candidate.fullName)} 
                                                alt={candidate.fullName} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`;
                                                }}
                                            />
                                        </div>
                                        <h3 className="candidate-name">{candidate.fullName}</h3>
                                        <p className="candidate-major">
                                            <span className="material-symbols-outlined">school</span> {candidate.major}
                                        </p>
                                        <div className="candidate-skills">
                                            {candidate.skills && candidate.skills.slice(0, 3).map((skill, sIdx) => (
                                                <span key={sIdx} className="skill-tag">{skill.name}</span>
                                            ))}
                                            {candidate.skills?.length > 3 && <span className="skill-more">+{candidate.skills.length - 3}</span>}
                                        </div>
                                        <button className="btn-view-detail" onClick={() => viewStudentDetail(candidate)}>
                                            Xem hồ sơ chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedJobId ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>person_search</span>
                            <h3>Chưa tìm thấy ứng viên phù hợp</h3>
                            <p>Hãy thử bổ sung các kỹ năng yêu cầu trong tin tuyển dụng.</p>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>work</span>
                            <h3>Chọn một công việc để xem gợi ý</h3>
                        </div>
                    )}

                    {selectedStudent && (
                        <StudentProfileModal 
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            studentId={selectedStudent.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuggestedCandidates;
