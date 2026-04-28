import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jobApi, studentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/common/JobDetail.css';
import ApplyModal from '../../components/common/ApplyModal';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Modal State
    const [showApplyModal, setShowApplyModal] = useState(false);

    // AI Analysis State
    const [aiState, setAiState] = useState('idle'); // 'idle', 'loading', 'result'
    const [aiResult, setAiResult] = useState(null);
    
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);

        if (savedUser?.role === 'ROLE_STUDENT') {
            studentApi.getProfile()
                .then(res => setProfile(res.data.data))
                .catch(err => console.error(err));
        }

        jobApi.getJobDetail(id)
            .then(res => {
                setJob(res.data.data);
                if (savedUser?.role === 'ROLE_STUDENT') {
                    studentApi.getMyApplications()
                        .then(appsRes => {
                            const apps = appsRes.data.data || [];
                            const isApplied = apps.some(app => app.jobId === parseInt(id));
                            if (isApplied) {
                                setJob(prev => ({ ...prev, isApplied: true, applied: true }));
                            }
                        })
                        .catch(err => console.error(err))
                        .finally(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleApplyClick = () => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để ứng tuyển!");
            navigate('/login');
            return;
        }
        setShowApplyModal(true);
    };

    const handleApplySuccess = () => {
        setJob(prev => ({ ...prev, isApplied: true, applied: true }));
    };

    const handleAnalyze = async () => {
        setAiState('loading');
        try {
            const res = await studentApi.analyzeAiMatch(id);
            setAiResult(res.data.data);
            setAiState('result');
        } catch (err) {
            console.error(err);
            setAiState('idle');
        }
    };

    const isStudent = user?.role === 'ROLE_STUDENT';

    if (loading) return (
        <div className="job-detail-page flex items-center justify-center" style={{paddingTop: '100px'}}>
             <span className="material-symbols-outlined spinner" style={{fontSize: '3rem', color: '#0f409f', animation: 'spin 1s linear infinite'}}>refresh</span>
        </div>
    );

    if (!job) return (
        <div className="job-detail-page flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>search_off</span>
                <h2 style={{marginTop: '1rem'}}>Không tìm thấy công việc</h2>
            </div>
        </div>
    );

    const renderContent = () => (
        <div className="job-detail-inner">
            {/* ── BANNER HERO ── */}
            <div className="jd-banner-hero">
                {job.bannerUrl ? (
                    <img src={getImageUrl(job.bannerUrl)} alt="Banner" className="jd-banner-img" />
                ) : (
                    <div className="jd-banner-placeholder"></div>
                )}
                <div className="jd-banner-overlay"></div>
                <div className="jd-banner-content">
                    <span className="jd-banner-tag">{job.jobType || 'Thực tập'}</span>
                    <h1 className="jd-banner-title">{job.title}</h1>
                    <div className="jd-banner-meta">
                        <span><span className="material-symbols-outlined">location_on</span> {job.location}</span>
                        <span><span className="material-symbols-outlined">payments</span> {job.salary}</span>
                    </div>
                </div>
            </div>

            <div className="jd-grid">
                {/* Left Column: Job Info */}
                <div className="jd-main-col">
                    <div className="jd-content-card">
                        {/* Quick Stats Grid */}
                        <div className="jd-quick-stats">
                            <div className="jd-stat-item">
                                <span className="material-symbols-outlined">group</span>
                                <div className="jd-stat-info">
                                    <label>Số lượng</label>
                                    <span>{job.quantity || 1} người</span>
                                </div>
                            </div>
                            <div className="jd-stat-item">
                                <span className="material-symbols-outlined">workspace_premium</span>
                                <div className="jd-stat-info">
                                    <label>Cấp bậc</label>
                                    <span>{job.level || 'Sinh viên / Thực tập'}</span>
                                </div>
                            </div>
                            <div className="jd-stat-item">
                                <span className="material-symbols-outlined">history_edu</span>
                                <div className="jd-stat-info">
                                    <label>Kinh nghiệm</label>
                                    <span>{job.experience || 'Không yêu cầu'}</span>
                                </div>
                            </div>
                            <div className="jd-stat-item">
                                <span className="material-symbols-outlined">wc</span>
                                <div className="jd-stat-info">
                                    <label>Giới tính</label>
                                    <span>{job.gender || 'Không yêu cầu'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="jd-divider"></div>

                        {/* Description */}
                        <section className="jd-section">
                            <div className="jd-sec-header">
                                <span className="material-symbols-outlined">description</span>
                                <h3>Mô tả công việc</h3>
                            </div>
                            <div className="jd-sec-content">
                                <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
                            </div>
                        </section>

                         {/* Requirements */}
                        <section className="jd-section">
                            <div className="jd-sec-header">
                                <span className="material-symbols-outlined">verified</span>
                                <h3>Yêu cầu ứng viên</h3>
                            </div>
                            <div className="jd-sec-content">
                                <div style={{ whiteSpace: 'pre-line' }}>{job.requirements || 'Trao đổi trực tiếp khi phỏng vấn'}</div>
                            </div>
                        </section>

                         {/* Benefits */}
                        <section className="jd-section">
                            <div className="jd-sec-header">
                                <span className="material-symbols-outlined">card_giftcard</span>
                                <h3>Quyền lợi được hưởng</h3>
                            </div>
                            <div className="jd-sec-content">
                                <div style={{ whiteSpace: 'pre-line' }}>{job.benefits || 'Chế độ đãi ngộ hấp dẫn'}</div>
                            </div>
                        </section>

                        {/* Activity Gallery */}
                        {job.companyImages && job.companyImages.length > 0 && (
                            <section className="jd-section">
                                <div className="jd-sec-header">
                                    <span className="material-symbols-outlined">photo_library</span>
                                    <h3>Hình ảnh hoạt động</h3>
                                </div>
                                <div className="jd-gallery-grid">
                                    {job.companyImages.map((img, idx) => (
                                        <div key={idx} className="jd-gallery-item">
                                            <img src={getImageUrl(img)} alt={`Activity ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                         {/* Skills */}
                        <section className="jd-section">
                            <div className="jd-sec-header">
                                <span className="material-symbols-outlined">psychology</span>
                                <h3>Kỹ năng & Yêu cầu</h3>
                            </div>
                            <div className="jd-skill-tags">
                                {job.skills && job.skills.length > 0 ? (
                                    job.skills.map((skill, idx) => (
                                        <span key={idx} className="jd-skill-tag">{skill}</span>
                                    ))
                                ) : (
                                    <span className="jd-skill-tag">Chưa có yêu cầu cụ thể</span>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="jd-sidebar-widgets">
                    {/* Company Info */}
                    <div className="jd-widget-card">
                        <div className="jd-widget-title">Thông tin công ty</div>
                        <div className="jd-company-box">
                            <div className="jd-company-logo">
                                {job.imageUrl ? (
                                    <img src={getImageUrl(job.imageUrl)} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    job.companyName ? job.companyName.charAt(0) : 'K'
                                )}
                            </div>
                            <div className="jd-company-name">
                                <h4>{job.companyName}</h4>
                                <Link to={`/company/${job.companyId}`}>Xem hồ sơ chi tiết</Link>
                            </div>
                        </div>
                        <div className="jd-company-info-row">
                            <span className="material-symbols-outlined">groups</span>
                            <span>Quy mô: {job.companySize || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="jd-company-info-row">
                            <span className="material-symbols-outlined">language</span>
                            <span>{job.website || 'Đang cập nhật website'}</span>
                        </div>
                        <div className="jd-company-info-row">
                            <span className="material-symbols-outlined">business_center</span>
                            <span>Lĩnh vực: {job.industry || 'Chưa cập nhật'}</span>
                        </div>
                    </div>

                     {/* Contact Person */}
                    {job.contactEmail && (
                        <div className="jd-widget-card">
                            <div className="jd-widget-title">Thông tin liên hệ</div>
                            <div className="jd-contact-box">
                                <div className="jd-contact-avatar">{job.contactName ? job.contactName.charAt(0) : 'HR'}</div>
                                <div className="jd-contact-info">
                                    <div className="jd-contact-name">{job.contactName || 'Người phụ trách tuyển dụng'}</div>
                                    <div className="jd-contact-role">{job.contactEmail}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Apply Action */}
                    <button 
                        className={`jd-btn-apply-full ${job.isApplied ? '' : 'active'}`}
                        onClick={!job.isApplied ? handleApplyClick : null}
                        disabled={job.isApplied}
                    >
                        {job.isApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                    </button>

                    {/* AI Analysis Card */}
                    <div className="jd-ai-card">
                        <div className="jd-ai-header">
                            <div className="jd-ai-icon-box">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <span className="jd-ai-title">AI DAU Connect - Phân tích hồ sơ</span>
                        </div>

                        {aiState === 'idle' && (
                            <>
                                <p className="jd-ai-intro">Hãy để AI DAU Connect phân tích mức độ phù hợp giữa Portfolio của bạn và yêu cầu của công việc này.</p>
                                <button className="jd-btn-ai" onClick={handleAnalyze}>Phân tích ngay</button>
                            </>
                        )}

                        {aiState === 'loading' && (
                            <>
                                <p className="jd-ai-intro">Hãy để AI DAU Connect phân tích mức độ phù hợp giữa Portfolio của bạn và yêu cầu của công việc này.</p>
                                <button className="jd-btn-ai loading" disabled>
                                    <span className="material-symbols-outlined spinner" style={{animation: 'spin 1s linear infinite'}}>refresh</span>
                                    Đang phân tích...
                                </button>
                            </>
                        )}

                        {aiState === 'result' && aiResult && (
                            <div className="jd-ai-result-view fade-in">
                                <div className="jd-ai-result-header">
                                    <span className="jd-ai-match-label">Độ phù hợp</span>
                                    <span className="jd-ai-percentage">{aiResult.matchPercentage}%</span>
                                </div>
                                <div className="jd-ai-box jd-ai-box-eval">
                                    <div className="jd-ai-box-title red">
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>analytics</span>
                                        Đánh giá khách quan
                                    </div>
                                    <p className="jd-ai-box-text">{aiResult.evaluation}</p>
                                </div>
                                <div className="jd-ai-box jd-ai-box-advice">
                                    <div className="jd-ai-box-title green">
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>tips_and_updates</span>
                                        Lời khuyên từ chuyên gia
                                    </div>
                                    <p className="jd-ai-box-text">{aiResult.advice}</p>
                                </div>
                                <button className="jd-btn-ai-reset" onClick={() => setAiState('idle')}>LÀM MỚI PHÂN TÍCH</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="jd-page-standard">
            {renderContent()}

            {showApplyModal && (
                <ApplyModal 
                    job={job}
                    profile={profile}
                    onClose={() => setShowApplyModal(false)}
                    onApplySuccess={handleApplySuccess}
                />
            )}
        </div>
    );
};

export default JobDetail;
