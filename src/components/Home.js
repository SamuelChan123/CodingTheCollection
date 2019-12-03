import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Typography } from "@material-ui/core";
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
      <Container component="main" maxWidth="xs">
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
              CodingTheCollection helps you create educational presentations
              with uploaded images of artworks and related contextual media.
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
          <Button variant="contained" fullWidth color="primary">
            <Link
              to="/howitworks"
              style={{
                textDecoration: "none",
                color: "white"
              }}
            >
              How it works
            </Link>
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10
          }}
        >
          <Button variant="contained" fullWidth color="primary">
            <Link
              to="/about"
              style={{
                textDecoration: "none",
                color: "white"
              }}
            >
              About Us
            </Link>
          </Button>
        </div>
      </Container>
      <br />
      <div>
        <Copyright />
      </div>
    </React.Fragment>
  );
}
