/*
 * @Author: yknam
 * @Date: 2020-2-29 14:34
 * @Last Modified by: yknam
 * @Last Modified time: 2020-2-29 14:34
 * @Desc: Side Menu Bar Open when click top tab
 * Work on contextmenu 2-29
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import "antd/dist/antd.css";
import CardList from "components/SKD/CardList";
import "./SKD.css";
import NavAnt from "components/Common/NavAnt";
import { Form, Input, Button } from "antd";
import { currentsetting } from "config/index.js";

const { TextArea } = Input;
const SidebarTab = (props) => {
  const location = useLocation();
  const history = useHistory();
  let graphdata = useSelector((state) => state.global.graphdata);

  const initform = {
    setting: {
      formItemLayout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
      layout: "horizontal",
      size: "middle",
      initialValues: { name: "", password: "", date: null },
      onFinish: "{values => {console.log(values);};}",
      formColumn: 1,
    },
    list: [
      { label: "Name", name: "name", type: "input", seq: 0 },
      {
        label: "Pass",
        name: "password",
        type: "input.password",
        rules: [{ required: false, message: "hello" }],
        seq: 2,
        formColumn: 2,
        layout: "inline",
        formItemLayout: null,
        tailLayout: null,
        editable: true,
      },
      {
        label: "Date",
        name: "date",
        type: "datepicker",
        rules: [
          { type: "object", required: true, message: "Please select time!" },
        ],
        seq: 1,
      },
      {
        label: "Type",
        name: "type",
        type: "select",
        optionArray: [
          { text: "ss", value: "ss" },
          { text: "ss2", value: "ss1" },
        ],
        seq: 3,
      },
      {
        label: "Pass12345",
        name: "first col",
        type: "input",
        seq: 10,
        placeholder: "pls insert",
      },
      {
        type: "button",
        seq: 1000,
        tailLayout: { wrapperCol: { offset: 8, span: 16 } },
        btnArr: [
          {
            btnLabel: "Submit",
            btnStyle: "secondary",
            htmlType: "submit",
            seq: 0,
          },
          {
            btnLabel: "Cancel",
            btnStyle: "primary",
            htmlType: "button",
            seq: 1,
          },
        ],
      },
    ],
  };

  const [formdt, setFormdt] = useState(initform);
  const [param, setParam] = useState({});
  useEffect(() => {
    axios
      .get(
        `${currentsetting.webserviceprefix}bootform/5eac0e7868c258495433823f`
      )
      .then((response) => {
        setFormdt(response.data.data);
        console.log(response.data);
      });
  }, [graphdata]);

  const runAxios = () => {
    let newarr = [],
      obj = {};
    graphdata.edges.map((k, i) => {
      return (
        (obj = {}),
        (obj.src = k.from),
        (obj.tgt = k.to),
        (obj.wgt = k.value),
        newarr.push(obj)
      );
    });

    let postdata = {
      matrixes: [
        {
          edgelist: newarr,
          ...JSON.parse(param.matrixparam),
        },
      ],
      ...JSON.parse(param.otherparam),
    };

    let config = {
      method: "post",
      url: `${param.url}`,
      data: postdata,
    };

    axios(config).then((r) => console.log(r.data));
  };
  const AntForm = () => {
    const onFinish = (values) => {
      console.log("Success:", values);
      setParam(values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item name="matrixparam">
          <TextArea rows={5} placeholder="param inside matrix" />
        </Form.Item>
        <Form.Item name="otherparam">
          <TextArea rows={5} placeholder="parameter input" />
        </Form.Item>
        <Form.Item label="url" name="url">
          <Input placeholder="api url" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const ctrList = [
    {
      _id: "1",
      ctrid: "",
      type: "",
      seq: 0,
      content: <h3>test1</h3>,
      size: 12,
    },
    {
      _id: "2",
      ctrid: "",
      type: "",
      seq: 1,
      content: <h3>test1</h3>,
      size: 12,
    },
    // {
    //   _id: "3",
    //   ctrid: "",
    //   type: "",
    //   seq: 2,
    //   size: 12,
    // },
  ];
  const tabarr = [
    {
      title: "Summary",
      content:
        // <TreeAnt
        //   onSelect={onSelect}
        //   contextItems={contextItems}
        //   contextCallback={contextCallback}
        //   {...setting}
        //   id={"_id"}
        // />
        "this is summary area",
    },
    {
      title: "Analysis",
      content: (
        <>
          <CardList
            ctrList={ctrList}
            addtext="+ Add New Analysis"
            addNew={() =>
              addNew("model?from=" + location.pathname + location.search)
            }
          />
          <AntForm />
        </>
      ),
    },
    {
      title: "Widget",
      content: (
        <CardList
          ctrList={ctrList}
          addtext="+ Add New Widget"
          addNew={() =>
            addNew("widget?from=" + location.pathname + location.search)
          }
        />
      ),
    },
  ];

  const [tabb, setTabb] = useState(tabarr);

  const addNew = (type) => {
    history.push(`/${type}`);
  };
  console.log("formdt:", formdt);
  return (
    <>
      <NavAnt tab={tabb} />

      <Button onClick={runAxios}>run</Button>
    </>
  );
};

export default SidebarTab;
