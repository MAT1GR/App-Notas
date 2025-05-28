import React from 'react';
import { File, Trash2 } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { formatDate } from '../../utils/dateUtils';

const DocumentList: React.FC = () => {
  const { documents, currentDocument, setCurrentDocument, deleteDocument, isLoading } = useDocumentStore();

  if (isLoading) {
    return (
      <div className="p-4 text-content-secondary">
        Loading documents...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="p-4 text-content-secondary">
        No documents yet. Create one to get started!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-background-tertiary/30">
      {documents.map((doc) => (
        <li 
          key={doc.id}
          className={`
            flex items-center justify-between p-3 cursor-pointer
            ${currentDocument?.id === doc.id ? 'bg-background-tertiary/30' : 'hover:bg-background-tertiary/20'}
            transition-colors
          `}
          onClick={() => setCurrentDocument(doc)}
        >
          <div className="flex items-center overflow-hidden">
            <File size={16} className="text-content-secondary mr-2 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="truncate font-medium">{doc.title || 'Untitled Document'}</p>
              <p className="text-xs text-content-secondary truncate">
                {formatDate(doc.updatedAt)}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this document?')) {
                deleteDocument(doc.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-ui-error p-1 rounded-md hover:bg-background-tertiary/50 transition-colors"
            aria-label="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;