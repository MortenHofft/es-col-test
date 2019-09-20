import React from "react";
import { injectIntl } from "react-intl";
import {
  Input,
  AutoComplete,
  Row,
  Col,
  Card,
  Button,
  DatePicker,
  Dropdown,
  Menu,
  Icon
} from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _get from "lodash/get";
import moment from "moment";

import FilterGroup from './filters/FilterGroup';
import TaxonFilter from './filters/TaxonFilter';
import LocationFilter from './filters/LocationFilter';

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

const Search = Input.Search;

const styles = {
  blockquote: {
    margin: '1em 0',
    paddingLeft: '.8em',
    color: '#697b8c',
    fontSize: '90%',
    borderLeft: '4px solid #ebedf0'
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
class Filters extends React.Component {

  render = () => {
    const { filter, esFilter, setFilter, setField, classes } = this.props;

    return (
      <React.Fragment>
        <Row type="flex">
          <Col span={24}>
            <div>
              <FilterGroup updateFilter={setFilter} render={
                props => {return <div>
                  <TaxonFilter {...props}/>
                  <LocationFilter {...props}/>
                </div>}
              }/>
            </div>

          </Col>
        </Row>
        {/* <Row type="flex">
          <Col span={24}>
            <AutoComplete
              dataSource={this.state.placeSuggestions}
              style={{ width: 200 }}
              onSearch={this.onLocationSearch}
              onSelect={value =>
                fetchData({ ...query, location: value, offset: 0 })
              }
              onChange={value => updateQuery({ ...query, location: value })}
              value={location}
              placeholder="search location"
            />

            <RangePicker
              defaultValue={[
                moment("2015/01/01", dateFormat),
                moment("2015/01/01", dateFormat)
              ]}
              format={dateFormat}
              onChange={value =>
                fetchData({
                  ...query,
                  dateRange: {
                    gte: value[0].format("YYYY"),
                    lte: value[1].format("YYYY")
                  },
                  offset: 0
                })
              }
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
        </Row> */}
      </React.Fragment>
    );
  };
}

// Filters.propTypes = {
//   updateQuery: PropTypes.func.isRequired, // method to update request parameters during manipulation with table (pagination, search)
//   fetchData: PropTypes.func.isRequired, // method to re-request data after parameters were updated
//   query: PropTypes.object.isRequired
// };

export default injectSheet(styles)(injectIntl(Filters));
