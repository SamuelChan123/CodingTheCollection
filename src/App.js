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
import EditProject from "./components/EditProject.js";
import PresentProject from "./components/NewProject.js";
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
          <Route path="/project/edit" exact component={EditProject} />
          <Route path="/project/present" exact component={PresentProject} />
          {/* <Route path="/artwork" exact component={Artwork} />
          <Route path="/artwork/new" exact component={NewArtwork} /> */}
          <Redirect exact from="/" to="/welcome" />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;
