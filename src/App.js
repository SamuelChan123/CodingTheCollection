import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./components/Register";
import { Link, Redirect } from "react-router-dom";
import Signin from "./components/Signin";
import Button from "@material-ui/core/Button";
import AllProjects from "./components/AllProjects.js";
import Project from "./components/Project.js";
import NewProject from "./components/NewProject.js";
import "./App.css";

function Index() {
  return (
    <React.Fragment>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Link
            to="/allprojects"
            style={{ textDecoration: "none", color: "white" }}
          >
            Sign In
          </Link>
        </Button>
      </div>
    </React.Fragment>
  );
}

function AppRouter() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/welcome" component={Index} />
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
          <Route path="/allprojects" component={AllProjects} />
          <Route path="/project" exact component={Project} />
          <Route path="/project/new" exact component={NewProject} />
          <Redirect exact from="/" to="/welcome" />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;
