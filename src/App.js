import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Register from "./components/Register";
import Signin from "./components/Signin.js";
import AllProjects from "./components/AllProjects.js";
import Project from "./components/Project.js";
import NewProject from "./components/NewProject.js";
import NewArtwork from "./components/NewArtwork.js"
import EditArtwork from "./components/EditArtwork.js"
import Home from "./components/Home.js";

import "./App.css";

function AppRouter() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/welcome" component={Home} />
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
          <Route path="/allprojects" component={AllProjects} />
          <Route path="/project" exact component={Project} />
          <Route path="/project/new" exact component={NewProject} />
          <Route path="/project/:projectId/artwork/new" exact component={NewArtwork} />
          <Route path="/project/:projectId/artwork/:artworkId/edit" exact component={EditArtwork} />
          {/* <Route path="/artwork" exact component={Artwork} />
          <Route path="/artwork/new" exact component={NewArtwork} /> */}
          <Redirect exact from="/" to="/welcome" />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;
