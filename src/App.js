import React from "react";
import "./App.css";

import EasyTable from "Data/EasyTable";

const App = (props) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <EasyTable
        showmenu={true}
        authObj={sampledata}
        tbsetting={{ size: "small" }}
      />
    </div>
  );
};

export default App;

const sampledata = {
  setting: {
    column: [
      {
        title: "name",
        titletext: "name",
        origin: "name",
        dataIndex: "name",
        key: "name",
        datatype: "string",
      },
      {
        title: "chinese",
        titletext: "chinese",
        origin: "chinese",
        dataIndex: "chinese",
        key: "chinese",
        datatype: "int",
      },
      {
        title: "math",
        titletext: "math",
        origin: "math",
        dataIndex: "math",
        key: "math",
        datatype: "int",
      },
      {
        title: "english",
        titletext: "english",
        origin: "english",
        dataIndex: "english",
        key: "english",
        datatype: "int",
      },
    ],
    reset: false,
    title: "Score",
    size: "small",
  },
  dtlist: [
    {
      key: "1",
      name: "John Brown",
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: "2",
      name: "Jim Green",
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: "3",
      name: "Joe Black",
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: "4",
      name: "Jim Red",
      chinese: 88,
      math: 99,
      english: 89,
    },
  ],
};
