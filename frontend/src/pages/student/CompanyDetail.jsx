import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/student/CompanyDetail.css';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await jobApi.getCompanyDetail(id);
                setCompany(response.data.data);
            } catch (error) {
                console.error('Error fetching company detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="cd-loading">Đang tải thông tin doanh nghiệp...</div>;
    if (!company) return <div className="cd-error">Không tìm thấy thông tin doanh nghiệp.</div>;

    return (
        <div className="cd-detail-wrapper">
            <header className="cd-top-header">
                <div className="cd-breadcrumb">
                    <Link to="/student/dashboard" className="cd-breadcrumb-link">DAU Connect</Link>
                    <span className="cd-breadcrumb-sep">›</span>
                    <span className="cd-breadcrumb-current">Danh sách công ty</span>
                </div>
                
                <div className="cd-header-actions">
                    <button onClick={() => navigate(-1)} className="cd-btn-back-header">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Quay lại
                    </button>
                    <button 
                        className="cd-message-btn-header" 
                        onClick={() => navigate(`/student/chat?partnerId=${company.userId || company.id}`)}
                    >
                        <span className="material-symbols-outlined">chat_bubble</span>
                        Nhắn tin
                    </button>
                    <div className="cd-avatar-circle">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                </div>
            </header>

            {/* ── BANNER HERO ── */}
            <div className="cd-banner-hero">
                {company.bannerUrl ? (
                    <img src={getImageUrl(company.bannerUrl)} alt="Banner" className="cd-banner-img" />
                ) : (
                    <div className="cd-banner-placeholder"></div>
                )}
                <div className="cd-banner-overlay"></div>
                <div className="cd-banner-content">
                    <div className="cd-banner-logo-box">
                        {company.logoUrl ? (
                            <img src={getImageUrl(company.logoUrl)} alt={company.name} />
                        ) : (
                            <div className="cd-logo-placeholder">{company.name.charAt(0)}</div>
                        )}
                    </div>
                    <div className="cd-banner-info">
                        <h1 className="cd-banner-title">{company.name}</h1>
                        <div className="cd-banner-meta">
                            <span><span className="material-symbols-outlined">business</span> {company.industry}</span>
                            <span><span className="material-symbols-outlined">location_on</span> {company.address}</span>
                            <span><span className="material-symbols-outlined">public</span> {company.website || 'Chưa có website'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cd-container-full">
                <div className="cd-layout-premium">
                    {/* Left Side: Main Info (The "Form") */}
                    <main className="cd-main-content-left">
                        <section className="cd-section-premium">
                            <h3 className="cd-section-title-premium">THÔNG TIN CHI TIẾT</h3>
                            
                            <div className="cd-info-grid-premium">
                                <div className="cd-info-group-premium">
                                    <label>TÊN CÔNG TY</label>
                                    <p>{company.name}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>MÃ SỐ THUẾ</label>
                                    <p>{company.taxId || 'Đang cập nhật'}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>NGÀNH NGHỀ</label>
                                    <p>{company.industry}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>WEBSITE</label>
                                    <p>
                                        <a href={company.website || "#"} target="_blank" rel="noreferrer" className="cd-link-web-premium">
                                            {company.website || 'Đang cập nhật'}
                                        </a>
                                    </p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>HOTLINE / SĐT</label>
                                    <p>{company.phone || 'Đang cập nhật'}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>NGƯỜI ĐẠI DIỆN</label>
                                    <p>{company.representative || 'Đang cập nhật'}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>EMAIL LIÊN HỆ</label>
                                    <p>{company.email || 'Đang cập nhật'}</p>
                                </div>
                                <div className="cd-info-group-premium">
                                    <label>QUY MÔ NHÂN SỰ</label>
                                    <p>{company.companySize || 'Đang cập nhật'} nhân viên</p>
                                </div>
                            </div>

                            <div className="cd-info-full-premium">
                                <label>ĐỊA CHỈ TRỤ SỞ</label>
                                <p>{company.address || 'Đang cập nhật'}</p>
                            </div>

                            <div className="cd-intro-section-premium">
                                <h4 className="cd-intro-title-premium">GIỚI THIỆU DOANH NGHIỆP</h4>
                                <div className="cd-intro-content-premium">
                                    {company.description || "Doanh nghiệp chưa cập nhật thông tin giới thiệu cụ thể."}
                                </div>
                            </div>
                        </section>

                        <section className="cd-section-premium">
                            <h3 className="cd-section-title-premium">VỊ TRÍ ĐANG TUYỂN DỤNG ({company.activeJobs?.length || 0})</h3>
                            
                            <div className="cd-jobs-list-premium">
                                {company.activeJobs && company.activeJobs.length > 0 ? (
                                    company.activeJobs.map(job => (
                                        <div key={job.id} className="cd-job-card-premium">
                                            <div className="cd-job-info-premium">
                                                <h4 className="cd-job-title-premium">{job.title}</h4>
                                                <div className="cd-job-meta-premium">
                                                    <span><span className="material-symbols-outlined">payments</span> {job.salary}</span>
                                                    <span><span className="material-symbols-outlined">location_on</span> {job.location}</span>
                                                    <span><span className="material-symbols-outlined">schedule</span> {job.jobType}</span>
                                                </div>
                                            </div>
                                            <Link to={`/jobs/${job.id}`} className="cd-btn-view-job">Chi tiết</Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="cd-empty-jobs">
                                        Hiện tại doanh nghiệp chưa có vị trí nào đang tuyển dụng.
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>

                    {/* Right Side: Sidebar Widgets */}
                    <aside className="cd-sidebar-right">
                        <div className="cd-widget-premium">
                            <h3 className="cd-widget-title-premium">Hoạt động công ty</h3>
                            <div className="cd-gallery-premium">
                                {company.activityImages && company.activityImages.length > 0 ? (
                                    company.activityImages.map((img, idx) => (
                                        <div key={idx} className="cd-gallery-item-premium">
                                            <img src={getImageUrl(img.imageUrl)} alt={`Activity ${idx}`} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="cd-gallery-placeholder-premium">
                                        <div className="cd-gallery-item-premium"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c" alt="Default" /></div>
                                        <div className="cd-gallery-item-premium"><img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174" alt="Default" /></div>
                                        <div className="cd-gallery-item-premium"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Default" /></div>
                                        <div className="cd-gallery-item-premium"><img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" alt="Default" /></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="cd-widget-premium">
                            <h3 className="cd-widget-title-premium">Thông tin liên hệ</h3>
                            <div className="cd-contact-widget-premium">
                                <div className="cd-contact-row-premium">
                                    <span className="material-symbols-outlined">mail</span>
                                    <span>{company.email || 'nhtruong2025@gmail.com'}</span>
                                </div>
                                <div className="cd-contact-row-premium">
                                    <span className="material-symbols-outlined">call</span>
                                    <span>{company.phone || '0906440439'}</span>
                                </div>
                                <div className="cd-contact-row-premium">
                                    <span className="material-symbols-outlined">language</span>
                                    <a href={company.website || "#"} target="_blank" rel="noreferrer">Website công ty</a>
                                </div>
                            </div>
                            <button 
                                className="cd-btn-message-full"
                                onClick={() => navigate(`/student/chat?partnerId=${company.userId || company.id}`)}
                            >
                                <span className="material-symbols-outlined">chat</span> Nhắn tin ngay
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
