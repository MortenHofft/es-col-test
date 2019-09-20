import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
// import _isEqual from 'lodash/isEqual';

class FilterGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultFilter: {},
      disabled: false,
      error: false,
      updateFilter: this.updateFilter,
      filter: {}
    };
  }

  componentDidMount() {
    // // A special flag to indicate if a component was mount/unmount
    // this._isMount = true;
    // // Setting default query params
    // // Parsing route search params
    // const search = this.getSearchParams();
    // const filter = this.getFilter();

    // if (this.props.location.search) {
    //   this.setState(state => {
    //     return {
    //       query: { ...state.query, ...search },
    //       searchValue: search.q,
    //       filter
    //     };
    //   }, () => {
    //     this.fetchData(this.state.query, this.state.filter);
    //   });
    // } else {
    //   this.fetchData(this.state.query, this.state.filter);
    // }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // // Working with the case when user goes back/forward in browser history
    // // using back/forward buttons of browser or mouse
    // if (!_isEqual(this.props.location, prevProps.location)) {
    //   const search = this.getSearchParams();
    //   const filter = this.getFilter();
    //   const currentQuery = { ...this.props.initQuery, ...search };
    //   // Updating query and fetching data ONLY if user hasn't done it via pagination controls
    //   // or search field
    //   if (!_isEqual(this.state.query, currentQuery) || !_isEqual(this.state.filter, filter)) {
    //       this.setState(() => {
    //         return {
    //           query: { ...this.props.initQuery, ...search },
    //           searchValue: search.q,
    //           filter
    //         };
    //       }, () => {
    //         this.fetchData(this.state.query, this.state.filter);
    //       });
    //   }
    // }
  }

  getFilter() {
    const params = qs.parse(this.props.location.search.slice(1));
    //remap names to only show relevant filters
    return { params };
  }

  updateFilter = filter => {
    let updatedFilter = { ...this.props.defaultFilter, ...filter };
    this.setState({
      filter: updatedFilter
    });
    this.props.updateFilter(updatedFilter)
  }

  render() {
    return (
      <React.Fragment>
        {this.props.render(this.state)}
      </React.Fragment>
    );
  }
}

FilterGroup.propTypes = {
  // onChange: PropTypes.func.isRequired,
  // initQuery: PropTypes.object.isRequired,
  // requireApply: PropTypes.bool,
  // urlStoragePrefix: PropTypes.string
};

export default withRouter(FilterGroup);
