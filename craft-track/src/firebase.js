import firebase from 'firebase'

require('firebase/app');
require('firebase/auth');
require('firebase/database');

var config = {
        apiKey: "AIzaSyCx4mbk0p-9anfE86Kl984Qw_rfb9tdRQI",
        authDomain: "crafttrack-11258.firebaseapp.com",
        projectId: "crafttrack-11258",
        storageBucket: "crafttrack-11258.appspot.com",
        messagingSenderId: "361870106796",
        appId: "1:361870106796:web:cee8a858d0106ba8057f09",
        measurementId: "G-Z2PZLH3HSS"
      };
firebase.initializeApp(config);
export default firebase;