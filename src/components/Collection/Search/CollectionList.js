import React from "react";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import { Input, AutoComplete, Table, Spin, Alert, Row, Col, DatePicker, Tabs } from "antd";
import injectSheet from "react-jss";
import _get from "lodash/get";
import { locations, speciesSuggest, collectionSearch, peopleSearch } from '../../../api/collection';
import Filters from './Filters';
import CollectionCount from '../charts/CollectionCount';
import SpecimenCounts from '../charts/SpecimenCounts';
import CollectionCare from '../charts/CollectionCare';
import PreservationCounts from '../charts/PreservationCounts';
import FilterManager from './filters/FilterManager';
import DataFetcher from '../charts/DataFetcher';
import CollectionResult from './CollectionResult/CollectionResult';
import PersonResult from './PersonResult';
import Paper from '../../search/Paper';

const { TabPane } = Tabs;

const styles = {
  scrollContainer: {
    overflow: "auto",
    width: "100%"
  },
  table: {
    "& thead > tr > th": {
      wordBreak: "keep-all"
    }
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -10
  },
  card: {
    flex: '1 0 50%'
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

  formatCollections = (collections, filter) => {
    return collections.buckets.map(collection => {
      const firstHit = collection.descriptors.hits.hits[0]._source;
      const col = {
        specimenCount: collection.specimenCount.value,
        digitizedCount: collection.digitizedCount.value,
        descriptorCount: collection.descriptors.doc_count,
        title: firstHit.collectionTitle,
        institutionKey: firstHit.institution,
        institutionTitle: firstHit.institution,
        doi: firstHit.doi,
        elvisSupport: firstHit.elvisSupport,
        description: firstHit.description,
      };
      return <CollectionResult noFilter={!filter} key={firstHit.collectionKey} collection={col} descriptors={collection.descriptors.hits.hits} style={{marginBottom: 20}}/>
      // return <div key={firstHit.collectionKey} style={{ border: '1px solid tomato' }}>
      //   <h3><a href={`https://gbif.org/dataset/${firstHit.collectionKey}`}>{firstHit.collectionTitle}</a></h3>
      //   <ul>
      //     {
      //       collection.descriptors.hits.hits.map(doc => {
      //         let e = doc._source;
      //         return <li key={doc._id}>
      //           <div>{e.location}</div>
      //           <div>{e.scientificName} ({e.key})</div>
      //           <div>{e.count} results</div>
      //           <div>Year: {e.dateRange.gte} - {e.dateRange.lte}</div>
      //         </li>
      //       })
      //     }
      //   </ul>
      // </div>
    });
  }

  formatPeople = (people, filter) => {
    return people.topAgents.buckets.map(person => {
      const firstHit = person.exampleAgents.hits.hits[0]._source;
      // const p = {
      //   specimenCount: person.specimenCount.value,
      //   digitizedCount: person.digitizedCount.value,
      // };
      return <PersonResult person={firstHit} topTaxa={person.agentToDescriptor.topTaxa.buckets} style={{marginBottom: 20}}/>
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
                <Paper padded>
                  <Filters {...props} />
                </Paper>
                <Tabs defaultActiveKey="2">
                  <TabPane tab="Collections" key="1">
                    {props.esFilter && <DataFetcher api={collectionSearch} query={{body: props.esFilter}} render={
                      ({ data, loading, error }) => {
                        return <div>
                          {!loading && !error &&
                            this.formatCollections(data.data.aggregations.collections, props.filter)
                          }
                        </div>
                      }
                    } />}
                  </TabPane>
                  <TabPane tab="Staff" key="2">
                    {props.esFilter && <DataFetcher api={peopleSearch} query={{body: props.esFilter}} render={
                      ({ data, loading, error }) => {
                        return <div>
                          {!loading && !error &&
                            <React.Fragment>
                              {this.formatPeople(data.data.aggregations.agents, props.filter)}
                              <pre>{JSON.stringify(data.data.aggregations, null, 2)}</pre>
                            </React.Fragment>
                          }
                        </div>
                      }
                    } />}
                  </TabPane>
                  <TabPane tab="Metrics" key="3">
                    <div className={classes.cards}>
                      <div className={classes.card}><CollectionCount query={props.esFilter}/></div>
                      <div className={classes.card}><SpecimenCounts query={props.esFilter}/></div>
                      <div className={classes.card}><PreservationCounts query={props.esFilter}/></div>
                      <div className={classes.card}><CollectionCare query={props.esFilter}/></div>
                    </div>
                  </TabPane>
                </Tabs>
              </React.Fragment>
            }} />
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
