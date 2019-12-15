import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

/*
Authors: Sam Chan, Santo Grillo, Will Ye, Edward Zhuang
We use the Firebase class to make almost all of our calls to our Firebase backend (ex. adding artwork, updating projects, etc.)
*/


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

  userSpecificProjects = () =>
    this.db
      .ref("projects")
      .orderByChild("owner")
      .equalTo(this.auth.currentUser.uid);

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
    this.db
      .ref(url)
      .set(newData)
      .then(() => {
        this.db
          .ref(`users/${this.auth.currentUser.uid}/projects`)
          .push()
          .set({ project: key });
      });
  };

  setArtwork = data => {
    var myRef = this.db.ref("artworks").push(data);
    var key = myRef.key;
    data.id = key;
    this.db.ref(`artworks/${key}`).set(data);
    return key;
  };
  setContextualMedia = data => {
    var myRef = this.db.ref("contextualmedia").push(data);
    var key = myRef.key;
    data.id = key;
    this.db.ref(`contextualmedia/${key}`).set(data);
    return key;
  };
  setProjectWithId = (id, data) => {
    const url = `projects/${id}`;
    this.db.ref(url).set(data);
  };

  setArtworkWithId = (id, data) => {
    const url = `artworks/${id}`;
    this.db.ref(url).set(data);
  };

  setContextualWithId = (id, data) => {
    const url = `contextualmedia/${id}`;
    this.db.ref(url).set(data);
  };

  updateProjectWithId = (id, data) => {
    const url = `projects/${id}`;
    this.db.ref(url).update(data);
  };

  updateArtworkWithId = (id, data) => {
    const url = `artworks/${id}`;
    this.db.ref(url).update(data);
  };

  addArtworkToProject = (projectId, artworkId) => {
    this.db
      .ref(`projects/${projectId}/artworks`)
      .push()
      .set({ artId: artworkId });
  };
  addContextualMediaToArtwork = (artworkId, contextualMediaId) => {
    this.db
      .ref(`artworks/${artworkId}/contextualmedia`)
      .push()
      .set({ contextualMediaId: contextualMediaId });
  };

  addCollaboratorToProject = (projectId, email) => {
    this.db
      .ref(`projects/${projectId}/collaborators`)
      .push()
      .set({ userEmail: email });
  };

  getCollaborators = projectId =>
    this.db.ref(`projects/${projectId}/collaborators`);

  collaborator = (projectId, uid) =>
    this.db.ref(`projects/${projectId}/collaborators/${uid}`);

  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
  artworks = () => this.db.ref("artworks");
  storage = () => this.store.ref();
  contextualMedia = () => this.db.ref("contextualmedia");
}

export default Firebase;
