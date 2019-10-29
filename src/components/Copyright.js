import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export default function Copyright() {
  return (
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
  );
}
