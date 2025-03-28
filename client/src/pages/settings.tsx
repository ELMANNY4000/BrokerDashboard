import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState(user?.name || "John Doe");
  const [email, setEmail] = useState("admin@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSignature, setEmailSignature] = useState(
    `Best regards,\n${user?.name || "John Doe"}\nAdministrator\nBroker Admin Platform`
  );
  
  // Form settings
  const [notifications, setNotifications] = useState({
    newUser: true,
    largeTx: true,
    withdrawal: true,
    systemAlert: true
  });
  
  const [systemSettings, setSystemSettings] = useState({
    currency: "USD ($)",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC-05:00 Eastern Time (US & Canada)",
    darkMode: false
  });
  
  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully"
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully"
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Account Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-slate-800 mb-4">Admin Profile</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-semibold">
                {fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button 
                className="text-primary-500 hover:text-primary-700 text-sm font-medium"
                onClick={() => toast({ title: "Feature Not Available", description: "Avatar change functionality is not implemented in this demo" })}
              >
                Change Avatar
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input 
                type="text" 
                value="Administrator" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50" 
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium text-slate-800 mb-4">Change Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <button 
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 mt-2"
                onClick={handleUpdatePassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-slate-800 mb-4">Email Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Signature</label>
              <textarea 
                rows={4} 
                value={emailSignature}
                onChange={(e) => setEmailSignature(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Email Notifications</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notifyNewUser" 
                    checked={notifications.newUser}
                    onChange={(e) => setNotifications({...notifications, newUser: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" 
                  />
                  <label htmlFor="notifyNewUser" className="ml-2 block text-sm text-slate-900">New user registrations</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notifyLargeTx" 
                    checked={notifications.largeTx}
                    onChange={(e) => setNotifications({...notifications, largeTx: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" 
                  />
                  <label htmlFor="notifyLargeTx" className="ml-2 block text-sm text-slate-900">Large transactions (over $5,000)</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notifyWithdrawal" 
                    checked={notifications.withdrawal}
                    onChange={(e) => setNotifications({...notifications, withdrawal: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" 
                  />
                  <label htmlFor="notifyWithdrawal" className="ml-2 block text-sm text-slate-900">User withdrawal requests</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notifySystemAlert" 
                    checked={notifications.systemAlert}
                    onChange={(e) => setNotifications({...notifications, systemAlert: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" 
                  />
                  <label htmlFor="notifySystemAlert" className="ml-2 block text-sm text-slate-900">System alerts and notifications</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium text-slate-800 mb-4">System Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={systemSettings.currency}
                  onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={systemSettings.dateFormat}
                  onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={systemSettings.timezone}
                  onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                >
                  <option>UTC-05:00 Eastern Time (US & Canada)</option>
                  <option>UTC+00:00 London, Edinburgh</option>
                  <option>UTC+01:00 Paris, Berlin, Rome, Madrid</option>
                  <option>UTC+08:00 Beijing, Hong Kong, Singapore</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="enableDarkMode" 
                  checked={systemSettings.darkMode}
                  onChange={(e) => setSystemSettings({...systemSettings, darkMode: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                />
                <label htmlFor="enableDarkMode" className="ml-2 block text-sm text-slate-900">Enable Dark Mode</label>
              </div>
              
              <button 
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 mt-2"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
