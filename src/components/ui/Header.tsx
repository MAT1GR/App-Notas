import React from 'react';
import { 
  Menu, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  User, 
  LogOut, 
  Maximize,
  Sun,
  Moon
} from 'lucide-react';
import { User as UserType } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { exportDocx } from '../../utils/exportUtils';

interface HeaderProps {
  toggleSidebar: () => void;
  openAuthModal: () => void;
  user: UserType | null;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, openAuthModal, user }) => {
  const { settings, toggleFullscreen } = useSettingsStore();
  const { currentDocument, updateDocument } = useDocumentStore();
  const { signOut } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  const handleSave = () => {
    if (currentDocument) {
      updateDocument(currentDocument.id, {
        title: currentDocument.title,
        content: currentDocument.content,
      });
    }
  };
  
  const handleExport = () => {
    if (currentDocument) {
      exportDocx(currentDocument.title, currentDocument.content);
    }
  };
  
  return (
    <header className={`${isDarkMode ? 'bg-background-secondary border-background-tertiary/50' : 'bg-white border-gray-200'} 
      px-4 py-2 flex items-center justify-between border-b transition-colors duration-200`}>
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="icon-btn mr-2"
          aria-label="Alternar barra lateral"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center">
          <span className="font-semibold text-lg">Inkroom</span>
          {currentDocument && (
            <span className={`ml-4 hidden md:inline-block ${isDarkMode ? 'text-content-secondary' : 'text-gray-600'}`}>
              {currentDocument.title || 'Documento sin título'}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {currentDocument && (
          <>
            <button 
              onClick={handleSave}
              className="icon-btn hidden sm:flex items-center"
              aria-label="Guardar documento"
              title="Guardar documento"
            >
              <Save size={18} />
            </button>
            
            <button 
              onClick={handleExport}
              className="icon-btn hidden sm:flex items-center"
              aria-label="Exportar como DOCX"
              title="Exportar como DOCX"
            >
              <Download size={18} />
            </button>
            
            <label 
              htmlFor="import-file" 
              className="icon-btn hidden sm:flex items-center cursor-pointer"
              aria-label="Importar documento"
              title="Importar documento"
            >
              <Upload size={18} />
              <input 
                id="import-file" 
                type="file" 
                accept=".docx,.txt" 
                className="hidden" 
                onChange={(e) => {
                  console.log('Import file:', e.target.files?.[0]);
                }}
              />
            </label>
          </>
        )}
        
        <button 
          onClick={toggleFullscreen}
          className="icon-btn"
          aria-label="Alternar pantalla completa"
          title="Alternar pantalla completa"
        >
          <Maximize size={18} />
        </button>
        
        <button
          onClick={toggleTheme}
          className="icon-btn"
          aria-label="Alternar tema"
          title="Alternar tema"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button 
          className="icon-btn"
          aria-label="Configuración"
          title="Configuración"
        >
          <Settings size={18} />
        </button>
        
        {user ? (
          <div className="relative ml-1">
            <button className={`flex items-center space-x-1 p-1.5 rounded-md ${isDarkMode ? 'hover:bg-background-tertiary/50' : 'hover:bg-gray-100'}`}>
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Usuario'} 
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-ui-primary flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
              )}
              <span className="text-sm hidden md:inline-block">{user.displayName}</span>
            </button>
            
            <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-background-secondary border-background-tertiary' : 'bg-white border-gray-200'} border hidden group-hover:block`}>
              <div className="py-1">
                <button 
                  onClick={() => signOut()}
                  className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-background-tertiary text-content-primary' : 'hover:bg-gray-100 text-gray-900'} flex items-center`}
                >
                  <LogOut size={16} className="mr-2" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={openAuthModal}
            className="btn-primary text-sm"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;