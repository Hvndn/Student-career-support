import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import '../../assets/css/CompanyJobManagement.css';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { Link } from 'react-router-dom';
import { companyApi } from '../../api';
import PostJobModal from '../../components/company/PostJobModal';

const CompanyJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'Tất cả trạng thái',
    type: 'Tất cả loại tin',
    region: 'Tất cả khu vực'
  });
  const JOBS_PER_PAGE = 5;

  const REGIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Bắc Ninh', 'Long An'];
  const JOB_TYPES = [
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'intern', label: 'Thực tập' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'freelance', label: 'Hợp đồng' }
  ];

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

  const handlePublish = async (jobId) => {
    try {
      setPublishingId(jobId);
      const detailsRes = await companyApi.getJobDetailsForEdit(jobId);
      if (detailsRes.data.status === 'success') {
        const fullJob = detailsRes.data.data;
        const now = new Date();
        // Cập nhật status và postedAt (giờ thực tế)
        await companyApi.updateJob(jobId, {
          ...fullJob,
          status: 'pending',
          postedAt: now.toISOString()
        });
        showToast('Tin đăng đã được gửi duyệt thành công!', 'success');
        await fetchJobs();
      }
    } catch (err) {
      console.error('Publish error:', err);
      showToast('Không thể xuất bản tin. Vui lòng thử lại sau.', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  const handleDuplicate = async (jobId) => {
    try {
      setLoading(true);
      await companyApi.duplicateJob(jobId);
      showToast('Đã sao chép tin tuyển dụng thành công!', 'success');
      await fetchJobs();
    } catch (err) {
      console.error('Duplicate error:', err);
      showToast('Không thể sao chép tin tuyển dụng.', 'error');
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

  const handleExtend = async (jobId) => {
    try {
      setLoading(true);
      const detailsRes = await companyApi.getJobDetailsForEdit(jobId);
      if (detailsRes.data.status === 'success') {
        const fullJob = detailsRes.data.data;
        
        // Extend deadline by 30 days from today or from current deadline if it's in the future
        const now = new Date();
        const currentDeadline = fullJob.deadline ? new Date(fullJob.deadline) : now;
        const baseDate = currentDeadline > now ? currentDeadline : now;
        
        const newDeadline = new Date(baseDate);
        newDeadline.setDate(newDeadline.getDate() + 30);
        
        await companyApi.updateJob(jobId, {
          ...fullJob,
          deadline: newDeadline.toISOString().split('T')[0]
        });
        
        showToast('Đã gia hạn tin tuyển dụng thêm 30 ngày!', 'success');
        await fetchJobs();
      }
    } catch (err) {
      console.error('Extend error:', err);
      showToast('Không thể gia hạn tin tuyển dụng.', 'error');
      setLoading(false);
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return <span className="status-badge active">Đang hiển thị</span>;
      case 'draft': return <span className="status-badge draft">Bản nháp</span>;
      case 'closed': return <span className="status-badge closed">Đã đóng</span>;
      default: return <span className="status-badge">{status}</span>;
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

  const formatFullDateTime = (dateValue) => {
    if (!dateValue) return 'Chưa cập nhật';
    
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return dateValue;
    
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateTimeVertical = (dateValue) => {
    if (!dateValue) return <div className="vertical-date"><div className="date-day">Chưa cập nhật</div></div>;
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return <div className="vertical-date"><div className="date-day">{dateValue}</div></div>;
    
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = d.toLocaleDateString('vi-VN');
    
    return (
      <div className="vertical-date">
        <div className="date-time">{time}</div>
        <div className="date-day">{date}</div>
      </div>
    );
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

  const handleToggleStatus = async (jobId, currentChecked) => {
    try {
      const newStatus = currentChecked ? 'closed' : 'open';
      const detailsRes = await companyApi.getJobDetailsForEdit(jobId);
      if (detailsRes.data.status === 'success') {
        const fullJob = detailsRes.data.data;
        const now = new Date();
        await companyApi.updateJob(jobId, {
          ...fullJob,
          status: newStatus,
          postedAt: now.toISOString() // Cập nhật giờ thực tế khi thao tác
        });
        showToast(`Đã ${newStatus === 'open' ? 'hiển thị' : 'ẩn'} tin đăng thành công!`, 'success');
        await fetchJobs();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Không thể thay đổi trạng thái hiển thị.', 'error');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const statusInfo = getJobStatusInfo(job);
    
    // Tìm kiếm theo tên
    const matchesSearch = job.title?.toLowerCase().includes(filters.search.toLowerCase()) || 
                          job.id?.toString().includes(filters.search);
    
    // Lọc theo trạng thái
    const matchesStatus = filters.status === 'Tất cả trạng thái' || statusInfo.label === filters.status;
    
    // Lọc theo loại tin
    const matchesType = filters.type === 'Tất cả loại tin' || job.jobType === filters.type;
    
    // Lọc theo khu vực
    const matchesRegion = filters.region === 'Tất cả khu vực' || job.region === filters.region;
    
    return matchesSearch && matchesStatus && matchesType && matchesRegion;
  });

  const handleExport = () => {
    if (filteredJobs.length === 0) {
      showToast('Không có dữ liệu để xuất!', 'error');
      return;
    }

    const headers = ['ID', 'Tieu de', 'Trang thai', 'Ngay dang', 'Han chot', 'Ho so nop', 'Luot xem', 'Khu vuc', 'Loai hinh'];
    const rows = filteredJobs.map(job => {
      const statusInfo = getJobStatusInfo(job);
      return [
        job.id,
        `"${job.title}"`,
        statusInfo.label,
        new Date(job.postedAt).toLocaleDateString('vi-VN'),
        formatDate(job.deadline),
        job.applicantsCount || 0,
        job.viewsCount || 0,
        job.region || 'N/A',
        job.jobType || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_tin_dang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống danh sách thành công!', 'success');
  };

  return (
    <div className="cd-layout">
      <CompanySidebar />
      <div className="cd-main">
        <CompanyNavbar />
        <div className="cd-content dau-style">
          <div className="cjm-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Quản lý tuyển dụng</h2>
            <div className="cjm-header intro-y" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <button 
                className="cjm-post-btn-maroon" 
                onClick={() => { setEditingJob(null); setShowPostModal(true); }}
              >
                Đăng tin tuyển dụng
              </button>

              <div className="cjm-search-box">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({...filters, search: e.target.value});
                    setCurrentPage(1);
                  }}
                />
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
              </div>
            </div>

            <div className="cjm-table-container intro-y delay-2">
              <table className="cjm-table-modern">
                <thead>
                  <tr>
                    <th style={{width: '10%'}}>HÌNH ẢNH</th>
                    <th style={{width: '35%'}}>TÊN TIN TUYỂN DỤNG</th>
                    <th style={{width: '15%'}}>NGÀNH NGHỀ</th>
                    <th className="text-center" style={{width: '10%'}}>LƯỢT XEM</th>
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
                            <td className="modern-industry">
                               {job.industry || 'Chưa cập nhật'}
                            </td>
                            <td className="text-center modern-stats">
                              <i className="fa-regular fa-eye"></i> {job.viewsCount || 0}
                            </td>
                            <td className="text-center modern-applicants">
                              <i className="fa-solid fa-user-group"></i> {job.applicantsCount || 0}
                            </td>
                            <td className="text-center modern-status" style={{ color: statusColor }}>
                              <i className="fa-regular fa-circle-check"></i> {statusText}
                            </td>
                            <td className="text-center">
                              <div className="modern-actions">
                                <button className="action-btn edit" onClick={() => handleEdit(job.id)}>
                                  <i className="fa-solid fa-pencil"></i> Sửa
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(job.id)}>
                                  <i className="fa-regular fa-trash-can"></i> Xóa
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

      {/* Post Job Modal */}
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
