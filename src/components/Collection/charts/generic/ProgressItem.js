import React from "react";
import { injectIntl } from "react-intl";
import { Progress } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  small: {
    fontSize: 11,
    fontWeight: 600,
    color: '#7f82a2',
    marginTop: 12
  },
  right: {
    float: 'right'
  }
};

const formatAsPercentage = (nr, digits) => {
  return (100*nr).toFixed(digits || 0);
}

export const ProgressItem = props => {
  const { classes, title, percent, strokeColor } = props;
  return <React.Fragment>
    <div className={classes.small}>
      <span>{title}</span>
      <span className={classes.right}>{formatAsPercentage(percent)}%</span>
    </div>
    <Progress percent={100*percent} size="small" showInfo={false} strokeColor={strokeColor}/>
  </React.Fragment>
}

ProgressItem.propTypes = {
  title: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(ProgressItem));
