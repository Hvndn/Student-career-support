import React from 'react';
import StudentSidebar from '../student/StudentSidebar';
import StudentHeader from './StudentHeader';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="dau-student-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafd' }}>
      <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main 
        className="dau-main-content" 
        style={{ 
          flex: 1, 
          marginLeft: (window.innerWidth > 1024) ? '260px' : '0', 
          padding: '0', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="dau-page-content" style={{ flex: 1 }}>
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 999
          }}
        />
      )}
    </div>
  );
};

export default StudentLayout;
