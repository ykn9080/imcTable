import React from "react";
import $ from "jquery";
import axios from "axios";
import AntFormDisplay from "Form/AntFormDisplay";
import { Input, Row, Col } from "antd";

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
        //$("#dvResult").css({ visibility: "visible" });
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
      <Row gutter={4}>
        <Col flex={6}>
          {" "}
          <AntFormDisplay
            formid="60fe76d93f6f282f238e01bb"
            onFinish={onFinish}
          />
        </Col>
        <Col flex={6}>
          <TextArea rows={10} id="code"></TextArea>
        </Col>
      </Row>

      {/* <div
        id="dvResult"
        style={{
          marginLeft: 40,
          visibility: "hidden",
        }}
      >
        {jsonresult && (
          <AntFormDisplay
            formid="60ff4c603f6f287d3f8e01bc"
            initialValues={jsonresult}
          />
        )}
        {/* <Row gutter={4}>
          <Col flex={1}>Result:</Col>
          <Col flex={47}>
            <TextArea rows={10} id="code"></TextArea>
          </Col>
        </Row> */}
    </div>
  );
};

export default Dataget;
