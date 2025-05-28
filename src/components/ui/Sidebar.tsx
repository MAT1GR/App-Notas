import React from 'react';
import { Plus, Folder } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { createDocument } = useDocumentStore();
  const { currentUser } = useAuthStore();
  
  const handleCreateDocument = () => {
    if (currentUser) {
      createDocument(currentUser.uid);
    }
  };
  
  return (
    <aside className="w-64 border-r border-background-tertiary/50 bg-background-secondary flex flex-col h-full">
      <div className="p-4 border-b border-background-tertiary/50 flex justify-between items-center">
        <div className="flex items-center">
          <Folder size={18} className="text-content-secondary mr-2" />
          <h2 className="font-medium">Documents</h2>
        </div>
        <button
          onClick={handleCreateDocument}
          className="icon-btn"
          aria-label="Create new document"
          title="Create new document"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;