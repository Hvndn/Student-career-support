import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import '../../assets/css/company/PostJobAI.css';

const INDUSTRIES = ['Công nghệ thông tin', 'Marketing', 'Tài chính', 'Thiết kế', 'Kế toán', 'Giáo dục', 'Y tế'];

const PostJobAI = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    industry: '',
    keywords: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerate = () => {
    if (!form.title || !form.industry) {
      alert("Vui lòng nhập Chức danh và Chọn Ngành nghề để AI có thể gợi ý chính xác nhất.");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedText('');

    // Simulate AI Generation Delay
    setTimeout(() => {
      setGeneratedText(`**Chức danh:** ${form.title}\n**Ngành nghề:** ${form.industry}\n\n**Mô tả công việc:**\n- Chịu trách nhiệm thiết kế, triển khai và bảo trì các hệ thống phần mềm.\n- Viết mã nguồn sạch, có khả năng mở rộng.\n- Phối hợp với đội ngũ để xác định và phát triển các tính năng mới.\n\n**Yêu cầu ứng viên:**\n- Ít nhất 2 năm kinh nghiệm trong lĩnh vực ${form.industry}.\n- Nắm vững kiến thức chuyên môn.\n- Có tinh thần trách nhiệm và khả năng làm việc nhóm tốt.\n- \n\n**Quyền lợi:**\n- Mức lương cạnh tranh, tương xứng với năng lực.\n- Môi trường làm việc trẻ trung, năng động.\n- Đầy đủ các chế độ bảo hiểm theo quy định.\n\n${form.keywords ? `*Lưu ý thêm từ nhà tuyển dụng:* ${form.keywords}` : ''}`);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="pjai-layout">
      <CompanySidebar />

      <div className="pjai-main">
        <CompanyNavbar activeTab="Jobs" />

        <div className="pjai-content-wrapper">
          <header className="pjai-header">
            <p className="pjai-breadcrumb">
              <Link to="/company/management">QUẢN LÝ TIN ĐĂNG</Link>
              <span className="separator">/</span>
              <span className="active-crumb">TẠO TIN VỚI AI</span>
            </p>
          </header>

          <div className="pjai-body">
            {/* Left Column: Input Form */}
            <div className="pjai-col-left">
              <div className="pjai-card">
                <div className="pjai-title-row">
                  <div className="pjai-icon-bg">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2L14.7 8.5L21.2 11.2L14.7 13.9L12 20.4L9.3 13.9L2.8 11.2L9.3 8.5L12 2Z"></path><path d="M19 15L20 17.5L22.5 18.5L20 19.5L19 22L18 19.5L15.5 18.5L18 17.5L19 15Z" opacity="0.5"></path></svg>
                  </div>
                  <div>
                    <h1 className="pjai-title">Tạo tin siêu tốc với trợ lý AI</h1>
                    <p className="pjai-subtitle">Chỉ mất 5 giây để AI của chúng tôi soạn thảo một mô tả công việc hoàn chỉnh và chuyên nghiệp cho bạn.</p>
                  </div>
                </div>

                <div className="pjai-form-group">
                  <label>CHỨC DANH CẦN TUYỂN *</label>
                  <input 
                    type="text" 
                    placeholder="Vd: Nhân viên Marketing, Lập trình viên Front-end..." 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                  />
                </div>

                <div className="pjai-form-group">
                  <label>NGÀNH NGHỀ *</label>
                  <select 
                    value={form.industry}
                    onChange={(e) => setForm({...form, industry: e.target.value})}
                  >
                    <option value="" disabled>Chọn ngành nghề trọng tâm</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>

                <div className="pjai-form-group">
                  <label>YÊU CẦU THÊM (KHÔNG BẮT BUỘC)</label>
                  <textarea 
                    placeholder="Nhập các từ khóa, kỹ năng bắt buộc, mức lương hoặc phúc lợi đặc biệt để AI viết sát với nhu cầu của bạn hơn..."
                    rows="4"
                    value={form.keywords}
                    onChange={(e) => setForm({...form, keywords: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  className={`pjai-btn-generate ${isGenerating ? 'generating' : ''}`}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="pjai-spinner"></div>
                      Đang sáng tạo nội dung...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L14.7 8.5L21.2 11.2L14.7 13.9L12 20.4L9.3 13.9L2.8 11.2L9.3 8.5L12 2Z"></path></svg>
                      Tạo nháp với AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Preview Area */}
            <div className="pjai-col-right">
              <div className="pjai-preview-card">
                <div className="pjai-preview-header">
                  <h3>Kết quả bản nháp (Preview)</h3>
                  {generatedText && (
                    <button className="pjai-btn-outline" onClick={() => navigate('/company/jobs/create')}>
                      Sử dụng và Chỉnh sửa chuyên sâu
                    </button>
                  )}
                </div>
                
                <div className="pjai-preview-content">
                  {!isGenerating && !generatedText && (
                    <div className="pjai-empty-state">
                      <div className="pjai-empty-icon">🤖</div>
                      <h4>Trợ lý AI đang chờ lệnh</h4>
                      <p>Điền thông tin bên trái và nhấn "Tạo nháp với AI" để xem phép thuật xảy ra.</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="pjai-loading-state">
                      <div className="skeleton-line title"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <br/>
                      <div className="skeleton-line title"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                    </div>
                  )}

                  {generatedText && !isGenerating && (
                    <div className="pjai-result-text">
                      {/* Simple Markdown parsing for preview */}
                      {generatedText.split('\n').map((line, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobAI;
