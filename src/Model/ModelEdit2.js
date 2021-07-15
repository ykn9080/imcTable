import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { globalVariable } from "actions";
import {
  Input,
  Row,
  Col,
  Button,
  Typography,
  Radio,
  Tabs,
  Checkbox,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModelRun from "Model/ModelRun";
import ModelViewParameter, { makeParam } from "Model/ModelViewParameter";
import ModelViewDataSelect, {
  matrixBymodetype,
} from "Model/ModelViewDataSelect";
import UploadFile from "components/Common/UploadFile";
import AntFormDisplay from "Form/AntFormDisplay";
import { localHandle } from "components/functions/LodashUtil";
const { Text } = Typography;

const { TabPane } = Tabs;
export const runModel1 = async (tempModel, projectbundle, mscript) => {
  // let modelForm;
  // switch (modetype) {
  //   default:
  //     return null;
  //   case "os":
  //   case "ts":
  //     modelForm = { matrix: linkid[0] };
  //     break;
  //   case "om":
  //   case "tm":
  //     modelForm = { matrices: linkid };
  //     break;
  //   case "vs":
  //     modelForm = { nodesetId: linkid[0] };
  //     break;
  // }

  // let paramObj = { ...modelForm, ...param };

  const rtn = await ModelRun(tempModel, projectbundle, mscript);
  return rtn;
};

const ModelEdit2 = () => {
  const dispatch = useDispatch();
  let paramvalue = useSelector((state) => state.global.paramvalue);
  let projectbundle = useSelector((state) => state.global.projectbundle);
  let tempModel = useSelector((state) => state.global.tempModel);
  let nextStep = useSelector((state) => state.global.nextStep);
  let currentStep = useSelector((state) => state.global.currentStep);
  let showSpin = useSelector((state) => state.global.showSpin);
  let modelRun = useSelector((state) => state.global.modelRun);
  let tabIndex = useSelector((state) => state.global.tabIndex);

  if (nextStep) {
    dispatch(globalVariable({ currentStep: nextStep }));
    dispatch(globalVariable({ nextStep: null }));
  }

  const [apitype, setApitype] = useState(0);
  const [apivalue, setApivalue] = useState();
  const [modelscript, setModelscript] = useState(null);
  const [initialScript, setInitialScript] = useState(null);
  const [tabs, setTabs] = useState(null);

  useEffect(() => {
    dispatch(globalVariable({ showSpin: false }));
    dispatch(globalVariable({ modelRun: false }));
    dispatch(globalVariable({ helpLink: `/model/edit?step=${currentStep}` }));
    let indx = "1";
    if (tabIndex.modelEdit2) indx = tabIndex.modelEdit2;
    setTabs(indx);
  }, []);

  useEffect(() => {
    const pro = tempModel?.properties;
    if (!pro) {
      tempModel.properties = {};
      dispatch(globalVariable({ tempModel }));
    }
    let apiurl;
    //api setting
    if (pro) {
      if (pro.apitype) setApitype(pro.apitype);
      if (pro.apiurl) {
        apiurl = pro.apiurl;
        setApivalue(apiurl);
        //setInitialScript({apiurl:pro.apiurl})
        localStorage.removeItem("persist:root");
        localStorage.setItem("url", apiurl);
        if (pro.modelscript) {
          setModelscript(pro.modelscript);
          setInitialScript({
            script: JSON.stringify(pro.modelscript),
            api: apiurl,
          });
        }
      }

      let qry = pro?.linknode?.nodesetid;
      if (qry) {
        dispatch(globalVariable({ paramvalue: qry[0] }));
      }
    }
  }, [tempModel]);

  // const saveTemp = (trigger) => {

  //   if (trigger.length > 0 && trigger[0] === "save") {

  //     dispatch(globalVariable({ tempModel: tempModel }));
  //     dispatch(globalVariable({ triggerChild: [] }));
  //   }
  // };
  // if (trigger.length > 0 && trigger[0] === "save") saveTemp(trigger);
  const handleApi = (e) => {
    e.preventDefault();
    if (tempModel.properties) {
      tempModel.properties.apitype = e.target.value;
      dispatch(globalVariable({ tempModel }));
    }
    setApitype(e.target.value);
  };
  const onChangeApiurl = (event) => {
    localStorage.setItem("url", event.target.value);
    tempModel.properties.apiurl = event.target.value;
    dispatch(globalVariable({ tempModel }));
    setApivalue(event.target.value);
  };

  const runModel = async (type) => {
    const healthCheck = () => {
      if (tempModel?.properties?.modelscript) return true;
      else {
        const param = JSON.parse(localStorage.getItem("onFinish"));
        let rtn = false;

        if (type === "form" && apivalue && param) rtn = true;
        if (type === "script" && tempModel?.properties?.modelscript) rtn = true;
        return rtn;
      }
    };
    let mscript;
    if (localStorage.getItem("url")) {
      if (!tempModel.properties) tempModel.properties = {};
      tempModel.properties.apiurl = localStorage.getItem("url");
      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ tempData: null }));
      localStorage.removeItem("url");
    }
    if (type === "script") {
      if (tempModel?.properties?.modelscript)
        mscript = tempModel.properties.modelscript;
      setModelscript(tempModel.properties.modelscript);
    } else {
      const modetype = tempModel.properties.modetype;
      const linkid = tempModel.properties.linknode._id;
      const type = tempModel.properties.linknode.type;
      const fromType =
        type === "Nodeset" ? "node" : type === "Rawdataset" ? "raw" : "link";

      const modelscript = tempModel.properties.modelscript;
      let param = localHandle("onFinish");
      if (!param) {
        param = modelscript;
      } else {
        param = { ...modelscript, ...makeParam(param) };
        if (typeof param.symmetrize !== "undefined") {
          if (!param.symmetrize) {
            delete param["symmetrizePreprocess"];
          }
          delete param["symmetrize"];
        }
        localHandle("onFinish", param);
      }
      const modelForm = matrixBymodetype(modetype, linkid, fromType);
      let paramObj = { ...param, ...modelForm };
      mscript = paramObj;
    }
    setModelscript(mscript);
    if (healthCheck() && modelRun === false) {
      const rtn = await ModelRun(tempModel, mscript);
      dispatch(globalVariable({ tempModel: rtn }));
      dispatch(globalVariable({ currentStep: currentStep + 1 }));
    } else {
      message.error("Incomplete Data !");
    }
  };
  const byform = (
    <>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Text strong>Data</Text>
        </Col>
        <Col>
          <ModelViewDataSelect />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Text strong>Api Type</Text>
        </Col>
        <Col>
          <Radio.Group value={apitype} onChange={handleApi}>
            <Radio value="url">URL</Radio>
            <Radio value="upload">Upload</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col offset={4} span={20}>
          {apitype === "url" ? (
            <Input value={apivalue} onChange={onChangeApiurl} />
          ) : (
            <UploadFile dir="/data/python" accept="py,txt" size={200} />
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Text strong>Parameter</Text>
        </Col>
        <Col span={20}>
          {tempModel?.param && paramvalue ? (
            <ModelViewParameter />
          ) : (
            <Button
              icon={<PlusOutlined />}
              size={"large"}
              type="dashed"
              style={{ width: "100%", height: 100 }}
              onClick={() => {
                dispatch(globalVariable({ currentStep: currentStep - 1 }));
              }}
            >
              ADD NEW PARAMETER
            </Button>
          )}
        </Col>
      </Row>
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => {
            runModel("form");
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );

  const onValuesChangeScript = (changedValues, allValues) => {
    if (changedValues.script) {
      setModelscript(JSON.parse(changedValues.script));
      tempModel.properties.modelscript = JSON.parse(changedValues.script);
    }
    if (changedValues.api) {
      localStorage.setItem("url", changedValues.api);
      tempModel.properties.apiurl = changedValues.api;
    }
    dispatch(globalVariable({ tempModel }));
  };
  const beautifyChange = (e) => {
    let script = JSON.stringify(modelscript);
    if (e.target.checked) {
      script = JSON.stringify(modelscript, null, 4);
    }
    let apival = apivalue;
    if (!apival) apival = localStorage.getItem("url");
    setInitialScript({
      script: script,
      api: apival,
    });
  };
  const scriptInput = (
    <>
      <div style={{ textAlign: "right", marginBottom: 5 }}>
        <Checkbox onChange={beautifyChange}>beautify</Checkbox>
      </div>
      <AntFormDisplay
        formid="5f82a9c9d9fcf36f78557f51"
        onValuesChange={onValuesChangeScript}
        initialValues={initialScript}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => {
            runModel("script");
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
  const onChangeTabs = (index) => {
    setTabs(index);
    tabIndex.modelEdit2 = index;
    dispatch(globalVariable({ tabIndex }));
  };
  return (
    <>
      <div style={{ marginTop: 20, marginRight: 10 }}>
        <div style={{ marginLeft: 20, marginBottom: 20 }}>
          <>
            {tabs && (
              <Tabs defaultActiveKey={tabs} onChange={onChangeTabs}>
                <TabPane tab="Input" key="1">
                  {byform}
                </TabPane>
                <TabPane tab="Script" key="2">
                  {scriptInput}
                </TabPane>
              </Tabs>
            )}
            <Button onClick={() => console.log(tempModel)}>tempModel</Button>
          </>
        </div>
      </div>
      {showSpin && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export default ModelEdit2;
