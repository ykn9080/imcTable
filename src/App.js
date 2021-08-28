import React from "react";
import "./App.css";

import EasyTable from "Data/EasyTable";

const App = (props) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <EasyTable
        edit={true}
        dataObj={sampledata}
        tbsetting={{ size: "small" }}
      />
    </div>
  );
};

export default App;

const sampledata = {
  key: "ext5",
  title: "Partition Vector",
  type: "table",
  dtorigin: [
   
      {
        key: '1',
        name: 'John Brown',
        chinese: 98,
        math: 60,
        english: 70,
      },
      {
        key: '2',
        name: 'Jim Green',
        chinese: 98,
        math: 66,
        english: 89,
      },
      {
        key: '3',
        name: 'Joe Black',
        chinese: 98,
        math: 90,
        english: 70,
      },
      {
        key: '4',
        name: 'Jim Red',
        chinese: 88,
        math: 99,
        english: 89,
      },
    
  ],
  setting: {
    column: [
      {
        title: "Partition",
        titletext: "Partition",
        origin: "Partition",
        dataIndex: "Partition",
        key: "Partition",
        datatype: "int",
      },
    ],
    reset: false,
    title: "Partition Vector",
    size: "small",
  },
  id: "210317132524",
  checked: true,
  x: 6,
  y: 0,
  w: 6,
  h: 14,
  i: "1",
  dtlist: [
    {
      key: '1',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '2',
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: '3',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '4',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ],
};
