import React, { Component } from "react";
import Plotly from "plotly.js";
// import Plotly from "./Plotly";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class Pie extends Component {
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
    this.drawPie();
  }

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  //   this._mounted = false;

  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.query !== this.props.query) {
  //     this.getData();
  //   }
  // }

  drawPie = () => {
    // var data = [{
    // 	values: [19, 26, 55],
    // 	labels: ['Residential', 'Non-Residential', 'Utility'],
    // 	type: 'pie',
    // 	marker: {
    // 		colors: ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)']
    // 	},
    // 	hole: .4,
    // }];

    // var layout = {
    // 	height: 400,
    // 	width: 500,
    // 	showlegend: true
    // };

    // Plotly.newPlot('myDiv', data, layout, {displaylogo: false});
  };

  render() {
    return (
      <React.Fragment>
        <div id="myDiv"></div>
        <Plot
          data={[
            {
              values: [19, 26, 55],
              labels: ["Residential", "Non-Residential", "Utility"],
              type: "pie"
            }
          ]}
          layout={{
            height: 400,
            width: 500
          }}
        />
      </React.Fragment>
    );
  }
}

export default Pie;
