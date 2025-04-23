// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "t-blog-a903d.firebaseapp.com",
  projectId: "t-blog-a903d",
  storageBucket: "t-blog-a903d.firebasestorage.app",
  messagingSenderId: "830924203939",
  appId: "1:830924203939:web:5811102d0495248e01dc16",
  measurementId: "G-VR6TL24M5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);