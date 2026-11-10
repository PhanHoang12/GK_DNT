
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey : "AIzaSyDc1VL07_ZyPMjlfGgqQBe4-EYXvXyHqhQ" ,
  authDomain : "admin-user-manager.firebaseapp.com" ,
  projectId : "admin-user-manager" ,
  storageBucket : "admin-user-manager.firebasestorage.app" ,
  messagingSenderId : "698711594221" ,
  appId : "1:698711594221:web:21cb50a1131066890868e4" ,
  measurementId : "G-XW3KXQ8H63"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
