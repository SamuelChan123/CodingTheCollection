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
        <center>
        <h2>
            How it works:
          </h2>
          <ol
          style={{
            textAlign: "center",
            listStylePosition: "inside",
            padding: "10px 200px",
          }}>
            <li>To begin using CodingTheCollection, please create an account. A link to the registration page can be found at the top right, if you are not signed in. <br/> <hr/></li>
            <li>Once you have created an account, please sign in. You will be directed to a home page which will say "Your Projects" and "Projects Shared With You". <br/> <hr/></li>
            <li>Click on the "Add New Project" button to create your first <strong>project</strong>. A project is a grouping of artworks and their related contextual medias. You must give a project a name, and you can add a cover photo if you like.<br/> <hr/></li>
            <li>After creating a project, you will see it show up under "Your Projects". Click a project to begin working on it.<br/> <hr/></li>
            <li>Since your project is currently empty, lets add some art to it by clicking the "Add New Artwork" button. 
              This will lead to a form where you will input information about the artwork. 
            An image and the name of the artwork are required. You will also be able to add contextual media as well. 
            You can add as many contextual media images as you want, but each one must be accompanied by a description. <br/> <hr/></li>
            <li>Click "Present Project" to view your project in presentation mode! Note that you can only do this when you have at least one artwork uploaded.<br/> <hr/></li>
            <li>You can also share a project by clicking the "Share Project" button. If a project is shared with you, it will show up in "Projects Shared With You".</li>
          </ol>
        </center>
        
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
              Currently, this is a placeholder video. A video explanation of how to use this application will be uploaded soon!
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
