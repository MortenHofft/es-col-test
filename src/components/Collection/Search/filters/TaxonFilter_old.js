import React from 'react';
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { AutoComplete, Button, Dropdown, Icon } from "antd";
import { speciesSuggest, speciesFromKey } from "../../../../api/collection";
import fieldFormater from "../FieldFormater";

const ButtonGroup = Button.Group;
const ScientificName = fieldFormater(id => speciesFromKey(id).then(x => ({ title: x.data.scientificName })));

const styles = {
  blockquote: {
    margin: '1em 0',
    paddingLeft: '.8em',
    color: '#697b8c',
    fontSize: '90%',
    borderLeft: '4px solid #ebedf0'
  }
};

class TaxonFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speciesSuggestions: [],
      taxonSearchVisible: false
    };
  }

  cancelSpeciesSuggestPromise = () => {
    if (
      this.speciesSuggestPromise &&
      typeof this.speciesSuggestPromise.cancel === "function"
    ) {
      this.speciesSuggestPromise.cancel();
    }
  };

  onSpeciesSearch = searchText => {
    let that = this;
    this.cancelSpeciesSuggestPromise();
    this.speciesSuggestPromise = speciesSuggest(searchText);
    this.speciesSuggestPromise
      .then(response => {
        that.setState({
          speciesSuggestions: !searchText
            ? []
            : response.data.map(x => ({ value: x.key, text: x.scientificName }))
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  taxonSearch = () => {
    const { updateFilter, filter } = this.props;

    return (
      <div
        style={{
          background: "white",
          borderRadius: "3px",
          padding: "10px",
          boxShadow: "0 0 1000px 1000px rgba(0,0,0,.2)",
          maxWidth: 400
        }}
      >
        {this.state.taxonSearchVisible &&
          <AutoComplete
            dataSource={this.state.speciesSuggestions}
            style={{ width: '100%' }}
            autoFocus={true}
            defaultValue=""
            // allowClear={true}
            onSearch={this.onSpeciesSearch}
            onSelect={value => {
              updateFilter({ ...filter, taxonKey: value });
              this.setState({ taxonSearchVisible: false });
            }}
            placeholder="Scientific name"
          />}
        <blockquote className={this.props.classes.blockquote}>
          <p>Please enter a scienitific name. This will filter for collections mentioning this group as well as lower and higher groups.</p>
          <p>So if you search for Felidae, then collections mentioning e.g. 'Felidae' or 'Puma' will show, but also collections simply stating they have 'Mammalia'.</p>
        </blockquote>
      </div>
    );
  };

  render() {
    const { taxonKey } = this.props.filter;
    const updateFilter = this.props.updateFilter;
    return (
      <React.Fragment>
        {taxonKey ? (
          <ButtonGroup>
            <Dropdown
              overlay={this.taxonSearch()}
              trigger={["click"]}
              onVisibleChange={flag =>
                this.setState({ taxonSearchVisible: flag })
              }
              visible={this.state.taxonSearchVisible}
            >
              <Button type="primary"><ScientificName id={taxonKey} /></Button>
            </Dropdown>
            <Button type="primary" onClick={e => {
              updateFilter({ ...this.props.filter, taxonKey: undefined });
              this.setState({ taxonSearchVisible: false });
            }}><Icon type="close" /></Button>
          </ButtonGroup>
        ) : (
            <Dropdown
              overlay={this.taxonSearch()}
              trigger={["click"]}
              onVisibleChange={flag =>
                this.setState({ taxonSearchVisible: flag })
              }
              visible={this.state.taxonSearchVisible}
            >
              <Button>What</Button>
            </Dropdown>
          )}
      </React.Fragment>
    );
  }
}

TaxonFilter.propTypes = {
  updateFilter: PropTypes.func.isRequired
};

export default injectSheet(styles)(injectIntl(TaxonFilter));
