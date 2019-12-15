import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

/*
Authors: Edward Zhuang, Will Ye, Sam Chan, Santo Grillo
Copyright to show that it is proprietary work of the CS 408 project group Coding the Collection and the Nasher
*/

export default function Copyright() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20
      }}
    >
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://coursework.cs.duke.edu/compsci408_2019fall/app_codingthecollection/blob/master/LICENSE"
        >
          CodingTheCollection
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </div>
  );
}
