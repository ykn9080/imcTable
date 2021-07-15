import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "react-awesome-query-builder/lib/css/styles.css";
import $ from "jquery";
import { Query, Builder, Utils } from "react-awesome-query-builder";
import loadedConfig from "./config_simple"; // <- you can try './config_complex' for more complex examples
import loadedInitLogic from "./init_logic";

const { jsonLogicFormat, queryString, checkTree, loadFromJsonLogic } = Utils;

// get init value in JsonTree format:
// const initValue = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue : emptyInitValue;
// const initTree = checkTree(loadTree(initValue), loadedConfig);

// -OR- alternativaly get init value in JsonLogic format:
// const initLogic =
//   loadedInitLogic && Object.keys(loadedInitLogic).length > 0
//     ? loadedInitLogic
//     : undefined;
// const initTree = checkTree(
//   loadFromJsonLogic(initLogic, loadedConfig),
//   loadedConfig
// );

export const QueryFieldMaker = (datas) => {
  //datas:[{fieldname:}]
  let fields = {};

  datas.map((k, i) => {
    switch (k.type) {
      case "text":
        fields = {
          ...fields,
          [k.fieldname]: {
            type: "text",
            excludeOperators: ["proximity"],
            // fieldSettings: {
            //   validateValue: (val, fieldSettings) => {
            //     return (val.length < 10 && (val === "" || val.match(/^[A-Za-z0-9_-]+$/) !== null));
            //   },
            // },
            mainWidgetProps: {
              valueLabel: k.fieldname,
              valuePlaceholder: `Enter ${k.fieldname}`,
            },
          },
        };
        break;
      case "number":
        fields = {
          ...fields,
          [k.fieldname]: {
            label: k.fieldname,
            type: "number",
            preferWidgets: ["number"],
            // fieldSettings: {
            //   min: -1,
            //   max: 5
            // },
          },
        };
        break;
      case "slider":
        let min = 0,
          max = 100;
        if (k.min) {
          min = k.min;
          max = k.max;
        }

        fields = {
          ...fields,
          [k.fieldname]: {
            label: k.fieldname,
            type: "number",
            preferWidgets: ["slider", "rangeslider"],
            valueSources: ["value", "field"],
            fieldSettings: {
              min: min,
              max: max,
              step: 1,
              marks: {
                [min]: <strong>{min}</strong>,
                [max]: <strong>{max}</strong>,
              },
            },
            //overrides
            widgets: {
              slider: {
                widgetProps: {
                  valuePlaceholder: k.fieldname + "...",
                },
              },
            },
          },
        };
        break;
      case "datetime":
      case "date":
        fields = {
          ...fields,
          [k.fieldname]: {
            label: k.fieldname,
            type: k.type,
            valueSources: ["value"],
          },
        };
        break;
      case "boolean":
        fields = {
          ...fields,
          [k.fieldname]: {
            label: k.label,
            type: "boolean",
            defaultValue: true,
            mainWidgetProps: {
              labelYes: "true",
              labelNo: "false",
            },
          },
        };
        break;
      case "select":
      case "multiselect":
        let listVal = [];
        if (k.valArr)
          k.valArr.map((a, b) => {
            listVal.push({ value: a, title: a });
            return null;
          });
        fields = {
          ...fields,
          [k.fieldname]: {
            label: k.fieldname,
            type: k.type,
            valueSources: ["value"],
            fieldSettings: {
              listValues: listVal,
            },
          },
        };
        break;
      default:
        return null;
    }
    return null;
  });
  return fields;
};
const domStyle = () => {
  $(".query-builder-container").css("padding", "");
  $(".query-builder").css("margin", 0);
  //$(".rule").css("border", "solid 1px #d1cfcf");
  $(".rule").css("backgroundColor", "#f9f4f4");
  $(".group").css("backgroundColor", "white");
  $(".ant-btn-info").addClass("ant-btn-info");
  $(".ant-btn-danger").removeClass("ant-btn-danger");
  // JsonLogic();
};
const QueryBuilder = (props) => {
  const [inittree, setInittree] = useState();
  const [config, setConfig] = useState();
  domStyle();
  useEffect(() => {
    let initLogic = undefined;
    // loadedInitLogic && Object.keys(loadedInitLogic).length > 0
    //   ? loadedInitLogic
    //   : undefined;

    if (props.logic) initLogic = props.logic;

    if (props.fields) loadedConfig.fields = props.fields;
    const initTree1 = checkTree(
      loadFromJsonLogic(initLogic, loadedConfig),
      loadedConfig
    );
    setConfig(loadedConfig);
    setInittree(initTree1);
    //console.log(initLogic, props.logic, initTree1, loadedConfig);
  }, [props.logic, props.fields]);

  const renderBuilder = (props) => {
    return (
      <div className="query-builder-container" style={{ padding: "10px" }}>
        <div className="query-builder">
          <Builder {...props} />
        </div>
      </div>
    );
  };

  const onChange = (immutableTree, config1) => {
    // setImmutable(immutableTree);
    // setConfig(config1);
    // updateResult(immutableTree);

    // `jsonTree` or `logic` can be saved to backend
    // (and then loaded with `loadTree` or `loadFromJsonLogic` as seen above)
    //const jsonTree = getTree(immutableTree);
    //console.log(immutableTree, config1);

    const { logic, data, errors } = jsonLogicFormat(immutableTree, config1);
    // let fixlogic = { ...logic };
    // fixlogic = fixMultiSelect(fixlogic);
    const humanstring = queryString(immutableTree, config1, true);
    //console.log(humanstring, logic);
    if (props.onChange) props.onChange(logic, data, errors, humanstring);
  };

  return (
    <div>
      {config && (
        <>
          <Query
            {...config}
            value={inittree}
            onChange={onChange}
            renderBuilder={renderBuilder}
          />
        </>
      )}
    </div>
  );
};
export default QueryBuilder;
