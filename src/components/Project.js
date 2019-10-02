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
import { Edit as EditIcon, Add as AddIcon } from "@material-ui/icons/";

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
  button: {
    margin: theme.spacing(0.5)
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
                paddingBottom: 5
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
                alignItems: "center",
                paddingBottom: 10
              }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                <Link
                  to="/project/presentation"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Present Project
                </Link>
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                <Link
                  to="/project/edit"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Edit Project
                </Link>
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
                    <Link
                      to="/project/some_id_here/artwork/some_id_here/edit"
                      style={{
                        textDecoration: "none",
                        color: "rgba(255, 255, 255, 0.54)"
                      }}
                    >
                      <EditIcon />
                    </Link>
                  </IconButton>
                }
              />
            </GridListTile>
          ))}

          <GridListTile>
            {/*<img src={add} />*/}
            <Link
              to="/project/some_id_here/artwork/new"
              style={{
                textDecoration: "none",
                color: "rgba(255, 255, 255, 0.54)"
              }}
            >
              <GridListTileBar
                title="Add New Artwork"
                actionIcon={
                  <IconButton className={classes.icon}>
                    <AddIcon />
                  </IconButton>
                }
              />
            </Link>
          </GridListTile>
        </GridList>
      </div>
    </React.Fragment>
  );
}
