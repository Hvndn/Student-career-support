import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import '../../assets/css/common/JobList.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    
    // User profile state
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);
        if (savedUser?.role === 'ROLE_STUDENT') {
            studentApi.getProfile()
                .then(res => setProfile(res.data.data))
                .catch(console.error);
        }

        jobApi.getJobs()
            .then(res => {
                setJobs(res.data.data);
                setFiltered(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        const loc = locationSearch.toLowerCase();
        setFiltered(
            jobs.filter(j =>
                (j.title?.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q)) &&
                j.location?.toLowerCase().includes(loc)
            )
        );
    }, [search, locationSearch, jobs]);

    const displayAvatar = profile?.avatarUrl || user?.avatar || "https://vectorified.com/images/default-avatar-icon-33.png";

    return (
        <div className="job-list-page">
            <main className="container py-8">
                {/* Header */}
                <div className="job-list-header">
                    <nav aria-label="Breadcrumb" className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="active">Tìm kiếm việc làm</span>
                    </nav>
                    <div className="header-content">
                        <div>
                            <h1>Việc làm dành cho Sinh viên</h1>
                            <p>Khám phá hơn {Math.max(1200, jobs.length)}+ cơ hội thực tập và việc làm part-time/full-time mới nhất.</p>
                        </div>
                        <div className="sort-filters">
                            <button className="sort-btn active">Mới nhất</button>
                            <button className="sort-btn">Lương cao</button>
                        </div>
                    </div>
                </div>

                <div className="job-list-content">
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="filter-card">
                            <div className="filter-header">
                                <h2>
                                    <span className="material-symbols-outlined">tune</span>
                                    Bộ lọc chi tiết
                                </h2>
                                <button 
                                    className="clear-filter-btn"
                                    onClick={() => { setSearch(''); setLocationSearch(''); }}
                                >
                                    Xoá lọc
                                </button>
                            </div>
                            
                            {/* Industry */}
                            <div className="filter-group">
                                <label className="filter-label">Ngành nghề</label>
                                <select className="filter-select">
                                    <option>Công nghệ thông tin</option>
                                    <option>Marketing / Truyền thông</option>
                                    <option>Thiết kế đồ họa</option>
                                    <option>Kinh doanh / Bán hàng</option>
                                    <option>Nhân sự</option>
                                </select>
                            </div>

                            {/* Salary */}
                            <div className="filter-group">
                                <label className="filter-label">Mức lương (VNĐ)</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Dưới 5 triệu</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input defaultChecked type="checkbox" />
                                        <span>5 - 10 triệu</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Trên 10 triệu</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>Thoả thuận</span>
                                    </label>
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="filter-group">
                                <label className="filter-label">Loại hình</label>
                                <div className="job-type-chips">
                                    <button className="job-type-chip active">Full-time</button>
                                    <button className="job-type-chip">Internship</button>
                                    <button className="job-type-chip">Part-time</button>
                                </div>
                            </div>

                            {/* City */}
                            <div className="filter-group">
                                <label className="filter-label">Thành phố</label>
                                <div className="search-input-wrapper">
                                    <span className="material-symbols-outlined">location_on</span>
                                    <input 
                                        className="search-input" 
                                        placeholder="Hồ Chí Minh, Hà Nội..." 
                                        type="text" 
                                        value={locationSearch}
                                        onChange={e => setLocationSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="filter-group">
                                <label className="filter-label">Kỹ năng yêu cầu</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input defaultChecked type="checkbox" />
                                        <span>English Communication</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>UI/UX Design</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input defaultChecked type="checkbox" />
                                        <span>Critical Thinking</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="promo-card">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>auto_awesome</span>
                            <h3>CV của bạn đã sẵn sàng?</h3>
                            <p>Tối ưu CV bằng AI để tăng 80% tỷ lệ được gọi phỏng vấn.</p>
                            <Link to="/student/profile" className="promo-btn">Tạo CV ngay</Link>
                        </div>
                    </aside>

                    {/* Results Section */}
                    <div className="results-section">
                        {loading ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined spinner" style={{ animation: 'spin 1s linear infinite' }}>refresh</span>
                                <h3>Đang tải...</h3>
                                <p>Vui lòng đợi giây lát.</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-symbols-outlined">search_off</span>
                                <h3>Không tìm thấy việc làm</h3>
                                <p>Rất tiếc, không có công việc nào trùng khớp với bộ lọc của bạn.</p>
                                <button onClick={() => { setSearch(''); setLocationSearch(''); }} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Xoá bộ lọc</button>
                            </div>
                        ) : (
                            filtered.map(job => (
                                <div key={job.id} className="job-card fade-in">
                                    <div className="company-logo-ph">
                                        {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div className="job-info">
                                        <div className="job-header-row">
                                            <div>
                                                <h3 className="job-title">
                                                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                                                </h3>
                                                <p className="company-name">{job.companyName}</p>
                                            </div>
                                            <button className="bookmark-btn">
                                                <span className="material-symbols-outlined">bookmark_add</span>
                                            </button>
                                        </div>
                                        <div className="job-meta">
                                            <div className="meta-item meta-salary">
                                                <span className="material-symbols-outlined">payments</span>
                                                <span>{job.salary || 'Thoả thuận'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="material-symbols-outlined">location_on</span>
                                                <span>{job.location || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="material-symbols-outlined">schedule</span>
                                                <span>Có sẵn</span>
                                            </div>
                                        </div>
                                        <div className="job-tags">
                                            {job.jobType && (
                                                <span className="job-tag">{job.jobType}</span>
                                            )}
                                            {job.level && (
                                                <span className="job-tag">{job.level}</span>
                                            )}
                                        </div>
                                        <div className="job-actions">
                                            <Link to={`/jobs/${job.id}`} className="btn-sm btn-secondary">Chi tiết</Link>
                                            {(!user || user?.role === 'ROLE_STUDENT') && (
                                                (job.isApplied || job.applied) ? (
                                                    <Link to={`/jobs/${job.id}`} className="btn-sm" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface-hover)' }}>Đã ứng tuyển</Link>
                                                ) : (
                                                    <Link to={`/jobs/${job.id}`} className="btn-sm btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }}>Ứng tuyển nhanh</Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Pagination */}
                        {!loading && filtered.length > 0 && (
                            <div className="pagination">
                                <button className="page-btn">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <span className="page-dots">...</span>
                                <button className="page-btn">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobList;
