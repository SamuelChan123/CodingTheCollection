import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Register from './components/Register';
import Signin from './components/Signin.js';
import AllProjects from './components/AllProjects.js';
import Project from './components/Project.js';
import Navbar from './components/Navbar.js';
import NewProject from './components/NewProject.js';
import NewArtwork from './components/NewArtwork.js'
import EditArtwork from './components/EditArtwork.js'
import EditProject from './components/EditProject.js';
import PresentProject from './components/NewProject.js';
import Home from './components/Home.js';
import Presentation from './components/Presentation.js';
import Model from './components/Model';
import { withFirebase } from './components/Firebase';

class AppRouter extends Component {
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
    <Router>
      <div>
        <Navbar authUser={this.state.authUser} />
        <Switch>
          <Route path="/welcome" component={Home} />
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
          <Route path="/allprojects" component={AllProjects} />
          <Route path="/project" exact component={Project} />
          <Route path="/project/new" exact component={NewProject} />
          <Route path="/project/presentation" component={Presentation} />
          <Route path="/model" component={Model} />
          <Route path="/project/:projectId/artwork/new" exact component={NewArtwork} />
          <Route path="/project/:projectId/artwork/:artworkId/edit" exact component={EditArtwork} />
          <Route path="/project/edit" exact component={EditProject} />
          {/* <Route path="/artwork" exact component={Artwork} />
          <Route path="/artwork/new" exact component={NewArtwork} /> */}
          <Redirect exact from="/" to="/welcome" />
        </Switch>
      </div>
    </Router>
    );
  }
}
export default withFirebase(AppRouter);
