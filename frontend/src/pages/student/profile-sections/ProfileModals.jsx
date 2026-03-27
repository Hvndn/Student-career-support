import React from 'react';
import ReactQuill from 'react-quill-new';

const QUILL_MODULES = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

/** ===== Modal Thêm Học Vấn ===== */
export const EduModal = ({ show, form, setForm, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container">
                <div className="pf-form-header">
                    <h3>Thêm học vấn</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="pf-field"><label className="pf-label">Trường</label><input className="pf-input" placeholder="Tên trường" value={form.schoolName} onChange={e => setForm({ ...form, schoolName: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Ngành</label><input className="pf-input" placeholder="Chuyên ngành" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Bắt đầu</label><input className="pf-input" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Kết thúc</label><input className="pf-input" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={onSave} disabled={saving}>Thêm mới</button>
            </div>
        </div>
    );
};

/** ===== Modal Thêm Kinh Nghiệm ===== */
export const ExpModal = ({ show, form, setForm, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container">
                <div className="pf-form-header">
                    <h3>Thêm kinh nghiệm</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="pf-field"><label className="pf-label">Công ty</label><input className="pf-input" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Vị trí</label><input className="pf-input" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Bắt đầu</label><input className="pf-input" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Kết thúc</label><input className="pf-input" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                <div className="pf-field"><label className="pf-label">Mô tả</label><textarea className="pf-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={onSave} disabled={saving}>Thêm mới</button>
            </div>
        </div>
    );
};

/** ===== Modal Thêm Kỹ Năng ===== */
export const SkillModal = ({ show, skillId, setSkillId, skillLevel, setSkillLevel, allSkills, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container">
                <div className="pf-form-header">
                    <h3>Thêm kỹ năng</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
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
                <button className="pf-btn pf-btn-primary" style={{ width: '100%' }} onClick={onSave} disabled={saving}>Thêm</button>
            </div>
        </div>
    );
};

/** ===== Modal Dự Án ===== */
export const ProjectModal = ({ show, form, setForm, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container" style={{ maxWidth: '600px' }}>
                <div className="pf-form-header">
                    <h3>{form.id ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}><label className="pf-label">Tên dự án</label><input className="pf-input" placeholder="Vd: E-commerce Web App" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Công nghệ sử dụng</label><input className="pf-input" placeholder="Vd: React, Node.js" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Vai trò</label><input className="pf-input" placeholder="Vd: Frontend Developer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Link GitHub</label><input className="pf-input" placeholder="https://github.com/..." value={form.repositoryUrl} onChange={e => setForm({ ...form, repositoryUrl: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Link Demo</label><input className="pf-input" placeholder="https://..." value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} /></div>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                        <label className="pf-label">Mô tả dự án</label>
                        <div style={{ background: 'white' }}>
                            <ReactQuill theme="snow" value={form.description} onChange={val => setForm({ ...form, description: val })} modules={QUILL_MODULES} placeholder="Mô tả về dự án..." />
                        </div>
                    </div>
                </div>
                <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={onSave} disabled={saving}>
                    {saving ? 'Đang lưu...' : (form.id ? 'Lưu thay đổi' : 'Thêm mới')}
                </button>
            </div>
        </div>
    );
};

/** ===== Modal Hoạt Động ===== */
export const ActivityModal = ({ show, form, setForm, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container" style={{ maxWidth: '700px' }}>
                <div className="pf-form-header">
                    <h3>{form.id ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}><label className="pf-label">Tên hoạt động</label><input className="pf-input" placeholder="Vd: Tình nguyện mùa hè xanh" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Tổ chức</label><input className="pf-input" placeholder="Vd: Hội sinh viên" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Vai trò</label><input className="pf-input" placeholder="Vd: Nhóm trưởng" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Ngày bắt đầu</label><input type="date" className="pf-input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Ngày kết thúc</label><input type="date" className="pf-input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}>
                        <label className="pf-label">Mô tả hoạt động</label>
                        <div style={{ background: 'white' }}>
                            <ReactQuill theme="snow" value={form.description} onChange={val => setForm({ ...form, description: val })} modules={QUILL_MODULES} placeholder="Mô tả đóng góp của bạn..." />
                        </div>
                    </div>
                </div>
                <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={onSave} disabled={saving}>
                    {saving ? 'Đang lưu...' : (form.id ? 'Lưu thay đổi' : 'Thêm mới')}
                </button>
            </div>
        </div>
    );
};

/** ===== Modal Chứng Chỉ ===== */
export const CertModal = ({ show, form, setForm, onSave, onClose, saving }) => {
    if (!show) return null;
    return (
        <div className="pf-form-overlay">
            <div className="pf-form-container" style={{ maxWidth: '600px' }}>
                <div className="pf-form-header">
                    <h3>{form.id ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ mới'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span className="material-symbols-outlined">close</span></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}><label className="pf-label">Tên chứng chỉ</label><input className="pf-input" placeholder="Vd: AWS Certified" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}><label className="pf-label">Tổ chức cấp</label><input className="pf-input" placeholder="Vd: Amazon Web Services" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Ngày cấp</label><input type="date" className="pf-input" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} /></div>
                    <div className="pf-field"><label className="pf-label">Ngày hết hạn</label><input type="date" className="pf-input" value={form.expirationDate} onChange={e => setForm({ ...form, expirationDate: e.target.value })} /></div>
                    <div className="pf-field" style={{ gridColumn: 'span 2' }}><label className="pf-label">Link chứng chỉ</label><input className="pf-input" placeholder="https://..." value={form.certificateUrl} onChange={e => setForm({ ...form, certificateUrl: e.target.value })} /></div>
                </div>
                <button className="pf-btn pf-btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={onSave} disabled={saving}>
                    {saving ? 'Đang lưu...' : (form.id ? 'Lưu thay đổi' : 'Thêm mới')}
                </button>
            </div>
        </div>
    );
};
