
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider,
getAuth, signInWithPopup, signOut, } from "firebase/auth"
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import {useAuth} from "./AuthContext";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async (setIsCheckingRegistration) => {
    try {
        setIsCheckingRegistration(true);
        const res = await signInWithPopup(auth, googleProvider);
        let user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            alert("Could not find user. Please register!");
            user = null;
            await signOut(auth);
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    } finally {
        setIsCheckingRegistration(false);
    }
};

const registerWithGoogle = async (setIsCheckingRegistration) => {
    try {
        setIsCheckingRegistration(true)
        const res = await signInWithPopup(auth, googleProvider);
        let user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
  signOut(auth);
    window.location.href = "/"
};

export {
    auth,
    db,
    signInWithGoogle,
    registerWithGoogle,
    logout,
};