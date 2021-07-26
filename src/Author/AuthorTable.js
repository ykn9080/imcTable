import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { idMake } from "components/functions/dataUtil";
import { Typography } from "antd";
import SingleTable from "Data/DataEdit1_SingleTable";
import AntFormDisplay from "Form/AntFormDisplay";
import Dataget from "Author/Dataget";

// import AddtoDataset from "Data/AddtoDataset";
// import axios from "axios";

const { Title } = Typography;

const AuthorTable = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [init, setInit] = useState();
  const [tbsetting, setTbsetting] = useState();
  // const [selectedTable, setSelectedTable] = useState();
  // const [selectData, setSelectData] = useState();
  // const [visible, setVisible] = useState(false);
  // const [addToDataset, setAddToDataset] = useState();

  const tempModel = useSelector((state) => state.global.tempModel);

  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "model/edit/graph?type=table" }));
    console.log("authObj", authObj, "edit", edit, "title", title);
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
      }
      console.log(title, desc, size);
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

      if (!newdata.id) {
        newdata = { ...newdata, id: idMake(), type: "table" };
      }

      newdata = {
        ...newdata,
        setting: set,
      };

      let notexist = true;
      authorlist.map((k, i) => {
        if (k.id === newdata.id) {
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
  let titlestyle = { marginTop: 10, marginLeft: 20, marginBottom: 10 };

  console.log("init:", init, "data", data);
  const onDataGet = (val) => {
    console.log("ondataget", val);
    let newAuth = { ...authObj };
    newAuth.dtlist = val;
    setData(newAuth);
  };
  return (
    <div style={{ padding: "35px 5px 10px 10px" }}>
      {edit && init && (
        <>
          <Title level={4}>Table</Title>
          <AntFormDisplay
            formid={"5f0ff2fe89db1023b0165b19"}
            onValuesChange={onEditValuesChangeTable}
            initialValues={init}
          />
        </>
      )}
      {data && (
        <SingleTable
          dataObj={data}
          tbsetting={tbsetting}
          edit={edit}
          className="gridcontent"
          save={saveTable}
        />
      )}
      <Dataget onDataGet={onDataGet} />
    </div>
  );
};

export default AuthorTable;
