import React, { Component } from "react";
import PropTypes from "prop-types";

class DataFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      data: undefined
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.getData();
  }

  componentWillUnmount() {
    // Cancel fetch callback?
    this._mounted = false;
    if (this.dataResult && typeof this.dataResult.cancel === "function") {
      this.dataResult.cancel();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.getData();
    }
  }

  getData = () => {
    this.dataResult = this.props.api(this.props.query);
    this.setState({loading: true, error: false});
    // if it is a promise, then wait for it to return
    if (this.dataResult && typeof this.dataResult.then === "function") {
      this.dataResult.then(
        result => {
          if (this._mounted) {
            this.setState({loading: false, error: false, data: result});
          }
        },
        error => {
          if (this._mounted) {
            this.setState({loading: false, error: error, data: undefined});
          }
        }
      );
    } else {
      // the function simply returned a value.
      this.setState({loading: false, error: false, data: this.dataResult});
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.render(this.state)}
      </React.Fragment>
    );
  }
};

DataFetcher.propTypes = {
  query: PropTypes.object,
  api: PropTypes.func.isRequired,
};

export default DataFetcher;