import React from "react";
import { injectIntl } from "react-intl";
import injectSheet from "react-jss";

const styles = {};

const Dashboard = () => {
  return (
    <React.Fragment>
      <h1>This is a test interface for search of collection descriptors</h1>
    </React.Fragment>
  );
};

Dashboard.propTypes = {};

export default injectSheet(styles)(injectIntl(Dashboard));
