import { useState } from "react";
import { Link } from "wouter";
import { User } from "@shared/schema";
import { AddFundsModal } from "@/components/ui/add-funds-modal";
import { useToast } from "@/hooks/use-toast";

interface UserTableProps {
  users: User[];
  title?: string;
  showViewAllButton?: boolean;
  viewAllLink?: string;
  showPagination?: boolean;
}

export function UserTable({ 
  users, 
  title = "Users", 
  showViewAllButton = false,
  viewAllLink = "/users",
  showPagination = false
}: UserTableProps) {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = showPagination 
    ? users.slice(indexOfFirstUser, indexOfLastUser) 
    : users;
  const totalPages = Math.ceil(users.length / usersPerPage);
  
  const handleAddFundsClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const handleEmailClick = (user: User) => {
    toast({
      title: "Email Function",
      description: `Email functionality for ${user.fullName} is not implemented in this demo.`
    });
  };
  
  const handleViewClick = (user: User) => {
    toast({
      title: "View User Details",
      description: `Viewing details for ${user.fullName} is not implemented in this demo.`
    });
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        {(title || showViewAllButton) && (
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {showViewAllButton && (
              <Link 
                href={viewAllLink}
                className="text-primary-500 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            )}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                          <span>{user.fullName.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{new Date(user.createdAt).toISOString().split('T')[0]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">${parseFloat(user.balance).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-primary-500 hover:text-primary-700 mr-3"
                        onClick={() => handleAddFundsClick(user)}
                      >
                        Add Funds
                      </button>
                      <button 
                        className="text-slate-500 hover:text-slate-700 mr-3"
                        onClick={() => handleEmailClick(user)}
                      >
                        Email
                      </button>
                      <button 
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => handleViewClick(user)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {showPagination && totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
            </div>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                
                if (pageNum <= totalPages) {
                  return (
                    <button 
                      key={pageNum}
                      className={`px-3 py-1 border border-slate-300 rounded ${
                        currentPage === pageNum 
                          ? 'bg-primary-500 text-white' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              <button 
                className={`px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <AddFundsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser}
      />
    </>
  );
}
