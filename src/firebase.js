import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {

  apiKey: "AIzaSyCNSivfBdnwPmcVK_OoT860d1-UdpylGSs",

  authDomain: "flexiblefeedback.firebaseapp.com",

  projectId: "flexiblefeedback",

  storageBucket: "flexiblefeedback.firebasestorage.app",

  messagingSenderId: "130409821515",

  appId: "1:130409821515:web:53aa45566e1548e37224ce",

  measurementId: "G-V1HDXWKXXJ"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
