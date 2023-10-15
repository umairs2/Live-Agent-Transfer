// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA_JzZHOKZaFM_4QdJZz2FhaLRD6Z5tb74',
  authDomain: 'seilvind-cloud-storage.firebaseapp.com',
  projectId: 'seilvind-cloud-storage',
  storageBucket: 'seilvind-cloud-storage.appspot.com',
  messagingSenderId: '726146106524',
  appId: '1:726146106524:web:ac0186f48c938845565959',
};

const app = initializeApp(firebaseConfig);

export default app;
