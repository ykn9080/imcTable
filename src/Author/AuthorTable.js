import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { idMake } from "components/functions/dataUtil";
import { Typography } from "antd";
import SingleTable from "Data/DataEdit1_SingleTable";
import AntFormDisplay from "Form/AntFormDisplay";
import { Button, Modal, Row, Col } from "antd";
import AddtoDataset from "Data/AddtoDataset";
import axios from "axios";

const { Title } = Typography;

const AuthorTable = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [init, setInit] = useState();
  const [tbsetting, setTbsetting] = useState();
  const [selectedTable, setSelectedTable] = useState();
  const [selectData, setSelectData] = useState();
  const [visible, setVisible] = useState(false);
  const [addToDataset, setAddToDataset] = useState();

  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "model/edit/graph?type=table" }));
    console.log(authObj, edit, title);
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
      setInit({ title, desc, size });
      setData(newAuth);
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

  const onModalCreate = (data) => {
    setSelectData(data);
  };

  const addToDatasetData = (data) => {
    setAddToDataset(data);
  };

  const doAddToDataset = () => {
    let config = {
      method: "post",
      url: `http://192.168.3.58:8011/addToData`,
      data: addToDataset,
    };
    axios(config).then((r) => {
      console.log(r);
    });
  };

  return (
    <div style={{ padding: "30px 0 0 10px" }}>
      {/* {data && data.setting && title && (
        <>
          <div style={title && titlestyle}>
            <Title level={4}>{data.setting.title}</Title>
          </div>
          <div style={{ float: "right" }}>
            <Button
              onClick={() => {
                onModalCreate(data);
                setVisible(true);
              }}
            >
              Add to Dataset
            </Button>
          </div>
        </>
      )} */}

      {/* <div>
        {visible ? (
          <Modal
            title="Add to Dataset"
            visible={true}
            onCancel={() => {
              setVisible(false);
            }}
            footer={[
              <Button
                key="cancel"
                onClick={() => {
                  setSelectData(null);
                  setVisible(false);
                }}
              >
                Cancel
              </Button>,
              <Button key="add" type="primary" onClick={doAddToDataset}>
                Add to Dataset
              </Button>,
            ]}
            width={600}
          >
            <AddtoDataset
              data={selectData}
              addToDatasetData={addToDatasetData}
            />
          </Modal>
        ) : null}
      </div> */}
      <h3>hello</h3>
      {edit && (
        <AntFormDisplay
          formid={"5f0ff2fe89db1023b0165b19"}
          onValuesChange={onEditValuesChangeTable}
          initialValues={init}
        />
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
    </div>
  );
};

export default AuthorTable;
