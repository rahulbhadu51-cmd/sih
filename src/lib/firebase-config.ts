
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  projectId: "studio-2743680357-e022c",
  appId: "1:74286697585:web:36e246f90625d905555fd0",
  storageBucket: "studio-2743680357-e022c.firebasestorage.app",
  apiKey: "AIzaSyB6O3JWM9Wu45GmX0K7vABF-EyZiiePwFw",
  authDomain: "studio-2743680357-e022c.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "74286697585"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
