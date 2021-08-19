import React, { useState, useEffect } from "react";
import "components/Common/Antd.css";
import { Typography, Row, Col, Button, Collapse, Radio } from "antd";
import AntFormDisplay from "imcformbuilder";
import {
  loopCommaToObject,
  objectToComma,
} from "components/functions/dataUtil";
const { Text } = Typography;

const { Panel } = Collapse;
const Goptions = ({ authObj, ...props }) => {
  //option
  const [optionType, setOptionType] = useState("simple");
  const [optionsComma, setOptionsComma] = useState();
  //simple,script
  const [initOptionsSimple, setInitOptionsSimple] = useState();
  const [initOptionsScript, setInitOptionsScript] = useState();
  //option_advanced
  const [iopGeneral, setIopGeneral] = useState();
  const [iopConfigure, setIopConfigure] = useState();
  const [iopEdges, setIopEdges] = useState();
  const [iopNodes, setIopNodes] = useState();
  const [iopGroups, setIopGroups] = useState();
  const [iopLayout, setIopLayout] = useState();
  const [iopInteraction, setIopInteraction] = useState();
  const [iopManipulation, setIopManipulation] = useState();
  const [iopPhysics, setIopPhysics] = useState();

  useEffect(() => {
    console.log(authObj);
    localStorage.removeItem("options");
    if (authObj) {
      let ds = authObj.setting;
      if (ds) {
        if (ds.options) {
          let optComma = ds.options;
          if (typeof ds.options === "string") optComma = JSON.parse(ds.options);
          setOptionsComma(optComma);
          console.log("useEffect", optComma);
          OptionInit(optComma);
        }
      }
    }
  }, [authObj]);
  const updateOptionsLocalStorage = (val) => {
    let optComma = {};
    const opttxt = localStorage.getItem("options");
    if (opttxt) {
      optComma = JSON.parse(opttxt);
    }
    optComma = { ...optComma, ...val };
    OptionInit(optComma);
    props.onFinishOptions(optComma);
  };
  const OptionInit = (optComma) => {
    setOptionsComma(optComma);
    localStorage.setItem("options", JSON.stringify(optComma));
    updateOptionsInit(optComma);
  };
  const updateOptionsInit = (dsvrtn) => {
    setInitOptionsSimple(dsvrtn);
    setInitOptionsScript({
      script: JSON.stringify(loopCommaToObject(dsvrtn), null, 4),
    });
    setIopGeneral(dsvrtn);
    setIopConfigure(dsvrtn);
    setIopEdges(dsvrtn);
    setIopNodes(dsvrtn);
    setIopGroups(dsvrtn);
    setIopLayout(dsvrtn);
    setIopInteraction(dsvrtn);
    setIopManipulation(dsvrtn);
    setIopPhysics(dsvrtn);
  };
  const onValuesChangeOptions_Simple = (changedValues, allValues) => {
    console.log(changedValues, allValues);
    //updateOptionsLocalStorage(allValues);
  };

  const onValuesChangeOptions = (changedValues, allValues) => {
    updateOptionsLocalStorage(allValues);
  };

  const onFinish_Simple = (val) => {
    console.log(val);
    updateOptionsLocalStorage(val);
  };
  const onFinishAdvanceOptions = () => {
    updateOptionsLocalStorage();
  };
  const onFinish_Script = (val) => {
    //const stxt = val.script;
    const sobj = JSON.parse(val.script);
    const optComma = objectToComma(sobj);
    updateOptionsLocalStorage(optComma);
  };
  const optionSimple = (
    <AntFormDisplay
      formid="5f699523c0521c3460444b45"
      onValuesChange={onValuesChangeOptions_Simple}
      onFinish={onFinish_Simple}
      initialValues={initOptionsSimple}
    />
  );
  const optionScript = (
    <>
      <AntFormDisplay
        formid="5f699064c0521c3460444b44"
        onFinish={onFinish_Script}
        initialValues={initOptionsScript}
      />
      <Button
        onClick={() => {
          console.log(optionsComma);
        }}
      >
        optionsComma
      </Button>
    </>
  );
  const optionAccordion = (
    <div>
      <Text>Advanced</Text>
      <Collapse accordion>
        <Panel header="General" key="1">
          <AntFormDisplay
            formid="5f61ce1b9b954d3dd487755e"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopGeneral}
          />
        </Panel>
        <Panel header="Configure" key="2">
          <AntFormDisplay
            formid="5f686051d91d3d0f5877e4f2"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopConfigure}
          />
        </Panel>
        <Panel header="Edges" key="3">
          <AntFormDisplay
            formid="5f686132d91d3d1fd277e4f3"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopEdges}
          />
        </Panel>
        <Panel header="Nodes" key="4">
          <AntFormDisplay
            formid="5f68614bd91d3d14e577e4f4"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopNodes}
          />
        </Panel>
        <Panel header="Groups" key="5">
          <AntFormDisplay
            formid="5f686163d91d3dc2d277e4f5"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopGroups}
          />
        </Panel>
        <Panel header="Layout" key="6">
          <AntFormDisplay
            formid="5f686174d91d3d610377e4f6"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopLayout}
          />
        </Panel>
        <Panel header="Interaction" key="7">
          <AntFormDisplay
            formid="5f68618ad91d3d71d877e4f7"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopInteraction}
          />
        </Panel>
        <Panel header="Manipulation" key="8">
          <AntFormDisplay
            formid="5f6861a0d91d3db87f77e4f8"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopManipulation}
          />
        </Panel>
        <Panel header="Physics" key="9">
          <AntFormDisplay
            formid="5f6861b8d91d3d0ada77e4f9"
            onValuesChange={onValuesChangeOptions}
            initialValues={iopPhysics}
          />
        </Panel>
      </Collapse>
      <div style={{ marginTop: 5, textAlign: "right" }}>
        <Button onClick={onFinishAdvanceOptions}>Save</Button>
      </div>
    </div>
  );

  const optionSelect = (
    <Row justify="end">
      <Col>
        {" "}
        <Radio.Group
          value={optionType}
          size="small"
          buttonStyle="solid"
          onChange={(e) => {
            setOptionType(e.target.value);
          }}
        >
          <Radio.Button value="simple">Basic</Radio.Button>
          <Radio.Button value="advance">Advance</Radio.Button>
          <Radio.Button value="script">Script</Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
  return (
    <>
      {optionSelect}
      {(() => {
        switch (optionType) {
          case "simple":
          default:
            return optionSimple;
          case "advance":
            return optionAccordion;
          case "script":
            return optionScript;
        }
      })()}
      <Button
        onClick={() => {
          console.log(
            optionsComma,
            JSON.parse(localStorage.getItem("options"))
          );
        }}
      >
        optionsComma,local
      </Button>
    </>
  );
};

export default Goptions;
