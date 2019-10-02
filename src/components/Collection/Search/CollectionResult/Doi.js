import React from "react";
import { injectIntl } from "react-intl";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  doi: {
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: 12,
    '& span': {
      border: '1px solid #dbe3e7'
    },
    '& span:first-of-type': {
      transition: 'all .3s ease',
      background: '#09c',
      padding: '0 4px',
      borderRadius: '5px 0 0 5px',
      color: '#fff',
      borderRightWidth: 0,
      borderColor: '#09c',
    },
    '& span:last-of-type': {
      background: '#fff',
      padding: '0 7px',
      borderRadius: '0 5px 5px 0',
      borderLeftWidth: 0,
      color: '#333',
    }
  }
};

function parse(doi) {
  const lastPart = doi ? doi.replace(/^(.*doi.org\/)?(doi:)?(10\.)/, '10.') : 'unknown';
  return {
    url: `https://doi.org/${lastPart}`,
    shortName: lastPart
  };
}

const Doi = props => {
  const { doi, className, classes, style } = props;
  const parsed = parse(doi);
  return (
    <a href={parsed.url} className={`gbDoi ${classes.doi} ${className}`} style={style}>
      <span>DOI</span>
      <span>{parsed.shortName}</span>
    </a>
  );
};

Doi.propTypes = {
  doi: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default injectSheet(styles)(injectIntl(Doi));
