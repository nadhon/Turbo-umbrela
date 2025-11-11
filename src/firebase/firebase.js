import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDY824riKv1F2rEIBWGSSOV2goZyuY4VEM",
  authDomain: "turbo-umbrela.firebaseapp.com",
  projectId: "turbo-umbrela",
  storageBucket: "turbo-umbrela.firebasestorage.app",
  messagingSenderId: "415180108085",
  appId: "1:415180108085:web:a3cc33051037e709ae9c7c",
  measurementId: "G-RZEL2V6Q8S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
