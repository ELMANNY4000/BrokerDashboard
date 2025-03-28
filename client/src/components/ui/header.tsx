import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  pageTitle: string;
}

export function Header({ pageTitle }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Close sidebar when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    // Also toggle a class on the sidebar element
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
  };
  
  // Format page title with capitalization
  const formattedTitle = pageTitle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-slate-600 hover:text-slate-900"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h2 className="text-xl font-semibold text-slate-800">{formattedTitle}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="text-slate-600 hover:text-slate-900 relative">
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name || 'John Doe'}</span>
        </div>
      </div>
    </header>
  );
}
