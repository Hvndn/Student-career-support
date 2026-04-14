import React from 'react';
import { getImageUrl } from '../../../utils/urlUtils';
import EditableText from '../EditableText';

const CreativeTemplate = ({ 
  profile, 
  avatarBase64, 
  theme,
  isEditMode = false,
  onUpdate = () => {}
}) => {
  // Styles & Colors (MATCHING SARAH JENKINS)
  const sidebarBg = '#008080'; // Teal/Green
  const accentColor = '#ff8c00'; // Orange
  const primaryText = '#ffffff';
  const bodyText = '#334155';
  const headerText = '#1e293b';

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

  return (
    <div id="cv-template-render" style={{
      width: '210mm',
      minHeight: '297mm',
      background: '#ffffff',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>
        {`
          .editable-hover:hover { background: rgba(0, 128, 128, 0.05) !important; }
          .list-item-container { position: relative; }
          .btn-delete-cv {
            position: absolute; top: -5px; right: -20px; background: #ef4444; color: white;
            border: none; width: 18px; height: 18px; border-radius: 50%; display: none; cursor: pointer;
            font-size: 12px; z-index: 10; align-items: center; justify-content: center;
          }
          .list-item-container:hover .btn-delete-cv { display: flex; }
          .btn-add-cv {
             background: transparent; border: 1px dashed ${sidebarBg}; color: ${sidebarBg};
             width: 100%; padding: 5px; margin-top: 10px; cursor: pointer; font-size: 8pt; border-radius: 4px;
          }
          @media print { .btn-delete-cv, .btn-add-cv { display: none !important; } }
          
          /* Geometric Decorations */
          .decoration-dot {
            width: 8px; height: 8px; border-radius: 50%; background: ${accentColor};
            position: absolute;
          }
        `}
      </style>

      {/* ── LEFT SIDEBAR (SARAH JENKINS STYLE) ── */}
      <aside style={{
        width: '32%',
        background: sidebarBg,
        padding: '2.5rem 1.5rem',
        color: primaryText,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        zIndex: 2
      }}>
        {/* Profile Circle Avatar */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '45mm',
            height: '45mm',
            margin: '0 auto',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `5px solid rgba(255,255,255,0.2)`,
            background: 'white'
          }}>
             <img 
               src={avatarBase64 || getImageUrl(profile.avatarUrl || profile.avatar) || 'https://vectorified.com/images/default-avatar-icon-33.png'} 
               alt="Avatar" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             />
          </div>
        </div>

        {/* Contact info below avatar */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: accentColor, marginBottom: '1rem', letterSpacing: '2px' }}>CONTACT</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '8.5pt' }}>
             <EditableText value={profile.phone} onChange={(val) => handleUpdateField('phone', val)} />
             <EditableText value={profile.email} onChange={(val) => handleUpdateField('email', val)} />
             <EditableText value={profile.address} onChange={(val) => handleUpdateField('address', val)} />
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: accentColor, marginBottom: '1rem', letterSpacing: '2px' }}>SKILLS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '8.5pt' }}>
             {(profile.skills || []).map((s, i) => (
               <div key={i} className="list-item-container">
                 {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('skills', i)}>&times;</button>}
                 <div style={{ marginBottom: '4px' }}>
                    <EditableText value={s.skillName || s.name} onChange={(val) => updateListItem('skills', i, 'skillName', val)} />
                 </div>
                 <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                    <div style={{ width: s.proficiency === 'Expert' ? '100%' : '75%', height: '100%', background: 'white' }} />
                 </div>
               </div>
             ))}
             {isEditMode && <button className="btn-add-cv" style={{borderColor: 'white', color: 'white'}} onClick={() => addListItem('skills', { skillName: 'New Skill' })}>+ ADD SKILL</button>}
          </div>
        </section>

        {/* Awards / Other */}
        <section>
          <h3 style={{ fontSize: '10pt', fontWeight: 800, color: accentColor, marginBottom: '1rem', letterSpacing: '2px' }}>AWARDS</h3>
          <div style={{ fontSize: '8.5pt', lineHeight: '1.5' }}>
             <EditableText as="div" value={profile.bio || "Awards list..."} multiline={true} onChange={() => {}} />
          </div>
        </section>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        padding: '3rem 2.5rem',
        position: 'relative'
      }}>
        {/* Name Header */}
        <header style={{ marginBottom: '3rem' }}>
          <EditableText 
            as="h1"
            value={profile.fullName} 
            onChange={(val) => handleUpdateField('fullName', val)} 
            style={{ fontSize: '36pt', fontWeight: 900, color: sidebarBg, margin: 0, letterSpacing: '-1px' }}
          />
          <EditableText 
            as="p"
            value={profile.major} 
            onChange={(val) => handleUpdateField('major', val)} 
            style={{ fontSize: '14pt', fontWeight: 600, color: accentColor, margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '3px' }}
          />
        </header>

        {/* PROFILE/SUMMARY */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 800, color: sidebarBg, borderBottom: `3px solid ${sidebarBg}`, paddingBottom: '5px', display: 'inline-block', marginBottom: '15px' }}>PROFILE</h3>
          <EditableText 
            as="p"
            value={profile.bio} 
            onChange={(val) => handleUpdateField('bio', val)} 
            multiline={true}
            style={{ fontSize: '9pt', lineHeight: '1.7', color: bodyText, textAlign: 'justify' }}
          />
        </section>

        {/* EXPERIENCE */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 800, color: sidebarBg, borderBottom: `3px solid ${sidebarBg}`, paddingBottom: '5px', display: 'inline-block', marginBottom: '15px' }}>EXPERIENCE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {(profile.experiences || []).map((exp, i) => (
                <div key={i} className="list-item-container">
                   {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('experiences', i)}>&times;</button>}
                   <div style={{ fontWeight: 800, fontSize: '10pt', color: headerText }}>
                      <EditableText value={exp.jobTitle} onChange={(val) => updateListItem('experiences', i, 'jobTitle', val)} />
                   </div>
                   <div style={{ fontSize: '9pt', color: accentColor, fontWeight: 700, margin: '2px 0' }}>
                      <EditableText value={exp.companyName} onChange={(val) => updateListItem('experiences', i, 'companyName', val)} /> 
                      <span style={{ color: bodyText, fontWeight: 400, marginLeft: '10px' }}>
                        (<EditableText value={exp.startDate} onChange={() => {}} /> - <EditableText value={exp.endDate} onChange={() => {}} />)
                      </span>
                   </div>
                   <EditableText as="div" value={exp.description} multiline={true} onChange={() => {}} style={{ fontSize: '9pt', lineHeight: '1.5', marginTop: '6px' }} />
                </div>
             ))}
             {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('experiences', { jobTitle: 'Position', companyName: 'Company', startDate: '2023', endDate: 'Present' })}>+ ADD EXPERIENCE</button>}
          </div>
        </section>

        {/* EDUCATION */}
        <section>
          <h3 style={{ fontSize: '12pt', fontWeight: 800, color: sidebarBg, borderBottom: `3px solid ${sidebarBg}`, paddingBottom: '5px', display: 'inline-block', marginBottom: '15px' }}>EDUCATION</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {(profile.educations || []).map((edu, i) => (
                <div key={i} className="list-item-container">
                   {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('educations', i)}>&times;</button>}
                   <div style={{ fontWeight: 800, fontSize: '10pt', color: headerText }}>
                      <EditableText value={edu.major} onChange={() => {}} />
                   </div>
                   <div style={{ fontSize: '9pt', color: bodyText }}>
                      <EditableText value={edu.schoolName} onChange={() => {}} />
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Orange Accent Dots */}
        <div className="decoration-dot" style={{ top: '40px', right: '40px' }} />
        <div className="decoration-dot" style={{ top: '80px', right: '100px', opacity: 0.5 }} />
        <div className="decoration-dot" style={{ top: '150px', right: '30px', width: '20px', height: '20px', opacity: 0.2 }} />

        {/* Footer Accent */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px',
          background: accentColor, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', opacity: 0.8
        }} />
      </main>
    </div>
  );
};

export default CreativeTemplate;
