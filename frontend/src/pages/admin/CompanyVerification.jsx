import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';
import toast from 'react-hot-toast';

const CompanyVerification = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        fetchPendingCompanies();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const fetchPendingCompanies = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getPendingCompanies();
            setCompanies(res.data.data || []);
        } catch (err) {
            console.error('Lấy danh sách doanh nghiệp thất bại:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminApi.approveCompany(id);
            toast.success('Đã phê duyệt doanh nghiệp thành công!');
            fetchPendingCompanies();
        } catch (err) {
            toast.error('Phê duyệt thất bại. Vui lòng thử lại!');
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Xác minh doanh nghiệp" />
                <main className="admin-body">
                    <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>Xác minh doanh nghiệp</h1>
                        <p style={{ color: '#4b5563', fontSize: '1rem', margin: '0.3rem 0 0' }}>Phê duyệt hồ sơ pháp lý và thông tin doanh nghiệp mới</p>
                    </div>

                    {/* TOP CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                            <div style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Chờ phê duyệt</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#c2410c', lineHeight: 1, marginBottom: '1rem' }}>{companies.length}</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px', gap: '0.3rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                100% yêu cầu
                            </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                            <div style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Trạng thái hệ thống</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0d5cda', lineHeight: 1, marginBottom: '1rem' }}>Ổn định</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px', gap: '0.3rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"></path></svg>
                                Hoạt động
                            </div>
                        </div>
                    </div>

                    {/* MAIN TABLE CONTAINER */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span style={{ color: '#0d5cda', background: '#e0ebff', padding: '0.3rem 0.8rem', borderRadius: '12px', cursor: 'pointer' }}>Tất cả</span>
                                    <span style={{ color: '#6b7280', cursor: 'pointer', padding: '0.3rem 0' }}>Chưa xem</span>
                                </div>
                            </div>
                            <div style={{ color: '#4b5563', fontSize: '0.85rem' }}>
                                Hiển thị <span style={{ fontWeight: 600, color: '#111827' }}>{companies.length}</span> doanh nghiệp chờ duyệt
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Doanh nghiệp</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Email</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Số điện thoại</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Mã số thuế</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Trạng thái</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4', textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.length > 0 ? companies.map(company => (
                                        <tr key={company.id} style={{ borderBottom: '1px solid #eef0f4', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#374151', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                                        {company.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{company.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{company.address}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{company.email}</td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{company.phone}</td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{company.taxCode || 'N/A'}</td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <span style={{ 
                                                    padding: '0.4rem 1rem', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: '#ffedd5',
                                                    color: '#c2410c',
                                                    display: 'inline-block'
                                                }}>
                                                    ● Đang chờ
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        onClick={() => handleApprove(company.id)}
                                                        style={{ 
                                                            background: '#0d5cda', 
                                                            color: '#fff', 
                                                            border: 'none', 
                                                            padding: '0.5rem 1.2rem', 
                                                            borderRadius: '6px', 
                                                            fontWeight: 600, 
                                                            fontSize: '0.85rem', 
                                                            cursor: 'pointer' 
                                                        }}
                                                    >
                                                        Phê duyệt
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                                Không có doanh nghiệp nào chờ phê duyệt
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BOTTOM INFO CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                        <div style={{ background: '#f0f5ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e0ebff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <div style={{ background: '#0d5cda', width: '24px', height: '24px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>i</div>
                                <h4 style={{ color: '#0d5cda', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Quy trình xác minh</h4>
                            </div>
                            <p style={{ color: '#3b82f6', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                Đảm bảo kiểm tra kỹ các tài liệu pháp lý như Giấy phép kinh doanh, MST và đại diện pháp luật trước khi phê duyệt. Thời gian xử lý tiêu chuẩn là 24-48 giờ.
                            </p>
                        </div>

                        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eef0f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ maxWidth: '65%' }}>
                                <h4 style={{ color: '#111827', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Cần hỗ trợ kỹ thuật?</h4>
                                <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                    Gặp sự cố khi xem tài liệu hoặc dữ liệu doanh nghiệp không hiển thị đúng.
                                </p>
                            </div>
                            <button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.8rem 1.2rem', color: '#111827', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                Liên hệ IT Support
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyVerification;
