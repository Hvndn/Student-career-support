import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../api';
import './Profile.css';

const BLANK_EDU = { schoolName: '', major: '', startDate: '', endDate: '', description: '' };
const BLANK_EXP = { companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' };

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Form states
    const [editBasic, setEditBasic] = useState(false);
    const [basicForm, setBasicForm] = useState({});

    const [editBio, setEditBio] = useState(false);
    const [bio, setBio] = useState('');

    const [showEduForm, setShowEduForm] = useState(false);
    const [eduForm, setEduForm] = useState(BLANK_EDU);

    const [showExpForm, setShowExpForm] = useState(false);
    const [expForm, setExpForm] = useState(BLANK_EXP);

    const [showSkillForm, setShowSkillForm] = useState(false);
    const [skillId, setSkillId] = useState('');
    const [skillLevel, setSkillLevel] = useState('Intermediate');
    const [allSkills, setAllSkills] = useState([]);

    useEffect(() => {
        studentApi.getProfile()
            .then(res => { setProfile(res.data.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };
    const reload = () => studentApi.getProfile().then(res => setProfile(res.data.data));

    /* ---- Handlers ---- */
    const openBasic = () => {
        setBasicForm({ 
            fullName: profile.fullName || '', 
            major: profile.major || '', 
            university: profile.university || '',
            graduationYear: profile.graduationYear || '', 
            phone: profile.phone || '',
            gpa: profile.gpa || '',
            totalCredits: profile.totalCredits || '',
            earnedCredits: profile.earnedCredits || '',
            classRank: profile.classRank || '',
            academicYear: profile.academicYear || '',
            currentTerm: profile.currentTerm || ''
        });
        setEditBasic(true);
    };

    const saveBasic = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile(basicForm);
            await reload();
            setEditBasic(false);
            flash('✅ Cập nhật thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatarFile', file);
        setSaving(true);
        try {
            await studentApi.updateAvatar(formData);
            await reload();
            flash('✅ Cập nhật ảnh đại diện thành công!');
        } catch { flash('❌ Lỗi khi tải ảnh lên.'); }
        setSaving(false);
    };

    const saveBio = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile({ ...profile, bio });
            await reload();
            setEditBio(false);
            flash('✅ Cập nhật mục tiêu thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    const loadAllSkills = async () => {
        try {
            const res = await studentApi.getSkills();
            setAllSkills(res.data.data);
        } catch { flash('❌ Không thể tải kỹ năng.'); }
    };

    useEffect(() => { if (showSkillForm) loadAllSkills(); }, [showSkillForm]);

    const addSkill = async () => {
        if (!skillId) return flash('⚠️ Chọn kỹ năng');
        setSaving(true);
        try {
            await studentApi.addSkill(skillId, skillLevel);
            await reload();
            setShowSkillForm(false);
            flash('✅ Đã thêm kỹ năng!');
        } catch (err) { flash('❌ Lỗi khi thêm kỹ năng.'); }
        setSaving(false);
    };

    const deleteSkill = async (id) => {
        if (!window.confirm('Xóa kỹ năng này?')) return;
        try {
            await studentApi.deleteSkill(id);
            await reload();
            flash('✅ Đã xóa kỹ năng.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    const saveEdu = async () => {
        if (!eduForm.schoolName) return flash('⚠️ Nhập tên trường');
        setSaving(true);
        try {
            await studentApi.addEducation(eduForm);
            await reload();
            setShowEduForm(false);
            setEduForm(BLANK_EDU);
            flash('✅ Thêm học vấn thành công!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const deleteEdu = async (id) => {
        if (!window.confirm('Xóa học vấn này?')) return;
        await studentApi.deleteEducation(id);
        await reload();
    };

    const saveExp = async () => {
        if (!expForm.companyName) return flash('⚠️ Nhập tên công ty');
        setSaving(true);
        try {
            await studentApi.addExperience(expForm);
            await reload();
            setShowExpForm(false);
            setExpForm(BLANK_EXP);
            flash('✅ Thêm kinh nghiệm thành công!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const deleteExp = async (id) => {
        if (!window.confirm('Xóa kinh nghiệm này?')) return;
        await studentApi.deleteExperience(id);
        await reload();
    };

    if (loading) return <div className="pf-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải hồ sơ...</div>;
    if (!profile) return <div className="pf-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Không tìm thấy hồ sơ!</div>;

    return (
        <div className="pf-layout">
            {/* Toast */}
            {message && (
                <div className={`pf-toast ${message.startsWith('✅') ? 'pf-toast-success' : 'pf-toast-error'}`}>
                    <span className="material-symbols-outlined">{message.startsWith('✅') ? 'check_circle' : 'error'}</span>
                    {message}
                </div>
            )}

            {/* Header */}
            <header className="pf-header">
                <div className="pf-logo-area">
                    <div className="pf-logo-box">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <Link to="/" style={{ textDecoration: 'none' }}><h2 className="pf-logo-text">CareerHub</h2></Link>
                </div>
                <div className="pf-header-right">
                    <button className="pf-icon-btn">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="pf-avatar-tiny" style={{ backgroundImage: `url(${profile.avatarUrl || 'https://vectorified.com/images/default-avatar-icon-33.png'})` }}></div>
                </div>
            </header>

            <main className="pf-container pf-main">
                {/* Profile Header Card */}
                <div className="pf-card pf-profile-header">
                    <div className="pf-profile-info">
                        <div className="pf-avatar-large" onClick={() => document.getElementById('avatarInput').click()} style={{ cursor: 'pointer' }}>
                            <img src={profile.avatarUrl || 'https://vectorified.com/images/default-avatar-icon-33.png'} alt="Avatar" />
                            <input type="file" id="avatarInput" hidden accept="image/*" onChange={handleAvatarChange} />
                        </div>
                        <div className="pf-user-details">
                            <h1>{profile.fullName}</h1>
                            <p className="pf-major">{profile.major || 'Chưa cập nhật chuyên ngành'}</p>
                            <div className="pf-contact-row">
                                <span className="pf-contact-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span> Hà Nội, Việt Nam
                                </span>
                                <span className="pf-contact-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span> {profile.phone || 'Chưa có SĐT'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="pf-actions">
                        <button className="pf-btn pf-btn-outline" onClick={openBasic}>
                            <span className="material-symbols-outlined">edit</span> Chỉnh sửa hồ sơ
                        </button>
                        <button className="pf-btn pf-btn-primary">
                            <span className="material-symbols-outlined">download</span> Tải xuống CV
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="pf-stats-grid">
                    <div className="pf-card pf-stat-card">
                        <p>GPA Tích lũy</p>
                        <div className="pf-stat-value-row">
                            <h3 className="pf-stat-value">{profile.gpa ? `${profile.gpa} / 4.0` : 'Cập nhật...'}</h3>
                            {profile.gpa >= 3.6 ? <span className="pf-stat-badge pf-stat-badge-green">Xuất sắc</span> : null}
                        </div>
                    </div>
                    <div className="pf-card pf-stat-card">
                        <p>Năm học</p>
                        <div className="pf-stat-value-row">
                            <h3 className="pf-stat-value">{profile.academicYear || 'Cập nhật...'}</h3>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{profile.currentTerm || ''}</span>
                        </div>
                    </div>
                    <div className="pf-card pf-stat-card">
                        <p>Tín chỉ hoàn thành</p>
                        <div className="pf-stat-value-row">
                            <h3 className="pf-stat-value">{profile.earnedCredits || 0} / {profile.totalCredits || 0}</h3>
                            <div className="pf-progress-container">
                                <div className="pf-progress-fill" style={{ width: profile.totalCredits ? `${(profile.earnedCredits / profile.totalCredits) * 100}%` : '0%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="pf-card pf-stat-card">
                        <p>Xếp hạng lớp</p>
                        <div className="pf-stat-value-row">
                            <h3 className="pf-stat-value">{profile.classRank || 'Cập nhật...'}</h3>
                            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>trending_up</span>
                        </div>
                    </div>
                </div>

                <div className="pf-main-grid">
                    {/* Left Col */}
                    <div className="pf-col-left">
                        {/* Education */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Quản lý học vấn</h2>
                                <button className="pf-add-btn" onClick={() => setShowEduForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Thêm mới
                                </button>
                            </div>
                            <div className="pf-timeline">
                                {profile.educations?.map(edu => (
                                    <div key={edu.id} className="pf-item" style={{ position: 'relative' }}>
                                        <div className="pf-item-icon">
                                            <span className="material-symbols-outlined">account_balance</span>
                                        </div>
                                        <div className="pf-item-content">
                                            <h4>{edu.schoolName}</h4>
                                            <p>{edu.major}</p>
                                            <p className="pf-date">{edu.startDate} - {edu.endDate || 'Hiện tại'}</p>
                                        </div>
                                        <button onClick={() => deleteEdu(edu.id)} style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                        </button>
                                    </div>
                                ))}
                                {profile.educations?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có thông tin học vấn.</p>}
                            </div>
                        </section>

                        {/* Experience */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Kinh nghiệm làm việc</h2>
                                <button className="pf-add-btn" onClick={() => setShowExpForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Thêm mới
                                </button>
                            </div>
                            <div className="pf-timeline">
                                {profile.experiences?.map((exp, idx) => (
                                    <div key={exp.id} className="pf-timeline-item">
                                        <div className={`pf-timeline-dot ${idx === 0 ? '' : 'pf-timeline-dot-gray'}`}></div>
                                        <div className="pf-exp-header">
                                            <div>
                                                <h4>{exp.jobTitle}</h4>
                                                <p style={{ fontWeight: 500, fontSize: '14px' }}>{exp.companyName}</p>
                                            </div>
                                            <span className="pf-exp-type">Full-time</span>
                                        </div>
                                        <p className="pf-date">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                                        <p style={{ fontSize: '14px', color: '#475569', marginTop: '0.5rem' }}>{exp.description}</p>
                                        <button onClick={() => deleteExp(exp.id)} style={{ position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                        </button>
                                    </div>
                                ))}
                                {profile.experiences?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có kinh nghiệm làm việc.</p>}
                            </div>
                        </section>
                    </div>

                    {/* Right Col */}
                    <div className="pf-col-right">
                        {/* Career Goals */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Mục tiêu nghề nghiệp</h2>
                                <button className="pf-add-btn" onClick={() => { setBio(profile.bio || ''); setEditBio(true); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                </button>
                            </div>
                            <div className="pf-goal-box">
                                <p className="pf-goal-text">"{profile.bio || 'Chưa cập nhật mục tiêu nghề nghiệp.'}"</p>
                            </div>
                            <div className="pf-goal-list">
                                <div className="pf-goal-item">
                                    <span className="material-symbols-outlined">verified</span> Làm việc tại công ty đa quốc gia
                                </div>
                                <div className="pf-goal-item">
                                    <span className="material-symbols-outlined">verified</span> Master React & Node.js
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Kỹ năng chuyên môn</h2>
                                <button className="pf-add-btn" onClick={() => setShowSkillForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                                </button>
                            </div>
                            <div className="pf-skills-list">
                                {profile.skills?.map(skill => (
                                    <span key={skill.id} className="pf-skill-tag" onClick={() => deleteSkill(skill.id)} style={{ cursor: 'pointer' }}>
                                        {skill.name} • {skill.level}
                                    </span>
                                ))}
                                {profile.skills?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có kỹ năng.</p>}
                            </div>
                        </section>

                        {/* Links */}
                        <section className="pf-card">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Liên kết</h2>
                            <div className="pf-col-right" style={{ gap: '0.75rem' }}>
                                <a href="#" className="pf-link-item">
                                    <span className="material-symbols-outlined">link</span>
                                    <span style={{ fontSize: '14px' }}>linkedin.com/in/{profile.fullName?.toLowerCase().replace(/ /g, '')}</span>
                                </a>
                                <a href="#" className="pf-link-item">
                                    <span className="material-symbols-outlined">code</span>
                                    <span style={{ fontSize: '14px' }}>github.com/{profile.fullName?.toLowerCase().split(' ').pop()}</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {editBasic && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Chỉnh sửa thông tin cơ bản & học thuật</h3>
                            <button onClick={() => setEditBasic(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="pf-field">
                                <label className="pf-label">Họ và tên</label>
                                <input className="pf-input" value={basicForm.fullName} onChange={e => setBasicForm({ ...basicForm, fullName: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">SĐT</label>
                                <input className="pf-input" value={basicForm.phone} onChange={e => setBasicForm({ ...basicForm, phone: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Đại học</label>
                                <input className="pf-input" value={basicForm.university} onChange={e => setBasicForm({ ...basicForm, university: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Chuyên ngành</label>
                                <input className="pf-input" value={basicForm.major} onChange={e => setBasicForm({ ...basicForm, major: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Khóa / Năm TN</label>
                                <input type="number" className="pf-input" value={basicForm.graduationYear} onChange={e => setBasicForm({ ...basicForm, graduationYear: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">GPA (Hệ 4.0)</label>
                                <input type="number" step="0.01" className="pf-input" value={basicForm.gpa} onChange={e => setBasicForm({ ...basicForm, gpa: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Năm học</label>
                                <input className="pf-input" placeholder="Vd: Năm thứ 3" value={basicForm.academicYear} onChange={e => setBasicForm({ ...basicForm, academicYear: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Kỳ học</label>
                                <input className="pf-input" placeholder="Vd: Kỳ 6" value={basicForm.currentTerm} onChange={e => setBasicForm({ ...basicForm, currentTerm: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Tổng tín chỉ</label>
                                <input type="number" className="pf-input" value={basicForm.totalCredits} onChange={e => setBasicForm({ ...basicForm, totalCredits: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Tín chỉ hoàn thành</label>
                                <input type="number" className="pf-input" value={basicForm.earnedCredits} onChange={e => setBasicForm({ ...basicForm, earnedCredits: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Xếp hạng lớp</label>
                                <input className="pf-input" placeholder="Vd: Top 5%" value={basicForm.classRank} onChange={e => setBasicForm({ ...basicForm, classRank: e.target.value })} />
                            </div>
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={saveBasic} disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            )}

            {editBio && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Mục tiêu nghề nghiệp</h3>
                            <button onClick={() => setEditBio(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <textarea className="pf-input" rows={6} value={bio} onChange={e => setBio(e.target.value)} style={{ marginBottom: '1rem' }} />
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={saveBio} disabled={saving}>Lưu</button>
                    </div>
                </div>
            )}

            {showEduForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Thêm học vấn</h3>
                            <button onClick={() => setShowEduForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="pf-field"><label className="pf-label">Trường</label><input className="pf-input" placeholder="Tên trường" value={eduForm.schoolName} onChange={e => setEduForm({ ...eduForm, schoolName: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Ngành</label><input className="pf-input" placeholder="Chuyên ngành" value={eduForm.major} onChange={e => setEduForm({ ...eduForm, major: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Bắt đầu</label><input className="pf-input" type="date" value={eduForm.startDate} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Kết thúc</label><input className="pf-input" type="date" value={eduForm.endDate} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })} /></div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={saveEdu} disabled={saving}>Thêm mới</button>
                    </div>
                </div>
            )}

            {showExpForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Thêm kinh nghiệm</h3>
                            <button onClick={() => setShowExpForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="pf-field"><label className="pf-label">Công ty</label><input className="pf-input" value={expForm.companyName} onChange={e => setExpForm({ ...expForm, companyName: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Vị trí</label><input className="pf-input" value={expForm.jobTitle} onChange={e => setExpForm({ ...expForm, jobTitle: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Bắt đầu</label><input className="pf-input" type="date" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Kết thúc</label><input className="pf-input" type="date" value={expForm.endDate} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} /></div>
                        <div className="pf-field"><label className="pf-label">Mô tả</label><textarea className="pf-input" rows={3} value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} /></div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={saveExp} disabled={saving}>Thêm mới</button>
                    </div>
                </div>
            )}

            {showSkillForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Thêm kỹ năng</h3>
                            <button onClick={() => setShowSkillForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Kỹ năng</label>
                            <select className="pf-input" value={skillId} onChange={e => setSkillId(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                {allSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Mức độ</label>
                            <select className="pf-input" value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={addSkill} disabled={saving}>Thêm</button>
                    </div>
                </div>
            )}

            <footer className="pf-footer">
                <p>© 2024 CareerHub SaaS - Nền tảng quản lý hồ sơ sinh viên hiện đại.</p>
            </footer>
        </div>
    );
};

export default Profile;
