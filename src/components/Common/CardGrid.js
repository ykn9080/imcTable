import React from "react";
import "antd/dist/antd.css";

import { Card, Space } from "antd";

let gridStyle = {
  width: "50%",
  textAlign: "center",
};
const CardGrid = (props) => {
  if (props.gridStyle) gridStyle = props.gridStyle;
  return (
    <Card title={props.title}>
      {props.cardArray.map((k, i) => {
        return <Card.Grid style={gridStyle}>{k}</Card.Grid>;
      })}
    </Card>
  );
};

export const CardGroup = (props) => {
  if (props.gridStyle) gridStyle = { ...gridStyle, ...props.gridStyle };
  return (
    <Space size={8}>
      {/* {props.cardArray.map((k, i) => {
        return (
          <Card title={k.title} style={gridStyle}>
            {k.contents}
          </Card>
        );
      })} */}
      <Card title="Card" style={gridStyle}>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card title="Card" style={gridStyle}>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card title="Card" style={gridStyle}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card title="Card" style={gridStyle}>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
};
export default CardGrid;
