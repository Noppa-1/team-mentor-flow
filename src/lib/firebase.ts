import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB40HZGCJz02vSerjRwKtPGg_...",
  authDomain: "internship-app-1cabe.firebaseapp.com",
  projectId: "internship-app-1cabe",
  storageBucket: "internship-app-1cabe.appspot.com",
  messagingSenderId: "583836640777",
  appId: "1:583836640777:web:571ba3d4d1df8...",
  measurementId: "G-BKRN05M607",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
