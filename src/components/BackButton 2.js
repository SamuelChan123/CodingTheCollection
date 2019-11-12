import React from "react";
import { Button } from "@material-ui/core";

class BackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  goBack = () => {
    if (this.props.backPage == null) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.props.backPage);
    }
  };

  render() {
    return (
      <div style={{ paddingBottom: 10 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={this.goBack}
        >
          Go Back
        </Button>
      </div>
    );
  }
}

export default BackButton;
