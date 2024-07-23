// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAEobDDXBvGdK4anqRlQOihhiCD8okJ4pM",
	authDomain: "catch-the-note-f2684.firebaseapp.com",
	projectId: "catch-the-note-f2684",
	storageBucket: "catch-the-note-f2684.appspot.com",
	messagingSenderId: "420790533871",
	appId: "1:420790533871:web:d0cbede9bbf9c34cbb251a",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
