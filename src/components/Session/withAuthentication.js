import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

/*
Authors: Edward Zhuang
We use this to handle authentication logic. authUser is null if there is no signed in user.
This code was adapted from a tutorial at https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial.
*/


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
