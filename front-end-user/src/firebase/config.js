import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCM8raMXjX79CkRkyogsVEkgfiO-0qbjdY",
  authDomain: "yashi-d8d3d.firebaseapp.com",
  projectId: "yashi-d8d3d",
  storageBucket: "yashi-d8d3d.appspot.com",
  messagingSenderId: "134960462069",
  appId: "1:134960462069:web:d3363fc9a4644fa1242dbc",
  measurementId: "G-7C2CQ2YQJY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

