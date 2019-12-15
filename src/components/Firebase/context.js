import React from 'react';

/*
Authors: Edward Zhuang
We use this higher-order component so components like SignIn do not need to know about the Firebase instance.
This code was adapted from a tutorial at https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial.
*/

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;