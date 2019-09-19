import React from 'react';
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import SuggestFilter from "./SuggestFilter";
import { speciesSuggest, speciesFromKey } from "../../../../api/collection";
import fieldFormater from "../FieldFormater";

const ScientificName = fieldFormater(id => speciesFromKey(id).then(x => ({ title: x.data.scientificName })));

class TaxonSuggest extends React.Component {
  render() {
    return <SuggestFilter 
      name="taxonKey"
      helpText="Please enter a scienitific name. This will filter for collections mentioning this group as well as lower and higher groups. So if you search for Felidae, then collections mentioning e.g. 'Felidae' or 'Puma' will show, but also collections simply stating they have 'Mammalia'."
      suggest={async str => (await speciesSuggest(str)).data}
      placeholder="Search for a scientific name"
      displayLabel={ScientificName}
      blankName="What"
      mapping={x => ({ value: x.key, text: x.scientificName })}
      {...this.props}
    />
  }
}

TaxonSuggest.propTypes = {
  updateFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
};

export default injectIntl(TaxonSuggest);
