import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';

const CompanyApproval = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingCompanies();
    }, []);

    const loadPendingCompanies = async () => {
        try {
            const res = await adminApi.getPendingCompanies();
            if (res.data.status === 'success') {
                setCompanies(res.data.data || []);
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch pending companies error:', err);
            setLoading(false);
        }
    };

    const handleApprove = async (companyId) => {
        if (!window.confirm('Xác nhận phê duyệt và kích hoạt tài khoản cho doanh nghiệp này?')) return;
        try {
            const res = await adminApi.approveCompany(companyId);
            if (res.data.status === 'success') {
                loadPendingCompanies();
            } else {
                alert(res.data.message || 'Phê duyệt thất bại!');
            }
        } catch (err) {
            console.error('Approve company error:', err);
            alert('Đã có lỗi xảy ra!');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải danh sách chờ phê duyệt...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Duyệt doanh nghiệp" />
                <main className="admin-body">
                    <div className="fade-in">
                        <div className="container">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.8rem', color: '#1e293b' }}>
                                    Phê duyệt <span style={{ color: '#2563eb' }}>Doanh nghiệp</span>
                                </h1>
                                <p style={{ color: '#475569' }}>Danh sách các doanh nghiệp mới đăng ký đang chờ được quản trị viên kích hoạt.</p>
                            </header>

                            <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Doanh nghiệp</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Thông tin liên hệ</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Website</th>
                                            <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center', fontWeight: '700' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map(company => (
                                            <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ 
                                                            width: '50px', 
                                                            height: '50px', 
                                                            borderRadius: '10px', 
                                                            background: '#eff6ff', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            fontSize: '1.2rem',
                                                            color: '#2563eb',
                                                            fontWeight: 'bold',
                                                            border: '1px solid #dbeafe'
                                                        }}>
                                                            {company.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{company.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>{company.industry || 'Lĩnh vực chưa cập nhật'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{company.contactPerson || company.user?.fullName}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>{company.user?.email}</div>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                                        {company.website?.replace('https://', '')?.replace('http://', '') || 'N/A'}
                                                    </a>
                                                </td>
                                                <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                                                        <button 
                                                            onClick={() => handleApprove(company.id)}
                                                            className="btn btn-primary" 
                                                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}
                                                        >
                                                            Phê duyệt ngay
                                                        </button>
                                                        <button 
                                                            className="btn" 
                                                            style={{ background: '#fff1f2', color: '#e11d48', padding: '0.5rem 1.5rem', fontSize: '0.85rem', border: '1px solid #ffe4e6' }}
                                                        >
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {companies.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>🏢</div>
                                        <p style={{ fontSize: '1.1rem' }}>Hiện không có doanh nghiệp nào chờ phê duyệt.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyApproval;
