import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkihcVEzXJZ0TROsOAga0hbczNNU9lV74",
  authDomain: "loginpage-9a8e4.firebaseapp.com",
  projectId: "loginpage-9a8e4",
  storageBucket: "loginpage-9a8e4.firebasestorage.app",
  messagingSenderId: "282203201056",
  appId: "1:282203201056:web:c4226ebca549074c126645",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
