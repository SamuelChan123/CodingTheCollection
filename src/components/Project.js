import React from "react";

import { Link } from "react-router-dom";

import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList,
  Button,
  makeStyles
} from "@material-ui/core";
import { Edit as EditIcon, AddCircle } from "@material-ui/icons/";

import tileData from "../sample/ArtOfAmericas.js";
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
    height: 500
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

export default function Project() {
  const classes = useStyles();
  const exhibit = "Art of the Americas";

  return (
    <React.Fragment>
      <Navbar />
      <br />
      <div className={classes.root}>
        <GridList cellHeight={180} cols={4} className={classes.gridList}>
          <GridListTile key="Subheader" cols={4} style={{ height: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 10
              }}
            >
              <h1
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {exhibit}
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Button variant="contained" color="primary">
                Present Project
              </Button>
            </div>
          </GridListTile>
          {tileData.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${tile.title}`}
                    className={classes.icon}
                  >
                    <EditIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
          {
            <GridListTile>
              {/*<img src={add} />*/}
              <GridListTileBar
                title="Add New Artwork"
                actionIcon={
                  <IconButton className={classes.icon}>
                    <Link
                      to="/artwork"
                      style={{
                        textDecoration: "none",
                        color: "rgba(255, 255, 255, 0.54)"
                      }}
                    >
                      <AddCircle />
                    </Link>
                  </IconButton>
                }
              />
            </GridListTile>
          }
        </GridList>
      </div>
    </React.Fragment>
  );
}