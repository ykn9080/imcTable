import React, { Typo } from "react";
import "antd/dist/antd.css";

import { Tag, Typography } from "antd";
const { Text, Title } = Typography;

const ViewHead = (props) => {
  console.log(props.initialValues);
  let init;
  if (props?.initialValues) init = props.initialValues;

  return init ? (
    <>
      <Title>{init.title}</Title>
      <Text>{init.desc}</Text>
    </>
  ) : null;
};

export const ViewTail = (props) => {
  console.log(props.initialValues);
  let tags = [];
  if (props?.initialValues?.tag) tags = props.initialValues.tag;
  return (
    <>
      <h2>ViewTail</h2>
      {tags.map((tag) => {
        return <Tag color="purple">{tag}</Tag>;
      })}
    </>
  );
};

export default ViewHead;
