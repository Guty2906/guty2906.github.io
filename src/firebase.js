import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 👇 REEMPLAZA con tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD1nBoJlUbVuMV8uaUv_PPfWlcArghnCJU",
  authDomain: "nuestra-historia-88d0d.firebaseapp.com",
  databaseURL: "https://nuestra-historia-88d0d-default-rtdb.firebaseio.com",
  projectId: "nuestra-historia-88d0d",
  storageBucket: "nuestra-historia-88d0d.firebasestorage.app",
  messagingSenderId: "1088561571040",
  appId: "1:1088561571040:web:ab75e0a58c1b9b10bd1c85"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);