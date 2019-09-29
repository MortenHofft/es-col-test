import React from "react";
import { injectIntl } from "react-intl";
import { Icon, Tooltip } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  loanCard: {
    background: "green",
    borderRadius: "3px",
    padding: "15px 20px",
    color: "white"
  },
  card: {
    background: "white",
    borderRadius: "3px",
    padding: "15px 20px",
    color: "#7f82a2",
    border: "1px solid #ddd",
    overflow: "hidden"
  },
  headline: {
    fontSize: 17,
    fontweight: 500
  },
  desciptors: {
    background: "#ddd",
    padding: 10
  },
  listHeader: {
    padding: 10,
    margin: 10,
    display: "flex",
    flexWrap: "wrap"
  },
  listItem: {
    background: "white",
    padding: 10,
    margin: 10,
    display: "flex",
    flexWrap: "wrap"
  },
  listDesc: {
    flex: "1 0 100%"
  },
  f50: {
    flex: "1 1 50%"
  },
  f25: {
    flex: "1 1 25%"
  },
  f100: {
    flex: "1 1 100%"
  }
};

function isHTML(str) {
  var doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

function stripHtml(str) {
  var doc = new DOMParser().parseFromString(str, "text/html");
  return doc.body.textContent || doc.body.innerText || "";
}

function truncate(str, length) {
  length = length || 100;
  if (str.length < length) return str;
  return str.slice(0, length) + "…";
}

function stripHtmlAndTruncate(str, length) {
  return truncate(stripHtml(str), length);
}

const LoanCard = props => {
  const { collection, className, classes, style } = props;

  return (
    <div className={`${classes.loanCard} ${className}`} style={style}>
      <span>Supports international loans</span>
      <span>
        Has loan agreement with <em>K</em>
      </span>
      <Collection {...props} />
    </div>
  );
};

const Collection = props => {
  const { collection, descriptors, classes, className, style } = props;
  // const collection = {
  //   collectionTitle: 'CAS botanic collection',
  //   institutionTitle: 'Chinese Academy of Science',
  //   specimenCount: 71265,
  //   digitisedCount: 42132,
  //   description: 'Records from OEH’s Atlas of NSW Wildlife database of flora and fauna sightings. Includes records from other custodians such as the National Herbarium of NSW, Forests NSW, Australian Bird and Bat Banding Scheme and the Australian Museum.'
  // };

  const percentDigitsed = Math.ceil(
    (100 * collection.digitizedCount) / collection.specimenCount
  );
  return (
    <article className={`${classes.card} ${className}`} style={style}>
      <div>
        <h1 className={classes.headline}>{collection.title}</h1>
        <div>
          From <a href="">{collection.institutionTitle}</a>
        </div>
        <div>
          {collection.specimenCount.toLocaleString()} specimens ({percentDigitsed}% digitized)
        </div>
        <p>{stripHtmlAndTruncate(collection.description, 200)}</p>
      </div>
      <div className={classes.desciptors}>
        <div className={classes.listHeader}>
          <div className={classes.f50}>Scientific name</div>
          <div className={classes.f25}>Location</div>
          <div className={classes.f25}>Specimens</div>
        </div>
        {descriptors.map(d => {
          return (
            <div key={d._id} className={classes.listItem}>
              <div className={classes.f50}>{d._source.scientificName}</div>
              <div className={classes.f25}>{d._source.location}</div>
              <div className={classes.f25}>{d._source.count}</div>
              <div className={classes.f100}>
                {stripHtmlAndTruncate(d._source.thematicFocus, 200)}
              </div>
            </div>
          );
        })}
      </div>
      <footer>doi and other identifiers</footer>
    </article>
  );
};

export const CollectionResult = props => {
  if (Math.random() > 0.5) {
    return <LoanCard {...props} />;
  }
  return <Collection {...props} />;
};

CollectionResult.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(CollectionResult));
