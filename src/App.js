import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from "./components/Register";
import { Link } from "react-router-dom";
import Signin from "./components/Signin";
import Button from "@material-ui/core/Button";
import Navbar from "./components/Navbar";
import AllProjects from "./components/AllProjects.js";
import "./App.css";

function Index() {
  return (
    <App-header>
      <br />
      <Button type="submit" variant="contained" color="primary">
        <Link
          to="/allprojects"
          style={{ textDecoration: "none", color: "white" }}
        >
          Sign In
        </Link>
      </Button>
    </App-header>
  );
}

function AppRouter() {
  return (
    <Router>
      <div>
        <Navbar />
        <Route path="/" exact component={Index} />
        <Route path="/signin" component={Signin} />
        <Route path="/register" component={Register} />
        <Route path="/allprojects" component={AllProjects} />
      </div>
    </Router>
  );
}

export default AppRouter;
