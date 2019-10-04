import React, { Component } from "react";
import injectSheet from "react-jss";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA";

const styles = {
  card: {
    background: 'white',
    borderRadius: '3px',
    color: '#7f82a2',
    border: '1px solid #ddd',
    overflow: 'hidden',
    display: 'block'
  },
  map: {
    height: "400px",
    width: '100%',
    overflow: 'hidden',
    "& canvas:focus": {
      outline: "none"
    }
  }
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      zoom: 0,
      center: [0, 0]
    });
    this.map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-left');
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.card}>
        <div ref={this.myRef} className={classes.map} />
      </div>
    );
  }
}

export default injectSheet(styles)(Map);
