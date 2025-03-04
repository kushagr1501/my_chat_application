// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCv9xdHnI4GAgZVg55_Rj2KLfupTx8SI-8",
    authDomain: "newchatpractice.firebaseapp.com",
    projectId: "newchatpractice",
    storageBucket: "newchatpractice.firebasestorage.app",
    messagingSenderId: "329546981889",
    appId: "1:329546981889:web:e1555c3c404b3bdb42d600"
    //   measurementId: "G-FE10R4EXWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app)
export default app;
