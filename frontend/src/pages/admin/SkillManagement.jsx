import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';

const SkillManagement = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const res = await adminApi.getSkills();
            setSkills(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSkill) return;
        try {
            await adminApi.addSkill(newSkill);
            setNewSkill('');
            loadSkills();
        } catch (err) {
            alert('Thêm kỹ năng thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa kỹ năng này?')) return;
        try {
            await adminApi.deleteSkill(id);
            loadSkills();
        } catch (err) {
            alert('Xóa thất bại!');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý kỹ năng" />
                <main className="admin-body">
                    <div className="fade-in">
                        <div className="container" style={{ maxWidth: '850px' }}>
                            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.8rem' }}>
                                    Quản lý <span className="gradient-text">Kỹ năng</span>
                                </h1>
                                <p style={{ color: 'var(--text-muted)' }}>Thêm hoặc xóa các kỹ năng trong danh mục hệ thống.</p>
                            </header>
                            
                            <div className="card glass" style={{ marginBottom: '3rem', padding: '1.5rem 2rem' }}>
                                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1.2rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập tên kỹ năng mới (ví dụ: React, Spring Boot...)" 
                                        className="glass" 
                                        style={{ flex: 1, padding: '1rem 1.2rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', fontWeight: '700' }}>
                                        + Thêm mới
                                    </button>
                                </form>
                            </div>

                            <div className="card glass" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.2rem' }}>
                                    {skills.map(skill => (
                                        <div key={skill.id} className="fade-in" style={{ 
                                            padding: '1rem 1.2rem', 
                                            borderRadius: '14px', 
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <span style={{ fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>{skill.name}</span>
                                            <button 
                                                onClick={() => handleDelete(skill.id)} 
                                                style={{ 
                                                    background: 'transparent', 
                                                    color: 'var(--error)', 
                                                    fontSize: '1.4rem', 
                                                    cursor: 'pointer',
                                                    padding: '0 0.5rem',
                                                    opacity: 0.6,
                                                    transition: 'opacity 0.2s'
                                                }}
                                                onMouseOver={(e) => e.target.style.opacity = 1}
                                                onMouseOut={(e) => e.target.style.opacity = 0.6}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {skills.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        Chưa có kỹ năng nào trong hệ thống.
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


export default SkillManagement;
