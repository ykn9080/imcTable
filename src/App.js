import React, { useState } from "react";
import "./App.css";

import { userContext } from "components/functions/userContext";
import SingleTable from "Data/DataEdit1_SingleTable";

const App = (props) => {
  const [gvalue, setGvalue] = useState([{ test: "ok", hello: "hi" }]);

  return (
    <div style={{ flexGrow: 1 }}>
      <userContext.Provider value={[gvalue, setGvalue]}>
        <SingleTable />
      </userContext.Provider>
    </div>
  );
};

export default App;
