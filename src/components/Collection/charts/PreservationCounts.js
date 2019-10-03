import React from "react";
import PropTypes from "prop-types";
import { getPresevationCounts } from './api';
import DataFetcher from './DataFetcher';
import PieCard from './generic/PieCard';

const PreservationCounts = props => {
  return <DataFetcher api={getPresevationCounts} query={props.query} render={
    ({data, loading, error}) => <React.Fragment>
      {!loading && <PieCard values={data.map(x => x.value)} labels={data.map(x => x.label)} title="Preservation types"/>}
      </React.Fragment>
  }/>
}


PreservationCounts.propTypes = {
  query: PropTypes.object
};

export default PreservationCounts;
