import React from "react";
import { injectIntl } from "react-intl";
import { Icon, Tooltip } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  card: {
    background: 'white',
    borderRadius: '3px',
    padding: '15px 20px',
    color: '#7f82a2',
    border: '1px solid #ddd',
    overflow: 'hidden',
    display: 'inline-block',
    margin: 10
  }
};

export const CountCard = props => {
  const { classes, className, style } = props;
  return <div className={`${classes.card} ${className}`} style={style}>
    
  </div>
}

CountCard.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(CountCard));
