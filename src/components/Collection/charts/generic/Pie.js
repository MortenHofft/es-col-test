import React from "react";
import Plotly from "plotly.js";
import PropTypes from "prop-types";

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const Pie = props => {
  return <Plot
    data={[
      {
        // values: [19, 26, 55],
        values: props.values,
        labels: props.labels,
        // labels: ["Residential", "Non-Residential", "Utility"],
        type: "pie"
      }
    ]}
    layout={{
      height: 300,
      width: 400,
      autosize: true,
      colorway : ['#1687EF', '#73BFB8', '#FEC601', '#EA7317', '#2364AA', '#d35656', '#f9d5bb'],
      margin: {
        l: 20,
        r: 20,
        b: 20,
        t: 20,
        pad: 0
      },
      // colorway : ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
    }}
    config={{ displaylogo: false, responsive: true }}
  />
}

Pie.propTypes = {
  values: PropTypes.array,
  labels: PropTypes.array,
};

export default Pie;
