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

  getCurrentUser = () => this.auth.currentUser.uid;

  projects = () => this.db.ref("projects");

  userSpecificProjects = () => this.db.ref("projects").orderByChild("owner").equalTo(this.auth.currentUser.uid);


  project = projectId => {
    this.db.ref(`projects/${projectId}`).once("value", snapshot => {
      if (snapshot.exists()) {
        return snapshot;
      }
      return null;
    });
  };

  setProject = data => {
    var myRef = this.db.ref("projects").push(data);
    var key = myRef.key;
    const url = `projects/${key}`;

    var newData = {
      id: key,
      name: data.name,
      image: data.image,
      artworks: data.artworks,
      owner: this.auth.currentUser.uid
    };
    this.db.ref(url).set(newData)
    .then(() => {
      this.db.ref(`users/${this.auth.currentUser.uid}/projects`)
      .push()
      .set({project: key});
    });
  };


  setArtwork = data => {
    var myRef = this.db.ref("artworks").push(data);
    var key = myRef.key;
    const url = `artworks/${key}`;
    data.id = key;
    this.db.ref(url).set(data);
    return key;
  };
  setProjectWithId = (id, data) => {
    const url = `projects/${id}`;
    this.db.ref(url).set(data);
  };

  updateProjectWithId = (id, data) => {
    const url = `projects/${id}`;
    this.db.ref(url).update(data);
  };

  addArtworkToProject = (projectId, artworkId) => {
    this.db.ref(`projects/${projectId}/artworks`).push().set({artId: artworkId});
  }

  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
  artworks = () => this.db.ref("artworks");
  storage = () => this.store.ref();
}

export default Firebase;
