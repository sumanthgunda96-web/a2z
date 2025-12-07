import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDdzml673jKzsay4VMRj9mxg55ytZA1JOA",
    authDomain: "gunda-srinivas-fireworks.firebaseapp.com",
    projectId: "gunda-srinivas-fireworks",
    storageBucket: "gunda-srinivas-fireworks.firebasestorage.app",
    messagingSenderId: "176236120664",
    appId: "1:176236120664:web:2a37dbb8cfaeb28687182d",
    measurementId: "G-TKRH2STK1L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
