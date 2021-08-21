import React, { useState } from "react";
import "./App.css";

import SingleTable from "Data/DataEdit1_SingleTable";

const App = (props) => {

  return (
    <div style={{ flexGrow: 1 }}>
        <SingleTable />
    </div>
  );
};

export default App;
