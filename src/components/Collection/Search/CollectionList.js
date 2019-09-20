import React from "react";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import { Input, AutoComplete, Table, Spin, Alert, Row, Col, DatePicker } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _get from "lodash/get";
import moment from 'moment';
import { locations, speciesSuggest, getEsQuery, collectionSearch } from '../../../api/collection';
import Filters from './Filters';
import CountProgress from '../charts/generic/CountProgress';
import CountCard from '../charts/generic/CountCard';
import SpecimenCount from '../charts/SpecimenCount';
import FilterManager from './filters/FilterManager';
import DataFetcher from '../charts/DataFetcher';

const styles = {
  scrollContainer: {
    overflow: "auto",
    width: "100%"
  },
  table: {
    "& thead > tr > th": {
      wordBreak: "keep-all"
    }
  }
};

/**
 * Generic table component
 * Used for displaying main items lists
 * (Organizations, Datasets, Installations, Nodes, Users, Collections) where they appear
 * @param props
 * @returns {*}
 * @constructor
 */
class CollectionList extends React.Component {
  state = {
    placeSuggestions: [],
    speciesSuggestions: []
  };

  onLocationSearch = searchText => {
    locations.then(places => {
      this.setState({
        placeSuggestions: !searchText ? places.locations : places.locations.filter(x => x.toLowerCase().startsWith(searchText.toLowerCase())),
      });
    });
  };

  cancelSpeciesSuggestPromise = () => {
    if (this.speciesSuggestPromise && typeof this.speciesSuggestPromise.cancel === 'function') {
      this.speciesSuggestPromise.cancel();
    }
  }

  onSpeciesSearch = searchText => {
    let that = this;
    this.cancelSpeciesSuggestPromise();
    this.speciesSuggestPromise = speciesSuggest(searchText);
    this.speciesSuggestPromise.then(response => {
      that.setState({
        speciesSuggestions: !searchText ? [] : response.data.map(x => ({ value: x.key, text: x.scientificName }))
      });
    })
      .catch(err => {
        console.log(err);
      });
  };

  formatCollections = collections => {
    return collections.buckets.map(collection => {
      const firstHit = collection.descriptors.hits.hits[0]._source;
      return <div key={firstHit.collectionKey} style={{ border: '1px solid tomato' }}>
        <h3><a href={`https://gbif.org/dataset/${firstHit.collectionKey}`}>{firstHit.collectionTitle}</a></h3>
        <ul>
          {
            collection.descriptors.hits.hits.map(doc => {
              let e = doc._source;
              return <li key={doc._id}>
                <div>{e.location}</div>
                <div>{e.scientificName} ({e.key})</div>
                <div>{e.count} results</div>
                <div>Year: {e.dateRange.gte} - {e.dateRange.lte}</div>
              </li>
            })
          }
        </ul>
      </div>
    });
  }

  render = () => {
    const {
      classes,
    } = this.props;

    return (
      <React.Fragment>
        <Row type="flex">
          <Col span={24}>
            <FilterManager render={props => {
              return <React.Fragment>
                <Filters {...props} />
                <SpecimenCount query={props.esFilter} />
                {props.esFilter && <DataFetcher api={collectionSearch} query={props.esFilter} render={
                  ({ data, loading, error }) => {
                    return <div>
                      {!loading && !error &&
                        this.formatCollections(data.data.aggregations.collections)
                      }
                    </div>
                  }
                } />}
              </React.Fragment>
            }} />

            <React.Fragment>
              <CountCard count={34563456} title="Collection descriptions" helpText="some explainer could go here" style={{ width: 400 }} />
              <CountProgress
                style={{ width: 400 }}
                items={[
                  { title: '13.023 digitized', percent: 30 },
                  { title: '982 with image', percent: 20 },
                  { title: '1.202 with location', percent: 30 }
                ]}
                suffix="Specimens"
                title={Number(34563456).toLocaleString()}
              />
              <CountProgress
                style={{ width: 400 }}
                items={[
                  { title: '13.023 digitized', percent: 30 },
                  { title: '982 with image', percent: 20 },
                  { title: '1.202 with location', percent: 1 }
                ]}
                title="Storage breakdown"
                strokeColor="pink"
              />
            </React.Fragment>

          </Col>
        </Row>
      </React.Fragment>
    );
  };
}

// CollectionList.propTypes = {
//   updateQuery: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
//   fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
//   query: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired, // object data to show in table
//   columns: PropTypes.array.isRequired, // array of column objects to display in table
//   error: PropTypes.bool.isRequired, // true if data fetching failed
//   loading: PropTypes.bool.isRequired, // data fetching in progress or not
//   searchable: PropTypes.bool, // indicates if table should show search field or not
//   width: PropTypes.number, // Optional parameter if you want to set width from outside
//   noHeader: PropTypes.bool // An option to hide table's header
// };

export default injectSheet(styles)(injectIntl(CollectionList));
