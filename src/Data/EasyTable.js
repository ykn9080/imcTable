import React, { useState, useEffect } from "react";
import { Typography, Divider, Card } from "antd";
import SingleTable from "./SingleTable";
import AntFormDisplay from "imcformbuilder";
import formdt from "./config/AntFormDisplay.json";
import { Tabs } from "antd";

const { Title } = Typography;

const EasyTable = ({ authObj, edit, onChange }) => {
  const [auth, setAuth] = useState([]);
  const [init, setInit] = useState();
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
      }
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
    if (onChange) onChange(local);
    setAuth(local);
  };

  const onFinishTable = (val) => {
    let local = auth;

    let st = local.setting;
    st = { ...st, ...val };
    setTbsetting({ size: local?.setting?.size });
    setInit({ title: st.title, desc: st.desc, size: st.size });
    if (onChange) onChange(local);
    setTimeout(() => {
      setTbsetting({ size: local?.setting?.size });
      setInit({ title: st.title, desc: st.desc, size: st.size });
    }, 100);
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
                <AntFormDisplay
                  formArray={formdt["5f0ff2fe89db1023b0165b19"]}
                  onFinish={onFinishTable}
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
