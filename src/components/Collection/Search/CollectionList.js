import React from "react";
import { FormattedMessage, FormattedNumber, injectIntl } from "react-intl";
import { Input, AutoComplete, Table, Spin, Alert, Row, Col } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _get from "lodash/get";
import { places, speciesSuggest } from '../../../api/collection';

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
    this.setState({
      placeSuggestions: !searchText ? places : places.filter(x => x.toLowerCase().startsWith(searchText.toLowerCase())),
    });
  };

  onSpeciesSearch = searchText => {
    let that = this;
    this.setState({
      speciesSuggestions: !searchText ? [] : [{"key":8157094,"kingdom":"Animalia","phylum":"Arthropoda","order":"Araneae","family":"Salticidae","genus":"Saphrys","species":"Saphrys a-notata","kingdomKey":1,"phylumKey":54,"classKey":367,"orderKey":1496,"familyKey":5644,"genusKey":8021618,"speciesKey":8157094,"parent":"Saphrys","parentKey":8021618,"scientificName":"Saphrys a-notata (Mello-Leitão, 1940)","canonicalName":"Saphrys a-notata","rank":"SPECIES","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia","54":"Arthropoda","367":"Arachnida","1496":"Araneae","5644":"Salticidae","8021618":"Saphrys"},"synonym":false,"class":"Arachnida"},{"key":3388356,"kingdom":"Fungi","phylum":"Ascomycota","genus":"Lateriramulosa","species":"Lateriramulosa a-inflata","kingdomKey":5,"phylumKey":95,"genusKey":2590212,"speciesKey":3388356,"parent":"Lateriramulosa","parentKey":2590212,"nubKey":3388356,"scientificName":"Lateriramulosa a-inflata Matsush.","canonicalName":"Lateriramulosa a-inflata","rank":"SPECIES","status":"ACCEPTED","higherClassificationMap":{"5":"Fungi","95":"Ascomycota","2590212":"Lateriramulosa"},"synonym":false},{"key":7326975,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium a-bolosii","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":7326975,"parent":"Allium","parentKey":9624496,"nubKey":7326975,"scientificName":"Allium a-bolosii P.Palau","canonicalName":"Allium a-bolosii","rank":"SPECIES","status":"DOUBTFUL","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium"},"synonym":false,"class":"Liliopsida"},{"key":3697871,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium cupani","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":2856889,"parent":"Allium cupani","parentKey":2856889,"nubKey":3697871,"scientificName":"Allium a-bolosii subsp. eivissanum (Garbari & Miceli) N.Torres & Rossell","canonicalName":"Allium a-bolosii eivissanum","rank":"SUBSPECIES","status":"SYNONYM","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium","2856889":"Allium cupani"},"synonym":true,"class":"Liliopsida"},{"key":5172153,"kingdom":"Animalia","phylum":"Arthropoda","order":"Araneae","family":"Salticidae","genus":"Saphrys","species":"Saphrys a-notata","kingdomKey":1,"phylumKey":54,"classKey":367,"orderKey":1496,"familyKey":5644,"genusKey":8021618,"speciesKey":8157094,"parent":"Saphrys","parentKey":8021618,"nubKey":5172153,"scientificName":"Euophrys a-notata Mello-Leitão, 1940","canonicalName":"Euophrys a-notata","rank":"SPECIES","status":"HOMOTYPIC_SYNONYM","higherClassificationMap":{"1":"Animalia","54":"Arthropoda","367":"Arachnida","1496":"Araneae","5644":"Salticidae","8021618":"Saphrys","8157094":"Saphrys a-notata"},"synonym":true,"class":"Arachnida"},{"key":3698087,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium a-bolosii","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":7326975,"parent":"Allium","parentKey":9624496,"nubKey":3698087,"scientificName":"Allium cupani var. a-bolosii (P.Palau) O.Bol","canonicalName":"Allium cupani a-bolosii","rank":"VARIETY","status":"HOMOTYPIC_SYNONYM","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium","7326975":"Allium a-bolosii"},"synonym":true,"class":"Liliopsida"},{"key":9663696,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Poales","family":"Poaceae","genus":"Poa","species":"Poa matris-occidentalis","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1369,"familyKey":3073,"genusKey":2704173,"speciesKey":6431331,"parent":"Poa matris-occidentalis","parentKey":6431331,"scientificName":"Poa matris-occidentalis subsp. a-b, 2006","canonicalName":"Poa matris-occidentalis a-b","rank":"SUBSPECIES","status":"ACCEPTED","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1369":"Poales","3073":"Poaceae","2704173":"Poa","6431331":"Poa matris-occidentalis"},"synonym":false,"class":"Liliopsida"},{"key":2,"kingdom":"Archaea","kingdomKey":2,"nubKey":2,"scientificName":"Archaea","canonicalName":"Archaea","rank":"KINGDOM","status":"ACCEPTED","higherClassificationMap":{},"synonym":false},{"key":1,"kingdom":"Animalia","kingdomKey":1,"nubKey":1,"scientificName":"Animalia","canonicalName":"Animalia","rank":"KINGDOM","status":"ACCEPTED","higherClassificationMap":{},"synonym":false},{"key":67,"kingdom":"Animalia","phylum":"Acanthocephala","kingdomKey":1,"phylumKey":67,"parent":"Animalia","parentKey":1,"nubKey":67,"scientificName":"Acanthocephala","canonicalName":"Acanthocephala","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":7509337,"kingdom":"Protozoa","phylum":"Amoebozoa","kingdomKey":7,"phylumKey":7509337,"parent":"Protozoa","parentKey":7,"scientificName":"Amoebozoa","canonicalName":"Amoebozoa","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"7":"Protozoa"},"synonym":false},{"key":25,"kingdom":"Bacteria","phylum":"Acidobacteria","kingdomKey":3,"phylumKey":25,"parent":"Bacteria","parentKey":3,"nubKey":25,"scientificName":"Acidobacteria","canonicalName":"Acidobacteria","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":7553103,"kingdom":"Bacteria","phylum":"Armatimonadetes","kingdomKey":3,"phylumKey":7553103,"parent":"Bacteria","parentKey":3,"scientificName":"Armatimonadetes","canonicalName":"Armatimonadetes","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":13,"kingdom":"Plantae","phylum":"Anthocerotophyta","kingdomKey":6,"phylumKey":13,"parent":"Plantae","parentKey":6,"nubKey":13,"scientificName":"Anthocerotophyta","canonicalName":"Anthocerotophyta","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"6":"Plantae"},"synonym":false},{"key":95,"kingdom":"Fungi","phylum":"Ascomycota","kingdomKey":5,"phylumKey":95,"parent":"Fungi","parentKey":5,"nubKey":95,"scientificName":"Ascomycota","canonicalName":"Ascomycota","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"5":"Fungi"},"synonym":false},{"key":54,"kingdom":"Animalia","phylum":"Arthropoda","kingdomKey":1,"phylumKey":54,"parent":"Animalia","parentKey":1,"nubKey":54,"scientificName":"Arthropoda","canonicalName":"Arthropoda","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":26,"kingdom":"Bacteria","phylum":"Actinobacteria","kingdomKey":3,"phylumKey":26,"parent":"Bacteria","parentKey":3,"nubKey":26,"scientificName":"Actinobacteria","canonicalName":"Actinobacteria","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":42,"kingdom":"Animalia","phylum":"Annelida","kingdomKey":1,"phylumKey":42,"parent":"Animalia","parentKey":1,"nubKey":42,"scientificName":"Annelida","canonicalName":"Annelida","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":80,"kingdom":"Bacteria","phylum":"Aquificae","kingdomKey":3,"phylumKey":80,"parent":"Bacteria","parentKey":3,"nubKey":80,"scientificName":"Aquificae","canonicalName":"Aquificae","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":9715305,"kingdom":"Chromista","phylum":"Acavomonidia","kingdomKey":4,"phylumKey":9715305,"parent":"Chromista","parentKey":4,"scientificName":"Acavomonidia","canonicalName":"Acavomonidia","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"4":"Chromista"},"synonym":false}]//response.data
    });
    // speciesSuggest(searchText)
    //   .then(response => {
    //     that.setState({
    //       speciesSuggestions: !searchText ? [] : [{"key":8157094,"kingdom":"Animalia","phylum":"Arthropoda","order":"Araneae","family":"Salticidae","genus":"Saphrys","species":"Saphrys a-notata","kingdomKey":1,"phylumKey":54,"classKey":367,"orderKey":1496,"familyKey":5644,"genusKey":8021618,"speciesKey":8157094,"parent":"Saphrys","parentKey":8021618,"scientificName":"Saphrys a-notata (Mello-Leitão, 1940)","canonicalName":"Saphrys a-notata","rank":"SPECIES","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia","54":"Arthropoda","367":"Arachnida","1496":"Araneae","5644":"Salticidae","8021618":"Saphrys"},"synonym":false,"class":"Arachnida"},{"key":3388356,"kingdom":"Fungi","phylum":"Ascomycota","genus":"Lateriramulosa","species":"Lateriramulosa a-inflata","kingdomKey":5,"phylumKey":95,"genusKey":2590212,"speciesKey":3388356,"parent":"Lateriramulosa","parentKey":2590212,"nubKey":3388356,"scientificName":"Lateriramulosa a-inflata Matsush.","canonicalName":"Lateriramulosa a-inflata","rank":"SPECIES","status":"ACCEPTED","higherClassificationMap":{"5":"Fungi","95":"Ascomycota","2590212":"Lateriramulosa"},"synonym":false},{"key":7326975,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium a-bolosii","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":7326975,"parent":"Allium","parentKey":9624496,"nubKey":7326975,"scientificName":"Allium a-bolosii P.Palau","canonicalName":"Allium a-bolosii","rank":"SPECIES","status":"DOUBTFUL","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium"},"synonym":false,"class":"Liliopsida"},{"key":3697871,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium cupani","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":2856889,"parent":"Allium cupani","parentKey":2856889,"nubKey":3697871,"scientificName":"Allium a-bolosii subsp. eivissanum (Garbari & Miceli) N.Torres & Rossell","canonicalName":"Allium a-bolosii eivissanum","rank":"SUBSPECIES","status":"SYNONYM","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium","2856889":"Allium cupani"},"synonym":true,"class":"Liliopsida"},{"key":5172153,"kingdom":"Animalia","phylum":"Arthropoda","order":"Araneae","family":"Salticidae","genus":"Saphrys","species":"Saphrys a-notata","kingdomKey":1,"phylumKey":54,"classKey":367,"orderKey":1496,"familyKey":5644,"genusKey":8021618,"speciesKey":8157094,"parent":"Saphrys","parentKey":8021618,"nubKey":5172153,"scientificName":"Euophrys a-notata Mello-Leitão, 1940","canonicalName":"Euophrys a-notata","rank":"SPECIES","status":"HOMOTYPIC_SYNONYM","higherClassificationMap":{"1":"Animalia","54":"Arthropoda","367":"Arachnida","1496":"Araneae","5644":"Salticidae","8021618":"Saphrys","8157094":"Saphrys a-notata"},"synonym":true,"class":"Arachnida"},{"key":3698087,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Asparagales","family":"Amaryllidaceae","genus":"Allium","species":"Allium a-bolosii","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1169,"familyKey":7682,"genusKey":9624496,"speciesKey":7326975,"parent":"Allium","parentKey":9624496,"nubKey":3698087,"scientificName":"Allium cupani var. a-bolosii (P.Palau) O.Bol","canonicalName":"Allium cupani a-bolosii","rank":"VARIETY","status":"HOMOTYPIC_SYNONYM","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1169":"Asparagales","7682":"Amaryllidaceae","9624496":"Allium","7326975":"Allium a-bolosii"},"synonym":true,"class":"Liliopsida"},{"key":9663696,"kingdom":"Plantae","phylum":"Tracheophyta","order":"Poales","family":"Poaceae","genus":"Poa","species":"Poa matris-occidentalis","kingdomKey":6,"phylumKey":7707728,"classKey":196,"orderKey":1369,"familyKey":3073,"genusKey":2704173,"speciesKey":6431331,"parent":"Poa matris-occidentalis","parentKey":6431331,"scientificName":"Poa matris-occidentalis subsp. a-b, 2006","canonicalName":"Poa matris-occidentalis a-b","rank":"SUBSPECIES","status":"ACCEPTED","higherClassificationMap":{"6":"Plantae","7707728":"Tracheophyta","196":"Liliopsida","1369":"Poales","3073":"Poaceae","2704173":"Poa","6431331":"Poa matris-occidentalis"},"synonym":false,"class":"Liliopsida"},{"key":2,"kingdom":"Archaea","kingdomKey":2,"nubKey":2,"scientificName":"Archaea","canonicalName":"Archaea","rank":"KINGDOM","status":"ACCEPTED","higherClassificationMap":{},"synonym":false},{"key":1,"kingdom":"Animalia","kingdomKey":1,"nubKey":1,"scientificName":"Animalia","canonicalName":"Animalia","rank":"KINGDOM","status":"ACCEPTED","higherClassificationMap":{},"synonym":false},{"key":67,"kingdom":"Animalia","phylum":"Acanthocephala","kingdomKey":1,"phylumKey":67,"parent":"Animalia","parentKey":1,"nubKey":67,"scientificName":"Acanthocephala","canonicalName":"Acanthocephala","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":7509337,"kingdom":"Protozoa","phylum":"Amoebozoa","kingdomKey":7,"phylumKey":7509337,"parent":"Protozoa","parentKey":7,"scientificName":"Amoebozoa","canonicalName":"Amoebozoa","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"7":"Protozoa"},"synonym":false},{"key":25,"kingdom":"Bacteria","phylum":"Acidobacteria","kingdomKey":3,"phylumKey":25,"parent":"Bacteria","parentKey":3,"nubKey":25,"scientificName":"Acidobacteria","canonicalName":"Acidobacteria","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":7553103,"kingdom":"Bacteria","phylum":"Armatimonadetes","kingdomKey":3,"phylumKey":7553103,"parent":"Bacteria","parentKey":3,"scientificName":"Armatimonadetes","canonicalName":"Armatimonadetes","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":13,"kingdom":"Plantae","phylum":"Anthocerotophyta","kingdomKey":6,"phylumKey":13,"parent":"Plantae","parentKey":6,"nubKey":13,"scientificName":"Anthocerotophyta","canonicalName":"Anthocerotophyta","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"6":"Plantae"},"synonym":false},{"key":95,"kingdom":"Fungi","phylum":"Ascomycota","kingdomKey":5,"phylumKey":95,"parent":"Fungi","parentKey":5,"nubKey":95,"scientificName":"Ascomycota","canonicalName":"Ascomycota","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"5":"Fungi"},"synonym":false},{"key":54,"kingdom":"Animalia","phylum":"Arthropoda","kingdomKey":1,"phylumKey":54,"parent":"Animalia","parentKey":1,"nubKey":54,"scientificName":"Arthropoda","canonicalName":"Arthropoda","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":26,"kingdom":"Bacteria","phylum":"Actinobacteria","kingdomKey":3,"phylumKey":26,"parent":"Bacteria","parentKey":3,"nubKey":26,"scientificName":"Actinobacteria","canonicalName":"Actinobacteria","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":42,"kingdom":"Animalia","phylum":"Annelida","kingdomKey":1,"phylumKey":42,"parent":"Animalia","parentKey":1,"nubKey":42,"scientificName":"Annelida","canonicalName":"Annelida","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"1":"Animalia"},"synonym":false},{"key":80,"kingdom":"Bacteria","phylum":"Aquificae","kingdomKey":3,"phylumKey":80,"parent":"Bacteria","parentKey":3,"nubKey":80,"scientificName":"Aquificae","canonicalName":"Aquificae","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"3":"Bacteria"},"synonym":false},{"key":9715305,"kingdom":"Chromista","phylum":"Acavomonidia","kingdomKey":4,"phylumKey":9715305,"parent":"Chromista","parentKey":4,"scientificName":"Acavomonidia","canonicalName":"Acavomonidia","rank":"PHYLUM","status":"ACCEPTED","higherClassificationMap":{"4":"Chromista"},"synonym":false}]//response.data
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  render = () => {
    const {
      searchable,
      updateQuery,
      fetchData,
      data,
      query,
      searchValue,
      loading,
      filter,
      error,
      columns,
      width,
      classes,
      noHeader
    } = this.props;
    const { q, location } = query;
    const translatedSearch = this.props.intl.formatMessage({
      id: "search",
      defaultMessage: "Search"
    });
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
              <AutoComplete
                dataSource={this.state.placeSuggestions}
                style={{ width: 200 }}
                onSearch={this.onLocationSearch}
                onSelect={value => fetchData({ location: value, offset: 0 })}
                onChange={value => updateQuery({ ...query, location: value })}
                value={location}
                placeholder="search location"
              />
              <AutoComplete
                dataSource={this.state.speciesSuggestions}
                style={{ width: 200 }}
                onSearch={this.onSpeciesSearch}
                onSelect={value => fetchData({ ...query, taxon: value, offset: 0 })}
                //onChange={value => updateQuery({ location: value })}
                //value={location}
                placeholder="search taxon"
                optionLabelProp="scientificName"
              />
              {searchable && (
                <Search
                  className="dataTable-search"
                  placeholder={translatedSearch}
                  enterButton={translatedSearch}
                  size="large"
                  onChange={e => updateQuery({ ...query, q: e.target.value })}
                  value={q}
                  onSearch={val => fetchData({ ...query, q: val, offset: 0 })}
                  style={{ marginBottom: "16px" }}
                  disabled={!!filter.type}
                />
              )}
              <div className={classes.scrollContainer}>
                {!loading &&
                  data &&
                  JSON.stringify(data.aggregations.collections)}
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
