/*eslint no-unused-vars: ["off", {"varsIgnorePattern": "^_"}]*/
import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Query, Builder, Utils } from "react-awesome-query-builder";
import throttle from "lodash/throttle";
import loadedConfig from "./config_simple"; // <- you can try './config_complex' for more complex examples
import loadedInitValue from "./init_value";
import loadedInitLogic from "./init_logic";
const stringify = JSON.stringify;
const {
  jsonLogicFormat,
  queryString,
  mongodbFormat,
  sqlFormat,
  getTree,
  checkTree,
  loadTree,
  uuid,
  loadFromJsonLogic,
} = Utils;
const preStyle = {
  backgroundColor: "darkgrey",
  margin: "10px",
  padding: "10px",
};
const preErrorStyle = {
  backgroundColor: "lightpink",
  margin: "10px",
  padding: "10px",
};

const emptyInitValue = { id: uuid(), type: "group" };

// get init value in JsonTree format:
// const initValue = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue : emptyInitValue;
// const initTree = checkTree(loadTree(initValue), loadedConfig);

// -OR- alternativaly get init value in JsonLogic format:
const initLogic =
  loadedInitLogic && Object.keys(loadedInitLogic).length > 0
    ? loadedInitLogic
    : undefined;
const initTree = checkTree(
  loadFromJsonLogic(initLogic, loadedConfig),
  loadedConfig
);
console.log(initLogic, loadFromJsonLogic(initLogic, loadedConfig));
const DemoQueryBuilder = (props) => {
  const [tree, setTree] = useState(initTree);
  const [config, setConfig] = useState(loadedConfig);
  const [immutable, setImmutable] = useState();

  useEffect(() => {
    $(".query-builder-container").css("padding", "");
    $(".query-builder").css("margin", 0);
    //$(".rule").css("border", "solid 1px #d1cfcf");
    $(".rule").css("backgroundColor", "#f9f4f4");
    $(".group").css("backgroundColor", "white");
    $(".ant-btn-info").addClass("ant-btn-info");
    $(".ant-btn-danger").removeClass("ant-btn-danger");
  }, []);
  const resetValue = () => {
    setTree(initTree);
  };

  const clearValue = () => {
    setTree(loadTree(emptyInitValue));
  };

  const renderBuilder = (props) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder">
        <Builder {...props} />
      </div>
    </div>
  );

  const onChange = (immutableTree, config1) => {
    console.log(immutableTree, config1);
    setImmutable(immutableTree);
    setConfig(config);
    // updateResult(immutableTree);

    // `jsonTree` or `logic` can be saved to backend
    // (and then loaded with `loadTree` or `loadFromJsonLogic` as seen above)
    const jsonTree = getTree(immutableTree);
    const { logic, data, errors } = jsonLogicFormat(immutableTree, config1);
    console.log(jsonTree, logic, data, errors);
    const humanstring = queryString(immutableTree, config1);
    console.log(humanstring);
    if (props.onChange) props.onChange(logic, data, errors, humanstring);
  };

  // const updateResult = throttle((immutableTree,config1) => {
  //   setTree(immutableTree);
  //   setConfig(config1);
  // }, 100);

  const renderResult = () => {
    const { logic, data, errors } = jsonLogicFormat(immutable, config);
    console.log(immutable, config, queryString(immutable, config));
    return (
      <div>
        <br />
        <div>
          stringFormat:
          <pre style={preStyle}>
            {stringify(queryString(immutable, config), undefined, 2)}
          </pre>
        </div>
        <hr />
        <div>
          humanStringFormat:
          <pre style={preStyle}>
            {stringify(queryString(immutable, config, true), undefined, 2)}
          </pre>
        </div>
        <hr />
        <div>
          sqlFormat:
          <pre style={preStyle}>
            {stringify(sqlFormat(immutable, config), undefined, 2)}
          </pre>
        </div>
        <hr />
        <div>
          mongodbFormat:
          <pre style={preStyle}>
            {stringify(mongodbFormat(immutable, config), undefined, 2)}
          </pre>
        </div>
        <hr />
        <div>
          <a
            href="http://jsonlogic.com/play.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            jsonLogicFormat
          </a>
          :
          {errors.length > 0 && (
            <pre style={preErrorStyle}>{stringify(errors, undefined, 2)}</pre>
          )}
          {!!logic && (
            <pre style={preStyle}>
              {"// Rule"}:<br />
              {stringify(logic, undefined, 2)}
              <br />
              <hr />
              {"// Data"}:<br />
              {stringify(data, undefined, 2)}
            </pre>
          )}
        </div>
        <hr />
        <div>
          Tree:
          <pre style={preStyle}>
            {stringify(getTree(immutable), undefined, 2)}
          </pre>
        </div>
      </div>
    );
  };
  console.log(loadedConfig, tree);
  return (
    <div>
      <Query
        {...loadedConfig}
        value={tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />

      <button onClick={resetValue}>reset</button>
      <button onClick={clearValue}>clear</button>

      <div className="query-builder-result">{renderResult()}</div>
    </div>
  );
};
export default DemoQueryBuilder;
