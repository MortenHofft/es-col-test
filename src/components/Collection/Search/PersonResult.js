import React from "react";
import { injectIntl } from "react-intl";
import { Icon, Tooltip, Button } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _startCase from 'lodash/startCase';
import JazzIcon, { hash } from './JassIcon';

const styles = {
  card: {
    background: "white",
    borderRadius: "3px",
    color: "#484848",
    border: "1px solid #ddd",
    overflow: "hidden",
    fontSize: 14,
  },
  layout: {
    padding: "16px 32px",
  },
  picture: {
    float: 'left',
    marginRight: 20
  },
  headline: {
    fontSize: 17,
    fontWeight: 600
  }
};

const PersonResult = props => {
  const { classes, className, style, person } = props;
  const agent = {
    name: person.name,
    orcId: 'https://orcid.org/0000-0002-8442-8025',
    actions: ['CURATOR', 'COLLECTOR'],
    descriptors: ['Aves', 'Magnolia'],
    collections: 3,
    emails: ['sdf@sdf.df']
  };
  return (
    <article className={`${classes.card} ${className}`} style={style}>
      <div className={classes.layout}>
        <div className={classes.picture}>
          <JazzIcon seed={hash(person.identifier)} />
        </div>
        <div className={classes.content}>
          <h1 className={classes.headline}>{agent.name}</h1>
          <div>Curator</div>
          <div>Research area: Magnolia and Tropical flowers</div>
          <div>Contributes to 3 collections</div>
          <div>
            <span>iD</span>{agent.orcid}
          </div>
        </div>
        <div>
          {agent.person}
          <Button>See profile</Button>
        </div>
      </div>
    </article>
  );
};

PersonResult.propTypes = {
  // title: PropTypes.string.isRequired,
  // percent: PropTypes.number.isRequired
};

export default injectSheet(styles)(injectIntl(PersonResult));
