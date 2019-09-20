import React from "react";
import PropTypes from "prop-types";
import ProgressItem from './ProgressItem';

export const ProgressList = props => {
  const { className, style, items, strokeColor } = props;
  return <React.Fragment>
    {items.map(x => <ProgressItem key={x.title} title={x.title} percent={x.percent} strokeColor={strokeColor} className={className} style={style}/>)}
  </React.Fragment>
}

ProgressList.propTypes = {
  items: PropTypes.array.isRequired
};

export default ProgressList;
