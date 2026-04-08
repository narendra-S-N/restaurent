import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

    apiKey: "AIzaSyBD_UKcmDfl77SOCqTONlzUTELrfwlfiDk",
    authDomain: "palle-food.firebaseapp.com",
    projectId: "palle-food",
    storageBucket: "palle-food.firebasestorage.app",
    messagingSenderId: "257567218569",
    appId: "1:257567218569:web:a2ab0d55721e7bdb8ddf58",
    measurementId: "G-MNP652PM0H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
