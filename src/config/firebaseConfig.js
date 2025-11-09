// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbKzFbCvuGqc9FkcE4otDGk6-C-U2qvIs",
  authDomain: "rehabsoft-9fd02.firebaseapp.com",
  projectId: "rehabsoft-9fd02",
  storageBucket: "rehabsoft-9fd02.firebasestorage.app",
  messagingSenderId: "16257795217",
  appId: "1:16257795217:web:c56bd000718150db8f2b30"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia CORRECTA (sin warning)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});