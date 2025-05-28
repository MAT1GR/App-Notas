import { create } from 'zustand';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { initializeFirebase } from '../firebase/config';
import toast from 'react-hot-toast';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticating: boolean;
  setCurrentUser: (user: User | null) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticating: false,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  signInWithEmail: async (email, password) => {
    const { auth } = initializeFirebase();
    set({ isAuthenticating: true });
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        set({ 
          currentUser: {
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || result.user.email?.split('@')[0] || '',
            photoURL: result.user.photoURL || '',
          }
        });
        toast.success('Sesión iniciada correctamente');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.code === 'auth/invalid-credential' 
        ? 'Correo o contraseña incorrectos' 
        : 'Error al iniciar sesión');
    } finally {
      set({ isAuthenticating: false });
    }
  },
  
  signUpWithEmail: async (email, password) => {
    const { auth } = initializeFirebase();
    set({ isAuthenticating: true });
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        set({ 
          currentUser: {
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || result.user.email?.split('@')[0] || '',
            photoURL: result.user.photoURL || '',
          }
        });
        toast.success('Cuenta creada correctamente');
      }
    } catch (error: any) {
      console.error('Error al crear cuenta:', error);
      toast.error(error.code === 'auth/email-already-in-use'
        ? 'El correo ya está registrado'
        : 'Error al crear la cuenta');
    } finally {
      set({ isAuthenticating: false });
    }
  },
  
  signInWithGoogle: async () => {
    const { auth } = initializeFirebase();
    const provider = new GoogleAuthProvider();
    
    set({ isAuthenticating: true });
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        set({ 
          currentUser: {
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
          }
        });
        toast.success('Sesión iniciada correctamente');
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      set({ isAuthenticating: false });
    }
  },
  
  signOut: async () => {
    const { auth } = initializeFirebase();
    
    try {
      await firebaseSignOut(auth);
      set({ currentUser: null });
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  }
}));