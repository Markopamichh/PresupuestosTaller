import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgYFpfwxf2v4Ogi8zdQT2xU5OwPBy9Fec",
  authDomain: "presupuesto-a0c1d.firebaseapp.com",
  projectId: "presupuesto-a0c1d",
  storageBucket: "presupuesto-a0c1d.firebasestorage.app",
  messagingSenderId: "26666170981",
  appId: "1:26666170981:web:ab52e4a5b2bf567553248c",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
