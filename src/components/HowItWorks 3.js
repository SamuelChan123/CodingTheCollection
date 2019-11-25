import React from "react";
import { Typography } from "@material-ui/core";
import NasherLogo from "../images/nashermuseum.svg";
import BackButton from "./BackButton";
import Copyright from "./Copyright";

class HowItWorks extends React.Component {
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
              A video explanation of the Coding The Collection web application
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
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/0U_3sUbL-ek"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10
          }}
        >
          <BackButton
            backPage="/welcome"
            history={this.props.history}
          ></BackButton>
        </div>
        <br />
        <div>
          <Copyright />
        </div>
      </React.Fragment>
    );
  }
}

export default HowItWorks;
