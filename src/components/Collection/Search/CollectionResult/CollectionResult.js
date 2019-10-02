import React from "react";
import { injectIntl } from "react-intl";
import { Icon, Tooltip } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import fieldFormater from "../FieldFormater";
import { institutionFromKey } from "../../../../api/collection";
import Doi from './Doi';
import { compactInteger } from '../helpers';
import { LogoSvg } from '../../../Layout/Logo';
import { wrap } from "module";
import _startCase from 'lodash/startCase';

const GbifIcon = props => <Icon component={LogoSvg} {...props} />;


const styles = {
  loanCard: {
    background: "#51B27E",
    borderRadius: "3px",
    padding: 5,
    color: "white",
  },
  loanHeader: {
    padding: '5px 30px 10px 30px',
    '& strong': {
      fontWeight: 600,
      marginRight: 10
    },
    position: 'relative'
  },
  loanButton: {
    border: '1px solid white',
    padding: '0 10px',
    borderRadius: 3,
    float: 'right',
    color: 'white',
    position: 'absolute',
    right: 0,
    top: 5
  },
  card: {
    background: "white",
    borderRadius: "3px",
    color: "#484848",
    border: "1px solid #ddd",
    overflow: "hidden",
    fontSize: 14,
  },
  cardContent: {
    padding: "10px 30px",
  },
  headline: {
    fontSize: 17,
    fontWeight: 600
  },
  descriptors: {
    background: '#FAFBFC',
    padding: '10px 30px',
    borderTop: '1px solid #EAEBEE',
    fontSize: 13,
    // fontWeight: 500
  },
  listHeader: {
    color: '#75757A',
    display: "flex",
    flexWrap: "wrap",
    padding: '0 16px',
  },
  listItem: {
    background: "white",
    padding: '8px 16px',
    margin: '8px 0',
    display: "flex",
    flexWrap: "wrap",
    border: "1px solid #ddd",
    borderRadius: 5
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
  },
  description: {
    color: '#666',
    marginTop: 10
  },
  facts: {
    display: 'flex',
    flexWrap: wrap,
    alignItems: 'center',
    margin: '5px -10px',
  },
  fact: {
    margin: '0 10px',
    flex: '0 0 auto',
    display: 'flex',
    flexWrap: wrap,
    alignItems: 'center'
  },
  footer: {
    borderTop: '1px solid #EAEBEE',
    background: '#F1F3F4',
    padding: '5px 30px'
  },
  codes: {
    marginLeft: 10,
    '& > span:after': {
      content: '"●"',
      margin: '0 5px',
      display: 'inline-block',
      fontSize: '50%',
    }
  },
};

const InstitutionName = fieldFormater(id => institutionFromKey(id).then(x => ({ title: x.data.name })));

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
  const { collection, descriptors, noFilter, className, classes, style } = props;

  return (
    <div className={`${classes.loanCard} ${className}`} style={style}>
      <div className={classes.loanHeader}>
        <strong>Supports international loans</strong>
        This institution has an exchange agreement with your institute
        <a className={classes.loanButton} href="https://duckduckgo.com/?q=elvis&t=hk&ia=news">ELViS</a>
      </div>
      <Collection collection={collection} classes={classes} descriptors={descriptors} noFilter={noFilter}/>
    </div>
  );
};

const Collection = props => {
  const { collection, descriptors, noFilter, classes, className, style } = props;
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
      <div className={classes.cardContent}>
        <h1 className={classes.headline}>{collection.title}</h1>
        <div style={{ marginTop: -5 }}>
          From <a href={`https://gbif.orG/grscicoll/institution/${collection.institutionTitle}`}><InstitutionName id={collection.institutionTitle} /></a>
        </div>
        <div className={classes.facts}>
          <div className={classes.fact}>
            <span>
              <strong>{compactInteger(collection.specimenCount, 2)}</strong> specimens
            </span>
          </div>
          <div className={classes.fact}>
            <GbifIcon style={{ fontSize: 17 }} />&nbsp;<span>{compactInteger(collection.digitizedCount, 2)}</span>
          </div>
        </div>
        {/* <p className={classes.description}>{stripHtmlAndTruncate(collection.description, 200)}</p> */}
      </div>
      {!noFilter && <div className={classes.descriptors}>
        <div className={classes.listHeader}>
          <div className={classes.f50}>Scientific name</div>
          <div className={classes.f25}>Location</div>
          <div className={classes.f25}>Specimens</div>
        </div>
        {descriptors.map(d => {
          return (
            <div key={d._id} className={classes.listItem}>
              <div className={classes.f50}>{d._source.scientificName}</div>
              <div className={classes.f25}>{_startCase(d._source.location.toLowerCase())}</div>
              <div className={classes.f25}>{compactInteger(d._source.count, 2)}</div>
              {/* <div className={`${classes.f100} ${classes.description}`}>
                {stripHtmlAndTruncate(d._source.thematicFocus, 100)}
              </div> */}
            </div>
          );
        })}
      </div>
      }
      <footer className={`gbCardFooter ${classes.footer}`}>
        <Doi doi={collection.doi} />
        <span className={classes.codes}><span>UWYMV</span><span>Egg</span></span>
      </footer>
    </article>
  );
};

export const CollectionResult = props => {
  if (props.collection.elvisSupport) {
    return <LoanCard {...props} />;
  }
  return <Collection {...props} />;
};

CollectionResult.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(CollectionResult));
