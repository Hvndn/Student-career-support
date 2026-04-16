import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import { toast } from 'react-hot-toast';
import '../../assets/css/common/JobList.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Burgundy Icon
const burgundyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowSize: [41, 41]
});

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [salaryFilter, setSalaryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // User profile state
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                keyword: search || undefined,
                location: locationSearch || undefined,
                industry: industryFilter !== 'all' ? industryFilter : undefined,
                jobType: typeFilter !== 'all' ? typeFilter : undefined
            };

            // Map salary levels
            if (salaryFilter === 'low') {
                params.maxSalary = 5000000;
            } else if (salaryFilter === 'mid') {
                params.minSalary = 5000000;
                params.maxSalary = 10000000;
            } else if (salaryFilter === 'high') {
                params.minSalary = 10000000;
            }

            const res = await jobApi.getJobs(params);
            const data = res.data.data || [];
            setJobs(data);
            setFiltered(data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            toast.error("Không thể tải danh sách công việc");
        } finally {
            setLoading(false);
        }
    }, [search, locationSearch, industryFilter, typeFilter, salaryFilter]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);
        if (savedUser?.role === 'ROLE_STUDENT') {
            studentApi.getProfile()
                .then(res => setProfile(res.data.data))
                .catch(console.error);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleToggleSave = async (e, jobId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isStudent) {
            toast.error("Vui lòng đăng nhập với quyền sinh viên để lưu công việc");
            return;
        }

        // Optimistic UI update
        setJobs(prevJobs => prevJobs.map(j => 
            j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
        ));
        setFiltered(prevFiltered => prevFiltered.map(j => 
            j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
        ));

        try {
            await studentApi.saveJob(jobId);
            const job = jobs.find(j => j.id === jobId);
            if (job.isSaved) {
                toast.success("Đã bỏ lưu công việc");
            } else {
                toast.success("Đã lưu công việc vào danh sách yêu thích");
            }
        } catch (error) {
            console.error("Save job error:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            // Revert on error
            setJobs(prevJobs => prevJobs.map(j => 
                j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
            ));
            setFiltered(prevFiltered => prevFiltered.map(j => 
                j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
            ));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isStudent = user?.role === 'ROLE_STUDENT';
    const displayName = profile?.fullName || user?.fullName || 'Sinh viên';

    const renderContent = () => (
        <div className="job-list-container-inner">

            {/* Horizontal Filter Bar */}
            <div className="filter-bar-premium">
                <div className="filter-search-wrap">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input 
                        type="text" 
                        className="filter-search-input" 
                        placeholder="Tìm vị trí, công ty, kỹ năng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select className="filter-select-premium" value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)}>
                    <option value="">Địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                </select>

                <select className="filter-select-premium" value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                    <option value="all">Ngành nghề</option>
                    <option value="IT">Công nghệ thông tin</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Thiết kế</option>
                </select>

                <select className="filter-select-premium" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">Thực tập (Internship)</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                </select>

                <select className="filter-select-premium" value={salaryFilter} onChange={(e) => setSalaryFilter(e.target.value)}>
                    <option value="all">Mức lương</option>
                    <option value="low">Dưới 5 triệu</option>
                    <option value="mid">5 - 10 triệu</option>
                    <option value="high">Trên 10 triệu</option>
                </select>

                <div className="view-toggle-premium">
                    <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                        <span className="material-symbols-outlined">list</span> DANH SÁCH
                    </button>
                    <button className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
                        <span className="material-symbols-outlined">map</span> BẢN ĐỒ
                    </button>
                </div>
            </div>

            {/* Results Header */}
            <div className="results-info-premium">
                <div className="results-title-wrap">
                    <h2 className="results-count-title">Kết quả tìm kiếm</h2>
                    <span className="results-badge-premium">{filtered.length}</span>
                </div>
                <p className="results-subtitle-premium">Tìm thấy {filtered.length} cơ hội phù hợp với tiêu chí của bạn</p>
                <div className="results-page-info">Trang 1 / 1</div>
            </div>

            {/* Main Results Area */}
            <div className="job-content-area">
                {loading ? (
                    <div className="loading-state-premium">
                         <span className="material-symbols-outlined spinner">refresh</span>
                         <p>Đang tìm kiếm cơ hội...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state-premium">
                        <span className="material-symbols-outlined">search_off</span>
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Thử điều chỉnh bộ lọc để tìm thấy nhiều cơ hội hơn</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="job-grid-premium">
                        {filtered.map(job => (
                            <div key={job.id} className="job-card-premium fade-in">
                                <div className="card-top-media" style={{ background: '#f1f5f9' }}>
                                    <div className="media-placeholder">
                                        {job.imageUrl ? (
                                            <img src={job.imageUrl} alt={job.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbd5e1' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>apartment</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="card-type-tag" style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px' }}>{job.jobType || 'Thực tập'}</span>
                                    <button 
                                        className="card-fav-btn"
                                        onClick={(e) => handleToggleSave(e, job.id)}
                                        style={{ 
                                            right: '12px', 
                                            top: '12px', 
                                            background: (job.isSaved || job.saved) ? '#f97316' : 'rgba(255, 255, 255, 0.9)', 
                                            color: (job.isSaved || job.saved) ? 'white' : '#64748b', 
                                            borderRadius: '50%', 
                                            width: '40px', 
                                            height: '40px',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                            {job.isSaved ? 'bookmark' : 'bookmark_border'}
                                        </span>
                                    </button>
                                </div>
                                <div className="card-main-body" style={{ padding: '20px' }}>
                                    <h3 className="job-title-premium" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{job.title}</h3>
                                    <div className="company-info-row" style={{ marginBottom: '20px' }}>
                                        <div className="company-logo-placeholder" style={{ background: '#1e293b', color: 'white' }}>
                                            {job.companyName ? job.companyName.charAt(0) : 'C'}
                                        </div>
                                        <span className="company-name-premium" style={{ color: '#64748b' }}>{job.companyName}</span>
                                    </div>
                                    <div className="job-detail-box" style={{ background: '#f8fafc', border: 'none' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: '20px' }}>payments</span>
                                        <span className="detail-text" style={{ fontWeight: '600' }}>{job.salary || '3 - 5 triệu'}</span>
                                    </div>
                                    <div className="job-detail-box" style={{ background: '#f8fafc', border: 'none' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '20px' }}>location_on</span>
                                        <span className="detail-text" style={{ fontWeight: '500' }}>{job.location || 'Hải Châu, Đà Nẵng'}</span>
                                    </div>
                                </div>
                                <div className="card-footer-premium" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                    <div className="posted-time">
                                        <span className="material-symbols-outlined">schedule</span> 5/1/2026
                                    </div>
                                    <Link to={`/jobs/${job.id}`} className="apply-btn-premium" style={{ background: '#8b1538', padding: '8px 20px' }}>
                                        Ứng tuyển <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="job-map-container-premium fade-in">
                        <MapContainer center={[16.067, 108.220]} zoom={13} style={{ height: '600px', width: '100%', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filtered.map(job => {
                                // Default coordinates for Da Nang locations if missing
                                const position = job.latitude && job.longitude ? [job.latitude, job.longitude] : [16.067 + (Math.random() - 0.5) * 0.05, 108.220 + (Math.random() - 0.5) * 0.05];
                                return (
                                    <Marker key={job.id} position={position} icon={burgundyIcon}>
                                        <Popup className="premium-map-popup">
                                            <div className="popup-job-info">
                                                <h4>{job.title}</h4>
                                                <p>{job.companyName}</p>
                                                <Link to={`/jobs/${job.id}`} className="popup-link">Xem chi tiết</Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="job-list-page-standard">
            {renderContent()}
        </div>
    );
};

export default JobList;
