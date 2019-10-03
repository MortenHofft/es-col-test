import React from "react";
import { injectIntl } from "react-intl";
import { Progress } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import ProgressList from './ProgressList';

const styles = {
  card: {
    background: 'white',
    borderRadius: '3px',
    padding: '15px 20px',
    color: '#7f82a2',
    border: '1px solid #ddd',
    display: 'block',
    margin: 10
  },
  count: {
    fontSize: 24,
    color: '#555773'
  },
  type: {
    paddingLeft: 10
  },
  small: {
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: 600
  },
  right: {
    float: 'right'
  }
};

export const CountProgress = props => {
  const { classes, className, style, strokeColor, items, suffix, title } = props;
  return <div className={`${classes.card} ${className}`} style={style}>
    <div>
      <span className={classes.count}>{title}</span>
      <span className={`${classes.small} ${classes.type}`}>{suffix}</span>
    </div>
    <ProgressList strokeColor={strokeColor} items={items} />
  </div>
}

// CountCard.propTypes = {
//   title: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
//   fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
//   query: PropTypes.object.isRequired
// };

export default injectSheet(styles)(injectIntl(CountProgress));
