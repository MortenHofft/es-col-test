import React from 'react';
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import SuggestFilter from "./SuggestFilter";
import { locations } from "../../../../api/collection";
import _ from 'lodash';

// const ScientificName = fieldFormater(id => speciesFromKey(id).then(x => ({ title: x.data.scientificName })));
const locationSuggest = async searchText => {
  let places = await locations;
  return !searchText
    ? places.locations
    : places.locations
      .filter(x => x.toLowerCase().startsWith(searchText.toLowerCase()))
      .map(x => ({ value: x, text: _.startCase(x.toLowerCase()) }));
};

class LocationFilter extends React.Component {

  render() {
    return <SuggestFilter
      name="location"
      helpText="Please enter a location name - currently only countries and regions are possible. We should expand this to country subregions."
      suggest={locationSuggest}
      placeholder="Enter location name"
      displayLabel={props => <span>{_.startCase(props.id.toLowerCase())}</span>}
      blankName="Where"
      {...this.props}
    />
  }
}

LocationFilter.propTypes = {
  updateFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
};

export default injectIntl(LocationFilter);
