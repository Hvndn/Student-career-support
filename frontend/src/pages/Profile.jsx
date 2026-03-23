import React, { useState, useEffect } from 'react';
import { studentApi } from '../api';

const inputStyle = {
    width: '100%',
    padding: '0.8rem 1.2rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
};

const labelStyle = {
    display: 'block',
    color: '#888',
    fontSize: '0.85rem',
    marginBottom: '0.4rem',
    fontWeight: '500'
};

const BLANK_EDU = { schoolName: '', major: '', startDate: '', endDate: '', description: '' };
const BLANK_EXP = { companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' };

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Edit modes
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

    /* ---- Basic Info ---- */
    const openBasic = () => {
        setBasicForm({ fullName: profile.fullName, major: profile.major, graduationYear: profile.graduationYear, phone: profile.phone || '' });
        setEditBasic(true);
    };
    const saveBasic = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile(basicForm);
            await reload();
            setEditBasic(false);
            flash('✅ Cập nhật thông tin thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    /* ---- Bio ---- */
    const openBio = () => { setBio(profile.bio || ''); setEditBio(true); };
    const saveBio = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile({
                fullName: profile.fullName,
                major: profile.major,
                graduationYear: profile.graduationYear,
                phone: profile.phone,
                bio: bio
            });
            await reload();
            setEditBio(false);
            flash('✅ Cập nhật giới thiệu thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    /* ---- Skills ---- */
    const loadAllSkills = async () => {
        try {
            const res = await studentApi.getSkills();
            setAllSkills(res.data.data);
        } catch { flash('❌ Không thể tải danh sách kỹ năng.'); }
    };

    useEffect(() => {
        if (showSkillForm) loadAllSkills();
    }, [showSkillForm]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatarFile', file);

        setSaving(true);
        try {
            const res = await studentApi.updateAvatar(formData);
            await reload();
            flash('✅ Cập nhật ảnh đại diện thành công!');
        } catch { flash('❌ Lỗi khi tải ảnh lên.'); }
        setSaving(false);
    };

    const addSkill = async () => {
        if (!skillId) return flash('⚠️ Vui lòng nhập kỹ năng');
        setSaving(true);
        try {
            // My API takes skillId and level. If the user types a name, this needs to be an ID.
            // Simplified: adding skill by ID (from a list)
            await studentApi.addSkill(skillId, skillLevel);
            await reload();
            setShowSkillForm(false);
            flash('✅ Đã thêm kỹ năng!');
        } catch (err) {
            flash(err.response?.data?.message || '❌ Lỗi khi thêm kỹ năng.');
        }
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

    /* ---- Education ---- */
    const saveEdu = async () => {
        if (!eduForm.schoolName || !eduForm.major || !eduForm.startDate) {
            flash('⚠️ Vui lòng điền tên trường, chuyên ngành và ngày bắt đầu.');
            return;
        }
        const data = { ...eduForm };
        if (!data.endDate) data.endDate = null;
        setSaving(true);
        try {
            await studentApi.addEducation(data);
            await reload();
            setShowEduForm(false);
            setEduForm(BLANK_EDU);
            flash('✅ Thêm học vấn thành công!');
        } catch (err) {
            flash(err.response?.data?.message || '❌ Lỗi khi thêm học vấn.');
        }
        setSaving(false);
    };
    const deleteEdu = async (id) => {
        if (!window.confirm('Xóa học vấn này?')) return;
        await studentApi.deleteEducation(id);
        await reload();
        flash('✅ Đã xóa.');
    };

    /* ---- Experience ---- */
    const saveExp = async () => {
        if (!expForm.companyName || !expForm.jobTitle || !expForm.startDate) {
            flash('⚠️ Vui lòng điền tên công ty, chức danh và ngày bắt đầu.');
            return;
        }
        const data = { ...expForm };
        if (!data.endDate) data.endDate = null;
        setSaving(true);
        try {
            await studentApi.addExperience(data);
            await reload();
            setShowExpForm(false);
            setExpForm(BLANK_EXP);
            flash('✅ Thêm kinh nghiệm thành công!');
        } catch (err) {
            flash(err.response?.data?.message || '❌ Lỗi khi thêm kinh nghiệm.');
        }
        setSaving(false);
    };
    const deleteExp = async (id) => {
        if (!window.confirm('Xóa kinh nghiệm này?')) return;
        await studentApi.deleteExperience(id);
        await reload();
        flash('✅ Đã xóa.');
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải hồ sơ...</div>;
    if (!profile) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Không tìm thấy hồ sơ!</div>;

    return (
        <div className="fade-in" style={{ padding: '3rem 2rem 6rem' }}>
            <div className="container">
                {/* Toast message */}
                {message && (
                    <div className="fade-in" style={{
                        position: 'fixed', top: '6rem', right: '2rem', zIndex: 9999,
                        padding: '1rem 2rem', borderRadius: '12px',
                        background: message.startsWith('✅') ? 'rgba(34,197,94,0.15)' : 'rgba(244,63,94,0.15)',
                        border: `1px solid ${message.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(244,63,94,0.3)'}`,
                        color: message.startsWith('✅') ? '#22c55e' : '#f43f5e',
                        fontWeight: '600', backdropFilter: 'blur(10px)'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2.5rem', alignItems: 'start' }}>
                    {/* Sidebar */}
                    <aside style={{ position: 'sticky', top: '7rem' }}>
                        <div className="card glass" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'var(--surface)', margin: '0 auto 1.5rem',
                                border: '3px solid rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '3.5rem', position: 'relative', overflow: 'hidden',
                                cursor: 'pointer'
                            }} onClick={() => document.getElementById('avatarInput').click()}>
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : '👤'}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'rgba(0,0,0,0.5)', padding: '0.3rem 0',
                                    fontSize: '0.7rem', color: 'white', fontWeight: 'bold'
                                }}>
                                    THAY ĐỔI
                                </div>
                            </div>
                            <input
                                type="file"
                                id="avatarInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />

                            {editBasic ? (
                                <div style={{ textAlign: 'left' }}>
                                    <label style={labelStyle}>Họ và tên</label>
                                    <input style={inputStyle} value={basicForm.fullName || ''} onChange={e => setBasicForm({ ...basicForm, fullName: e.target.value })} />
                                    <label style={labelStyle}>Chuyên ngành</label>
                                    <input style={inputStyle} value={basicForm.major || ''} onChange={e => setBasicForm({ ...basicForm, major: e.target.value })} />
                                    <label style={labelStyle}>Năm tốt nghiệp</label>
                                    <input style={inputStyle} type="number" value={basicForm.graduationYear || ''} onChange={e => setBasicForm({ ...basicForm, graduationYear: e.target.value })} />
                                    <label style={labelStyle}>Điện thoại</label>
                                    <input style={inputStyle} value={basicForm.phone || ''} onChange={e => setBasicForm({ ...basicForm, phone: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                                        <button onClick={saveBasic} disabled={saving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                            {saving ? 'Đang lưu...' : 'Lưu'}
                                        </button>
                                        <button onClick={() => setEditBasic(false)} className="btn glass" style={{ flex: 1, justifyContent: 'center' }}>Huỷ</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.4rem' }}>{profile.fullName}</h2>
                                    <p style={{ color: '#585d47', fontWeight: '600', marginBottom: '0.5rem' }}>{profile.major}</p>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>🎓 {profile.graduationYear}</p>
                                    {profile.phone && <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>📞 {profile.phone}</p>}
                                    <button onClick={openBasic} className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                                        ✏️ Chỉnh sửa thông tin
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="card glass" style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Kỹ năng</h3>
                                <button onClick={() => setShowSkillForm(!showSkillForm)} className="btn glass" style={{ padding: '0.5rem 0.6rem', fontSize: '0.9rem', minWidth: '36px', height: '36px', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: showSkillForm ? 'rotate(0deg)' : 'rotate(0deg)' }}>
                                    {showSkillForm ? '✕' : '+'}
                                </button>
                            </div>

                            {showSkillForm && (
                                <div className="fade-in" style={{ marginBottom: '1.2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <label style={labelStyle}>Tên kỹ năng</label>
                                    <select style={inputStyle} value={skillId} onChange={e => setSkillId(e.target.value)}>
                                        <option value="">-- Chọn kỹ năng --</option>
                                        {allSkills.map(s => (
                                            <option key={s.id} value={s.id} style={{ padding: '1rem' }}>{s.name}</option>
                                        ))}
                                    </select>
                                    <label style={labelStyle}>Mức độ</label>
                                    <select style={inputStyle} value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <button onClick={addSkill} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Thêm</button>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {profile.skills?.map(skill => (
                                    <span key={skill.id} className="skill-tag" style={{
                                        padding: '0.5rem 1rem', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.7rem'
                                    }}>
                                        <span style={{ color: 'white' }}>{skill.name}</span>
                                        <span style={{ color: '#585d47', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{skill.level}</span>
                                        <button onClick={() => deleteSkill(skill.id)} style={{
                                            background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem', padding: '0',
                                            marginLeft: '0.2rem', display: 'flex', alignItems: 'center'
                                        }}>✕</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>


                    {/* Main content */}
                    <main>
                        {/* Bio */}
                        <div className="card glass" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Giới thiệu bản thân</h3>
                                {!editBio && <button onClick={openBio} className="btn btn-accent" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>✏️ Sửa</button>}
                            </div>
                            {editBio ? (
                                <>
                                    <textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        rows={6}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        placeholder="Giới thiệu ngắn về bản thân bạn..."
                                    />
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={saveBio} disabled={saving} className="btn btn-primary">{saving ? 'Đang lưu...' : 'Lưu'}</button>
                                        <button onClick={() => setEditBio(false)} className="btn glass">Huỷ</button>
                                    </div>
                                </>
                            ) : (
                                <p style={{ color: '#888', lineHeight: '1.8' }}>
                                    {profile.bio || 'Chưa có giới thiệu. Nhấn Sửa để thêm nội dung.'}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        <div className="card glass" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Học vấn</h3>
                                <button onClick={() => setShowEduForm(!showEduForm)} className="btn btn-accent" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    {showEduForm ? '✕ Đóng' : '+ Thêm'}
                                </button>
                            </div>

                            {showEduForm && (
                                <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                        <div>
                                            <label style={labelStyle}>Tên trường *</label>
                                            <input style={inputStyle} placeholder="Đại học ABC" value={eduForm.schoolName} onChange={e => setEduForm({ ...eduForm, schoolName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Chuyên ngành</label>
                                            <input style={inputStyle} placeholder="Công nghệ thông tin" value={eduForm.major} onChange={e => setEduForm({ ...eduForm, major: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Ngày bắt đầu</label>
                                            <input style={inputStyle} type="date" value={eduForm.startDate} onChange={e => setEduForm({ ...eduForm, startDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Ngày kết thúc</label>
                                            <input style={inputStyle} type="date" value={eduForm.endDate} onChange={e => setEduForm({ ...eduForm, endDate: e.target.value })} />
                                        </div>
                                    </div>
                                    <label style={labelStyle}>Mô tả</label>
                                    <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Thành tích, GPA..." value={eduForm.description} onChange={e => setEduForm({ ...eduForm, description: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={saveEdu} disabled={saving} className="btn btn-primary">{saving ? 'Đang lưu...' : '💾 Lưu học vấn'}</button>
                                        <button onClick={() => setShowEduForm(false)} className="btn glass">Huỷ</button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {profile.educations?.length === 0 && <p style={{ color: '#555' }}>Chưa có thông tin học vấn.</p>}
                                {profile.educations?.map(edu => (
                                    <div key={edu.id} style={{ borderLeft: '3px solid #585d47', paddingLeft: '1.5rem', position: 'relative' }}>
                                        <button onClick={() => deleteEdu(edu.id)} style={{
                                            position: 'absolute', right: 0, top: 0, background: 'none', border: 'none',
                                            color: '#555', cursor: 'pointer', fontSize: '0.9rem'
                                        }}>✕</button>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{edu.schoolName}</h4>
                                        <p style={{ color: '#585d47', fontWeight: '600', marginBottom: '0.3rem' }}>{edu.major}</p>
                                        <p style={{ color: '#666', fontSize: '0.85rem' }}>📅 {edu.startDate} — {edu.endDate || 'Hiện tại'}</p>
                                        {edu.description && <p style={{ marginTop: '0.6rem', color: '#888', fontSize: '0.95rem' }}>{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="card glass">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Kinh nghiệm làm việc</h3>
                                <button onClick={() => setShowExpForm(!showExpForm)} className="btn btn-accent" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    {showExpForm ? '✕ Đóng' : '+ Thêm'}
                                </button>
                            </div>

                            {showExpForm && (
                                <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                        <div>
                                            <label style={labelStyle}>Tên công ty *</label>
                                            <input style={inputStyle} placeholder="Công ty XYZ" value={expForm.companyName} onChange={e => setExpForm({ ...expForm, companyName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Vị trí</label>
                                            <input style={inputStyle} placeholder="Intern, Developer..." value={expForm.jobTitle} onChange={e => setExpForm({ ...expForm, jobTitle: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Ngày bắt đầu</label>
                                            <input style={inputStyle} type="date" value={expForm.startDate} onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Ngày kết thúc</label>
                                            <input style={inputStyle} type="date" value={expForm.endDate} onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} />
                                        </div>
                                    </div>
                                    <label style={labelStyle}>Mô tả công việc</label>
                                    <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Mô tả công việc, thành tích..." value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={saveExp} disabled={saving} className="btn btn-primary">{saving ? 'Đang lưu...' : '💾 Lưu kinh nghiệm'}</button>
                                        <button onClick={() => setShowExpForm(false)} className="btn glass">Huỷ</button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {profile.experiences?.length === 0 && <p style={{ color: '#555' }}>Chưa có kinh nghiệm làm việc.</p>}
                                {profile.experiences?.map(exp => (
                                    <div key={exp.id} style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '1.5rem', position: 'relative' }}>
                                        <button onClick={() => deleteExp(exp.id)} style={{
                                            position: 'absolute', right: 0, top: 0, background: 'none', border: 'none',
                                            color: '#555', cursor: 'pointer', fontSize: '0.9rem'
                                        }}>✕</button>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{exp.companyName}</h4>
                                        <p style={{ color: 'var(--secondary)', fontWeight: '600', marginBottom: '0.3rem' }}>{exp.jobTitle}</p>
                                        <p style={{ color: '#666', fontSize: '0.85rem' }}>📅 {exp.startDate} — {exp.endDate || 'Hiện tại'}</p>
                                        {exp.description && <p style={{ marginTop: '0.6rem', color: '#888', fontSize: '0.95rem' }}>{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
