import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../../assets/css/CompanyJobManagement.css';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import { companyApi } from '../../api';
import PostJobModal from '../../components/company/PostJobModal';

const CompanyJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'Tất cả trạng thái',
    industry: 'Tất cả ngành nghề',
    region: 'Tất cả khu vực'
  });
  const [sortConfig, setSortConfig] = useState({ key: 'postedAt', direction: 'desc' });
  const JOBS_PER_PAGE = 5;

  const REGIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Bắc Ninh', 'Long An'];
  const JOBS_PER_PAGE = 5;

  const showToast = (message, type = 'success') => {
    if (type === 'error') toast.error(message);
    else toast.success(message);
  };

  const toggleDropdown = (e, jobId) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getJobs();
      console.log('Fetched jobs data:', response.data);
      if (response.data.status === 'success') {
        const sortedJobs = response.data.data.sort((a, b) => {
          // Sắp xếp theo thời gian đăng/cập nhật mới nhất (Real-time)
          const dateA = new Date(a.postedAt || 0);
          const dateB = new Date(b.postedAt || 0);
          return dateB - dateA;
        });
        setJobs(sortedJobs);
        
        // Đảm bảo currentPage không vượt quá tổng số trang mới
        const newTotalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
          setCurrentPage(1);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
      if (err.response?.status === 403) {
        setError('Phiên làm việc hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else {
        setError(err.response?.data?.message || 'Không thể tải danh sách tin đăng. Vui lòng kiểm tra kết nối.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này? Thao tác này không thể hoàn tác.')) {
      try {
        setLoading(true);
        await companyApi.deleteJob(jobId);
        showToast('Đã xóa tin tuyển dụng thành công!', 'success');
        await fetchJobs();
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Không thể xóa tin tuyển dụng.', 'error');
        setLoading(false);
      }
    }
  };

  const handleEdit = async (jobId) => {
    try {
      setLoading(true);
      const detailsRes = await companyApi.getJobDetailsForEdit(jobId);
      if (detailsRes.data.status === 'success') {
        setEditingJob(detailsRes.data.data);
        setShowPostModal(true);
      }
    } catch (err) {
      console.error('Edit error:', err);
      showToast('Không thể tải thông tin tin đăng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Không giới hạn';
    
    // Nếu là string từ @JsonFormat (yyyy-MM-dd)
    if (typeof dateValue === 'string') {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return dateValue;
      return d.toLocaleDateString('vi-VN');
    }
    
    // Nếu là mảng [year, month, day] từ Jackson default serialization
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      const [year, month, day] = dateValue;
      return `${day}/${month}/${year}`;
    }
    
    return String(dateValue);
  };

  const getJobStatusInfo = (job) => {
    const status = job.status?.toLowerCase();

    // Kiểm tra hết hạn (ngoại trừ bản nháp)
    if (status !== 'draft' && job.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let deadlineDate;
      if (typeof job.deadline === 'string') {
        deadlineDate = new Date(job.deadline);
      } else if (Array.isArray(job.deadline)) {
        const [y, m, d] = job.deadline;
        deadlineDate = new Date(y, m - 1, d);
      }
      
      if (deadlineDate && deadlineDate < today) {
        return { label: 'Hết hạn', colorClass: 'expired', canToggle: false, checked: false };
      }
    }

    switch (status) {
      case 'draft':
        return { label: 'Chưa đăng', colorClass: 'draft', canToggle: false, checked: false };
      case 'pending':
        return { label: 'Chờ duyệt', colorClass: 'pending', canToggle: false, checked: false };
      case 'rejected':
      case 'canceled':
        return { label: 'Đã hủy', colorClass: 'rejected', canToggle: false, checked: false };
      case 'open':
      case 'active':
        return { label: 'Đã duyệt', colorClass: 'active', canToggle: true, checked: true };
      case 'closed':
        return { label: 'Đã ẩn', colorClass: 'closed', canToggle: true, checked: false };
      default:
        return { label: 'Không xác định', colorClass: 'unknown', canToggle: false, checked: false };
    }
  };

  const filteredJobs = jobs.filter(job => {
    const statusInfo = getJobStatusInfo(job);
    
    // Tìm kiếm theo tên
    const matchesSearch = job.title?.toLowerCase().includes(filters.search.toLowerCase()) || 
                          job.id?.toString().includes(filters.search);
    
    // Lọc theo trạng thái
    const matchesStatus = filters.status === 'Tất cả trạng thái' || statusInfo.label === filters.status;
    
    // Lọc theo ngành nghề
    const matchesIndustry = filters.industry === 'Tất cả ngành nghề' || job.industry === filters.industry;
    
    // Lọc theo khu vực
    const matchesRegion = filters.region === 'Tất cả khu vực' || job.region === filters.region;
    
    return matchesSearch && matchesStatus && matchesIndustry && matchesRegion;
  }).sort((a, b) => {
    const { key, direction } = sortConfig;
    let valA = a[key];
    let valB = b[key];

    if (key === 'postedAt') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="cd-layout">
      <CompanySidebar />
      <div className="cd-main">
        <CompanyNavbar />
        <div className="cd-content dau-style">
          <div className="cjm-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Quản lý tuyển dụng</h2>
            <div className="cjm-header intro-y" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="cjm-search-box">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tin tuyển dụng..." 
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({...filters, search: e.target.value});
                    setCurrentPage(1);
                  }}
                />
                <i className="fa-solid fa-magnifying-glass cjm-icon-search"></i>
              </div>

              <button 
                className="cjm-post-btn-blue" 
                onClick={() => { setEditingJob(null); setShowPostModal(true); }}
              >
                <i className="fa-solid fa-plus"></i> Đăng tin tuyển dụng
              </button>
            </div>

            {/* Toolbar Bộ lọc & Sắp xếp */}
            <div className="cjm-toolbar intro-y delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                <select 
                  className="dau-select filter-control"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  style={{ minWidth: '160px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px 12px', color: '#64748b', fontSize: '14px', background: '#fff' }}
                >
                  <option>Tất cả trạng thái</option>
                  <option>Đã duyệt</option>
                  <option>Chờ duyệt</option>
                  <option>Bản nháp</option>
                  <option>Hết hạn</option>
                  <option>Đã ẩn</option>
                </select>

                <select 
                  className="dau-select filter-control"
                  value={filters.region}
                  onChange={(e) => setFilters({...filters, region: e.target.value})}
                  style={{ minWidth: '160px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px 12px', color: '#64748b', fontSize: '14px', background: '#fff' }}
                >
                  <option>Tất cả khu vực</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <button 
                  onClick={() => setFilters({ search: '', status: 'Tất cả trạng thái', industry: 'Tất cả ngành nghề', region: 'Tất cả khu vực' })}
                  style={{ padding: '8px 15px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Làm mới
                </button>
              </div>

              <div className="sort-section" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', height: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 6h18M6 12h12m-9 6h6"></path></svg>
                  <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sắp xếp</span>
                </div>
                <select 
                  className="dau-select filter-control"
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split('-');
                    setSortConfig({ key, direction });
                  }}
                  style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: '500', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="postedAt-desc">Mới nhất</option>
                  <option value="postedAt-asc">Cũ nhất</option>
                  <option value="title-asc">Tiêu đề (A-Z)</option>
                  <option value="applicantsCount-desc">Ứng tuyển (Nhiều nhất)</option>
                </select>
              </div>
            </div>

            <div className="cjm-table-container intro-y delay-2">
              <table className="cjm-table-modern">
                <thead>
                  <tr>
                    <th style={{width: '10%'}}>HÌNH ẢNH</th>
                    <th style={{width: '35%'}}>TÊN TIN TUYỂN DỤNG</th>
                    <th style={{width: '15%'}}>NGÀNH NGHỀ</th>
                    <th className="text-center" style={{width: '10%'}}>NGÀY TẠO</th>
                    <th className="text-center" style={{width: '10%'}}>ỨNG TUYỂN</th>
                    <th className="text-center" style={{width: '10%'}}>TRẠNG THÁI</th>
                    <th className="text-center" style={{width: '10%'}}>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '60px'}}>
                        <div className="loading-spinner-wrapper">
                          <div className="loading-spinner-small"></div>
                          <p style={{marginTop: '10px', color: '#64748b'}}>Đang tải dữ liệu...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '60px'}}>
                        <div className="cjm-error-state">
                          <div className="error-icon" style={{fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
                          <p style={{color: '#e53e3e', fontWeight: '600', marginBottom: '1rem'}}>{error}</p>
                          <button onClick={fetchJobs} className="cjm-retry-btn">Thử lại</button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredJobs.length > 0 ? (
                    (() => {
                      const indexOfLastJob = currentPage * JOBS_PER_PAGE;
                      const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
                      const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
                      
                      return currentJobs.map(job => {
                        let statusText = 'Hoạt động';
                        let statusColor = '#65a30d'; // Green
                        if (job.status?.toLowerCase() === 'draft') { statusText = 'Bản nháp'; statusColor = '#64748b'; }
                        else if (job.status?.toLowerCase() === 'pending') { statusText = 'Chờ duyệt'; statusColor = '#f59e0b'; }
                        else if (job.status?.toLowerCase() === 'rejected') { statusText = 'Từ chối'; statusColor = '#ef4444'; }
                        
                        return (
                          <tr key={job.id} className="modern-row">
                            <td>
                              <div className="modern-avatar">
                                {job.bannerUrl ? (
                                  <img src={`http://localhost:8080${job.bannerUrl}`} alt="Banner" />
                                ) : (
                                  <div className="avatar-placeholder"><i className="fa-solid fa-briefcase"></i></div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="modern-job-title">
                                {job.title}
                              </div>
                              <div className="modern-job-skills">
                                Kỹ năng: {Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || 'Không yêu cầu')}
                              </div>
                            </td>
                            <td data-label="NGÀNH NGHỀ" className="modern-industry">
                               {job.industry || 'Chưa cập nhật'}
                            </td>
                            <td data-label="NGÀY TẠO" className="text-center modern-stats">
                              {formatDate(job.postedAt)}
                            </td>
                            <td data-label="ỨNG TUYỂN" className="text-center modern-stats">
                              <i className="fa-solid fa-user-group"></i> {job.applicantsCount || 0}
                            </td>
                            <td data-label="TRẠNG THÁI" className="text-center modern-status" style={{ color: statusColor }}>
                              <i className="fa-regular fa-circle-check"></i> {statusText}
                            </td>
                            <td data-label="HÀNH ĐỘNG" className="text-center">
                              <div className="modern-actions">
                                <button className="action-btn edit" onClick={() => handleEdit(job.id)} title="Chỉnh sửa">
                                  <i className="fa-solid fa-pencil"></i>
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(job.id)} title="Xóa">
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()
                  ) : (
                    <tr className="empty-row">
                      <td colSpan="7">
                        <div className="cjm-empty-state">
                          <div className="empty-icon-wrapper" style={{marginBottom: '1rem'}}>
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </div>
                          <h3 style={{color: '#1e293b', marginBottom: '0.5rem'}}>Chưa có tin đăng nào</h3>
                          <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Hãy bắt đầu tìm kiếm nhân tài bằng cách đăng tin tuyển dụng đầu tiên của bạn.</p>
                          <button onClick={() => { setEditingJob(null); setShowPostModal(true); }} className="cjm-post-btn-small">
                            + Đăng tin ngay
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredJobs.length > JOBS_PER_PAGE && (
              <div className="cjm-pagination">
                <div className="cjm-pagination-info">
                  Đang hiển thị {Math.min((currentPage - 1) * JOBS_PER_PAGE + 1, filteredJobs.length)} - {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} trong tổng số {filteredJobs.length} tin
                </div>
                <div className="cjm-pagination-controls">
                  <button 
                    className="pagination-btn arrow" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                  {[...Array(Math.ceil(filteredJobs.length / JOBS_PER_PAGE))].map((_, index) => (
                    <button 
                      key={index + 1}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button 
                    className="pagination-btn arrow" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE)))}
                    disabled={currentPage === Math.ceil(filteredJobs.length / JOBS_PER_PAGE)}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}

            <div className="cjm-footer-note">
              ⓘ Để đảm bảo tin đăng hợp lệ, tham khảo <a href="#">Quy định duyệt tin tuyển dụng</a> tại đây
            </div>
          </div>
        </div>
      </div>

      <PostJobModal 
        isOpen={showPostModal} 
        onClose={() => setShowPostModal(false)}
        jobToEdit={editingJob}
        onSuccess={() => {
            setShowPostModal(false);
            setEditingJob(null);
            fetchJobs();
        }}
      />
    </div>
  );
};

export default CompanyJobManagement;
