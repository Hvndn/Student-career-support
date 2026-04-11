import React from 'react';
import { getImageUrl } from '../../utils/urlUtils';

const CVTemplate = ({ profile, avatarBase64, experiences, educations, skills, languages, interests, projects, activities, certifications, theme }) => {
  // Styles & Colors
  const sidebarBg = '#f1f5f9'; // Subtle blue-gray
  const mainBg = '#ffffff';
  const accentColor = theme?.accentColor || '#2563eb'; // Royal Blue or custom
  const primaryText = '#0f172a'; // Midnight
  const secondaryText = '#334155'; // Slate
  const mutedText = '#64748b'; // Light Slate
  const borderColor = '#e2e8f0'; // Border

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
    <div id="cv-template" style={{
      width: '210mm',
      minHeight: '297mm',
      background: mainBg,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: secondaryText,
      display: 'flex',
      overflow: 'hidden'
    }}>
      
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
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '4px', display: 'inline-block' }}>LIÊN HỆ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '9pt' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: accentColor }}><IconEmail /></span>
              <span style={{ wordBreak: 'break-all' }}>{profile.email || 'email@example.com'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: accentColor }}><IconPhone /></span>
              <span>{profile.phone || '0123 456 789'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: accentColor }}><IconMap /></span>
              <span>{profile.address || 'Hà Nội, Việt Nam'}</span>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '4px', display: 'inline-block' }}>KỸ NĂNG</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skills && skills.length > 0 ? skills.slice(0, 8).map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{s.skillName || s.name}</span>
                </div>
                <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '3px' }}>
                  <div style={{ width: s.proficiency === 'Expert' ? '100%' : s.proficiency === 'Advanced' ? '85%' : '65%', height: '100%', background: accentColor, borderRadius: '3px' }}></div>
                </div>
              </div>
            )) : <p style={{ fontSize: '8.5pt', fontStyle: 'italic' }}>Chưa có thông tin.</p>}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '4px', display: 'inline-block' }}>NGOẠI NGỮ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {languages && languages.length > 0 ? languages.map((lang, i) => (
              <div key={i}>
                <p style={{ margin: 0, fontSize: '9pt', fontWeight: 700, color: primaryText }}>{lang.languageName}</p>
                <p style={{ margin: 0, fontSize: '8pt', color: mutedText }}>{lang.proficiency} • {lang.certificate}</p>
              </div>
            )) : <p style={{ fontSize: '8.5pt', fontStyle: 'italic' }}>Chưa có thông tin.</p>}
          </div>
        </section>

        {/* Interests */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', letterSpacing: '0.05em', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '4px', display: 'inline-block' }}>SỞ THÍCH</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {interests && interests.map((item, i) => (
              <span key={i} style={{ fontSize: '8.5pt', background: mainBg, color: secondaryText, padding: '3px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                {item.name}
              </span>
            ))}
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
          <h1 style={{ 
            fontSize: '32pt', 
            fontWeight: 900, 
            color: primaryText, 
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-0.04em'
          }}>
            {profile.fullName || 'HỌ TÊN CỦA BẠN'}
          </h1>
          <p style={{ 
            fontSize: '15pt', 
            fontWeight: 600, 
            color: accentColor, 
            margin: '12px 0 0',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {profile.major || 'Chuyên ngành học thuật'}
          </p>
        </header>

        {/* Bio / Summary */}
        <section>
          <div 
            style={{ fontSize: '10.5pt', color: secondaryText, lineHeight: '1.6', textAlign: 'justify', fontStyle: 'italic' }}
            dangerouslySetInnerHTML={{ __html: profile.bio || 'Sinh viên năng động với nền tảng kiến thức vững chắc.' }}
          />
        </section>

        {/* Experience */}
        <section>
          <h3 style={{ fontSize: '14pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '2rem', height: '2.5px', background: accentColor }}></span>
            KINH NGHIỆM LÀM VIỆC
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {experiences && experiences.length > 0 ? experiences.map((exp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 800, color: primaryText, flex: '1 1 250px', minWidth: 0 }}>{exp.jobTitle || exp.position}</h4>
                  <span style={{ fontSize: '9.5pt', color: mutedText, fontWeight: 700, whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.endDate || 'Hiện tại'}</span>
                </div>
                <p style={{ margin: 0, fontWeight: 700, color: accentColor, fontSize: '10pt' }}>{exp.companyName}</p>
                <div 
                  style={{ margin: '8px 0 0', fontSize: '10pt', color: secondaryText, lineHeight: '1.5' }}
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              </div>
            )) : <p style={{ color: mutedText, fontStyle: 'italic' }}>Chưa có thông tin.</p>}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 style={{ fontSize: '14pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '2rem', height: '2.5px', background: accentColor }}></span>
            HỌC VẤN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {educations && educations.length > 0 ? educations.map((edu, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 800, color: primaryText, flex: '1 1 250px', minWidth: 0 }}>{edu.schoolName || edu.universityName}</h4>
                  <span style={{ fontSize: '9.5pt', color: mutedText, fontWeight: 700, whiteSpace: 'nowrap' }}>{edu.startDate} — {edu.endDate || 'Tốt nghiệp 2027'}</span>
                </div>
                <p style={{ margin: 0, fontWeight: 700, color: accentColor, fontSize: '10pt' }}>{edu.major || profile.major}</p>
                {edu.description && (
                  <div style={{ margin: '6px 0 0', fontSize: '10pt', color: secondaryText }} dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            )) : <p style={{ color: mutedText, fontStyle: 'italic' }}>Chưa có thông tin.</p>}
          </div>
        </section>

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h3 style={{ fontSize: '14pt', fontWeight: 800, color: primaryText, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '2rem', height: '2.5px', background: accentColor }}></span>
              DỰ ÁN TIÊU BIỂU
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {projects.slice(0, 2).map((proj, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${borderColor}`, paddingLeft: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 800, color: primaryText }}>{proj.name}</h4>
                  </div>
                  <div style={{ fontSize: '9pt', fontWeight: 700, color: accentColor, marginBottom: '6px' }}>
                    {proj.role} • {proj.techStack}
                  </div>
                  <div 
                    style={{ fontSize: '10pt', color: secondaryText, lineHeight: '1.4', marginBottom: '8px' }}
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                  <div style={{ display: 'flex', gap: '15px' }}>
                    {proj.repositoryUrl && (
                      <a href={proj.repositoryUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8.5pt', color: accentColor, textDecoration: 'none', fontWeight: 600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        GitHub
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8.5pt', color: accentColor, textDecoration: 'none', fontWeight: 600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 22 3 22 10"></polyline><line x1="14" y1="10" x2="22" y2="2"></line></svg>
                        Demo Link
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

export default CVTemplate;
