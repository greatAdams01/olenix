import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCiIn3y-R-xDrDHhuXWXUVzrC2UPlaM3Sc",
  authDomain: "garet-2cc7a.firebaseapp.com",
  projectId: "garet-2cc7a",
  storageBucket: "garet-2cc7a.firebasestorage.app",
  messagingSenderId: "965906073525",
  appId: "1:965906073525:web:65cd23e8f5246af1e63bfc"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
