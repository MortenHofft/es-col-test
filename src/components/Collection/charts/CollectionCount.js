import React from "react";
import PropTypes from "prop-types";
import { getCollectionCount } from './api';
import DataFetcher from './DataFetcher';
import CountCard from './generic/CountCard';

const CollectionCount = props => {
  return <DataFetcher api={getCollectionCount} query={props.query} render={
    ({data, loading, error}) => <React.Fragment>
      <CountCard loading={loading} error={error} count={data} title="Collections" helpText="Number of collections that have mentioned this group" />
      </React.Fragment>
  }/>
}


CollectionCount.propTypes = {
  query: PropTypes.object
};

export default CollectionCount;
