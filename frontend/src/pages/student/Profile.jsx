import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { studentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/student/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Consolidated Edit State
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    const [showSkillForm, setShowSkillForm] = useState(false);
    const [skillId, setSkillId] = useState('');
    const [skillLevel, setSkillLevel] = useState('intermediate');
    const [allSkills, setAllSkills] = useState([]);

    const [showProjectModal, setShowProjectModal] = useState(false);
    const [projectData, setProjectData] = useState({ name: '', description: '', repositoryUrl: '', demoUrl: '' });
    const [isSaving, setSavingState] = useState(false);

    const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

    const reload = () => studentApi.getProfile().then(res => {
        setProfile(res.data.data);
    });

    useEffect(() => {
        studentApi.getProfile()
            .then(res => { 
                setProfile(res.data.data); 
                setLoading(false); 
            })
            .catch(() => setLoading(false));
    }, []);

    const openEdit = () => {
        setForm({ 
            fullName: profile.fullName || '', 
            studentIdStr: profile.studentIdStr || '',
            academicYear: profile.academicYear || '',
            major: profile.major || '', 
            bio: profile.bio || '',
            phone: profile.phone || '',
            email: profile.email || '',
            address: profile.address || '',
            gpa: profile.gpa || '',
            githubUrl: profile.githubUrl || '',
            linkedinUrl: profile.linkedinUrl || ''
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile(form);
            await reload();
            setEditMode(false);
            flash('✅ Cập nhật hồ sơ thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    const handleProjectAction = async (e) => {
        e.preventDefault();
        setSavingState(true);
        try {
            if (projectData.id) await studentApi.updateProject(projectData.id, projectData);
            else await studentApi.addProject(projectData);
            setShowProjectModal(false);
            setProjectData({ name: '', description: '', repositoryUrl: '', demoUrl: '' });
            await reload();
            flash('✅ Lưu dự án thành công!');
        } catch { flash('❌ Lỗi khi lưu dự án.'); }
        setSavingState(false);
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Xóa dự án này?')) return;
        try {
            await studentApi.deleteProject(id);
            await reload();
            flash('✅ Đã xóa dự án.');
        } catch { flash('❌ Lỗi khi xóa dự án.'); }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatarFile', file);
        setIsUploading(true);
        try {
            await studentApi.updateAvatar(formData);
            await reload();
            flash('✅ Cập nhật ảnh đại diện thành công!');
        } catch { flash('❌ Lỗi khi tải ảnh lên.'); }
        setIsUploading(false);
    };

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file size (e.g., max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return flash('⚠️ Video quá lớn (Tối đa 50MB)');
        }

        const formData = new FormData();
        formData.append('videoFile', file);
        setIsUploading(true);
        try {
            await studentApi.updateVideo(formData);
            await reload();
            flash('✅ Cập nhật video giới thiệu thành công!');
        } catch { flash('❌ Lỗi khi tải video lên.'); }
        setIsUploading(false);
    };

    const loadSkills = async () => {
        try {
            const res = await studentApi.getSkills();
            setAllSkills(res.data.data);
        } catch { flash('❌ Không thể tải kỹ năng.'); }
    };

    useEffect(() => { if (showSkillForm) loadSkills(); }, [showSkillForm]);

    const handleAddSkill = async () => {
        if (!skillId) return flash('⚠️ Chọn kỹ năng');
        setSaving(true);
        try {
            await studentApi.addSkill(skillId, skillLevel);
            await reload();
            setShowSkillForm(false);
            flash('✅ Đã thêm kỹ năng!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Xóa kỹ năng này?')) return;
        try {
            await studentApi.deleteSkill(id);
            await reload();
            flash('✅ Đã xóa kỹ năng.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    if (loading) return <div className="pf-loading">Đang tải hồ sơ...</div>;
    if (!profile) return <div className="pf-error">Không tìm thấy hồ sơ!</div>;

    const QUILL_MODULES = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="pf-profile-wrapper">
            {/* Toast Notification */}
                {message && (
                    <div className={`pf-toast ${message.startsWith('✅') ? 'is-success' : 'is-error'}`}>
                        {message}
                    </div>
                )}

                {/* Premium Banner */}

                {/* Premium Banner */}
                <div className="pf-premium-banner">
                    <div className="pf-banner-overlay"></div>
                    {profile.coverImageUrl ? (
                        <img src={getImageUrl(profile.coverImageUrl)} alt="Banner" className="pf-banner-img" />
                    ) : (
                        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" alt="Banner" className="pf-banner-img" />
                    )}
                    <button className="pf-btn-banner-edit" onClick={openEdit}>
                        <span className="material-symbols-outlined">edit_note</span>
                        Chỉnh sửa hồ sơ
                    </button>
                </div>

                {/* Header Info Card */}
                <div className="pf-modern-header">
                    <div className="pf-header-left">
                        <div className="pf-header-avatar">
                            <img 
                                src={profile.avatarUrl ? getImageUrl(profile.avatarUrl) : `https://ui-avatars.com/api/?name=${profile.fullName}&size=200`} 
                                alt="Avatar" 
                                className="pf-avatar-img"
                            />
                        </div>
                        <div className="pf-user-id">
                            <span className="pf-major-tag">{profile.major || 'Kiến Trúc'}</span>
                            <h2>{profile.fullName}</h2>
                            <div className="pf-class-info">
                                Lớp: {profile.academicYear || '26kt6'} &nbsp; - &nbsp; MSSV: {profile.studentIdStr || '19KT123'}
                            </div>
                        </div>
                    </div>

                    <div className="pf-header-center">
                        <h4>Thông tin liên lạc</h4>
                        <div className="pf-contact-grid">
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">mail</span></div>
                                <span>{profile.email || 'n/a'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">call</span></div>
                                <span>{profile.phone || 'n/a'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">location_on</span></div>
                                <span>{profile.address || 'Hòa Xuân, Cẩm Lệ'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">globe</span></div>
                                <span>{profile.githubUrl || 'dau.edu.vn'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">person</span></div>
                                <span>{profile.linkedinUrl || 'nl_truong'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pf-header-right">
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{profile.gpa || '0.00'}</span>
                            <span className="pf-stat-lbl">GPA</span>
                        </div>
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{profile.projects?.length || 0}</span>
                            <span className="pf-stat-lbl">DỰ ÁN</span>
                        </div>
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{profile.cvData ? 1 : 0}</span>
                            <span className="pf-stat-lbl">CVS</span>
                        </div>
                    </div>
                </div>

                <div className="pf-content-grid">
                    <div className="pf-main-col" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">badge</span>
                                    Thông tin chung
                                </h3>
                                <button className="pf-btn-text" onClick={openEdit}>Sửa</button>
                            </div>
                            <div className="pf-bio-box">
                                <div dangerouslySetInnerHTML={{ __html: profile.bio || 'Chưa có thông tin giới thiệu.' }} />
                            </div>
                        </div>

                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">folder_special</span>
                                    Dự án tiêu biểu
                                </h3>
                                <button className="pf-btn-text" onClick={() => { setProjectData({ name: '', description: '', repositoryUrl: '', demoUrl: '' }); setShowProjectModal(true); }}>+ Thêm dự án</button>
                            </div>
                            <div className="pf-list">
                                {profile.projects?.length > 0 ? profile.projects.map(proj => (
                                    <div key={proj.id} className="pf-item">
                                        <div className="pf-item-info">
                                            <h4 className="pf-item-title">{proj.name}</h4>
                                            <p className="pf-item-subtitle">{proj.description}</p>
                                            <div className="pf-item-links" style={{marginTop: '8px', display: 'flex', gap: '15px'}}>
                                                {proj.repositoryUrl && (
                                                    <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" className="pf-link-small" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>link</span> GitHub
                                                    </a>
                                                )}
                                                {proj.demoUrl && (
                                                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="pf-link-small" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>visibility</span> Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pf-item-actions">
                                            <button className="pf-btn-icon" onClick={() => { setProjectData(proj); setShowProjectModal(true); }}>
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="pf-btn-icon pf-delete" onClick={() => handleDeleteProject(proj.id)}>
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="pf-empty-state" style={{padding: '2rem', textAlign: 'center'}}>
                                        <span className="material-symbols-outlined" style={{fontSize: '48px', color: '#cbd5e1'}}>folder_off</span>
                                        <p className="pf-text-muted">Bạn chưa thêm dự án nào. Hãy giới thiệu các dự án ấn tượng của bạn!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="pf-sidebar-col" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">videocam</span>
                                    Video giới thiệu
                                </h3>
                            </div>
                            <div className="pf-video-window">
                                {profile.videoUrl ? (
                                    <video src={getImageUrl(profile.videoUrl)} controls className="pf-video-obj" />
                                ) : (
                                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400" alt="Video Placeholder" className="pf-video-obj" />
                                )}
                                {isUploading && <div className="pf-upload-overlay">Đang tải...</div>}
                            </div>
                            <label className="pf-btn-dau" style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined">upload</span>
                                {profile.videoUrl ? 'Đổi Video' : 'Thêm Video'}
                                <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
                            </label>
                        </div>

                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">psychology</span>
                                    Kỹ năng chuyên môn
                                </h3>
                                <button className="pf-btn-text" onClick={() => setShowSkillForm(true)}>+ Thêm</button>
                            </div>
                            <div className="pf-skill-tags">
                                {profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
                                    <div key={idx} className="pf-tag" onDoubleClick={() => handleDeleteSkill(skill.name)}>
                                        {skill.name}
                                    </div>
                                )) : <p className="pf-text-muted">Chưa cập nhật kỹ năng.</p>}
                            </div>
                        </div>

                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">description</span>
                                    Hồ sơ năng lực (CV)
                                </h3>
                            </div>
                            <div className="pf-cv-list">
                                {profile.cvs?.length > 0 ? (
                                    <div className="pf-cv-item">
                                        <div className="pf-cv-left">
                                            <div className="pf-cv-icon"><span className="material-symbols-outlined">picture_as_pdf</span></div>
                                            <div className="pf-cv-info">
                                                <span className="pf-cv-title">CV mới của tôi</span>
                                            </div>
                                        </div>
                                        <Link to="/student/cv-management" className="pf-cv-btn">
                                            <span className="material-symbols-outlined">open_in_new</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to="/student/cv-management" className="pf-btn-dau" style={{background: 'var(--dau-primary)'}}>
                                        Tạo CV ngay
                                    </Link>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* --- CONSOLIDATED EDIT MODAL --- */}
                {editMode && (
                    <div className="pf-modal-overlay">
                        <div className="pf-modal-container">
                            <div className="pf-modal-header">
                                <h3>Chỉnh sửa hồ sơ</h3>
                                <button className="pf-modal-close" onClick={() => setEditMode(false)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="pf-modal-body">
                                {/* Avatar Edit Section */}
                                <div className="pf-modal-avatar-section">
                                    <div className="pf-modal-avatar-box">
                                        <img 
                                            src={profile.avatarUrl ? getImageUrl(profile.avatarUrl) : `https://ui-avatars.com/api/?name=${profile.fullName}&size=200`} 
                                            alt="Preview" 
                                        />
                                        <label htmlFor="modal-avatar-input" className="pf-avatar-overlay">
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        </label>
                                        <input type="file" id="modal-avatar-input" hidden onChange={handleAvatarChange} />
                                    </div>
                                    <p className="pf-avatar-hint">Nhấn để thay đổi ảnh đại diện</p>
                                </div>

                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Họ và tên</label>
                                        <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Nguyễn Lê Trường" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Mã sinh viên</label>
                                        <input type="text" value={form.studentIdStr} onChange={e => setForm({...form, studentIdStr: e.target.value})} placeholder="19KT123" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Lớp</label>
                                        <input type="text" value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} placeholder="26kt6" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Chuyên ngành</label>
                                        <input type="text" value={form.major} onChange={e => setForm({...form, major: e.target.value})} placeholder="Kiến trúc" />
                                    </div>
                                </div>

                                <div className="pf-modal-field full-width">
                                    <label>Giới thiệu bản thân</label>
                                    <div className="pf-quill-wrapper">
                                        <ReactQuill 
                                            theme="snow" 
                                            value={form.bio} 
                                            onChange={val => setForm({...form, bio: val})} 
                                            modules={QUILL_MODULES}
                                        />
                                    </div>
                                </div>

                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Email</label>
                                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@gmail.com" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Số điện thoại</label>
                                        <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0901234567" />
                                    </div>
                                </div>

                                <div className="pf-modal-field full-width">
                                    <label>Địa chỉ</label>
                                    <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Số nhà, Tên đường, Quận/Huyện..." />
                                </div>

                                <div className="pf-modal-grid-3">
                                    <div className="pf-modal-field">
                                        <label>GPA</label>
                                        <input type="number" step="0.1" value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} placeholder="4.0" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Website / Portfolio URL</label>
                                        <input type="text" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} placeholder="dau.edu.vn" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Facebook / LinkedIn</label>
                                        <input type="text" value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} placeholder="linkedin.com/in/user" />
                                    </div>
                                </div>
                            </div>

                            <div className="pf-modal-footer">
                                <button className="pf-btn-save-all" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showSkillForm && (
                    <div className="pf-modal-overlay">
                        <div className="pf-modal-container small">
                            <div className="pf-modal-header">
                                <h3>Thêm kỹ năng chuyên môn</h3>
                                <button className="pf-modal-close" onClick={() => setShowSkillForm(false)}>&times;</button>
                            </div>
                            <div className="pf-modal-body">
                                <div className="pf-modal-field">
                                    <label>Chọn kỹ năng</label>
                                    <select className="pf-input" value={skillId} onChange={e => setSkillId(e.target.value)}>
                                        <option value="">-- Chọn kỹ năng --</option>
                                        {allSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="pf-modal-footer">
                                <button className="pf-btn-save-all" onClick={handleAddSkill} disabled={saving}>Thêm kỹ năng</button>
                            </div>
                        </div>
                    </div>
                )}
            {showProjectModal && (
                <div className="pf-modal-overlay">
                    <div className="pf-modal">
                        <div className="pf-modal-header">
                            <h3>{projectData.id ? 'Sửa dự án' : 'Thêm dự án mới'}</h3>
                            <button className="pf-close-btn" onClick={() => setShowProjectModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleProjectAction} className="pf-form">
                            <div className="pf-form-group">
                                <label>Tên dự án</label>
                                <input type="text" value={projectData.name} onChange={e => setProjectData({...projectData, name: e.target.value})} required placeholder="Ví dụ: JobPortal Website" />
                            </div>
                            <div className="pf-form-group">
                                <label>Mô tả ngắn</label>
                                <textarea value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} placeholder="Mô tả công nghệ sử dụng, vai trò của bạn..." />
                            </div>
                            <div className="pf-form-row">
                                <div className="pf-form-group">
                                    <label>Link Repository (GitHub)</label>
                                    <input type="url" value={projectData.repositoryUrl} onChange={e => setProjectData({...projectData, repositoryUrl: e.target.value})} placeholder="https://github.com/..." />
                                </div>
                                <div className="pf-form-group">
                                    <label>Link Demo</label>
                                    <input type="url" value={projectData.demoUrl} onChange={e => setProjectData({...projectData, demoUrl: e.target.value})} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="pf-modal-actions">
                                <button type="button" className="pf-btn-secondary" onClick={() => setShowProjectModal(false)}>Hủy</button>
                                <button type="submit" className="pf-btn-dau" disabled={isSaving}>
                                    {isSaving ? 'Đang lưu...' : 'Lưu dự án'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
