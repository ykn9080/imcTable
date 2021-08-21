import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ButtonNew = props => {
  let title = "ADD NEW";
  if (props.title) title = props.title;
  let setting = {
    icon: /*#__PURE__*/React.createElement(PlusOutlined, null),
    size: "large",
    type: "dashed",
    style: {
      width: "100%",
      height: 100
    }
  };
  if (props.icon) setting = { ...setting,
    icon: props.icon
  };
  if (props.size) setting = { ...setting,
    size: props.size
  };
  if (props.type) setting = { ...setting,
    type: props.type
  };
  if (props.style) setting = { ...setting,
    style: props.style
  };
  if (props.onClick) setting = { ...setting,
    onClick: props.onClick
  };
  return /*#__PURE__*/React.createElement(Button, setting, title);
};

export default ButtonNew;