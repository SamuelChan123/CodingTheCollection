import React from 'react';
import { withFirebase } from './Firebase';
import { Button } from '@material-ui/core';

/*
Authors: Edward Zhuang
This allows users to sign out.  
*/

const SignOutButton = ({ firebase }) => (
  <Button color="inherit" type="button" onClick={firebase.doSignOut}>
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
