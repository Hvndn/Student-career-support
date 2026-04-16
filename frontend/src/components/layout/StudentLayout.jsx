import React from 'react';
import StudentSidebar from '../student/StudentSidebar';
import StudentHeader from './StudentHeader';
import GlobalChatSidebar from './GlobalChatSidebar';
import { useMessaging } from '../../context/MessagingContext';

const StudentLayout = ({ children }) => {
  const { isChatOpen } = useMessaging();
  return (
    <div className="dau-student-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafd' }}>
      <StudentSidebar />
      <GlobalChatSidebar />
      <main 
        className="dau-main-content" 
        style={{ 
          flex: 1, 
          marginLeft: isChatOpen ? '580px' : '260px', 
          padding: '0', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <StudentHeader />
        <div className="dau-page-content" style={{ flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
