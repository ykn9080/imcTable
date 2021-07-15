import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { Steps, Button, message, Row, Col } from "antd";
import Grid from "@material-ui/core/Grid";

const { Step } = Steps;
const StepAnt = (props) => {
  let stepname = "currentStep";
  if (props.stepname) stepname = props.stepname;
  const dispatch = useDispatch();
  let currentStep = useSelector((state) => state.global[stepname]);
  const stepInfo = props.stepInfo;

  const next = () => {
    dispatch(globalVariable({ [stepname]: currentStep + 1 }));
  };

  const prev = () => {
    dispatch(globalVariable({ [stepname]: currentStep - 1 }));
  };

  let setting = {},
    Previous = "Previous",
    Next = "Next",
    Done = "Done",
    bsetting = {};
  if (props.iconbutton) {
    bsetting = { shape: "circle", type: "primary", size: "small" };
    Previous = "<";
    Next = ">";
    Done = "F";
  }
  if (props.size) setting = { ...setting, size: props.size };
  if (props.style) setting = { ...setting, style: props.style };
  if (props.initial) setting = { ...setting, initial: props.initial };
  if (props.onChange) setting = { ...setting, onChange: props.onChange };
  if (props.ghost) bsetting = { ...bsetting, ghost: true };
  if (props.btntype) bsetting = { ...bsetting, type: props.btntype };
  const steps = (
    <Steps {...setting} current={currentStep}>
      {stepInfo.map((k, i) => {
        return <Step key={k.title} title={k.title} icon={k.icon} />;
      })}
    </Steps>
  );
  const Btn = () => {
    return (
      <>
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} {...bsetting} onClick={prev}>
            {Previous}
          </Button>
        )}
        {currentStep < stepInfo.length - 1 && (
          <Button {...bsetting} onClick={next}>
            {Next}
          </Button>
        )}
        {currentStep === stepInfo.length - 1 && (
          <Button
            {...bsetting}
            onClick={() => message.success("Processing complete!")}
          >
            {Done}
          </Button>
        )}
      </>
    );
  };
  const iBtn = () => {
    return (
      <>
        {currentStep > 0 && (
          <Button type="primary" shape="circle" onClick={prev}>
            P
          </Button>
        )}
        {currentStep < stepInfo.length - 1 && (
          <Button type="primary" shape="circle" onClick={next}>
            N
          </Button>
        )}
        {currentStep === stepInfo.length - 1 && (
          <Button
            type="secondary"
            shape="circle"
            {...bsetting}
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
      </>
    );
  };
  return (
    <>
      {props.inline ? (
        <Row gutter={16}>
          <Col span={18}> {steps}</Col>
          <Col span={6}>
            <Btn />
          </Col>
        </Row>
      ) : (
        <>
          {steps}

          <Grid container justify="flex-end">
            <div style={{ marginTop: 20 }}>
              {props.iconbutton ? <iBtn /> : <Btn />}
            </div>
          </Grid>
        </>
      )}
    </>
  );
};

export default StepAnt;
