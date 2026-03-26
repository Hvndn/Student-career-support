import React from 'react';

const CVTemplate = ({ profile, experiences, educations, skills, languages }) => {
  return (
    <div id="cv-template" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '0',
      margin: '0',
      background: 'white',
      fontFamily: "'Outfit', sans-serif",
      color: '#1e293b',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header - High Impact */}
      <div style={{
        background: '#0f172a',
        color: 'white',
        padding: '40mm 20mm 15mm 20mm',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(37, 99, 235, 0.2)',
          borderRadius: '50%',
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '32pt', 
            fontWeight: 800, 
            margin: 0, 
            letterSpacing: '-0.03em',
            lineHeight: '1',
            textTransform: 'uppercase'
          }}>
            {profile.fullName || 'HỌ TÊN CỦA BẠN'}
          </h1>
          <p style={{ 
            fontSize: '16pt', 
            fontWeight: 500, 
            color: '#60a5fa', 
            margin: '0.75rem 0 0',
            letterSpacing: '0.05em'
          }}>
            {profile.major || 'Chuyên ngành học thuật'}
          </p>
        </div>

        {/* Contact Info in Header */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'right',
          fontSize: '10pt',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          opacity: 0.9
        }}>
          <p style={{ margin: 0 }}>{profile.email || 'email@example.com'}</p>
          <p style={{ margin: 0 }}>{profile.phone || '0123 456 789'}</p>
          <p style={{ margin: 0 }}>{profile.address || 'Hà Nội, Việt Nam'}</p>
        </div>
      </div>

      {/* Main Body - Balanced Two Column */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Column (Main) */}
        <div style={{ width: '65%', padding: '15mm 10mm 20mm 20mm' }}>
          
          {/* Summary */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '18px', background: '#2563eb' }}></span>
              GIỚI THIỆU BẢN THÂN
            </h3>
            <div 
              style={{ fontSize: '10.5pt', color: '#475569', lineHeight: '1.6', textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: profile.bio || 'Một sinh viên năng động với nền tảng kiến thức vững chắc và mong muốn phát triển sự nghiệp trong môi trường chuyên nghiệp.' }}
            />
          </section>

          {/* Experience */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '14pt', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '18px', background: '#2563eb' }}></span>
              KINH NGHIỆM LÀM VIỆC
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {experiences.length > 0 ? experiences.map((exp, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '1px solid #e2e8f0' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '9px', height: '9px', background: '#2563eb', borderRadius: '50%' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#1e293b' }}>{exp.position}</h4>
                    <span style={{ fontSize: '9pt', color: '#64748b', fontWeight: 600 }}>{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#2563eb', fontSize: '10pt' }}>{exp.companyName}</p>
                  <p style={{ margin: '0.6rem 0 0', fontSize: '10pt', color: '#475569', lineHeight: '1.5' }}>{exp.description}</p>
                </div>
              )) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có thông tin kinh nghiệm.</p>}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 style={{ fontSize: '14pt', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '4px', height: '18px', background: '#2563eb' }}></span>
              HỌC VẤN
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {educations.length > 0 ? educations.map((edu, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '1px solid #e2e8f0' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '9px', height: '9px', background: '#2563eb', borderRadius: '50%' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#1e293b' }}>{edu.universityName}</h4>
                    <span style={{ fontSize: '9pt', color: '#64748b', fontWeight: 600 }}>{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                  </div>
                  <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#2563eb', fontSize: '10pt' }}>{edu.degree} - {profile.major}</p>
                </div>
              )) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có thông tin học vấn.</p>}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ width: '35%', padding: '15mm 20mm 20mm 10mm', borderLeft: '1px solid #f1f5f9', background: '#fcfdfe' }}>
          
          {/* Skills Section */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kỹ năng chuyển môn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', fontWeight: 600 }}>
                    <span>{s.skillName}</span>
                    <span style={{ color: '#2563eb' }}>Expert</span>
                  </div>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: '85%', height: '100%', background: '#2563eb', borderRadius: '2px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ngoại ngữ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {languages && languages.length > 0 ? languages.map((lang, i) => (
                <div key={i} style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: 0, fontSize: '10pt', fontWeight: 700 }}>{lang.languageName}</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '8.5pt', color: '#64748b' }}>{lang.certificate || lang.proficiency}</p>
                </div>
              )) : (
                <p style={{ fontSize: '9pt', color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật ngoại ngữ.</p>
              )}
            </div>
          </section>

          {/* Projects Link/Meta */}
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chứng chỉ</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '9.5pt', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>Google Data Analytics Professional Certificate</li>
              <li>AWS Certified Cloud Practitioner</li>
            </ul>
          </section>

        </div>
      </div>

      {/* Footer Branding */}
      <footer style={{ 
        padding: '5mm 20mm', 
        borderTop: '1px solid #f1f5f9', 
        textAlign: 'center',
        fontSize: '8pt',
        color: '#94a3b8',
        background: '#fff'
      }}>
        Hồ sơ được tạo tự động bởi hệ thống Nexus Talent &copy; 2024
      </footer>
    </div>
  );
};

export default CVTemplate;
