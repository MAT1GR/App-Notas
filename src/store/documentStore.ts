import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { initializeFirebase } from '../firebase/config';
import toast from 'react-hot-toast';

export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  
  setCurrentDocument: (document: Document | null) => void;
  createDocument: (userId: string, title?: string) => Promise<Document | null>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  loadDocuments: (userId: string) => Promise<void>;
  saveToLocalStorage: (document: Partial<Document>) => void;
  loadFromLocalStorage: () => Partial<Document> | null;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  
  setCurrentDocument: (document) => set({ currentDocument: document }),
  
  createDocument: async (userId, title = 'Untitled Document') => {
    const { db } = initializeFirebase();
    
    try {
      const newDocument = {
        title,
        content: '',
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'documents'), newDocument);
      
      const createdDocument = {
        id: docRef.id,
        ...newDocument,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      set((state) => ({
        documents: [...state.documents, createdDocument],
        currentDocument: createdDocument,
      }));
      
      toast.success('Document created');
      return createdDocument;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
      return null;
    }
  },
  
  updateDocument: async (id, data) => {
    const { db } = initializeFirebase();
    const { currentDocument, documents } = get();
    
    if (!currentDocument) return;
    
    try {
      await updateDoc(doc(db, 'documents', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      const updatedDocument = {
        ...currentDocument,
        ...data,
        updatedAt: Timestamp.now(),
      };
      
      set({
        currentDocument: updatedDocument,
        documents: documents.map((doc) => 
          doc.id === id ? updatedDocument : doc
        ),
      });
      
      toast.success('Document saved', { id: 'document-saved' });
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to save document');
    }
  },
  

  
  deleteDocument: async (id) => {
    const { db } = initializeFirebase();
    const { documents, currentDocument } = get();
    
    try {
      await deleteDoc(doc(db, 'documents', id));
      
      const newDocuments = documents.filter((doc) => doc.id !== id);
      
      set({
        documents: newDocuments,
        currentDocument: currentDocument?.id === id 
          ? newDocuments[0] || null 
          : currentDocument,
      });
      
      toast.success('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  },
  
  loadDocuments: async (userId) => {
    const { db } = initializeFirebase();
    
    set({ isLoading: true });
    
    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const documents: Document[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      
      set({ 
        documents,
        currentDocument: documents.length > 0 ? documents[0] : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading documents:', error);
      set({ isLoading: false });
      toast.error('Failed to load documents');
    }
  },
  
  saveToLocalStorage: (document) => {
    try {
      localStorage.setItem('inkroom-document', JSON.stringify(document));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  
  
  loadFromLocalStorage: () => {
    try {
      const savedDocument = localStorage.getItem('inkroom-document');
      return savedDocument ? JSON.parse(savedDocument) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },
}));

