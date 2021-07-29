import React from "react";
import { Doughnut } from "react-chartjs-2";

let data = {
  labels: ["Red", "Green", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

const Chartjs2 = (props) => {
  if (props.data) data = props.data;
  let setting = {};
  if (props.legend) setting = { legend: props.legend };
  return (
    <div>
      <Doughnut data={data} {...setting} />
    </div>
  );
};

export default Chartjs2;
