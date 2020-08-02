import*as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyA2AX0npXtm00j7iwDCh9QClRajJfNjA1s",
    authDomain: "wireless-library-3a8a8.firebaseapp.com",
    databaseURL: "https://wireless-library-3a8a8.firebaseio.com",
    projectId: "wireless-library-3a8a8",
    storageBucket: "wireless-library-3a8a8.appspot.com",
    messagingSenderId: "981760727060",
    appId: "1:981760727060:web:3eaf45cfbf4fe0a8442f01",
    measurementId: "G-Y0LCBTB5VX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore(); 