import React from 'react';
import PropTypes from 'prop-types';
import { getEsQuery } from '../../../../api/collection';

class FilterManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: undefined,
      esFilter: undefined,
      setFilter: this.setFilter,
      setField: this.setField
    };
  }

  setFilter = async filter => {
    if (!this._isMount) return;
    if (typeof filter === 'object') {
      Object.keys(filter).forEach(key => {
        if (typeof filter[key] === 'undefined') delete filter[key];
      })
      if (Object.keys(filter).length === 0) filter = undefined;
    }
    let esFilter = await getEsQuery(filter);
    this.setState({ filter, esFilter });
  }

  setField = async (field, value) => {
    this.setFilter({ ...this.state.filter, [field]: value });
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.setFilter(this.state.filter);
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.render(this.state)}
      </React.Fragment>
    );
  }
}

FilterManager.propTypes = {
  name: PropTypes.string,
};

export default FilterManager;
