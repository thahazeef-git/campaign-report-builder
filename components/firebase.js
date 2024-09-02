import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCUCrsWLoaiwGawbKAaD-SnqOmZf3iuqsU",
    authDomain: "campaign-report-builder.firebaseapp.com",
    projectId: "campaign-report-builder",
    storageBucket: "campaign-report-builder.appspot.com",
    messagingSenderId: "177366243068",
    appId: "1:177366243068:web:3fc5d5f8a0c4036db22979",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };