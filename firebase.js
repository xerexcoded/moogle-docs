import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyCrnQ8coRC0LoK-RXwMgNBFQGuTYrh7i-w",
    authDomain: "moogle-docs.firebaseapp.com",
    projectId: "moogle-docs",
    storageBucket: "moogle-docs.appspot.com",
    messagingSenderId: "759148714269",
    appId: "1:759148714269:web:acc4846fb3d617b041e9f4"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();// if not intialized then intialize for the first time


  const db = app.firestore();
  export {db};