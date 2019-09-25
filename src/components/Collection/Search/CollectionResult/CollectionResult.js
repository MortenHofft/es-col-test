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
  headline: {
    fontSize: 17,
    fontweight: 500
  }
};

export const CollectionResult = props => {
  const { collection, descriptors, classes, className, style } = props;
  return <article className={`${classes.card} ${className}`} style={style}>
    <div>
      <h1 className={classes.headline}>{collection.collectionTitle}</h1>
      <div>From <a href="">Hacepette university</a></div>
      <div>71.242 specimens (32% digitized)</div>
      <p>
        Records from OEH’s Atlas of NSW Wildlife database of flora and fauna sightings. Includes records from other custodians such as the National Herbarium of NSW, Forests NSW, Australian Bird and Bat Banding Scheme and the Australian Museum.
      </p>
    </div>
    <div>
      <div></div>
    </div>
    <footer>
      doi and other identifiers
    </footer>
  </article>
}

CollectionResult.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(CollectionResult));
