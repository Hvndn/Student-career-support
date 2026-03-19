import React, { useState } from 'react';
import { recruitmentApi } from '../api';

const CandidateSearch = () => {
    const [skill, setSkill] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!skill) return;
        setLoading(true);
        try {
            const res = await recruitmentApi.searchCandidates(skill);
            setCandidates(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Tìm kiếm <span className="gradient-text">Nhân tài</span></h1>
            
            <div className="card glass" style={{ marginBottom: '3rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Nhập kỹ năng bạn đang tìm kiếm (VD: Java, React, SQL...)" 
                        className="glass" 
                        style={{ flex: 1, padding: '1rem', color: 'white' }}
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>Tìm kiếm</button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Đang tìm kiếm ứng viên phù hợp...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {candidates.map(can => (
                        <div key={can.id} className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--surface)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                <div>
                                    <h4 style={{ marginBottom: '0.2rem' }}>{can.fullName}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{can.major}</p>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    Kỹ năng: {can.skills.map(s => <span key={s} style={{ color: 'var(--text)' }}>{s}</span>)}
                                </p>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Xem hồ sơ chi tiết</button>
                        </div>
                    ))}
                    {candidates.length === 0 && !loading && skill && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                            Không tìm thấy ứng viên nào phù hợp với kỹ năng này.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CandidateSearch;
