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
          <Button
            href="/howitworks"
            variant="contained"
            fullWidth
            color="primary"
          >
            <div
              style={{
                color: "white"
              }}
            >
              How it works
            </div>
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
          <Button href="/about" variant="contained" fullWidth color="primary">
            <div
              style={{
                textDecoration: "none",
                color: "white"
              }}
            >
              About Us
            </div>
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
