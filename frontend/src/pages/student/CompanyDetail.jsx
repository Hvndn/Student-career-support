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
                    <span className="material-symbols-outlined cd-notif-icon">notifications</span>
                    <div className="cd-avatar-circle">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                </div>
            </header>

            <div className="cd-container">
                <div className="cd-back-link">
                    <button onClick={() => navigate(-1)} className="cd-btn-back">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Quay lại danh sách
                    </button>
                    
                    <button 
                        className="cd-message-btn" 
                        style={{ float: 'right' }} 
                        onClick={() => navigate(`/student/chat?partnerId=${company.userId || company.id}`)}
                    >
                        <span className="material-symbols-outlined">chat_bubble</span>
                        Nhắn tin với doanh nghiệp
                    </button>
                </div>

                <div className="cd-layout">
                    {/* Left Sidebar */}
                    <aside className="cd-sidebar">
                        <div className="cd-sidebar-card cd-main-info-card">
                            <div className="cd-logo-container">
                                {company.logoUrl ? (
                                    <img src={getImageUrl(company.logoUrl)} alt={company.name} />
                                ) : (
                                    <div className="cd-logo-placeholder">{company.name.charAt(0)}</div>
                                )}
                            </div>
                            <h2 className="cd-sidebar-company-name">{company.name}</h2>
                            <p className="cd-sidebar-industry">{company.industry}</p>
                            
                            <div className="cd-verified-tag">
                                <span className="material-symbols-outlined">verified</span>
                                Đã xác thực
                            </div>

                            <div className="cd-contact-list">
                                <div className="cd-contact-item">
                                    <div className="cd-icon-circle bg-mail">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <span>{company.email || 'nhtruong2025@gmail.com'}</span>
                                </div>
                                <div className="cd-contact-item">
                                    <div className="cd-icon-circle bg-call">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <span>{company.phone || '0906440439'}</span>
                                </div>
                                <div className="cd-contact-item">
                                    <div className="cd-icon-circle bg-web">
                                        <span className="material-symbols-outlined">public</span>
                                        <a href={company.website || "#"} target="_blank" rel="noreferrer">
                                            {company.website || 'https://phuonganh.com'}
                                        </a>
                                    </div>
                                </div>
                                <div className="cd-contact-item">
                                    <div className="cd-icon-circle bg-users">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                    <span>{company.companySize || '100-499'} Nhân viên</span>
                                </div>
                            </div>
                        </div>

                        <div className="cd-sidebar-card cd-activity-card">
                            <div className="cd-card-header-flex">
                                <h3>Hoạt động công ty</h3>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#94a3b8' }}>image</span>
                            </div>
                            <div className="cd-gallery">
                                <div className="cd-gallery-item"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c" alt="Activity" /></div>
                                <div className="cd-gallery-item"><img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174" alt="Activity" /></div>
                                <div className="cd-gallery-item"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Activity" /></div>
                                <div className="cd-gallery-item"><img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" alt="Activity" /></div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="cd-main-content">
                        <section className="cd-info-section">
                            <h3 className="cd-section-title">THÔNG TIN DOANH NGHIỆP</h3>
                            
                            <div className="cd-info-grid">
                                <div className="cd-info-group">
                                    <label>TÊN CÔNG TY</label>
                                    <p>{company.name}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>MÃ SỐ THUẾ</label>
                                    <p>{company.taxId || '7084424504'}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>NGÀNH NGHỀ</label>
                                    <p>{company.industry}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>WEBSITE</label>
                                    <p><a href={company.website || "#"} target="_blank" rel="noreferrer" className="cd-link-web">
                                        {company.website || 'https://phuonganhtnhhquynh.com'}
                                    </a></p>
                                </div>
                                <div className="cd-info-group">
                                    <label>HOTLINE / SĐT</label>
                                    <p>{company.phone || '0906440439'}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>NGƯỜI ĐẠI DIỆN</label>
                                    <p>{company.representative || 'Phương anh'}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>EMAIL LIÊN HỆ</label>
                                    <p>{company.email || 'nhtruong2025@gmail.com'}</p>
                                </div>
                                <div className="cd-info-group">
                                    <label>QUY MÔ NHÂN SỰ</label>
                                    <p>{company.companySize || '100-499'}</p>
                                </div>
                            </div>

                            <div className="cd-info-full">
                                <label>ĐỊA CHỈ TRỤ SỞ</label>
                                <p>{company.address || 'Như Quỳnh Center, Xã Như Quỳnh, Hưng Yên'}</p>
                            </div>

                            <div className="cd-introduction">
                                <h4 className="cd-intro-title">GIỚI THIỆU CÔNG TY</h4>
                                <div className="cd-intro-box">
                                    {company.description || "Được thành lập trên cơ sở kết nối ý tưởng kinh doanh và thế mạnh riêng của các thành viên sáng lập, với sự nỗ lực và sáng tạo không ngừng của toàn thể cán bộ nhân viên. Công ty TNHH Phương Anh đã từng bước đi lên từ một doanh nghiệp vừa và nhỏ hoạt động trong lĩnh vực xây dựng nay đã trở thành chủ đầu tư của dự án bất động sản quy mô lên đến hơn 4,2 ha, tổng mức đầu cư gần 1000 tỷ."}
                                </div>
                            </div>
                        </section>

                        <section className="cd-jobs-section">
                            <h3 className="cd-jobs-title">Vị trí đang tuyển dụng ({company.activeJobs?.length || 0})</h3>
                            
                            <div className="cd-jobs-list">
                                {company.activeJobs && company.activeJobs.length > 0 ? (
                                    company.activeJobs.map(job => (
                                        <div key={job.id} className="cd-job-card">
                                            <div className="cd-job-info">
                                                <h4 className="cd-job-title">{job.title}</h4>
                                                <div className="cd-job-meta">
                                                    <span><span className="material-symbols-outlined">payments</span> {job.salary}</span>
                                                    <span><span className="material-symbols-outlined">location_on</span> {job.location}</span>
                                                    <span><span className="material-symbols-outlined">schedule</span> {job.jobType}</span>
                                                </div>
                                            </div>
                                            <Link to={`/jobs/${job.id}`} className="cd-apply-button">Ứng tuyển</Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="cd-job-card" style={{ justifyContent: 'center', color: '#94a3b8' }}>
                                        Hiện tại chưa có vị trí nào đang tuyển dụng.
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
