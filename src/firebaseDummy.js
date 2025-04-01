// Rename to firebase.js

// Import Firebase libraries
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration (Replace with your Firebase Project details)
const firebaseConfig = {
  apiKey: "", // Your Firebase API Key
  authDomain: "", // Your Firebase Auth domain
  projectId: "", // Your Firebase Project ID
  storageBucket: "", // Your Firebase Storage Bucket
  messagingSenderId: "", // Your Messaging Sender ID
  appId: "", // Your Firebase App ID
  measurementId: "", // Your Firebase Measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initializes Firebase with the provided configuration

// Set up Firebase Authentication
const auth = getAuth(app); // This sets up Firebase Authentication

// Google Authentication Provider
const googleProvider = new GoogleAuthProvider(); // Google provider for Firebase Authentication

// Set up Firestore Database
const db = getFirestore(app); // Initializes Firestore database

// Export Firebase features that we will use in other files
export { app, db, auth, googleProvider };
