import React from "react";
import { Button, Container } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#84BD00"
    },
    secondary: {
      main: "#a9a9a9"
    }
  }
});

class BackButton extends React.Component {
  goBack = () => {
    if (this.props.backPage == null) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.props.backPage);
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={this.goBack}
          style={{ color: "white", opacity: 0.9 }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </Container>
    );
  }
}

export default BackButton;
