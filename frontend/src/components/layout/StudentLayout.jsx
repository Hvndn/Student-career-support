import React from 'react';
import StudentSidebar from '../student/StudentSidebar';

const StudentLayout = ({ children }) => {
  return (
    <div className="dau-student-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafd' }}>
      <StudentSidebar />
      <main className="dau-main-content" style={{ flex: 1, marginLeft: '260px', padding: '0', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
