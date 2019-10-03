import React from "react";
import { injectIntl } from "react-intl";
import { Icon, Tooltip } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import Pie from './Pie';

const styles = {
  card: {
    background: 'white',
    borderRadius: '3px',
    padding: '15px 20px',
    color: '#7f82a2',
    border: '1px solid #ddd',
    overflow: 'hidden',
    display: 'block',
    margin: 10
  },
  title: {
    fontSize: 24,
    color: '#555773',
  },
  help: {
    float: 'right',
    margin: '-10px -15px'
  },
};

export const PieCard = props => {
  const { classes, className, style, title, helpText, values, labels, loading, error, categories } = props;
  return <div className={`${classes.card} ${className}`} style={style}>
    <div>
      <div className={classes.help}>
        <Tooltip title={helpText}>
          <Icon type="question-circle" theme="filled" />
        </Tooltip>
      </div>
      <div>
        <span className={classes.title}>{title}</span>
      </div>
      <Pie values={values} labels={labels}/>
    </div>
  </div>
}

PieCard.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(PieCard));
