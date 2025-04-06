// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBkgVbl9I1BnfnxfQymSMkO3QD2Sq1T18",
  authDomain: "lotto-ec591.firebaseapp.com",
  projectId: "lotto-ec591",
  storageBucket: "lotto-ec591.firebasestorage.app",
  messagingSenderId: "815333478867",
  appId: "1:815333478867:web:e556c00d3f422e77fa5f26",
  measurementId: "G-Y2DRFETL8N"
};

// firebase.initializeApp(config);  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



export { app, auth };