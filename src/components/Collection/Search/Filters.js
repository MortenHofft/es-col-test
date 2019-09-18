import React from "react";
import { injectIntl } from "react-intl";
import { Input, AutoComplete, Row, Col, Card, Button, DatePicker, Dropdown, Menu, Icon } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _get from "lodash/get";
import moment from 'moment';
import { locations, speciesSuggest } from '../../../api/collection';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const Search = Input.Search;

const styles = {

};

/**
 * Generic table component
 * Used for displaying main items lists
 * (Organizations, Datasets, Installations, Nodes, Users, Collections) where they appear
 * @param props
 * @returns {*}
 * @constructor
 */
class Filters extends React.Component {
  state = {
    placeSuggestions: [],
    speciesSuggestions: [],
    taxonSearchVisible: false
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

  taxonSearch = () => {
    const {
      updateQuery,
      fetchData,
      query,
    } = this.props;
    const { taxonKey } = query;

    return <div style={{ background: 'white', borderRadius: '3px', padding: '20px', boxShadow: '0 0 1000px 1000px rgba(0,0,0,.2)' }}>
      <AutoComplete
        dataSource={this.state.speciesSuggestions}
        style={{ width: 200 }}
        autoFocus={true}
        onSearch={this.onSpeciesSearch}
        onSelect={value => {
          fetchData({ ...query, taxonKey: Number(value), offset: 0 });
          updateQuery({ ...query, taxonKey: Number(value) });
          this.setState({ taxonSearchVisible: false });
        }}
        // onChange={value => updateQuery({ ...query, taxonKey: value })}
        // value={taxonKey}
        placeholder="search taxon"
      />
    </div>
  };

  render = () => {
    const {
      updateQuery,
      fetchData,
      query,
      classes,
    } = this.props;
    const { q, location, taxonKey } = query;

    return (
      <React.Fragment>
        <Row type="flex">
          <Col span={24}>
            <Dropdown 
              overlay={this.taxonSearch()} 
              trigger={['click']} 
              onVisibleChange={flag => this.setState({ taxonSearchVisible: flag })} 
              visible={this.state.taxonSearchVisible}>
              {taxonKey ? <Button type="primary">{taxonKey}</Button> : <Button>What</Button>}
            </Dropdown>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={24}>
            <AutoComplete
              dataSource={this.state.placeSuggestions}
              style={{ width: 200 }}
              onSearch={this.onLocationSearch}
              onSelect={value => fetchData({ ...query, location: value, offset: 0 })}
              onChange={value => updateQuery({ ...query, location: value })}
              value={location}
              placeholder="search location"
            />
            <AutoComplete
              dataSource={this.state.speciesSuggestions}
              style={{ width: 200 }}
              onSearch={this.onSpeciesSearch}
              onSelect={value => fetchData({ ...query, taxonKey: Number(value), offset: 0 })}
              onChange={value => updateQuery({ ...query, taxonKey: value })}
              value={taxonKey}
              placeholder="search taxon"
            />
            <RangePicker
              defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
              format={dateFormat}
              onChange={value => fetchData({ ...query, dateRange: { gte: value[0].format('YYYY'), lte: value[1].format('YYYY') }, offset: 0 })}
            />
            <Search
              className="dataTable-search"
              size="large"
              onChange={e => updateQuery({ ...query, q: e.target.value })}
              value={q}
              onSearch={val => fetchData({ ...query, q: val, offset: 0 })}
              style={{ marginBottom: "16px" }}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  };
}

Filters.propTypes = {
  updateQuery: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
  fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
  query: PropTypes.object.isRequired,
};

export default injectSheet(styles)(injectIntl(Filters));
