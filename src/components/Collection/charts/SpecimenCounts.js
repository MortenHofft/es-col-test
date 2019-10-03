import React from "react";
import PropTypes from "prop-types";
import { getSpecimenCounts } from './api';
import DataFetcher from './DataFetcher';
import CountProgress from './generic/CountProgress';

const SpecimenCounts = props => {
  return <DataFetcher api={getSpecimenCounts} query={props.query} render={
    ({ data, loading, error }) => {
      if (!loading && !error) {
        const items = [
          { title: `${data.digitizedCount.toLocaleString()} digitized`, percent: data.digitizedCount/data.specimenCount },
          { title: `${data.typeCount.toLocaleString()} types`, percent: data.typeCount/data.specimenCount },
        ]
        return <CountProgress
          loading={loading} error={error}
          helpText="Number of collections that have mentioned this group"
          items={items}
          suffix="Specimens"
          title={Number(data.specimenCount).toLocaleString()}
        />
      }
      return <CountProgress
          loading={loading} error={error}
          helpText="Number of collections that have mentioned this group"
          items={[]}
          suffix="Specimens"
        />
    }
  } />
}

SpecimenCounts.propTypes = {
  query: PropTypes.object
};

export default SpecimenCounts;
