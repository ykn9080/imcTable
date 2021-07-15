import React, { useState } from "react";
import "./App.css";
import Admin from "Admin";
import Model from "Model";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { userContext } from "components/functions/userContext";

const App = (props) => {
  const [gvalue, setGvalue] = useState([{ test: "ok", hello: "hi" }]);

  return (
    <>
      <Router>
        <userContext.Provider value={[gvalue, setGvalue]}>
          <Switch>
            <Route path="/" exact component={Admin} />
            <Route path="/model" component={Model} />
            <Route
              path="/admin/:name?/:child?/:grandchild?"
              component={Admin}
            />
          </Switch>
        </userContext.Provider>
      </Router>
    </>
  );
};

export default App;
