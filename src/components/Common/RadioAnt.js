import React, { useState } from "react";
import { Radio, Input } from "antd";

const RadioAnt = (props) => {
  const [value, setValue] = useState(-1);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    if (props.onChange) props.onChange(e.target.value);
  };

  let radioStyle = {};
  //vertical position
  //   radioStyle = {
  //     display: "block",
  //     height: "30px",
  //     lineHeight: "30px",
  //   };
  //type="button" buttonStyle="solid" -> box style
  let groupStyle = {};
  if (props.buttonStyle)
    groupStyle = { ...groupStyle, buttonStyle: props.buttonStyle };
  if (props.radioStyle) radioStyle = { ...radioStyle, ...props.radioStyle };

  const Rad = ({ k }) => {
    if (props.type === "button")
      return (
        <Radio.Button value={k.value}>
          {k.label ? k.label : k.value}
        </Radio.Button>
      );
    else {
      return (
        <Radio style={radioStyle} value={k.value}>
          {k.label ? k.label : k.value}
          {value === -2 ? (
            <Input style={{ width: 100, marginLeft: 10 }} />
          ) : null}
        </Radio>
      );
    }
  };
  return (
    <Radio.Group onChange={onChange} value={value} {...groupStyle}>
      {props.radioArray.map((k, i) => {
        return <Rad k={k} />;
      })}
    </Radio.Group>
  );
};

export default RadioAnt;
