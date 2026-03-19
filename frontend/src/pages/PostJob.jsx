import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyApi } from '../api';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        salary: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        deadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await companyApi.postJob(formData);
            navigate('/company/dashboard');
        } catch (err) {
            alert('Đăng tin thất bại!');
        }
    };

    return (
        <div className="container" style={{ marginTop: '3rem', maxWidth: '800px' }}>
            <div className="card glass" style={{ padding: '3rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>Đăng tin <span className="gradient-text">Tuyển dụng</span></h1>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Tiêu đề công việc</label>
                            <input 
                                type="text" 
                                className="glass" 
                                style={{ width: '100%', padding: '0.75rem', color: '#000' }}
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Mức lương</label>
                            <input 
                                type="text" 
                                className="glass" 
                                style={{ width: '100%', padding: '0.75rem', color: '#000' }}
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Địa điểm</label>
                            <input 
                                type="text" 
                                className="glass" 
                                style={{ width: '100%', padding: '0.75rem', color: '#000' }}
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Loại hình</label>
                            <select 
                                className="glass" 
                                style={{ width: '100%', padding: '0.75rem', color: '#000', background: 'var(--surface)' }}
                                value={formData.jobType}
                                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Internship</option>
                                <option>Freelance</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Hạn chót ứng tuyển</label>
                        <input 
                            type="date" 
                            className="glass" 
                            style={{ width: '100%', padding: '0.75rem', color: '#000' }}
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Mô tả công việc</label>
                        <textarea 
                            className="glass" 
                            style={{ width: '100%', padding: '0.75rem', color: '#000', minHeight: '200px' }}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/company/dashboard')} className="btn glass" style={{ flex: 1 }}>Hủy</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Đăng tin ngay</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
