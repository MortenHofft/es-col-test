import React from "react";
import { Icon, Tooltip } from "antd";
import PropTypes from "prop-types";
import { getCollectionCount } from './api';
import DataFetcher from './DataFetcher';
import CountCard from './generic/CountCard';
import Pie from './Pie';

const SpecimenCount = props => {
  return <DataFetcher api={getCollectionCount} query={props.query} render={
    ({data, loading, error}) => <React.Fragment>
      <CountCard loading={loading} error={error} count={data} title="Collections" helpText="Number of collections that have mentioned this group" style={{ width: 400 }} />
      <Pie></Pie>
      </React.Fragment>
  }/>
}


SpecimenCount.propTypes = {
  query: PropTypes.object
};

export default SpecimenCount;
