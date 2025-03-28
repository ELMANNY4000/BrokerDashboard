import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    return currentPath === path;
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-slate-800 text-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 z-30" id="sidebar">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold">Broker Admin</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link 
              href="/dashboard" 
              className={`block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${
                isActive("/dashboard") ? "border-l-4 border-primary-500 bg-slate-700 text-white" : ""
              }`}
            >
              <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/users" 
              className={`block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${
                isActive("/users") ? "border-l-4 border-primary-500 bg-slate-700 text-white" : ""
              }`}
            >
              <i className="fas fa-users mr-2"></i> Users
            </Link>
          </li>
          <li>
            <Link 
              href="/transactions" 
              className={`block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${
                isActive("/transactions") ? "border-l-4 border-primary-500 bg-slate-700 text-white" : ""
              }`}
            >
              <i className="fas fa-exchange-alt mr-2"></i> Transactions
            </Link>
          </li>
          <li>
            <Link 
              href="/email-notifications" 
              className={`block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${
                isActive("/email-notifications") ? "border-l-4 border-primary-500 bg-slate-700 text-white" : ""
              }`}
            >
              <i className="fas fa-envelope mr-2"></i> Email Notifications
            </Link>
          </li>
          <li>
            <Link 
              href="/settings" 
              className={`block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${
                isActive("/settings") ? "border-l-4 border-primary-500 bg-slate-700 text-white" : ""
              }`}
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
        <a 
          href="#" 
          className="block py-2 text-slate-300 hover:text-white transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </a>
      </div>
    </div>
  );
}
