import React from 'react';
import { getImageUrl } from '../../../utils/urlUtils';
import EditableText from '../EditableText';

const ModernTemplate = ({ 
  profile, 
  avatarBase64, 
  experiences, 
  educations, 
  skills, 
  languages, 
  interests, 
  projects, 
  activities, 
  certifications, 
  theme,
  isEditMode = false,
  onUpdate = () => {}
}) => {
  // Styles & Colors
  const sidebarBg = '#8b1538';
  const mainBg = '#ffffff';
  const accentColor = theme?.accentColor || '#8b1538';
  const primaryText = '#0f172a';
  const secondaryText = '#334155';
  const mutedText = '#64748b';
  const borderColor = '#e2e8f0';

  const handleUpdateField = (field, value) => {
    onUpdate({ ...profile, [field]: value });
  };

  const updateListItem = (listName, idx, key, value) => {
    const newList = [...(profile[listName] || [])];
    newList[idx] = { ...newList[idx], [key]: value };
    handleUpdateField(listName, newList);
  };

  const deleteListItem = (listName, idx) => {
    const newList = [...(profile[listName] || [])];
    newList.splice(idx, 1);
    handleUpdateField(listName, newList);
  };

  const addListItem = (listName, blankItem) => {
    const newList = [...(profile[listName] || []), { ...blankItem, id: Date.now() }];
    handleUpdateField(listName, newList);
  };

  // SVG Icons
  const IconEmail = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  );
  const IconPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  );
  const IconMap = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  );

  return (
    <div id="cv-template-render" style={{
      width: '210mm',
      minHeight: '297mm',
      background: mainBg,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: secondaryText,
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>
        {`
          .editable-hover:hover {
            background: rgba(37, 99, 235, 0.05) !important;
            border-color: rgba(37, 99, 235, 0.2) !important;
          }
          .list-item-container { position: relative; }
          .btn-delete-cv {
            position: absolute;
            top: -5px;
            right: -20px;
            background: #ef4444;
            color: white;
            border: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: none;
            cursor: pointer;
            font-size: 12px;
            align-items: center;
            justify-content: center;
            z-index: 10;
          }
          .list-item-container:hover .btn-delete-cv { display: flex; }
          .btn-add-cv {
             background: transparent;
             border: 1px dashed ${accentColor};
             color: ${accentColor};
             width: 100%;
             padding: 5px;
             margin-top: 10px;
             cursor: pointer;
             font-size: 8pt;
             font-weight: 600;
             border-radius: 4px;
          }
          .btn-add-cv:hover { background: rgba(37, 99, 235, 0.05); }
          @media print {
            .btn-delete-cv, .btn-add-cv { display: none !important; }
            #cv-template-render { margin: 0 !important; width: 100% !important; height: 100% !important; }
          }
        `}
      </style>
      
      {/* ── LEFT SIDEBAR (30%) ── */}
      <aside style={{
        width: '32%',
        background: sidebarBg,
        padding: '30mm 12mm 20mm',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '40mm',
            height: '40mm',
            margin: '0 auto',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${mainBg}`,
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
          }}>
            <img 
              src={avatarBase64 || getImageUrl(profile.avatarUrl || profile.avatar) || 'https://vectorified.com/images/default-avatar-icon-33.png'} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Contact Info */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid rgba(255,255,255,0.3)`, paddingBottom: '4px', display: 'inline-block' }}>LIÊN HỆ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '9pt', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ffffff' }}><IconEmail /></span>
              <EditableText 
                value={profile.email} 
                onChange={(val) => handleUpdateField('email', val)} 
                placeholder="email@example.com" 
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ffffff' }}><IconPhone /></span>
              <EditableText 
                value={profile.phone} 
                onChange={(val) => handleUpdateField('phone', val)} 
                placeholder="0123 456 789" 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ffffff' }}><IconMap /></span>
              <EditableText 
                value={profile.address} 
                onChange={(val) => handleUpdateField('address', val)} 
                placeholder="Hà Nội, Việt Nam" 
              />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid rgba(255,255,255,0.3)`, paddingBottom: '4px', display: 'inline-block' }}>KỸ NĂNG</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#ffffff' }}>
            {(profile.skills || []).map((s, i) => (
              <div key={i} className="list-item-container">
                {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('skills', i)}>&times;</button>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', fontWeight: 600, marginBottom: '4px' }}>
                  <EditableText 
                    value={s.skillName || s.name} 
                    onChange={(val) => updateListItem('skills', i, 'skillName', val)} 
                    placeholder="Tên kỹ năng" 
                  />
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}>
                  <div style={{ width: s.proficiency === 'Expert' ? '100%' : s.proficiency === 'Advanced' ? '85%' : '65%', height: '100%', background: '#ffffff', borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
            {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('skills', { skillName: 'Kỹ năng mới', proficiency: 'Advanced' })}>+ THÊM KỸ NĂNG</button>}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid rgba(255,255,255,0.3)`, paddingBottom: '4px', display: 'inline-block' }}>NGOẠI NGỮ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#ffffff' }}>
            {(profile.languages || []).map((lang, i) => (
              <div key={i} className="list-item-container">
                {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('languages', i)}>&times;</button>}
                <EditableText 
                    as="p"
                    value={lang.languageName} 
                    onChange={(val) => updateListItem('languages', i, 'languageName', val)} 
                    placeholder="Tên ngôn ngữ" 
                    style={{ margin: 0, fontSize: '9pt', fontWeight: 700, color: '#ffffff' }}
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                    <EditableText 
                        value={lang.proficiency} 
                        onChange={(val) => updateListItem('languages', i, 'proficiency', val)} 
                        placeholder="Trình độ" 
                        style={{ margin: 0, fontSize: '8pt', color: mutedText }}
                    />
                    <span style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.7)' }}>•</span>
                    <EditableText 
                        value={lang.certificate} 
                        onChange={(val) => updateListItem('languages', i, 'certificate', val)} 
                        placeholder="Chứng chỉ" 
                        style={{ margin: 0, fontSize: '8pt', color: mutedText }}
                    />
                </div>
              </div>
            ))}
            {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('languages', { languageName: 'Tiếng Anh', proficiency: 'C1', certificate: 'IELTS 7.0' })}>+ THÊM NGOẠI NGỮ</button>}
          </div>
        </section>
      </aside>

      {/* ── MAIN CONTENT (70%) ── */}
      <main style={{
        flex: 1,
        padding: '30mm 20mm 20mm 15mm',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        wordBreak: 'break-word'
      }}>
        {/* Name Header */}
        <header style={{ marginBottom: '1rem' }}>
          <EditableText 
            as="h1"
            value={profile.fullName} 
            onChange={(val) => handleUpdateField('fullName', val)} 
            placeholder="HỌ TÊN CỦA BẠN" 
            style={{ 
                fontSize: '32pt', 
                fontWeight: 900, 
                color: primaryText, 
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-0.04em'
            }}
          />
          <EditableText 
            as="p"
            value={profile.major} 
            onChange={(val) => handleUpdateField('major', val)} 
            placeholder="VỊ TRÍ ỨNG TUYỂN" 
            style={{ 
                fontSize: '15pt', 
                fontWeight: 600, 
                color: accentColor, 
                margin: '12px 0 0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
            }}
          />
        </header>

        {/* Bio / Summary */}
        <section>
          <EditableText 
            as="div"
            value={profile.bio} 
            onChange={(val) => handleUpdateField('bio', val)} 
            placeholder="Năng lực cốt lõi và định hướng nghề nghiệp của bạn..." 
            multiline={true}
            style={{ fontSize: '10.5pt', color: secondaryText, lineHeight: '1.6', textAlign: 'justify', fontStyle: 'italic' }}
          />
        </section>

        {/* Experience */}
        <section>
          <h3 style={{ fontSize: '14pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '2rem', height: '2.5px', background: accentColor }}></span>
            KINH NGHIỆM LÀM VIỆC
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {(profile.experiences || []).map((exp, i) => (
              <div key={i} className="list-item-container">
                {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('experiences', i)}>&times;</button>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <EditableText 
                    as="h4"
                    value={exp.jobTitle || exp.position} 
                    onChange={(val) => updateListItem('experiences', i, 'jobTitle', val)} 
                    placeholder="Vị trí công việc" 
                    style={{ margin: 0, fontSize: '11.5pt', fontWeight: 800, color: primaryText, flex: '1 1 250px', minWidth: 0 }}
                  />
                  <span style={{ fontSize: '9.5pt', color: mutedText, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    <EditableText 
                        value={exp.startDate} 
                        onChange={(val) => updateListItem('experiences', i, 'startDate', val)} 
                        placeholder="Bắt đầu" 
                    />
                    &nbsp;—&nbsp;
                    <EditableText 
                        value={exp.endDate} 
                        onChange={(val) => updateListItem('experiences', i, 'endDate', val)} 
                        placeholder="Hiện tại" 
                    />
                  </span>
                </div>
                <EditableText 
                    as="p"
                    value={exp.companyName} 
                    onChange={(val) => updateListItem('experiences', i, 'companyName', val)} 
                    placeholder="Tên công ty" 
                    style={{ margin: 0, fontWeight: 700, color: accentColor, fontSize: '10pt' }}
                />
                <EditableText 
                    as="div"
                    value={exp.description} 
                    onChange={(val) => updateListItem('experiences', i, 'description', val)} 
                    placeholder="Mô tả trách nhiệm và thành tựu..." 
                    multiline={true}
                    style={{ margin: '8px 0 0', fontSize: '10pt', color: secondaryText, lineHeight: '1.5' }}
                />
              </div>
            ))}
            {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('experiences', { jobTitle: 'Vị trí mới', companyName: 'Công ty mới', startDate: '2023', endDate: 'Huyền tại', description: 'Mô tả...' })}>+ THÊM KINH NGHIỆM</button>}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 style={{ fontSize: '14pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '2rem', height: '2.5px', background: accentColor }}></span>
            HỌC VẤN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {(profile.educations || []).map((edu, i) => (
              <div key={i} className="list-item-container">
                {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('educations', i)}>&times;</button>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <EditableText 
                    as="h4"
                    value={edu.schoolName || edu.universityName} 
                    onChange={(val) => updateListItem('educations', i, 'schoolName', val)} 
                    placeholder="Tên trường học" 
                    style={{ margin: 0, fontSize: '11.5pt', fontWeight: 800, color: primaryText, flex: '1 1 250px', minWidth: 0 }}
                  />
                  <span style={{ fontSize: '9.5pt', color: mutedText, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    <EditableText 
                        value={edu.startDate} 
                        onChange={(val) => updateListItem('educations', i, 'startDate', val)} 
                        placeholder="Bắt đầu" 
                    />
                    &nbsp;—&nbsp;
                    <EditableText 
                        value={edu.endDate} 
                        onChange={(val) => updateListItem('educations', i, 'endDate', val)} 
                        placeholder="Tốt nghiệp" 
                    />
                  </span>
                </div>
                <EditableText 
                    as="p"
                    value={edu.major} 
                    onChange={(val) => updateListItem('educations', i, 'major', val)} 
                    placeholder="Chuyên ngành" 
                    style={{ margin: 0, fontWeight: 700, color: accentColor, fontSize: '10pt' }}
                />
                <EditableText 
                    as="div"
                    value={edu.description} 
                    onChange={(val) => updateListItem('educations', i, 'description', val)} 
                    placeholder="Điểm số, giải thưởng hoặc các khóa học tiêu biểu..." 
                    multiline={true}
                    style={{ margin: '6px 0 0', fontSize: '10pt', color: secondaryText }}
                />
              </div>
            ))}
            {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('educations', { schoolName: 'Đại học Đông Á', major: 'CNTT', startDate: '2023', endDate: '2027', description: '' })}>+ THÊM HỌC VẤN</button>}
          </div>
        </section>

        {/* Footer Branding */}
        <footer style={{ 
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: `1px solid ${sidebarBg}`,
          textAlign: 'center',
          fontSize: '8pt',
          color: mutedText
        }}>
          Bản quyền hệ thống <strong>Fivecore</strong> &copy; 2024 • Hồ sơ được tối ưu cho nhà tuyển dụng
        </footer>
      </main>
    </div>
  );
};

export default ModernTemplate;
