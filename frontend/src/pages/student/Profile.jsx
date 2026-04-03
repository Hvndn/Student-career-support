import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import NavbarSelector from '../../components/common/NavbarSelector';
import { getImageUrl } from '../../utils/urlUtils';
import CVTemplate from '../../components/student/CVTemplate';
import html2pdf from 'html2pdf.js';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../assets/css/student/Profile.css';
import EducationSection from './profile-sections/EducationSection';
import ExperienceSection from './profile-sections/ExperienceSection';
import SkillSection from './profile-sections/SkillSection';
import { EduModal, ExpModal, SkillModal, ProjectModal, ActivityModal, CertModal } from './profile-sections/ProfileModals';

const QUILL_MODULES = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const BLANK_EDU = { schoolName: '', major: '', startDate: '', endDate: '', description: '' };
const BLANK_EXP = { companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' };
const BLANK_LANG = { languageName: '', proficiency: 'Intermediate', certificate: '' };
const BLANK_PROJECT = { name: '', techStack: '', role: '', repositoryUrl: '', demoUrl: '', description: '' };
const BLANK_ACTIVITY = { name: '', organization: '', role: '', startDate: '', endDate: '', description: '' };
const BLANK_CERT = { name: '', issuer: '', issueDate: '', expirationDate: '', certificateUrl: '' };

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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

    const [showLangForm, setShowLangForm] = useState(false);
    const [langForm, setLangForm] = useState(BLANK_LANG);

    const [showInterestForm, setShowInterestForm] = useState(false);
    const [interestName, setInterestName] = useState('');

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectForm, setProjectForm] = useState(BLANK_PROJECT);

    const [showActivityForm, setShowActivityForm] = useState(false);
    const [activityForm, setActivityForm] = useState(BLANK_ACTIVITY);

    const [showCertForm, setShowCertForm] = useState(false);
    const [certForm, setCertForm] = useState(BLANK_CERT);

    useEffect(() => {
        studentApi.getProfile()
            .then(res => { 
                const data = res.data.data;
                setProfile(data); 
                setBio(data.bio || ''); 
                setLoading(false); 
            })
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
            currentTerm: profile.currentTerm || '',
            address: profile.address || ''
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
        setIsUploading(true);
        try {
            await studentApi.updateAvatar(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });
            await reload();
            flash('✅ Cập nhật ảnh đại diện thành công!');
        } catch { flash('❌ Lỗi khi tải ảnh lên.'); }
        setIsUploading(false);
        setUploadProgress(0);
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

    const saveLang = async () => {
        if (!langForm.languageName) return flash('⚠️ Nhập tên ngoại ngữ');
        setSaving(true);
        try {
            await studentApi.addLanguage(langForm);
            await reload();
            setShowLangForm(false);
            setLangForm(BLANK_LANG);
            flash('✅ Thêm ngoại ngữ thành công!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const deleteLang = async (id) => {
        if (!window.confirm('Xóa ngoại ngữ này?')) return;
        try {
            await studentApi.deleteLanguage(id);
            await reload();
            flash('✅ Đã xóa ngoại ngữ.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    const addInterest = async () => {
        if (!interestName) return flash('⚠️ Nhập tên sở thích');
        setSaving(true);
        try {
            await studentApi.addInterest({ name: interestName });
            await reload();
            setShowInterestForm(false);
            setInterestName('');
            flash('✅ Thêm sở thích thành công!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const deleteInterest = async (id) => {
        if (!window.confirm('Xóa sở thích này?')) return;
        try {
            await studentApi.deleteInterest(id);
            await reload();
            flash('✅ Đã xóa sở thích.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    const saveProject = async () => {
        if (!projectForm.name) return flash('⚠️ Nhập tên dự án');
        setSaving(true);
        try {
            if (projectForm.id) {
                await studentApi.updateProject(projectForm.id, projectForm);
                flash('✅ Cập nhật dự án thành công!');
            } else {
                await studentApi.addProject(projectForm);
                flash('✅ Thêm dự án thành công!');
            }
            await reload();
            setShowProjectForm(false);
            setProjectForm(BLANK_PROJECT);
        } catch { flash('❌ Lỗi khi lưu dự án.'); }
        setSaving(false);
    };

    const openProjectEdit = (proj) => {
        setProjectForm({ ...proj });
        setShowProjectForm(true);
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Xóa dự án này?')) return;
        try {
            await studentApi.deleteProject(id);
            await reload();
            flash('✅ Đã xóa dự án.');
        } catch { flash('❌ Lỗi khi xóa dự án.'); }
    };

    /* ---- Activity Handlers ---- */
    const openActivityEdit = (act) => {
        setActivityForm({ ...act });
        setShowActivityForm(true);
    };

    const saveActivity = async () => {
        if (!activityForm.name) return flash('⚠️ Vui lòng nhập tên hoạt động.');
        setSaving(true);
        try {
            if (activityForm.id) {
                await studentApi.updateActivity(activityForm.id, activityForm);
                flash('✅ Cập nhật hoạt động thành công!');
            } else {
                await studentApi.addActivity(activityForm);
                flash('✅ Thêm hoạt động thành công!');
            }
            await reload();
            setShowActivityForm(false);
            setActivityForm(BLANK_ACTIVITY);
        } catch { flash('❌ Lỗi khi lưu hoạt động.'); }
        setSaving(false);
    };

    const deleteActivity = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa hoạt động này?')) return;
        try {
            await studentApi.deleteActivity(id);
            await reload();
            flash('✅ Đã xóa hoạt động.');
        } catch { flash('❌ Lỗi khi xóa hoạt động.'); }
    };

    /* ---- Certification Handlers ---- */
    const openCertEdit = (cert) => {
        setCertForm({ ...cert });
        setShowCertForm(true);
    };

    const saveCert = async () => {
        if (!certForm.name) return flash('⚠️ Vui lòng nhập tên chứng chỉ.');
        setSaving(true);
        try {
            if (certForm.id) {
                await studentApi.updateCertification(certForm.id, certForm);
                flash('✅ Cập nhật chứng chỉ thành công!');
            } else {
                await studentApi.addCertification(certForm);
                flash('✅ Thêm chứng chỉ thành công!');
            }
            await reload();
            setShowCertForm(false);
            setCertForm(BLANK_CERT);
        } catch { flash('❌ Lỗi khi lưu chứng chỉ.'); }
        setSaving(false);
    };

    const deleteCert = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa chứng chỉ này?')) return;
        try {
            await studentApi.deleteCertification(id);
            await reload();
            flash('✅ Đã xóa chứng chỉ.');
        } catch { flash('❌ Lỗi khi xóa chứng chỉ.'); }
    };

    const handleDownloadCV = () => {
        const element = document.getElementById('cv-template');
        const opt = {
            margin: 0,
            filename: `CV_${profile.fullName?.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 3, useCORS: true, logging: false, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Standard flow to generate and download PDF
        html2pdf().from(element).set(opt).save();
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

            <main className="pf-container pf-main">
                {/* Profile Header Card */}
                <div className="pf-card pf-profile-header">
                    <div className="pf-profile-info">
                        <div className="pf-avatar-large" onClick={() => !isUploading && document.getElementById('avatarInput').click()} style={{ cursor: isUploading ? 'wait' : 'pointer', position: 'relative' }}>
                            <img src={getImageUrl(profile.avatarUrl) || 'https://vectorified.com/images/default-avatar-icon-33.png'} alt="Avatar" />
                            {isUploading && (
                                <div className="pf-upload-overlay">
                                    <div className="pf-upload-spinner"></div>
                                    <div className="pf-upload-text">{uploadProgress}%</div>
                                </div>
                            )}
                            <input type="file" id="avatarInput" hidden accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
                        </div>
                        <div className="pf-user-details">
                            <h1>{profile.fullName}</h1>
                            <p className="pf-major">{profile.major || 'Chưa cập nhật chuyên ngành'}</p>
                            <div className="pf-contact-row" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                <span className="pf-contact-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span> {profile.address || 'Hà Nội, Việt Nam'}
                                </span>
                                <span className="pf-contact-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span> {profile.email || 'Chưa có email'}
                                </span>
                                <span className="pf-contact-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span> {profile.phone || 'Chưa có SĐT'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="pf-actions">
                        <button className="pf-btn pf-btn-outline" onClick={openBasic}>
                            <span className="material-symbols-outlined">edit</span> Chỉnh sửa hồ sơ
                        </button>
                        <button className="pf-btn pf-btn-primary" onClick={handleDownloadCV}>
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
                        {/* Education Section */}
                        <EducationSection
                            educations={profile.educations}
                            onAdd={() => setShowEduForm(true)}
                            onDelete={deleteEdu}
                        />

                        {/* Experience Section */}
                        <ExperienceSection
                            experiences={profile.experiences}
                            onAdd={() => setShowExpForm(true)}
                            onDelete={deleteExp}
                        />

                        {/* Projects */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Dự án cá nhân</h2>
                                <button className="pf-add-btn" onClick={() => setShowProjectForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Thêm mới
                                </button>
                            </div>
                            <div className="pf-timeline">
                                {profile.projects?.map(proj => (
                                    <div key={proj.id} className="pf-item" style={{ position: 'relative', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
                                        <div className="pf-item-icon" style={{ background: '#f0f9ff', color: '#0369a1' }}>
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                        </div>
                                        <div className="pf-item-content">
                                            <h4 style={{ color: '#0369a1' }}>{proj.name}</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                {proj.role && <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px' }}>Vai trò: {proj.role}</span>}
                                                {proj.techStack && <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>Tech: {proj.techStack}</span>}
                                            </div>
                                            <div 
                                                className="pf-project-desc" 
                                                style={{ fontSize: '14px', color: '#475569', marginTop: '0.5rem', lineHeight: '1.6' }}
                                                dangerouslySetInnerHTML={{ __html: proj.description }}
                                            />
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                                {proj.repositoryUrl && (
                                                    <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>code</span> GitHub
                                                    </a>
                                                )}
                                                {proj.demoUrl && (
                                                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span> Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pf-item-actions">
                                            <button onClick={() => openProjectEdit(proj)} className="pf-edit-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                            </button>
                                            <button onClick={() => deleteProject(proj.id)} className="pf-delete-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {profile.projects?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa cập nhật dự án cá nhân.</p>}
                            </div>
                        </section>

                        {/* Activities */}
                        <section className="pf-card" style={{ marginTop: '1.5rem' }}>
                            <div className="pf-section-title">
                                <h2>Hoạt động</h2>
                                <button className="pf-add-btn" onClick={() => { setActivityForm(BLANK_ACTIVITY); setShowActivityForm(true); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                                </button>
                            </div>
                            <div className="pf-items-list">
                                {profile.activities?.map(act => (
                                    <div key={act.id} className="pf-item" style={{ position: 'relative', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
                                        <div className="pf-item-content">
                                            <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: 600 }}>{act.name}</h3>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                {act.organization && <span style={{ fontSize: '12px', background: '#f8fafc', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>{act.organization}</span>}
                                                {act.role && <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px' }}>Vai trò: {act.role}</span>}
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                    {act.startDate} — {act.endDate || 'Hiện tại'}
                                                </span>
                                            </div>
                                            <div 
                                                className="pf-project-desc" 
                                                style={{ fontSize: '14px', color: '#475569', marginTop: '0.5rem', lineHeight: '1.6' }}
                                                dangerouslySetInnerHTML={{ __html: act.description }}
                                            />
                                        </div>
                                        <div className="pf-item-actions">
                                            <button onClick={() => openActivityEdit(act)} className="pf-edit-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                            </button>
                                            <button onClick={() => deleteActivity(act.id)} className="pf-delete-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {profile.activities?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa cập nhật hoạt động ngoại khóa.</p>}
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
                                <div 
                                    className="pf-goal-text pf-rich-text" 
                                    dangerouslySetInnerHTML={{ __html: profile.bio || 'Chưa cập nhật mục tiêu nghề nghiệp.' }} 
                                />
                            </div>
                        </section>

                        {/* Skills Section */}
                        <SkillSection
                            skills={profile.skills}
                            onAdd={() => setShowSkillForm(true)}
                            onDelete={deleteSkill}
                        />

                        {/* Certifications */}
                        <section className="pf-card" style={{ marginTop: '1.5rem' }}>
                            <div className="pf-section-title">
                                <h2>Chứng chỉ</h2>
                                <button className="pf-add-btn" onClick={() => { setCertForm(BLANK_CERT); setShowCertForm(true); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                                </button>
                            </div>
                            <div className="pf-items-list">
                                {profile.certifications?.map(cert => (
                                    <div key={cert.id} className="pf-item" style={{ position: 'relative', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px dashed #e2e8f0' }}>
                                        <div className="pf-item-content">
                                            <h3 style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>{cert.name}</h3>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                                {cert.issuer} • {cert.issueDate}
                                            </div>
                                            {cert.certificateUrl && (
                                                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>link</span> Xem chứng chỉ
                                                </a>
                                            )}
                                        </div>
                                        <div className="pf-item-actions">
                                            <button onClick={() => openCertEdit(cert)} className="pf-edit-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                                            </button>
                                            <button onClick={() => deleteCert(cert.id)} className="pf-delete-btn-small">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {profile.certifications?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa cập nhật chứng chỉ.</p>}
                            </div>
                        </section>

                        {/* Languages */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Ngoại ngữ</h2>
                                <button className="pf-add-btn" onClick={() => setShowLangForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                                </button>
                            </div>
                            <div className="pf-goal-list" style={{ marginTop: 0 }}>
                                {profile.languages?.map(lang => (
                                    <div key={lang.id} className="pf-item" style={{ position: 'relative', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                        <div className="pf-item-content">
                                            <h4 style={{ color: '#2563eb' }}>{lang.languageName}</h4>
                                            <p style={{ fontWeight: 500, fontSize: '13px' }}>{lang.proficiency} {lang.certificate ? `• ${lang.certificate}` : ''}</p>
                                        </div>
                                        <button onClick={() => deleteLang(lang.id)} className="pf-delete-btn-abs">
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                                        </button>
                                    </div>
                                ))}
                                {profile.languages?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa cập nhật ngoại ngữ.</p>}
                            </div>
                        </section>

                        {/* Interests */}
                        {/* Interests */}
                        <section className="pf-card">
                            <div className="pf-section-title">
                                <h2>Sở thích</h2>
                                <button className="pf-add-btn" onClick={() => setShowInterestForm(true)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                                </button>
                            </div>
                            <div className="pf-skills-list">
                                {profile.interests?.map(item => (
                                    <span key={item.id} className="pf-skill-tag" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a', cursor: 'pointer' }} onClick={() => deleteInterest(item.id)}>
                                        {item.name} • <span style={{ fontSize: '10px' }}>Xóa</span>
                                    </span>
                                ))}
                                {profile.interests?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa cập nhật sở thích.</p>}
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
                                <label className="pf-label">Địa chỉ</label>
                                <input className="pf-input" placeholder="Vd: Hà Nội, Việt Nam" value={basicForm.address} onChange={e => setBasicForm({ ...basicForm, address: e.target.value })} />
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
                        <div className="pf-quill-wrapper" style={{ marginBottom: '1.5rem' }}>
                            <ReactQuill 
                                theme="snow" 
                                value={bio} 
                                onChange={setBio} 
                                modules={QUILL_MODULES}
                                placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
                            />
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={saveBio} disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            )}

            {/* === Các Modal Form (đã tách sang ProfileModals.jsx) === */}
            <EduModal show={showEduForm} form={eduForm} setForm={setEduForm} onSave={saveEdu} onClose={() => setShowEduForm(false)} saving={saving} />
            <ExpModal show={showExpForm} form={expForm} setForm={setExpForm} onSave={saveExp} onClose={() => setShowExpForm(false)} saving={saving} />
            <SkillModal show={showSkillForm} skillId={skillId} setSkillId={setSkillId} skillLevel={skillLevel} setSkillLevel={setSkillLevel} allSkills={allSkills} onSave={addSkill} onClose={() => setShowSkillForm(false)} saving={saving} />
            <ProjectModal show={showProjectForm} form={projectForm} setForm={setProjectForm} onSave={saveProject} onClose={() => { setShowProjectForm(false); setProjectForm(BLANK_PROJECT); }} saving={saving} />
            <ActivityModal show={showActivityForm} form={activityForm} setForm={setActivityForm} onSave={saveActivity} onClose={() => setShowActivityForm(false)} saving={saving} />
            <CertModal show={showCertForm} form={certForm} setForm={setCertForm} onSave={saveCert} onClose={() => setShowCertForm(false)} saving={saving} />

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

            {showLangForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Thêm ngoại ngữ</h3>
                            <button onClick={() => setShowLangForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Ngoại ngữ</label>
                            <input className="pf-input" placeholder="Vd: Tiếng Anh, Tiếng Nhật..." value={langForm.languageName} onChange={e => setLangForm({ ...langForm, languageName: e.target.value })} />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Trình độ</label>
                            <select className="pf-input" value={langForm.proficiency} onChange={e => setLangForm({ ...langForm, proficiency: e.target.value })}>
                                <option value="Sơ cấp">Sơ cấp (Beginner)</option>
                                <option value="Trung cấp">Trung cấp (Intermediate)</option>
                                <option value="Cao cấp">Cao cấp (Advanced)</option>
                                <option value="Bản ngữ">Bản ngữ (Native)</option>
                            </select>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Chứng chỉ (Nếu có)</label>
                            <input className="pf-input" placeholder="Vd: IELTS 7.5, JLPT N3..." value={langForm.certificate} onChange={e => setLangForm({ ...langForm, certificate: e.target.value })} />
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={saveLang} disabled={saving}>Thêm</button>
                    </div>
                </div>
            )}

            {showInterestForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container">
                        <div className="pf-form-header">
                            <h3>Thêm sở thích</h3>
                            <button onClick={() => setShowInterestForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Sở thích</label>
                            <input className="pf-input" placeholder="Vd: Đọc sách, Du lịch, Thể thao..." value={interestName} onChange={e => setInterestName(e.target.value)} />
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={addInterest} disabled={saving}>Thêm</button>
                    </div>
                </div>
            )}

            {showProjectForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container" style={{ maxWidth: '600px' }}>
                        <div className="pf-form-header">
                            <h3>{projectForm.id ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</h3>
                            <button onClick={() => { setShowProjectForm(false); setProjectForm(BLANK_PROJECT); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Tên dự án</label>
                                <input className="pf-input" placeholder="Vd: E-commerce Web App" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Công nghệ sử dụng</label>
                                <input className="pf-input" placeholder="Vd: React, Node.js, MongoDB" value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Vai trò</label>
                                <input className="pf-input" placeholder="Vd: Frontend Developer" value={projectForm.role} onChange={e => setProjectForm({ ...projectForm, role: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Link GitHub (Source code)</label>
                                <input className="pf-input" placeholder="https://github.com/..." value={projectForm.repositoryUrl} onChange={e => setProjectForm({ ...projectForm, repositoryUrl: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Link Demo / Live</label>
                                <input className="pf-input" placeholder="https://..." value={projectForm.demoUrl} onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })} />
                            </div>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Mô tả dự án (Hỗ trợ định dạng văn bản)</label>
                                <div style={{ background: 'white' }}>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={projectForm.description} 
                                        onChange={val => setProjectForm({ ...projectForm, description: val })}
                                        modules={QUILL_MODULES}
                                        placeholder="Mô tả ngắn gọn về dự án, các tính năng chính, giải pháp kỹ thuật..."
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={saveProject} disabled={saving}>
                            {saving ? 'Đang lưu...' : (projectForm.id ? 'Lưu thay đổi' : 'Thêm mới')}
                        </button>
                    </div>
                </div>
            )}

            {showActivityForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container" style={{ maxWidth: '700px' }}>
                        <div className="pf-form-header">
                            <h3>{activityForm.id ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}</h3>
                            <button onClick={() => setShowActivityForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Tên hoạt động</label>
                                <input className="pf-input" placeholder="Vd: Tình nguyện mùa hè xanh" value={activityForm.name} onChange={e => setActivityForm({ ...activityForm, name: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Tổ chức</label>
                                <input className="pf-input" placeholder="Vd: Hội sinh viên" value={activityForm.organization} onChange={e => setActivityForm({ ...activityForm, organization: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Vai trò</label>
                                <input className="pf-input" placeholder="Vd: Thành viên / Nhóm trưởng" value={activityForm.role} onChange={e => setActivityForm({ ...activityForm, role: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Ngày bắt đầu</label>
                                <input type="date" className="pf-input" value={activityForm.startDate} onChange={e => setActivityForm({ ...activityForm, startDate: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Ngày kết thúc</label>
                                <input type="date" className="pf-input" value={activityForm.endDate} onChange={e => setActivityForm({ ...activityForm, endDate: e.target.value })} />
                            </div>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Mô tả hoạt động (Hỗ trợ định dạng văn bản)</label>
                                <div style={{ background: 'white' }}>
                                    <ReactQuill 
                                        theme="snow" 
                                        value={activityForm.description} 
                                        onChange={val => setActivityForm({ ...activityForm, description: val })}
                                        modules={QUILL_MODULES}
                                        placeholder="Mô tả kỹ hơn về đóng góp và thành tích của bạn..."
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={saveActivity} disabled={saving}>
                            {saving ? 'Đang lưu...' : (activityForm.id ? 'Lưu thay đổi' : 'Thêm mới')}
                        </button>
                    </div>
                </div>
            )}

            <footer className="pf-footer">
                <p>© 2024 CareerHub SaaS - Nền tảng quản lý hồ sơ sinh viên hiện đại.</p>
            </footer>
            {/* Hidden CV Template for PDF Export */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <CVTemplate 
                    profile={profile} 
                    experiences={profile.experiences || []} 
                    educations={profile.educations || []} 
                    skills={profile.skills || []} 
                    languages={profile.languages || []}
                    interests={profile.interests || []}
                    projects={profile.projects || []}
                    activities={profile.activities || []}
                    certifications={profile.certifications || []}
                />
            </div>
            {showCertForm && (
                <div className="pf-form-overlay">
                    <div className="pf-form-container" style={{ maxWidth: '600px' }}>
                        <div className="pf-form-header">
                            <h3>{certForm.id ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ mới'}</h3>
                            <button onClick={() => setShowCertForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Tên chứng chỉ</label>
                                <input className="pf-input" placeholder="Vd: AWS Certified Solutions Architect" value={certForm.name} onChange={e => setCertForm({ ...certForm, name: e.target.value })} />
                            </div>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Tổ chức cấp</label>
                                <input className="pf-input" placeholder="Vd: Amazon Web Services" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Ngày cấp</label>
                                <input type="date" className="pf-input" value={certForm.issueDate} onChange={e => setCertForm({ ...certForm, issueDate: e.target.value })} />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Ngày hết hạn (Nếu có)</label>
                                <input type="date" className="pf-input" value={certForm.expirationDate} onChange={e => setCertForm({ ...certForm, expirationDate: e.target.value })} />
                            </div>
                            <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                                <label className="pf-label">Link chứng chỉ / Portfolio</label>
                                <input className="pf-input" placeholder="https://..." value={certForm.certificateUrl} onChange={e => setCertForm({ ...certForm, certificateUrl: e.target.value })} />
                            </div>
                        </div>
                        <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={saveCert} disabled={saving}>
                            {saving ? 'Đang lưu...' : (certForm.id ? 'Lưu thay đổi' : 'Thêm mới')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
