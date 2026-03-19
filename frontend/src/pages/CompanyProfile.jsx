import React, { useState, useEffect } from 'react';
import { companyApi } from '../api';

const CompanyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        companyApi.getProfile()
            .then(res => {
                setProfile(res.data.data);
                setFormData(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await companyApi.updateProfile(formData);
            setProfile(formData);
            setIsEditing(false);
            alert('Cập nhật thành công!');
        } catch (err) {
            alert('Cập nhật thất bại!');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;

    return (
        <div className="container" style={{ marginTop: '3rem', maxWidth: '800px' }}>
            <div className="card glass" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h1>Hồ sơ <span className="gradient-text">Doanh nghiệp</span></h1>
                    <button onClick={() => setIsEditing(!isEditing)} className="btn glass" style={{ color: 'var(--primary)' }}>
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '12px', background: 'var(--surface)', margin: '0 auto 1.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {profile.logoUrl ? (
                            <img src={profile.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ fontSize: '4rem', marginTop: '2rem' }}>🏢</div>
                        )}
                    </div>
                    {isEditing && <button className="btn glass" style={{ fontSize: '0.85rem' }}>Thay đổi Logo</button>}
                </div>

                {!isEditing ? (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tên công ty</label>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.3rem' }}>{profile.name}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email liên hệ</label>
                                <p style={{ marginTop: '0.3rem' }}>{profile.email}</p>
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Số điện thoại</label>
                                <p style={{ marginTop: '0.3rem' }}>{profile.phone}</p>
                            </div>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Website</label>
                            <p style={{ marginTop: '0.3rem', color: 'var(--primary)' }}>{profile.website}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Tên doanh nghiệp</label>
                            <input type="text" name="name" className="glass" style={{ width: '100%', padding: '0.75rem', color: '#000' }} value={formData.name} onChange={handleChange} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
                                <input type="email" name="email" className="glass" style={{ width: '100%', padding: '0.75rem', color: '#000' }} value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Số điện thoại</label>
                                <input type="text" name="phone" className="glass" style={{ width: '100%', padding: '0.75rem', color: '#000' }} value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Website</label>
                            <input type="text" name="website" className="glass" style={{ width: '100%', padding: '0.75rem', color: '#000' }} value={formData.website} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Lưu thay đổi</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
