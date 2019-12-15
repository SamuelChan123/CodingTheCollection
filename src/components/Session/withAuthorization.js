import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

/*
Authors: Edward Zhuang
We use this to handle authorization logic. If a user who is not signed in tries to access a page they need authorization for,
they will be redirected to the home page.
This code was adapted from a tutorial at https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial.
*/

const withAuthorization = Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (authUser == null) {
          this.props.history.push("/welcome");
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};
export default withAuthorization;
