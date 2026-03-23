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
        deadline: '',

        experience: '',
        gender: '',
        education: '',

        contactName: '',
        contactAddress: '',

        companyInfo: '',

        // NEW
        logo: null,
        logoPreview: '',
        skillInput: '',
        skills: []
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Upload logo
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                logo: file,
                logoPreview: URL.createObjectURL(file)
            });
        }
    };

    // Add skill tag
    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && formData.skillInput.trim() !== '') {
            e.preventDefault();
            setFormData({
                ...formData,
                skills: [...formData.skills, formData.skillInput.trim()],
                skillInput: ''
            });
        }
    };

    // Remove skill
    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'skills') {
                    data.append('skills', JSON.stringify(formData.skills));
                } else {
                    data.append(key, formData[key]);
                }
            });

            await companyApi.postJob(data);

            alert("Đăng tin thành công!");
            navigate('/company/dashboard');
        } catch (err) {
            alert('Đăng tin thất bại!');
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h2 style={{ color: "white" }}>Đăng tin tuyển dụng</h2>
            </div>

            <div style={styles.container}>

                {/* FORM */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <h3 style={styles.title}>Thông tin công việc</h3>

                    <input style={styles.input} placeholder="Tiêu đề"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)} required />

                    <input style={styles.input} placeholder="Mức lương"
                        value={formData.salary}
                        onChange={(e) => handleChange('salary', e.target.value)} required />

                    <input style={styles.input} placeholder="Địa điểm"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)} required />

                    <select style={styles.input}
                        value={formData.jobType}
                        onChange={(e) => handleChange('jobType', e.target.value)}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Freelance</option>
                    </select>

                    <input type="date" style={styles.input}
                        value={formData.deadline}
                        onChange={(e) => handleChange('deadline', e.target.value)} required />

                    <textarea style={{ ...styles.input, height: 100 }}
                        placeholder="Mô tả"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)} required />

                    {/* TAG SKILL */}
                    <h3 style={styles.title}>Kỹ năng</h3>

                    <input
                        style={styles.input}
                        placeholder="Nhập kỹ năng và nhấn Enter..."
                        value={formData.skillInput}
                        onChange={(e) => handleChange('skillInput', e.target.value)}
                        onKeyDown={handleAddSkill}
                    />

                    <div style={styles.tagContainer}>
                        {formData.skills.map((skill, index) => (
                            <div key={index} style={styles.tag}>
                                {skill}
                                <span onClick={() => removeSkill(index)} style={styles.removeTag}>×</span>
                            </div>
                        ))}
                    </div>

                    {/* EXTRA */}
                    <h3 style={styles.title}>Chi tiết</h3>

                    <input style={styles.input} placeholder="Kinh nghiệm"
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)} />

                    <input style={styles.input} placeholder="Giới tính"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)} />

                    <input style={styles.input} placeholder="Học vấn"
                        value={formData.education}
                        onChange={(e) => handleChange('education', e.target.value)} />

                    {/* CONTACT */}
                    <h3 style={styles.title}>Liên hệ</h3>

                    <input style={styles.input} placeholder="Tên công ty"
                        value={formData.contactName}
                        onChange={(e) => handleChange('contactName', e.target.value)} />

                    <input style={styles.input} placeholder="Địa chỉ"
                        value={formData.contactAddress}
                        onChange={(e) => handleChange('contactAddress', e.target.value)} />

                    {/* COMPANY */}
                    <h3 style={styles.title}>Về công ty</h3>

                    <textarea style={{ ...styles.input, height: 100 }}
                        placeholder="Giới thiệu công ty..."
                        value={formData.companyInfo}
                        onChange={(e) => handleChange('companyInfo', e.target.value)} />

                    {/* LOGO */}
                    <h3 style={styles.title}>Logo công ty</h3>

                    <input type="file" accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ color: 'white' }} />

                    {formData.logoPreview && (
                        <img src={formData.logoPreview}
                            alt="logo"
                            style={styles.logoPreview} />
                    )}

                    <div style={styles.buttonGroup}>
                        <button type="button"
                            onClick={() => navigate('/company/dashboard')}
                            style={styles.cancelBtn}>
                            Hủy
                        </button>

                        <button type="submit" style={styles.submitBtn}>
                            Đăng tin
                        </button>
                    </div>
                </form>

                {/* PREVIEW */}
                <div style={styles.preview}>
                    <h3 style={styles.title}>Xem trước</h3>

                    <div style={styles.jobCard}>

                        {formData.logoPreview && (
                            <img src={formData.logoPreview} style={styles.logoSmall} alt="logo" />
                        )}

                        <h4>{formData.title || "Tiêu đề"}</h4>

                        <p>💰 {formData.salary || "Lương"}</p>
                        <p>📍 {formData.location || "Địa điểm"}</p>
                        <p>🕒 {formData.jobType}</p>
                        <p>📅 {formData.deadline || "Hạn nộp"}</p>

                        <hr />

                        <p>{formData.description || "Mô tả..."}</p>

                        <hr />

                        <h4>Kỹ năng</h4>
                        <div style={styles.tagContainer}>
                            {formData.skills.length > 0 ? (
                                formData.skills.map((skill, i) => (
                                    <div key={i} style={styles.tag}>{skill}</div>
                                ))
                            ) : <p>Chưa có</p>}
                        </div>

                        <hr />

                        <h4>Chi tiết</h4>
                        <p>💼 {formData.experience || "Không yêu cầu"}</p>
                        <p>👤 {formData.gender || "Không yêu cầu"}</p>
                        <p>🎓 {formData.education || "Không yêu cầu"}</p>

                        <hr />

                        <h4>Liên hệ</h4>
                        <p>🏢 {formData.contactName || "Công ty"}</p>
                        <p>📍 {formData.contactAddress || "Địa chỉ"}</p>

                        <hr />

                        <h4>Về công ty</h4>
                        <p>{formData.companyInfo || "Chưa có thông tin"}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const styles = {
    page: { background: '#0f172a', minHeight: '100vh', padding: '20px' },
    header: { maxWidth: '1200px', margin: '0 auto 20px' },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
    },
    form: {
        background: '#1e293b',
        padding: '20px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    preview: {
        background: '#1e293b',
        padding: '20px',
        borderRadius: '10px'
    },
    title: { color: 'white' },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #334155',
        background: '#0f172a',
        color: 'white'
    },
    jobCard: {
        background: '#0f172a',
        padding: '15px',
        borderRadius: '8px',
        color: 'white'
    },
    buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
    cancelBtn: {
        flex: 1,
        padding: '10px',
        background: '#334155',
        color: 'white',
        border: 'none',
        borderRadius: '6px'
    },
    submitBtn: {
        flex: 2,
        padding: '10px',
        background: '#22c55e',
        color: 'white',
        border: 'none',
        borderRadius: '6px'
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    tag: {
        background: '#22c55e',
        padding: '5px 10px',
        borderRadius: '20px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    removeTag: {
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    logoPreview: {
        width: '80px',
        marginTop: '10px',
        borderRadius: '8px'
    },
    logoSmall: {
        width: '60px',
        marginBottom: '10px',
        borderRadius: '6px'
    }
};

export default PostJob;