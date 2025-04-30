
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated && <Navbar />}
      
      <main className={`container max-w-screen-md mx-auto px-4 pt-6 pb-20 ${isAuthenticated ? 'md:pt-24' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
