import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '' }) => {
  return (
    <main className={`flex-1 ${className}`}>
      {children}
    </main>
  );
};

export default MainContent;