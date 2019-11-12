import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
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
        <h3>
          <Typography>
          CodingTheCollection helps you create educational presentations with uploaded images of artworks and related contextual media.
          <br />
          This is a collaboration between Computer Science 408 and the Nasher Museum of Art at Duke University.
          </Typography>
          
        </h3>
        <br />
        
      </div>
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
            How it works
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
