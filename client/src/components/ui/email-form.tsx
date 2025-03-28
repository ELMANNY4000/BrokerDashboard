import { useState } from "react";
import { User, InsertEmailNotification } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface EmailFormProps {
  users: User[];
  onSendEmail: (emailData: InsertEmailNotification) => void;
  isPending: boolean;
}

export function EmailForm({ users, onSendEmail, isPending }: EmailFormProps) {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("welcome");
  const [content, setContent] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [includeLogo, setIncludeLogo] = useState(true);
  
  // Set default content based on template
  const updateContentFromTemplate = (templateType: string) => {
    switch (templateType) {
      case "welcome":
        setContent(`
<h2>Welcome to Our Brokerage Platform</h2>
<p>Dear User,</p>
<p>We're excited to welcome you to our brokerage platform. Your account is now active and ready to use.</p>
<p>Here are a few quick links to get you started:</p>
<ul>
  <li>Complete your profile</li>
  <li>Add funds to your account</li>
  <li>Explore our investment options</li>
</ul>
<p>If you have any questions, please don't hesitate to contact our support team.</p>
<p>Happy investing!</p>
        `);
        break;
      case "funds":
        setContent(`
<h2>Funds Added to Your Account</h2>
<p>Dear User,</p>
<p>We're pleased to inform you that funds have been added to your brokerage account.</p>
<p>Please log in to your account to verify the transaction and start investing.</p>
<p>If you did not expect this transaction or have any questions, please contact our support team immediately.</p>
<p>Thank you for choosing our platform for your investment needs.</p>
        `);
        break;
      case "announcement":
        setContent(`
<h2>Important Announcement</h2>
<p>Dear Valued Customer,</p>
<p>We have an important announcement regarding our services.</p>
<p>Please read the details below:</p>
<p>[Announcement Details]</p>
<p>If you have any questions about this announcement, please contact our support team.</p>
<p>Thank you for your continued trust in our services.</p>
        `);
        break;
      case "custom":
        setContent("");
        break;
    }
  };
  
  // Handle template change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplate = e.target.value;
    setTemplate(newTemplate);
    updateContentFromTemplate(newTemplate);
  };
  
  // Handle recipient type change
  const handleRecipientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecipientType(e.target.value);
    setSelectedUserIds([]);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      toast({
        title: "Missing Subject",
        description: "Please provide an email subject",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide email content",
        variant: "destructive",
      });
      return;
    }
    
    if (recipientType === "custom" && selectedUserIds.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }
    
    // Create notification data
    const emailData: InsertEmailNotification = {
      subject,
      content,
      recipientType,
      recipientIds: recipientType === "custom" ? selectedUserIds.join(",") : undefined,
    };
    
    onSendEmail(emailData);
  };
  
  // Toggle user selection in custom recipients
  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };
  
  // Select or deselect all users
  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedUserIds(users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Send New Email Notification</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emailRecipients" className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
          <select 
            id="emailRecipients" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={recipientType}
            onChange={handleRecipientTypeChange}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users Only</option>
            <option value="inactive">Inactive Users Only</option>
            <option value="custom">Select Individual Users</option>
          </select>
        </div>
        
        {recipientType === "custom" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Users</label>
            <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2">
              {users.map(user => (
                <div className="flex items-center mb-2" key={user.id}>
                  <input 
                    type="checkbox" 
                    id={`user-${user.id}`} 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                  <label htmlFor={`user-${user.id}`} className="ml-2 block text-sm text-slate-900">
                    {user.fullName} ({user.email})
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button 
                type="button" 
                className="text-xs text-primary-500 hover:text-primary-700"
                onClick={() => handleSelectAll(true)}
              >
                Select All
              </button>
              <button 
                type="button" 
                className="text-xs text-primary-500 hover:text-primary-700"
                onClick={() => handleSelectAll(false)}
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="emailSubject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input 
            type="text" 
            id="emailSubject" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="emailTemplate" className="block text-sm font-medium text-slate-700 mb-1">Email Template</label>
          <select 
            id="emailTemplate" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={template}
            onChange={handleTemplateChange}
          >
            <option value="welcome">Welcome Email</option>
            <option value="funds">Funds Added Notification</option>
            <option value="announcement">General Announcement</option>
            <option value="custom">Custom Message</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="emailContent" className="block text-sm font-medium text-slate-700 mb-1">Email Content</label>
          <textarea 
            id="emailContent" 
            rows={8} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
            placeholder="Enter your message here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="includeLogo" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            checked={includeLogo}
            onChange={(e) => setIncludeLogo(e.target.checked)}
          />
          <label htmlFor="includeLogo" className="ml-2 block text-sm text-slate-900">Include company logo in email</label>
        </div>
        
        <div className="flex justify-between">
          <button 
            type="button" 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200"
            onClick={() => toast({
              title: "Preview Not Available",
              description: "Email preview functionality is not implemented in this demo."
            })}
          >
            Preview Email
          </button>
          <div>
            <button 
              type="button" 
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 mr-2"
              onClick={() => toast({
                title: "Draft Saved",
                description: "Your email draft has been saved."
              })}
            >
              Save as Draft
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
