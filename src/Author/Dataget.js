import React from "react";
import $ from "jquery";
import axios from "axios";
import AntFormDisplay from "Form/AntFormDisplay";
import { Input } from "antd";

const { TextArea } = Input;
const Dataget = (props) => {
  const onFinish = (val) => {
    console.log(val);
    const options = {
      method: val.method,
      url: val.url,
    };
    if (val.header) options = { ...options, header: JSON.parse(val.header) };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        let rtn = response.data;
        if (val.datafield) {
          const fields = val.datafield.split(".");

          fields.map((k, i) => {
            rtn = rtn[k];
          });
        }
        props.onDataGet(rtn);
        $("#code").val(JSON.stringify(response.data, null, 2));
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  return (
    <div>
      <AntFormDisplay formid="60fe76d93f6f282f238e01bb" onFinish={onFinish} />
      <TextArea rows={10} id="code"></TextArea>
    </div>
  );
};

export default Dataget;
