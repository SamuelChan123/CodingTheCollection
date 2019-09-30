import React from "react";
import { Link } from "react-router-dom";

import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList,
  makeStyles
} from "@material-ui/core";
import { Info as InfoIcon, Add as AddIcon } from "@material-ui/icons/";

import tileData from "../sample/AllProjectsSample";
import Navbar from "./NavbarUser";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 1000,
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

export default function AllProjects() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Navbar />
      <br />
      <div className={classes.root}>
        <GridList cellHeight={180} cols={4} className={classes.gridList}>
          <GridListTile key="Subheader" cols={4} style={{ height: "auto" }}>
            <h1
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              All Projects
            </h1>
          </GridListTile>
          {tileData.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.img} alt={tile.title} />
              <Link
                to="/project"
                style={{
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.54)"
                }}
              >
                <GridListTileBar
                  title={tile.title}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.title}`}
                      className={classes.icon}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </Link>
            </GridListTile>
          ))}
          {
            <GridListTile>
              {/*<img src={add} />*/}
              <Link
                to="/project/new"
                style={{
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.54)"
                }}
              >
                <GridListTileBar
                  title="Add New Project"
                  actionIcon={
                    <IconButton className={classes.icon}>
                      <AddIcon />
                    </IconButton>
                  }
                />
              </Link>
            </GridListTile>
          }
        </GridList>
      </div>
    </React.Fragment>
  );
}
