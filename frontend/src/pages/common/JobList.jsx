import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import '../../assets/css/student/JobList.css';

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

    const handleClearFilters = () => {
        setSearch('');
        setLocationSearch('');
    };

    return (
        <div className="job-list-container">
            <main className="job-list-content">
                {/* Sidebar: Filters */}
                <aside className="jobs-sidebar">
                    <div className="filter-card">
                        <div className="filter-header">
                            <h2 className="filter-title">
                                <span className="material-symbols-outlined">tune</span>
                                Bộ lọc
                            </h2>
                            <button className="filter-reset" onClick={handleClearFilters}>Xoá lọc</button>
                        </div>
                        
                        <div className="filter-group">
                            <label className="filter-label">Tìm kiếm</label>
                            <input 
                                className="filter-input" 
                                placeholder="Tên công việc, công ty..." 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Địa điểm</label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '18px', color: 'var(--text-muted)' }}>location_on</span>
                                <input 
                                    className="filter-input" 
                                    style={{ paddingLeft: '38px' }}
                                    placeholder="TP. Hồ Chí Minh, Hà Nội..." 
                                    type="text" 
                                    value={locationSearch}
                                    onChange={e => setLocationSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Ngành nghề</label>
                            <select className="filter-select">
                                <option>Tất cả ngành nghề</option>
                                <option>Công nghệ thông tin</option>
                                <option>Marketing / Truyền thông</option>
                                <option>Thiết kế đồ họa</option>
                                <option>Kinh doanh / Bán hàng</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Mức lương</label>
                            <div className="checkbox-group">
                                {['Dưới 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Thoả thuận'].map(label => (
                                    <label key={label} className="checkbox-item">
                                        <input type="checkbox" />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Loại hình</label>
                            <div className="checkbox-group">
                                {['Full-time', 'Internship', 'Part-time'].map(label => (
                                    <label key={label} className="checkbox-item">
                                        <input type="checkbox" />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Promotion Card */}
                    <div style={{ marginTop: '1.5rem', padding: '1.8rem', background: 'linear-gradient(135deg, #111827, #374151)', borderRadius: '24px', color: '#fff', boxShadow: 'var(--shadow-md)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>auto_awesome</span>
                        <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>CV của bạn ổn chứ?</h4>
                        <p style={{ fontSize: '0.8rem', opacity: '0.8', marginBottom: '1.2rem', lineHeight: '1.5' }}>Ghi điểm ngay với nhà tuyển dụng bằng bộ hồ sơ chuyên nghiệp.</p>
                        <Link to="/student/profile" style={{ display: 'block', textAlign: 'center', background: '#fff', color: '#111827', padding: '0.6rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700' }}>Tối ưu CV ngay</Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="jobs-main">
                    <header className="jobs-header">
                        <div className="breadcrumb">
                            <Link to="/">Trang chủ</Link>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                            <span>Việc làm</span>
                        </div>
                        <div className="jobs-title-row">
                            <div>
                                <h1 className="jobs-title">Việc làm dành cho bạn</h1>
                                <p className="jobs-subtitle">Tìm kiếm hàng nghìn cơ hội nghề nghiệp phù hợp với tài năng của bạn.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', background: 'var(--surface)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <button className="btn" style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'var(--accent)', color: '#fff', borderRadius: '8px' }}>Mới nhất</button>
                                <button className="btn" style={{ padding: '6px 16px', fontSize: '0.8rem', background: 'transparent', color: 'var(--text-muted)', borderRadius: '8px' }}>Lương cao</button>
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <div className="premium-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Đang tìm kiếm những cơ hội tốt nhất...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <span className="material-symbols-outlined empty-icon">search_off</span>
                            <h3 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>Không tìm thấy kết quả</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thử thay đổi từ khóa hoặc xóa bớt bộ lọc bạn nhé.</p>
                            <button className="btn-detail" style={{ marginTop: '1.5rem' }} onClick={handleClearFilters}>Xoá bộ lọc</button>
                        </div>
                    ) : (
                        <div className="jobs-list">
                            {filtered.map(job => (
                                <div key={job.id} className="job-card">
                                    <div className="company-logo-wrapper">
                                        {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div className="job-info">
                                        <div className="job-card-header">
                                            <div>
                                                <h3 className="job-title">{job.title}</h3>
                                                <p className="job-company">{job.companyName}</p>
                                            </div>
                                            <button className="bookmark-btn">
                                                <span className="material-symbols-outlined">bookmark</span>
                                            </button>
                                        </div>
                                        <div className="job-meta">
                                            <div className="meta-item">
                                                <span className="material-symbols-outlined">payments</span>
                                                <span className="salary-text">{job.salary || 'Thoả thuận'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="material-symbols-outlined">location_on</span>
                                                <span>{job.location || 'Địa điểm khác'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="material-symbols-outlined">work</span>
                                                <span>{job.jobType || 'Toàn thời gian'}</span>
                                            </div>
                                        </div>
                                        <div className="job-tags">
                                            {job.level && <span className="job-tag">{job.level}</span>}
                                            {job.industry && <span className="job-tag">{job.industry}</span>}
                                            <span className="job-tag">Cơ hội thực tập</span>
                                        </div>
                                        <div className="job-actions">
                                            <Link to={`/jobs/${job.id}`} className="btn-detail">Xem chi tiết</Link>
                                            <Link to={`/jobs/${job.id}`} className="btn-apply">Ứng tuyển nhanh</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && filtered.length > 0 && (
                        <div className="pagination">
                            <button className="page-btn"><span className="material-symbols-outlined">chevron_left</span></button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <button className="page-btn"><span className="material-symbols-outlined">chevron_right</span></button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobList;
