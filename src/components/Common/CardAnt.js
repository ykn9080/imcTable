import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CardAnt = (props) => {
  let setting = {},
    children = {},
    data;

  if (props.size) setting = { ...setting, size: props.size };
  if (props.width) setting = { ...setting, style: { width: props.width } };
  if (props.extra) setting = { ...setting, extra: props.extra };
  if (props.title) setting = { ...setting, title: props.title };
  if (props.hoverable) setting = { ...setting, hoverable: props.hoverable };
  if (props.cover) setting = { ...setting, cover: props.cover };
  if (props.data) {
    data = props.data;
    if (data.title) setting = { ...setting, title: data.title };
  }

  //cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
  if (props.children) children = { ...props.children };
  //children: <Meta title="Europe Street beat" description="www.instagram.com" />
  const actions = [
    <DeleteOutlined
      key="delete"
      onClick={() => props.removeItemHandler(props.id)}
    />,
    <EditOutlined key="edit" onClick={() => props.editItemHandler(props.id)} />,
  ];
  if (props.actions) setting = { ...setting, actions: actions };
  if (props.specialactions)
    setting = { ...setting, actions: props.specialactions }; // if diffenent actions

  return (
    <>
      <Card {...setting}>{props.children}</Card>
    </>
  );
};

export default CardAnt;
