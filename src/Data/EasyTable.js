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

  // const updateLocalStorage = (title, updateObj) => {
  //   let local,
  //     local1 = localStorage.getItem(title);
  //   if (local1) local = JSON.parse(local1);
  //   local.setting = { ...local.setting, ...updateObj };

  //   //updateObj==={}, remove options
  //   if ((Object.keys(updateObj).length === 0) | !updateObj.options) {
  //     delete local.setting.options;
  //     form.resetFields();
  //   }
  //   localStorage.setItem(title, JSON.stringify(local));
  // };
  // const saveTemp = (trigger) => {
  //   let authorlist = tempModel?.properties?.resultsAuthor;

  //   if (trigger.length > 0 && trigger[0] === "save") {
  //     let newdata = { ...data };
  //     let mdtb = localStorage.getItem("modeltable");
  //     let set = {};
  //     set = newdata.setting;
  //     if (mdtb) {
  //       mdtb = JSON.parse(mdtb);
  //       set = { ...set, ...mdtb };
  //       // newdata = { ...newdata, ...mdtb };
  //       localStorage.removeItem("modeltable");
  //     }
  //     let dtsrc = localStorage.getItem("modeldtsrc");
  //     if (dtsrc) {
  //       dtsrc = JSON.parse(dtsrc);
  //       set = { ...set, ...dtsrc };
  //       localStorage.removeItem("modeldtsrc");
  //     }

  //     newdata = {
  //       ...newdata,
  //       setting: set,
  //     };

  //     let notexist = true;
  //     authorlist.map((k, i) => {
  //       if (k.i === newdata.i) {
  //         authorlist.splice(i, 1, newdata);
  //         notexist = false;
  //       }
  //       return null;
  //     });
  //     if (notexist) {
  //       authorlist.push(newdata);
  //     }

  //     tempModel.properties.resultsAuthor = authorlist;
  //     dispatch(globalVariable({ tempModel }));
  //     dispatch(globalVariable({ triggerChild: [] }));
  //   }
  // };
  // saveTemp(trigger);

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

    // if (changedValues.size) {
    //   setTbsetting({ size: allValues.size });
    //   //setInit({ ...init, size: allValues.size });
    // }
  };
  const onFinishTable = (val) => {
    let local,
      local1 = localStorage.getItem("modelchart");
    if (local1) {
      local = JSON.parse(local1);
      setTbsetting({ size: local?.setting?.size });
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
