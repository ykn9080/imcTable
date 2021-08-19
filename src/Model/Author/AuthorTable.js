import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { Typography, Divider, Card, Button } from "antd";
import SingleTable from "Data/DataEdit1_SingleTable";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import Dataget from "Model/Author/Dataget";
import { Tabs } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthorTable = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [init, setInit] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [tbsetting, setTbsetting] = useState();

  const tempModel = useSelector((state) => state.global.tempModel);

  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "edit/graph?type=table" }));
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
      setData(newAuth);
    } else {
      setInit({ title: "", desc: "", size: "" });
      setData({});
    }
  }, [authObj]);

  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;

    if (trigger.length > 0 && trigger[0] === "save") {
      let newdata = { ...data };
      let mdtb = localStorage.getItem("modeltable");
      let set = {};
      set = newdata.setting;
      if (mdtb) {
        mdtb = JSON.parse(mdtb);
        set = { ...set, ...mdtb };
        // newdata = { ...newdata, ...mdtb };
        localStorage.removeItem("modeltable");
      }
      let dtsrc = localStorage.getItem("modeldtsrc");
      if (dtsrc) {
        dtsrc = JSON.parse(dtsrc);
        set = { ...set, ...dtsrc };
        localStorage.removeItem("modeldtsrc");
      }

      newdata = {
        ...newdata,
        setting: set,
      };

      let notexist = true;
      authorlist.map((k, i) => {
        if (k.i === newdata.i) {
          authorlist.splice(i, 1, newdata);
          notexist = false;
        }
        return null;
      });
      if (notexist) {
        authorlist.push(newdata);
      }

      tempModel.properties.resultsAuthor = authorlist;
      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ triggerChild: [] }));
    }
  };
  saveTemp(trigger);

  const saveTable = (data) => {
    setData(data);
  };
  const onEditValuesChangeTable = (changedValues, allValues) => {
    localStorage.setItem("modeltable", JSON.stringify(allValues));
    if (changedValues.size) setTbsetting({ size: allValues.size });
  };

  const onDataGet = (val) => {
    const newData = { ...data, dtlist: val };
    setData(newData);
  };

  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      {edit === true ? (
        <Tabs tabPosition={"left"}>
          <TabPane tab="Author" key="1">
            {edit && init && (
              <>
                <Title level={4}>Table</Title>
                <Divider style={{ marginTop: 0 }} />
                <Card>
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
          </TabPane>
          <TabPane tab="Data" key="2">
            <Dataget onDataGet={onDataGet} dtsrc={dtsrc} />
          </TabPane>
        </Tabs>
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
      <Button
        onClick={() => {
          console.log(tempModel);
        }}
      >
        tempModel
      </Button>
    </div>
  );
};

export default AuthorTable;
