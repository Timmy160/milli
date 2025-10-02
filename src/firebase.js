import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg3TDbgA8JDkS2IeDqv_IhYboBZ77IfSc",
  authDomain: "millionaire-child.firebaseapp.com",
  projectId: "millionaire-child",
  storageBucket: "millionaire-child.firebasestorage.app",
  messagingSenderId: "695604640032",
  appId: "1:695604640032:web:58f807e546d9bf0a5fff45"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
