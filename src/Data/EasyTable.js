import React, { useState, useEffect } from "react";
import {
  Divider,
  Card,
  Button,
  PageHeader,
  Modal,
  Tooltip,
  message,
} from "antd";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SingleTable from "./SingleTable";
import AntFormDisplay from "imcformbuilder";
import formdt from "./config/AntFormDisplay.json";

const EasyTable = ({ authObj, onChange, edit, showmenu }) => {
  const [auth, setAuth] = useState();
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState();
  const [editt, setEditt] = useState();
  const [init, setInit] = useState();
  const [tbsetting, setTbsetting] = useState();

  useEffect(() => {
    setMenu(showmenu);
    if (!edit) setEditt(false);
    else setEditt(edit);
    setAuth(authObj);
  }, [authObj]);

  useEffect(() => {
    if (auth) {
      let newAuth = { ...auth };
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
      localStorage.setItem("modelchart", JSON.stringify(auth));
      //setAuth(newAuth);
    } else {
      setInit({ title: "", desc: "", size: "" });
      //setAuth({});
    }
  }, [auth]);

  const saveTable = (data) => {
    let local = _.cloneDeep(auth);
    local.setting = data.setting;
    if (onChange) onChange(local);
    setAuth(local);
  };

  const onValuesChangeTable1 = (changedValues, allValues) => {
    //use localstorage to prevent state change
    let local = auth,
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...changedValues };
    if (["title", "desc"].indexOf(Object.keys(changedValues)[0]) === -1) {
      setTbsetting({ size: local.setting.size });
      setInit(local.setting);
    }
    localStorage.setItem("modelchart", JSON.stringify(local));
  };
  const onSave = () => {
    let local = auth,
      local1 = localStorage.getItem("modelchart");
    if (local1) {
      local = JSON.parse(local1);
      setAuth(local);
      setTbsetting({ size: local.setting.size });
      if (onChange) onChange(local);
    }
    setEditt(false);
  };
  const copyClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(auth, null, 4));
    message.info("Copied to clipboard");
  };
  const modal = (
    <Modal
      visible={visible}
      title="Code"
      onCancel={() => setVisible(false)}
      footer={[
        <Tooltip title="Copy code to clipboard">
          <Button key="copy" onClick={copyClipboard}>
            Copy
          </Button>
        </Tooltip>,
        <Button key="submit" type="primary" onClick={() => setVisible(false)}>
          Close
        </Button>,
      ]}
    >
      <div style={{ overflowY: "scroll", height: 250 }}>
        {JSON.stringify(auth, null, 4)}
      </div>
    </Modal>
  );
  const editForm = (
    <div style={{ textAlign: "right" }}>
      <Button
        type="link"
        onClick={() => {
          setVisible(true);
        }}
      >
        code
      </Button>
      <Button
        type="link"
        onClick={() => {
          setEditt(!editt);
          setInit(auth.setting);
        }}
      >
        edit
      </Button>
    </div>
  );

  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      {editt ? (
        <>
          {init && (
            <>
              <PageHeader
                title="Table"
                extra={
                  showmenu && [
                    <Button
                      key="1"
                      type="text"
                      icon={<FaCheck />}
                      onClick={onSave}
                    />,
                    <Button
                      key="2"
                      type="text"
                      icon={<ImCross />}
                      onClick={() => setEditt(false)}
                    />,
                  ]
                }
              />
              <Divider style={{ marginTop: 0 }} />
              <Card>
                <AntFormDisplay
                  formArray={formdt["5f0ff2fe89db1023b0165b19"]}
                  onValuesChange={onValuesChangeTable1}
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
                edit={editt}
                className="gridcontent"
                save={saveTable}
              />
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 15,
            width: "97%",
            height: "98%",
          }}
        >
          {menu && editForm}
          <SingleTable
            dataObj={auth}
            tbsetting={tbsetting}
            edit={editt}
            className="gridcontent"
            save={saveTable}
          />
        </div>
      )}
      {modal}
    </div>
  );
};

export default EasyTable;
