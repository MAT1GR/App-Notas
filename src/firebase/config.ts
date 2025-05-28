import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDCKlGwznampc2tcDU-iH3OfMbxyK3w1e4",
  authDomain: "appnotas-116b3.firebaseapp.com",
  databaseURL: "https://appnotas-116b3-default-rtdb.firebaseio.com",
  projectId: "appnotas-116b3",
  storageBucket: "appnotas-116b3.firebasestorage.app",
  messagingSenderId: "852404672328",
  appId: "1:852404672328:web:8f7122daec137d9d32c57d",
  measurementId: "G-KH6PYE695T"
};

let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;

export const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  
  return { app, auth, db, storage };
};