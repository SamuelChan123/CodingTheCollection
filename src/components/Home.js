import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.js";

export default function Home() {
  return (
    <React.Fragment>
      <Navbar />
      <Link
        to="/allprojects"
        style={{
          textDecoration: "none"
        }}
      >
        (Temp) go to all projects
      </Link>
    </React.Fragment>
  );
}
