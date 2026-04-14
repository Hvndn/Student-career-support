import React from 'react';
import { getImageUrl } from '../../../utils/urlUtils';
import EditableText from '../EditableText';

const ProfessionalTemplate = ({ 
  profile, 
  avatarBase64, 
  theme,
  isEditMode = false,
  onUpdate = () => {}
}) => {
  // Styles & Colors
  const accentColor = theme?.accentColor || '#1e3a8a'; // Navy Blue
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

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'SA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div id="cv-template-render" style={{
      width: '210mm',
      minHeight: '297mm',
      background: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      color: secondaryText,
      padding: '20mm 15mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>
        {`
          .editable-hover:hover { background: rgba(30, 41, 59, 0.05) !important; }
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
            z-index: 10;
          }
          .list-item-container:hover .btn-delete-cv { display: flex; align-items: center; justify-content: center; }
          .btn-add-cv {
             background: transparent;
             border: 1px dashed ${accentColor};
             color: ${accentColor};
             width: 100%;
             padding: 5px;
             margin-top: 10px;
             cursor: pointer;
             font-size: 8pt;
             border-radius: 4px;
          }
           @media print { .btn-delete-cv, .btn-add-cv { display: none !important; } }
        `}
      </style>

      {/* ── HEADER (Sarah J. Anderson Style) ── */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '25px', 
        marginBottom: '40px',
        paddingBottom: '25px',
        borderBottom: `1.5px solid ${borderColor}`
      }}>
        {/* Initial Circle Badge */}
        <div style={{
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24pt',
          fontWeight: 300,
          color: accentColor,
          flexShrink: 0
        }}>
          {getInitials(profile.fullName)}
        </div>

        {/* Name & Title */}
        <div style={{ flex: 1 }}>
          <EditableText 
            as="h1"
            value={profile.fullName} 
            onChange={(val) => handleUpdateField('fullName', val)} 
            style={{ fontSize: '22pt', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}
          />
          <EditableText 
            as="p"
            value={profile.major} 
            onChange={(val) => handleUpdateField('major', val)} 
            style={{ fontSize: '11pt', fontWeight: 600, color: accentColor, margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}
          />
        </div>

        {/* Contact info on the right */}
        <div style={{ fontSize: '8.5pt', color: mutedText, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>{profile.email}</div>
          <div>{profile.phone}</div>
          <div>{profile.address}</div>
        </div>
      </header>

      {/* ── TWO COLUMN BODY ── */}
      <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
        
        {/* LEFT COLUMN (35%) */}
        <aside style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Profile Section */}
          <section>
            <h3 style={{ fontSize: '10.5pt', fontWeight: 800, color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>PROFILE</h3>
            <EditableText 
              as="div"
              value={profile.bio} 
              onChange={(val) => handleUpdateField('bio', val)} 
              multiline={true}
              style={{ fontSize: '9pt', lineHeight: '1.6', color: secondaryText, textAlign: 'justify' }}
            />
          </section>

          {/* Skills Section */}
          <section>
            <h3 style={{ fontSize: '10.5pt', fontWeight: 800, color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>SKILLS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(profile.skills || []).map((s, i) => (
                <div key={i} className="list-item-container" style={{ fontSize: '9pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('skills', i)}>&times;</button>}
                  <span style={{ color: accentColor }}>•</span>
                  <EditableText 
                    value={s.skillName || s.name} 
                    onChange={(val) => updateListItem('skills', i, 'skillName', val)} 
                  />
                </div>
              ))}
              {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('skills', { skillName: 'New Skill' })}>+ ADD SKILL</button>}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h3 style={{ fontSize: '10.5pt', fontWeight: 800, color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>EDUCATION</h3>
            {(profile.educations || []).map((edu, i) => (
              <div key={i} className="list-item-container" style={{ marginBottom: '15px' }}>
                {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('educations', i)}>&times;</button>}
                <div style={{ fontWeight: 700, fontSize: '9pt', color: primaryText }}>
                   <EditableText value={edu.major} onChange={(val) => updateListItem('educations', i, 'major', val)} />
                </div>
                <div style={{ fontSize: '8.5pt', color: mutedText }}>
                   <EditableText value={edu.schoolName} onChange={(val) => updateListItem('educations', i, 'schoolName', val)} />
                </div>
                <div style={{ fontSize: '8pt', color: accentColor }}>
                   <EditableText value={edu.startDate} onChange={(val) => updateListItem('educations', i, 'startDate', val)} /> - <EditableText value={edu.endDate} onChange={(val) => updateListItem('educations', i, 'endDate', val)} />
                </div>
              </div>
            ))}
            {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('educations', { major: 'Degree', schoolName: 'University', startDate: '2020', endDate: '2024' })}>+ ADD EDUCATION</button>}
          </section>

        </aside>

        {/* RIGHT COLUMN (65%) */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Experience Section */}
          <section>
            <h3 style={{ fontSize: '10.5pt', fontWeight: 800, color: accentColor, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>EXPERIENCE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(profile.experiences || []).map((exp, i) => (
                <div key={i} className="list-item-container">
                  {isEditMode && <button className="btn-delete-cv" onClick={() => deleteListItem('experiences', i)}>&times;</button>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <EditableText 
                      as="h4" 
                      value={exp.jobTitle} 
                      onChange={(val) => updateListItem('experiences', i, 'jobTitle', val)} 
                      style={{ fontSize: '10pt', fontWeight: 800, color: primaryText, margin: 0 }}
                    />
                    <span style={{ fontSize: '8.5pt', color: mutedText, fontWeight: 700 }}>
                      <EditableText value={exp.startDate} onChange={(val) => updateListItem('experiences', i, 'startDate', val)} /> - <EditableText value={exp.endDate} onChange={(val) => updateListItem('experiences', i, 'endDate', val)} />
                    </span>
                  </div>
                  <EditableText 
                    as="p" 
                    value={exp.companyName} 
                    onChange={(val) => updateListItem('experiences', i, 'companyName', val)} 
                    style={{ fontSize: '9pt', fontWeight: 600, color: accentColor, margin: '0 0 6px 0', textTransform: 'uppercase' }}
                  />
                  <EditableText 
                    as="div" 
                    value={exp.description} 
                    onChange={(val) => updateListItem('experiences', i, 'description', val)} 
                    multiline={true} 
                    style={{ fontSize: '9pt', lineHeight: '1.5', color: secondaryText }}
                  />
                </div>
              ))}
              {isEditMode && <button className="btn-add-cv" onClick={() => addListItem('experiences', { jobTitle: 'New Position', companyName: 'Company Name', startDate: '2023', endDate: 'Present', description: 'Task and achievements...' })}>+ ADD EXPERIENCE</button>}
            </div>
          </section>

        </main>
      </div>

    </div>
  );
};

export default ProfessionalTemplate;
