import React from "react";
import { Typography, Container } from "@material-ui/core";
import NasherLogo from "../images/nashermuseum.svg";
import BackButton from "./BackButton";
import Copyright from "./Copyright";

class About extends React.Component {
  render() {
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
              This project is a collaboration between Computer Science 408 and
              the Nasher Museum of Art at Duke University.
            </Typography>
            <br />
            <Typography>
              CS 408 Coding the Collection Project Group: Samuel Chan, Edward
              Zhuang, William Ye, Santo Grillo
            </Typography>
            <br />
            <Typography>Clients: Julia McHugh, Mark Olson</Typography>
            <Typography>
              With Support From: Ajay Patel, Robert Duvall
            </Typography>
          </h3>
          <br />
        </div>

        <Container component="main" maxWidth="xs">
          <BackButton
            backPage="/welcome"
            history={this.props.history}
          ></BackButton>
        </Container>
        <br />
        <div>
          <Copyright />
        </div>
      </React.Fragment>
    );
  }
}

export default About;
