import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import '../../assets/css/PostJobJD.css';

const PostJobJD = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'file'
  const [jdText, setJdText] = useState('');
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = () => {
    if (activeTab === 'text' && !jdText.trim()) {
      alert("Vui lòng dán nội dung JD vào khung văn bản.");
      return;
    }
    if (activeTab === 'file' && !file) {
      alert("Vui lòng tải lên một tệp tin (PDF, DOCX) chứa JD.");
      return;
    }

    setIsExtracting(true);

    // Simulate extraction delay
    setTimeout(() => {
      setIsExtracting(false);
      // Giả lập chuyển hướng sang trang Form với cờ data=jd-extracted (Sau này có thể truyền state qua UseLocation)
      navigate('/company/jobs/create?mode=jd-extracted');
    }, 2500);
  };

  return (
    <div className="pjjd-layout">
      <CompanySidebar />

      <div className="pjjd-main">
        <CompanyTopbar activeTab="Jobs" />

        <div className="pjjd-content-wrapper">
          <header className="pjjd-header">
            <p className="pjjd-breadcrumb">
              <Link to="/company/management">QUẢN LÝ TIN ĐĂNG</Link>
              <span className="separator">/</span>
              <span className="active-crumb">TẠO TỪ TIN CÓ SẴN (JD)</span>
            </p>
          </header>

          <div className="pjjd-body">
            <div className="pjjd-card">
              <div className="pjjd-title-row">
                <div className="pjjd-icon-bg">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <div>
                  <h1 className="pjjd-title">Tạo tin nhanh từ Mô tả công việc (JD)</h1>
                  <p className="pjjd-subtitle">Hệ thống sẽ tự động quét, đọc hiểu và điền thông tin vào phiếu đăng tuyển dựa trên nội dung bạn cung cấp.</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="pjjd-tabs">
                <button 
                  className={`pjjd-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Dán nội dung (Văn bản)
                </button>
                <button 
                  className={`pjjd-tab-btn ${activeTab === 'file' ? 'active' : ''}`}
                  onClick={() => setActiveTab('file')}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  Tải tệp tin lên
                </button>
              </div>

              {/* Tab Content */}
              <div className="pjjd-tab-content">
                {activeTab === 'text' && (
                  <div className="pjjd-text-area-wrapper">
                    <textarea 
                      className="pjjd-textarea"
                      placeholder="Dán toàn bộ nội dung Mô tả công việc (Job Description) của bạn vào đây... Ví dụ: Vị trí cần tuyển, Mức lương, Yêu cầu, Môi trường làm việc... Hệ thống thông minh sẽ lọc thông tin tự động cho bạn."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    ></textarea>
                  </div>
                )}

                {activeTab === 'file' && (
                  <div 
                    className={`pjjd-dropzone ${file ? 'has-file' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {!file ? (
                      <div className="pjjd-dropzone-inner">
                        <div className="drop-icon">
                          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </div>
                        <h3>Kéo thả tệp tin vào đây</h3>
                        <p>Hỗ trợ định dạng: <strong>.pdf, .doc, .docx</strong> (Tối đa: 5MB)</p>
                        
                        <div className="drop-or">- HOẶC -</div>
                        <label className="pjjd-btn-outline-upload">
                          Chọn tệp từ máy tính
                          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        </label>
                      </div>
                    ) : (
                      <div className="pjjd-file-preview">
                        <div className="file-icon">
                          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                        </div>
                        <div className="file-info">
                          <h4>{file.name}</h4>
                          <p>{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button className="remove-file-btn" onClick={() => setFile(null)}>
                          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Area */}
              <div className="pjjd-action-area">
                <button 
                  className={`pjjd-btn-primary ${isExtracting ? 'extracting' : ''}`}
                  onClick={handleExtract}
                  disabled={isExtracting}
                >
                  {isExtracting ? (
                    <>
                      <div className="pjjd-scan-line"></div>
                      <span className="scan-text">Đang phân tích cú pháp dữ liệu...</span>
                    </>
                  ) : (
                    'Phân tích & Trích xuất thông tin'
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobJD;
