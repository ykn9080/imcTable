import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useLocation, useHistory } from "react-router-dom";
import querySearch from "stringquery";
import { Button, Tooltip, Space, Popover, Alert, Typography } from "antd";
import {
  FormOutlined,
  PaperClipOutlined,
  CopyrightCircleOutlined,
} from "@ant-design/icons";
import { FaRegCopy } from "react-icons/fa";
import PageHead from "components/Common/PageHeader";
import AntFormDisplay from "Form/AntFormDisplay";
import "components/Common/Antd.css";

const { Text } = Typography;

const FormView = (props) => {
  const location = useLocation();
  let query = querySearch(location.search);
  const history = useHistory();
  const dispatch = useDispatch();
  dispatch(globalVariable({ formEdit: false }));
  const [submitted, setSubmitted] = useState();
  let formdt = useSelector((state) => state.global.currentData);
  let selectedKey = useSelector((state) => state.global.selectedKey);

  if (query.rtn) history.push("/admin/control/form/formedit");
  useEffect(() => {
    dispatch(globalVariable({ helpLink: null }));
    dispatch(globalVariable({ selectedKey: formdt._id }));
  }, []);
  if (typeof location.state != "undefined") formdt = location.state;
  //in order to reload

  dispatch(globalVariable({ currentData: formdt }));
  const extra = [
    <Tooltip title="Edit">
      <Button
        shape="circle"
        icon={<FormOutlined />}
        onClick={() => history.push("/admin/control/form/formedit")}
      />
    </Tooltip>,
    <Tooltip title="Copy Code">
      <Button
        shape="circle"
        icon={<FaRegCopy />}
        onClick={() =>
          navigator.clipboard
            .writeText(JSON.stringify(formdt))
            .then(function () {
              console.log(
                "Async: Copying the code to clipboard was successful!"
              );
            })
        }
      />
    </Tooltip>,
    <Tooltip title="View Code">
      <Popover
        placement="topLeft"
        title={"Submitted data"}
        content={submitted}
        trigger="click"
      >
        <Button
          shape="circle"
          icon={<CopyrightCircleOutlined />}
          onClick={() => {}}
        />
      </Popover>
    </Tooltip>,
  ];
  const copyclipboard = (
    <Tooltip title="Copy to Clipboard">
      {formdt._id}
      {"  "}
      <Button
        style={{ border: "none" }}
        icon={<PaperClipOutlined />}
        onClick={() => {
          navigator.clipboard.writeText(formdt._id).then(function () {
            console.log("Async: Copying to clipboard was successful!");
          });
        }}
      />
    </Tooltip>
  );
  const sum = formdt?.data?.setting;
  const content = [
    { term: "Id", detail: copyclipboard },
    { term: "Title", detail: formdt.name },
    { term: "Column", detail: sum?.formColumn },
    { term: "Size", detail: sum?.size },
    { term: "Layout", detail: sum?.layout },
    { term: "LabelWidth", detail: sum?.formItemLayout.labelCol.span },
    { term: "Description", detail: sum?.desc, span: 24 },
  ];
  const onValuesChange = (changedValues, allValues) => {
    setSubmitted(JSON.stringify(allValues, null, 4));
  };
  const onFinish = (val) => {
    setSubmitted(JSON.stringify(val, null, 4));
  };
  return (
    <>
      <div className="site-page-header-ghost-wrapper">
        <PageHead
          title="FormView"
          onBack={true}
          extra={extra}
          content={content}
          ghost={false}
          span={12}
        ></PageHead>
      </div>

      <div style={{ margin: 10 }}>
        <div>
          {submitted && (
            <Space>
              <Alert message={submitted} type="success" />
            </Space>
          )}
        </div>
        <AntFormDisplay
          formArray={formdt.data}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
        />
      </div>
    </>
  );
};

export default FormView;
