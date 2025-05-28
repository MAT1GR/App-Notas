import React, { useState } from 'react';
import { X, LogIn, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isAuthenticating } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
  if (!isOpen) return null;
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
    onClose();
  };
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-background-secondary' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-md ${isDarkMode ? 'hover:bg-background-tertiary/50' : 'hover:bg-gray-100'}`}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            {isRegistering ? 'Crear una cuenta' : 'Iniciar sesión'}
          </h2>
          <p className={isDarkMode ? 'text-content-secondary' : 'text-gray-600'}>
            {isRegistering 
              ? 'Crea una cuenta para comenzar a escribir' 
              : 'Inicia sesión para acceder a tus documentos'}
          </p>
        </div>
        
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${
                isDarkMode 
                  ? 'bg-background-tertiary/30 border-background-tertiary text-content-primary' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${
                isDarkMode 
                  ? 'bg-background-tertiary/30 border-background-tertiary text-content-primary' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center space-x-2 btn-primary py-2.5"
          >
            {isAuthenticating ? (
              <span>Procesando...</span>
            ) : (
              <>
                <Mail size={18} />
                <span>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</span>
              </>
            )}
          </button>
        </form>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDarkMode ? 'border-background-tertiary' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${isDarkMode ? 'bg-background-secondary' : 'bg-white'}`}>
              O continuar con
            </span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isAuthenticating}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-md border ${
            isDarkMode 
              ? 'border-background-tertiary hover:bg-background-tertiary/30' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <LogIn size={18} />
          <span>Google</span>
        </button>
        
        <div className="mt-4 text-sm text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-ui-primary hover:text-ui-hover"
          >
            {isRegistering 
              ? '¿Ya tienes una cuenta? Inicia sesión' 
              : '¿No tienes una cuenta? Regístrate'}
          </button>
        </div>
        
        <div className={`mt-6 text-sm ${isDarkMode ? 'text-content-secondary' : 'text-gray-600'} text-center`}>
          <p>
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;