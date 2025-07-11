// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8qAxNwVngc8bpxaWU0kQdqylQT5jtlhI",
  authDomain: "memo-app-4e0ec.firebaseapp.com",
  projectId: "memo-app-4e0ec",
  storageBucket: "memo-app-4e0ec.firebasestorage.app",
  messagingSenderId: "947374839290",
  appId: "1:947374839290:web:6de4477a73d318f0f80043"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);