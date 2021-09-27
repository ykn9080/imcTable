import React, { useState, useEffect } from "react";
import { Typography, Divider, Card } from "antd";
import SingleTable from "./SingleTable";
import AntFormDisplay from "imcformbuilder";
import formdt from "./config/AntFormDisplay.json";
import { Tabs, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

const EasyTable = ({ authObj, edit, onChange }) => {
  const [auth, setAuth] = useState([]);
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
      setAuth(newAuth);
    } else {
      setInit({ title: "", desc: "", size: "" });
      setAuth({});
    }
  }, [authObj]);

  const saveTable = (data) => {
    let local = auth;
    local.setting = data.setting;
    onChange(data);
    setAuth(data);
  };
  const onEditValuesChangeTable = (changedValues, allValues) => {
    //use localstorage to prevent state change
    let local = auth;
    local.setting = { ...local.setting, ...changedValues };
    setAuth(local);
    onChange(local);
  };
  const onFinishTable = (val) => {
    let local = auth;

    const st = local.setting;
    setTbsetting({ size: local?.setting?.size });
    setInit({ title: st.title, desc: st.desc, size: st.size });
    setTimeout(() => {
      setTbsetting({ size: local?.setting?.size });
      setInit({ title: st.title, desc: st.desc, size: st.size });
    }, 100);
  };
  const onDataGet = (val) => {
    const newData = { ...auth, dtlist: val };
    setAuth(newData);
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
          {auth && (
            <div style={{ marginTop: 40 }}>
              <SingleTable
                dataObj={auth}
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
            dataObj={auth}
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
