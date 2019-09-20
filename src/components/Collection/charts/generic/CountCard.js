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
  },
  count: {
    fontSize: 24,
    color: '#555773',
  },
  media: {
    display: 'flex',
    alignItems: 'center'
  },
  small: {
    fontSize: 11,
    fontWeight: 600,
    color: '#7f82a2',
    textTransform: 'uppercase'
  },
  help: {
    float: 'right',
    margin: '-10px -15px'
  },
  icon: {
    borderRadius: '50%',
    width: 70,
    height: 70,
    background: 'linear-gradient(20deg, #1580e2, #1890ff)',
    position: 'relative',
    color: 'white',
    textAlign: 'center',
    lineHeight: '80px',
    marginRight: '1rem'
  }
};

export const CountCard = props => {
  const { classes, className, style, count, title, helpText, loading, error } = props;
  console.log({loading, error, count});
  return <div className={`${classes.card} ${className}`} style={style}>
    <div>
      <div className={classes.help}>
        <Tooltip title={helpText}>
          <Icon type="question-circle" theme="filled" />
        </Tooltip>
      </div>
      <div className={classes.media}>
        <div className={classes.icon}><Icon type="tag" theme="filled" style={{ fontSize: 35, lineHeight: '80px', }} /></div>
        <div className={classes.text}>
          <div className={classes.count}>{!loading ? count.toLocaleString() : 'Loading'}</div>
          <div className={`${classes.small} ${classes.type}`}>{title ? title : ' '}</div>
        </div>
      </div>
    </div>
  </div>
}

CountCard.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(CountCard));
