import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyD91vak12Cq2FQNIMmS2xti5ym3bzwOnMk",
  authDomain: "codingthecollectionnasher.firebaseapp.com",
  databaseURL: 'https://codingthecollectionnasher.firebaseio.com',
  projectId: "codingthecollectionnasher",
  storageBucket: "",
  messagingSenderId: "116235028163",
  appId: "1:116235028163:web:7708417c578429ff5c8476",
  measurementId: "G-HQLWJGPFJD"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);
  
  doSignInWithEmailAndPassword = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password);
    
  doSignOut = () => this.auth.signOut();

}



// doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
// doSignOut = () => this.auth.signOut();

export default Firebase;
