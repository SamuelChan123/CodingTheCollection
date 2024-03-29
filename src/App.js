import React, { Component } from "react";

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
import Navbar from "./components/Navbar.js";
import NewProject from "./components/NewProject.js";
import NewArtwork from "./components/NewArtwork.js";
import EditArtwork from "./components/EditArtwork.js";
import EditProject from "./components/EditProject.js";
import ShareProject from "./components/ShareProject.js";
import Home from "./components/Home.js";
import Presentation from "./components/Presentation.js";
import Model from "./components/Model";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import { withAuthentication } from "./components/Session";

/*
 * App.js/App Router
 * Authors: Edward Zhuang, Will Ye, Sam Chan, Santo Grill
 * This class defines the routes/URLs and links them to their components
 */

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route path="/welcome" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/signin" component={Signin} />
            <Route path="/register" component={Register} />
            <Route path="/allprojects" component={AllProjects} />
            <Route path="/project/:projectId" exact component={Project} />
            <Route path="/newproject" exact component={NewProject} />
            <Route path="/howitworks" exact component={HowItWorks} />
            <Route
              path="/project/:projectId/present"
              exact
              component={Presentation}
            />
            <Route
              path="/project/:projectId/present/:artId"
              exact
              component={Presentation}
            />
            <Route path="/model" component={Model} />
            <Route
              path="/project/:projectId/newartwork"
              exact
              component={NewArtwork}
            />
            <Route
              path="/project/:projectId/editartwork/:artworkId"
              exact
              component={EditArtwork}
            />
            <Route
              path="/editproject/:projectId"
              exact
              component={EditProject}
            />
            <Route
              path="/shareproject/:projectId"
              exact
              component={ShareProject}
            />
            <Route path="*" component={Home} />
            <Redirect exact from="/" to="/welcome" />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default withAuthentication(AppRouter);
