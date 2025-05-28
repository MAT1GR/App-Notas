import React, { useEffect, useState } from 'react';
import { Pen } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Header from './components/ui/Header';
import Sidebar from './components/ui/Sidebar';
import Editor from './components/editor/Editor';
import DocumentList from './components/ui/DocumentList';
import AuthModal from './components/auth/AuthModal';
import { useAuthStore } from './store/authStore';
import { useDocumentStore } from './store/documentStore';
import { initializeFirebase } from './firebase/config';
import { useSettingsStore } from './store/settingsStore';
import { useThemeStore } from './store/themeStore';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(true); // Start with auth modal open
  const { currentUser, setCurrentUser } = useAuthStore();
  const { loadDocuments } = useDocumentStore();
  const { settings } = useSettingsStore();
  const { isDarkMode } = useThemeStore();
  
  useEffect(() => {
    // Initialize Firebase
    const { auth } = initializeFirebase();
    
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || '',
          photoURL: user.photoURL || '',
        });
        loadDocuments(user.uid);
        setAuthModalOpen(false); // Close auth modal when user is logged in
      } else {
        setCurrentUser(null);
        setAuthModalOpen(true); // Show auth modal when user is logged out
      }
    });
    
    return () => unsubscribe();
  }, [setCurrentUser, loadDocuments]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className={`flex h-screen flex-col ${settings.font} transition-colors duration-200
        ${isDarkMode ? 'bg-background-primary text-content-primary' : 'bg-white text-gray-900'}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          openAuthModal={() => setAuthModalOpen(true)}
          user={currentUser}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {currentUser && sidebarOpen && (
            <Sidebar>
              <DocumentList />
            </Sidebar>
          )}
          
          <main className={`flex-1 overflow-auto ${isDarkMode ? 'bg-background-primary' : 'bg-gray-50'}`}>
            {currentUser ? (
              <Editor />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center">
                    <Pen className="h-8 w-8 text-ui-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Bienvenido a Inkroom</h2>
                  <p className={`mb-6 max-w-md ${isDarkMode ? 'text-content-secondary' : 'text-gray-600'}`}>
                    Una aplicación minimalista de escritura para autores, con sincronización en la nube y herramientas esenciales de formato.
                  </p>
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="btn-primary"
                  >
                    Iniciar sesión para comenzar
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => currentUser && setAuthModalOpen(false)} 
        />
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: isDarkMode ? '#1e293b' : '#ffffff',
              color: isDarkMode ? '#e2e8f0' : '#1e293b',
              borderRadius: '0.375rem',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;