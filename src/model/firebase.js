// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY824riKv1F2rEIBWGSSOV2goZyuY4VEM",
  authDomain: "turbo-umbrela.firebaseapp.com",
  projectId: "turbo-umbrela",
  storageBucket: "turbo-umbrela.firebasestorage.app",
  messagingSenderId: "415180108085",
  appId: "1:415180108085:web:a3cc33051037e709ae9c7c",
  measurementId: "G-RZEL2V6Q8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);