import React, { useState, useEffect } from "react";
import { Typography, Divider, Card } from "antd";
import SingleTable from "./SingleTable";
import AntFormDisplay from "imcformbuilder";
import formdt from "./config/AntFormDisplay.json";
import { Tabs, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

const EasyTable = ({ authObj, edit, save }) => {
  const [data, setData] = useState([]);
  const [init, setInit] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [tbsetting, setTbsetting] = useState();

  useEffect(() => {
    if (authObj) {
      let newAuth = { ...authObj };
      let title = "",
        desc = "",
        size = "";

      if (newAuth.title) title = newAuth.title;
      if (newAuth.setting) {
        localStorage.setItem("modelchart", JSON.stringify(authObj));
        const st = newAuth.setting;
        if (st.title) title = st.title;
        desc = st.desc;
        size = st.size;
        let src = {};
        if (st.initVal) src.initVal = st.initVal;
        if (st.result) src.result = st.result;
        setDtsrc(src);
      }
      if (newAuth.dtsrc) setDtsrc(newAuth.dtsrc);
      setInit({ title, desc, size });
      setData(newAuth);
    } else {
      setInit({ title: "", desc: "", size: "" });
      setData({});
    }
  }, [authObj]);

  const saveTable = (data) => {
    let local,
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = data.setting;
    localStorage.setItem("modelchart", JSON.stringify(local));
    setData(data);
    if (save) save(data);
  };
  const onEditValuesChangeTable = (changedValues, allValues) => {
    //use localstorage to prevent state change
    let local = {},
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...changedValues };
    localStorage.setItem("modelchart", JSON.stringify(local));
  };
  const onFinishTable = (val) => {
    let local,
      local1 = localStorage.getItem("modelchart");
    if (local1) {
      local = JSON.parse(local1);
      const st = local.setting;
      setTbsetting({ size: local?.setting?.size });
      setInit({ title: st.title, desc: st.desc, size: st.size });
      setTimeout(() => {
        setTbsetting({ size: local?.setting?.size });
        setInit({ title: st.title, desc: st.desc, size: st.size });
      }, 100);
    }
  };
  const onDataGet = (val) => {
    const newData = { ...data, dtlist: val };
    setData(newData);
  };

  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      {edit === true ? (
        <>
          {init && (
            <>
              <Title level={4}>Table</Title>
              <Divider style={{ marginTop: 0 }} />
              <Card>
                <Button
                  type="link"
                  icon={<RedoOutlined />}
                  onClick={onFinishTable}
                />
                <AntFormDisplay
                  formArray={formdt["5f0ff2fe89db1023b0165b19"]}
                  onValuesChange={onEditValuesChangeTable}
                  initialValues={init}
                />
              </Card>
            </>
          )}
          {data && (
            <div style={{ marginTop: 40 }}>
              <SingleTable
                dataObj={data}
                tbsetting={tbsetting}
                edit={edit}
                className="gridcontent"
                save={saveTable}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: 40 }}>
          <SingleTable
            dataObj={data}
            tbsetting={tbsetting}
            edit={edit}
            className="gridcontent"
            save={saveTable}
          />
        </div>
      )}
    </div>
  );
};

export default EasyTable;
