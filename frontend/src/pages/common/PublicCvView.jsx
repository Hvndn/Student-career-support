import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recruitmentApi, studentApi } from '../../api';
import { getTemplateComponent } from '../../components/student/templates/TemplateRegistry.jsx';
import '../../assets/css/student/CVBuilder.css'; // Reuse CV styles

const PublicCvView = () => {
    const { appId } = useParams();
    const navigate = useNavigate();
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (appId === 'live') {
            studentApi.getProfile()
                .then(res => {
                    if (res.data?.status === 'success' && res.data.data?.cvData) {
                        setCvData(JSON.parse(res.data.data.cvData));
                    } else {
                        setError("Bạn chưa đính kèm bản thiết kế CV nào vào hồ sơ.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError("Không thể tải dữ liệu hồ sơ cá nhân.");
                    setLoading(false);
                });
        } else {
            recruitmentApi.getApplicationDetail(appId)
                .then(res => {
                    if ((res.data?.status === 'success' || res.data?.success) && res.data.data?.cvData) {
                        setCvData(JSON.parse(res.data.data.cvData));
                    } else {
                        setError("Không tìm thấy dữ liệu CV Online cho hồ sơ này.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError("Bạn không có quyền xem hồ sơ này hoặc hồ sơ không tồn tại.");
                    setLoading(false);
                });
        }
    }, [appId]);

    if (loading) return (
        <div className="cvb-loading">
            <div className="cvb-spin"/><p>Đang tải dữ liệu hồ sơ...</p>
        </div>
    );

    if (error || !cvData) return (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#ccc' }}>error</span>
            <h2 style={{ marginTop: '1rem' }}>{error || "Lỗi hiển thị hồ sơ"}</h2>
            <button onClick={() => window.close()} className="pf-btn-dau" style={{ marginTop: '2rem' }}>Đóng trang</button>
        </div>
    );

    const Template = getTemplateComponent(cvData.layoutKey || 'MODERN_1');

    return (
        <div className="cvb-wrap view-only" style={{ background: '#f8fafc', height: '100vh', overflow: 'auto' }}>
            <header className="cvb-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="cvb-header-l">
                    <div style={{ marginLeft: '1rem' }}>
                        <div className="cvb-title">BẢN XEM HỒ SƠ ỨNG VIÊN</div>
                        <div className="cvb-brand">
                            {appId === 'live' ? 'Bản CV đang hiển thị trên hồ sơ của bạn' : 'Snapshot CV tại thời điểm nộp đơn'}
                        </div>
                    </div>
                </div>
                <div className="cvb-header-r">
                    <button className="cvb-hbtn cvb-hbtn-ghost" onClick={() => window.print()}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '5px' }}>print</span>
                        In hồ sơ
                    </button>
                    <button className="cvb-hbtn cvb-hbtn-red" onClick={() => window.close()}>
                        Đóng
                    </button>
                </div>
            </header>

            <div className="cvb-body" style={{ justifyContent: 'center', padding: '40px 0' }}>
                <div className="cvb-canvas" style={{ width: 'auto', background: 'transparent', padding: 0 }}>
                    <div className="cvb-canvas-inner" style={{ transform: 'scale(1)', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <Template
                            profile={cvData}
                            cvData={cvData}
                            isEditMode={false}
                            themeColor={cvData.themeColor || '#0f409f'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicCvView;
