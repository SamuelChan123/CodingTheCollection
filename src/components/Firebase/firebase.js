import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyD91vak12Cq2FQNIMmS2xti5ym3bzwOnMk",
  authDomain: "codingthecollectionnasher.firebaseapp.com",
  databaseURL: "https://codingthecollectionnasher.firebaseio.com",
  projectId: "codingthecollectionnasher",
  storageBucket: "codingthecollectionnasher.appspot.com",
  messagingSenderId: "116235028163",
  appId: "1:116235028163:web:7708417c578429ff5c8476",
  measurementId: "G-HQLWJGPFJD"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.store = app.storage();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  projects = () => this.db.ref("projects");
  users = () => this.db.ref("users");
  artworks = () => this.db.ref("artworks");
  storage = () => this.store.ref();
}

export default Firebase;
