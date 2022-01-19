// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3NL0NPtzCBXivQD7Ejsbp1kUb3pHiY1c",
  authDomain: "mixing-testnet.firebaseapp.com",
  databaseURL:
    "https://mixing-testnet-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mixing-testnet",
  storageBucket: "mixing-testnet.appspot.com",
  messagingSenderId: "780953688776",
  appId: "1:780953688776:web:c953768f1955c6601923fd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
