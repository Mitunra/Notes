/* eslint-disable no-unused-vars, no-console */

// firebaseConfig.js
//import * as firebase from 'firebase/app';
// Import Firebase modules using the modular syntax
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCobyImr2YlXvXBhpB2eApk2bYxgixpcwI",
    authDomain: "noteremainder.firebaseapp.com",
    projectId: "noteremainder",
    storageBucket: "noteremainder.appspot.com",
    messagingSenderId: "555797265203",
    appId: "1:555797265203:web:6fdaa1b4836f56413edc46",
    measurementId: "G-NDY672Y54B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db };
