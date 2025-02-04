import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBtyhVvhsZabNKtYCNWUYWVsTyHs1m_gOw",
  authDomain: "blockeditor-ab41b.firebaseapp.com",
  projectId: "blockeditor-ab41b",
  storageBucket: "blockeditor-ab41b.firebasestorage.app",
  messagingSenderId: "664484068128",
  appId: "1:664484068128:web:60cade9c3e81c6dbcd7545",
  measurementId: "G-VYG2QPG9W5"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db } 