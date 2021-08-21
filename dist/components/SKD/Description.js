import React from "react";
import { Descriptions } from "antd";
export const DescRow = ({
  data,
  title,
  format,
  colspan,
  extra
}) => {
  if (!format) format = -1;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Descriptions, {
    column: {
      xxl: 4,
      xl: 3,
      lg: 3,
      md: 3,
      sm: 2,
      xs: 1
    },
    title: title,
    size: "small",
    extra: extra
  }, Object.keys(data).map((a, b) => {
    let txt = data[a];
    let colspan1 = 1;
    if (!a) return;
    const upperKey = a[0].toUpperCase() + a.slice(1);

    if (colspan && colspan[a]) {
      colspan1 = parseInt(colspan[a]);
    }

    return /*#__PURE__*/React.createElement(Descriptions.Item, {
      label: upperKey,
      key: a + b,
      span: colspan1
    }, txt);
  })));
};

const Description = ({
  data,
  title,
  format,
  colspan,
  extra
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "99%",
      padding: 5
    }
  }, data && /*#__PURE__*/React.createElement(DescRow, {
    data: data,
    title: title,
    format: format,
    colspan: colspan,
    extra: extra
  })));
};

export default Description;