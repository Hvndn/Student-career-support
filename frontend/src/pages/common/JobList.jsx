import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
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
                const data = res.data.data || [];
                setJobs(data);
                setFiltered(data);
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
            jobs.filter(j => {
                const matchesSearch = (j.title?.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q));
                const matchesLocation = loc === '' || j.location?.toLowerCase().includes(loc);
                const matchesIndustry = industryFilter === 'all' || j.industry === industryFilter;
                const matchesType = typeFilter === 'all' || j.jobType === typeFilter;
                
                let matchesSalary = true;
                if (salaryFilter !== 'all') {
                    if (salaryFilter === 'low') matchesSalary = j.salary?.includes('triệu') && parseInt(j.salary) < 5;
                    if (salaryFilter === 'mid') matchesSalary = j.salary?.includes('triệu') && parseInt(j.salary) >= 5 && parseInt(j.salary) <= 10;
                    if (salaryFilter === 'high') matchesSalary = j.salary?.includes('triệu') && parseInt(j.salary) > 10;
                }

                return matchesSearch && matchesLocation && matchesIndustry && matchesType && matchesSalary;
            })
        );
    }, [search, locationSearch, industryFilter, typeFilter, salaryFilter, jobs]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isStudent = user?.role === 'ROLE_STUDENT';
    const displayName = profile?.fullName || user?.fullName || 'Sinh viên';

    const renderContent = () => (
        <div className="job-list-container-inner">
            {/* Breadcrumb / Top Bar */}
            <header className="job-list-top-bar">
                <div className="breadcrumb-premium">
                    <span className="breadcrumb-prev">DAU Connect</span>
                    <span className="breadcrumb-sep">›</span>
                    <span className="breadcrumb-current">Tìm việc làm</span>
                </div>
                
                {isStudent && (
                    <div className="header-actions-premium">
                        <button className="notif-btn-premium">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="notif-dot-premium"></span>
                        </button>
                        <div className="user-menu-wrap-premium" ref={menuRef}>
                            <div className="user-avatar-premium" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <img src={profile?.avatarUrl || "https://ui-avatars.com/api/?name=" + displayName} alt="User" />
                            </div>
                            {showUserMenu && (
                                <div className="user-dropdown-premium">
                                    <div className="dropdown-info-premium">
                                        <p className="dropdown-name">{displayName}</p>
                                        <p className="dropdown-role">student</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/student/profile" className="dropdown-item-premium">
                                        <span className="material-symbols-outlined">person</span> Hồ sơ
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item-premium logout">
                                        <span className="material-symbols-outlined">logout</span> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

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
                                <div className="card-top-media">
                                    <div className="media-placeholder">
                                        <span className="material-symbols-outlined">corporate_fare</span>
                                    </div>
                                    <span className="card-type-tag">Thực tập</span>
                                    <button className="card-fav-btn">
                                        <span className="material-symbols-outlined">bookmark_outline</span>
                                    </button>
                                </div>
                                <div className="card-main-body">
                                    <h3 className="job-title-premium">{job.title}</h3>
                                    <div className="company-info-row">
                                        <div className="company-logo-placeholder">
                                            {job.companyName ? job.companyName.charAt(0) : 'C'}
                                        </div>
                                        <span className="company-name-premium">{job.companyName}</span>
                                    </div>
                                    <div className="job-detail-box">
                                        <span className="material-symbols-outlined">payments</span>
                                        <span className="detail-text">{job.salary || '3 - 5 triệu'}</span>
                                    </div>
                                    <div className="job-detail-box">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <span className="detail-text">{job.location || 'Hải Châu, Đà Nẵng'}</span>
                                    </div>
                                </div>
                                <div className="card-footer-premium">
                                    <div className="posted-time">
                                        <span className="material-symbols-outlined">schedule</span> 5/1/2026
                                    </div>
                                    <Link to={`/jobs/${job.id}`} className="apply-btn-premium">
                                        Ứng tuyển <span className="material-symbols-outlined">chevron_right</span>
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
