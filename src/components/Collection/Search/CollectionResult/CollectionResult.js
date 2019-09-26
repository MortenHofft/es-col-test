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
  const { descriptors, classes, className, style } = props;
  const collection = {
    collectionTitle: 'CAS botanic collection',
    institutionTitle: 'Chinese Academy of Science',
    specimenCount: 71265,
    digitisedCount: 42132,
    description: 'Records from OEH’s Atlas of NSW Wildlife database of flora and fauna sightings. Includes records from other custodians such as the National Herbarium of NSW, Forests NSW, Australian Bird and Bat Banding Scheme and the Australian Museum.'
  };

  const percentDigitsed = Math.ceil(100*collection.specimenCount/collection.digitisedCount);
  return <article className={`${classes.card} ${className}`} style={style}>
    <div>
      <h1 className={classes.headline}>{collection.collectionTitle}</h1>
      <div>From <a href="">{collection.institutionTitle}</a></div>
      <div>{collection.specimenCount.toLocaleString()} specimens ({percentDigitsed.toLocaleString()}% digitized)</div>
      <p>
        {collection.description}
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
