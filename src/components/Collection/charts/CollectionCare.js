import React from "react";
import PropTypes from "prop-types";
import { getCollectionCare } from './api';
import DataFetcher from './DataFetcher';
import CountProgress from './generic/CountProgress';

const CollectionCare = props => {
  return <DataFetcher api={getCollectionCare} query={props.query} render={
    ({ data, loading, error }) => {
      if (!loading && !error) {
        const items = [
          { title: `Physical accessibility`, percent: data.physicalAccessibility.value/100 },
          { title: `Physical condition`, percent: data.physicalCondition.value/100 },
          { title: `Hounsing materials`, percent: data.housingMaterials.value/100 },
          { title: `Storage equipment`, percent: data.storageEquipment.value/100 },
        ]
        return <CountProgress
          loading={loading} error={error}
          helpText="Number of collections that have mentioned this group"
          items={items}
          suffix="when provided"
          title="Collection care"
          strokeColor="pink"
        />
      }
      return <CountProgress
          loading={loading} error={error}
          helpText="Number of collections that have mentioned this group"
          items={[]}
          suffix="when provided"
          title="Collection care"
        />
    }
  } />
}

CollectionCare.propTypes = {
  query: PropTypes.object
};

export default CollectionCare;
