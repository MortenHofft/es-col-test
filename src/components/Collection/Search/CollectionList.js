import React from "react";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import { Input, AutoComplete, Table, Spin, Alert, Row, Col, DatePicker } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _get from "lodash/get";
import moment from 'moment';
import { locations, speciesSuggest } from '../../../api/collection';
import Filters from './Filters';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const Search = Input.Search;

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
      updateQuery,
      fetchData,
      data,
      query,
      loading,
      filter,
      error,
      columns,
      classes,
    } = this.props;
    // If filters were added to the column
    if (columns[columns.length - 1].hasOwnProperty("filters")) {
      // Adding active filter
      columns[columns.length - 1].filteredValue = [filter.type];
    }

    return (
      <React.Fragment>
        {!error && (
          <Row type="flex">
            <Col span={24}>
              <Filters query={query} updateQuery={updateQuery} fetchData={fetchData}/>
              <div className={classes.scrollContainer}>
                {!loading &&
                  data &&
                  this.formatCollections(data.aggregations.collections)
                }
              </div>
            </Col>
          </Row>
        )}
        {error && (
          <Alert
            message={
              <FormattedMessage id="error.title" defaultMessage="Error" />
            }
            description={
              <FormattedMessage
                id="error.description"
                defaultMessage="An error happened while trying to process your request. Please report the error at https://github.com/gbif/portal-feedback/issues/new"
              />
            }
            type="error"
            showIcon
          />
        )}
      </React.Fragment>
    );
  };
}

CollectionList.propTypes = {
  updateQuery: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
  fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
  query: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired, // object data to show in table
  columns: PropTypes.array.isRequired, // array of column objects to display in table
  error: PropTypes.bool.isRequired, // true if data fetching failed
  loading: PropTypes.bool.isRequired, // data fetching in progress or not
  searchable: PropTypes.bool, // indicates if table should show search field or not
  width: PropTypes.number, // Optional parameter if you want to set width from outside
  noHeader: PropTypes.bool // An option to hide table's header
};

export default injectSheet(styles)(injectIntl(CollectionList));
