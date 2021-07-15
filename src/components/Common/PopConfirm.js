import React from "react";
import { Popconfirm, message } from "antd";

function confirm(e) {
  console.log(e);
  message.success("Click on Yes");
}

function cancel(e) {
  console.log(e);
  message.error("Click on No");
}
const PopConfirm = (props) => {
  return (
    <Popconfirm
      title="Are you sure delete?"
      onConfirm={props.confirm}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <a href="#">Delete</a>
    </Popconfirm>
  );
};

export default PopConfirm;
