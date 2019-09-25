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
  },
  filter: {
    display: 'inline-block',
    marginRight: 10
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
      this.suggestions &&
      typeof this.suggestions.cancel === "function"
    ) {
      this.suggestions.cancel();
    }
  };

  onSpeciesSearch = async searchText => {
    let that = this;
    this.cancelSpeciesSuggestPromise();
    this.suggestions = this.props.suggest(searchText);
    if (this.suggestions && typeof this.suggestions.then === "function") {
      this.suggestions
        .then(response => {
          that.setState({
            speciesSuggestions: !searchText
              ? []
              : response.map(x => {
                return this.props.mapping ? this.props.mapping(x) : x
              })
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      that.setState({
        speciesSuggestions: this.suggestions
      });
    }
  };

  taxonSearch = () => {
    const { updateFilter, filter } = this.props;

    return (
      <React.Fragment>
        {this.state.taxonSearchVisible &&
          <div
            style={{
              background: "white",
              borderRadius: "3px",
              padding: "10px",
              boxShadow: "0 0 1000px 1000px rgba(0,0,0,.2)",
              maxWidth: 400
            }}
          >
            <AutoComplete
              dataSource={this.state.speciesSuggestions}
              style={{ width: '100%' }}
              autoFocus={true}
              defaultValue=""
              // allowClear={true}
              onSearch={this.onSpeciesSearch}
              onSelect={value => {
                updateFilter({ ...filter, ...{ [this.props.name]: value } });
                this.setState({ taxonSearchVisible: false });
              }}
              placeholder={this.props.placeholder}
            />
            <blockquote className={this.props.classes.blockquote}>
              {this.props.helpText}
            </blockquote>
          </div>
        }
      </React.Fragment>
    );
  };

  render() {
    const filterValue = this.props.filter[this.props.name];
    const updateFilter = this.props.updateFilter;
    const DisplayLabel = this.props.displayLabel;
    return (
      <div className={this.props.classes.filter}>
        {filterValue ? (
          <ButtonGroup>
            <Dropdown
              overlay={this.taxonSearch()}
              trigger={["click"]}
              onVisibleChange={flag =>
                this.setState({ taxonSearchVisible: flag })
              }
              visible={this.state.taxonSearchVisible}
            >
              <Button type="primary">{<DisplayLabel id={filterValue} />}</Button>
            </Dropdown>
            <Button type="primary" onClick={e => {
              updateFilter({ ...this.props.filter, ...{ [this.props.name]: undefined } });
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
              <Button>{this.props.blankName}</Button>
            </Dropdown>
          )}
      </div>
    );
  }
}

TaxonFilter.propTypes = {
  updateFilter: PropTypes.func.isRequired
};

export default injectSheet(styles)(injectIntl(TaxonFilter));
