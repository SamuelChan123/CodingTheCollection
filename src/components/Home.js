import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Navbar from "./Navbar.js";
import NasherLogo from "../images/nashermuseum.svg";
import Copyright from "./Copyright";

export default function Home() {
  return (
    <React.Fragment>
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10
        }}
      >
        <img src={NasherLogo} alt="" />
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10
        }}
      >
        <Button variant="contained" color="primary">
          <Link
            to="/allprojects"
            style={{
              textDecoration: "none",
              color: "white"
            }}
          >
            All Projects Page
          </Link>
        </Button>
      </div>
      <br />
      <div>
        <Copyright />
      </div>
    </React.Fragment>
  );
}
