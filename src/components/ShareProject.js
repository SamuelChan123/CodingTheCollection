import React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";
import ImageUploader from "react-images-upload";

import Copyright from "./Copyright";
import BackButton from "./BackButton";
import { withAuthorization } from "./Session";

class ShareProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        text: '',
        loading: false,
        collaborators: [],
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
    this.projectId = this.props.match.params.projectId;
    console.log(this.props.firebase.getCollaborators(this.projectId));
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onAddCollaborator = event => {
    this.props.firebase.getCollaborators(this.projectId).child((this.state.text).replace(/\./g, ",")).set(true)
    
    // push({
    //   email: this.state.text,
    // });
    this.setState({ text: '' });
    event.preventDefault();
  };

  onRemoveCollaborator = uid => {
    this.props.firebase.collaborator(this.projectId, uid).remove();
    // console.log(uid)
  };

  useStyles() {
    return makeStyles(theme => ({
      "@global": {
        body: {
          backgroundColor: theme.palette.common.white
        }
      },
      paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
      },
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
      },
      submit: {
        margin: theme.spacing(3, 0, 2)
      }
    }));
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.getCollaborators(this.projectId).on('value', snapshot => {
        // convert collaborators list from snapshot
        const collaboratorObject = snapshot.val();

        // console.log(this.projectId);


        if (collaboratorObject) {

          const collaboratorList = Object.keys(collaboratorObject).map(key => ({
            ...collaboratorObject[key],
            uid: key,
          }));
          // console.log(collaboratorList);

          this.setState({ 
            collaborators: collaboratorList,
            loading: false,
          });
        } else {
          this.setState({ collaborators: null, loading: false });
        }
    });
  }

  componentWillUnmount() {
    this.props.firebase.getCollaborators().off();
  }


  render() {
    const classes = this.useStyles();
    const noError = this.state.noError;
    const { text, collaborators, loading } = this.state;

    return (
      <React.Fragment>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography component="h1" variant="h5">
              Share Project
            </Typography>
          </div>

          <div className={classes.paper}>
          <form 
                className={classes.form}
                onSubmit={this.onAddCollaborator} 
            >
            <TextField 
                name="todo" 
                variant="outlined"
                fullWidth
                type="text" 
                value={text}
                onChange={this.onChangeText}
                placeholder="Enter collaborator email here... [Press Enter]" 
                autoComplete="off" />
          </form>

          <div>
            {loading && <div>Loading ...</div>}
            {collaborators ? (
              <CollaboratorList collaborators={collaborators} onRemoveCollaborator={this.onRemoveCollaborator} />
            ) : (
              <div>There are currently no collaborators.</div>
            )}
          </div>
          </div>
          <br />

          <BackButton history={this.props.history} />
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

const CollaboratorList = ({ collaborators, onRemoveCollaborator  }) => (
  <ul>
    {collaborators.map(collaborator => (
      <CollaboratorItem key={collaborator.uid} collaborator={collaborator} onRemoveCollaborator={onRemoveCollaborator}/>
    ))}
  </ul>
);
const CollaboratorItem = ({ collaborator, onRemoveCollaborator }) => (
  <li>
    <strong>{(collaborator.uid).replace(/,/g, ".")}</strong>
    <button
    type="button"
    onClick={() => onRemoveCollaborator(collaborator.uid)}
  >
    Remove
  </button>
  </li>
);

export default withAuthorization(ShareProject);
