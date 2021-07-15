import { PlusOutlined } from "@ant-design/icons";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Save from "@material-ui/icons/Save";
import AddBox from "@material-ui/icons/Send";
import { globalVariable } from "actions";
import { Button, PageHeader } from "antd";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModelViewParameter from "./ModelViewParameter";

const ModelEdit1 = () => {
  const dispatch = useDispatch();
  const [cardprops, setCardprops] = useState();
  const [changeParam, setChangeParam] = useState();
  let currentStep = useSelector((state) => state.global.currentStep);
  let tempModel = useSelector((state) => state.global.tempModel);
  let paramvalue = useSelector((state) => state.global.paramvalue);
  if (!paramvalue) dispatch(globalVariable({ paramvalue: "any" }));

  useEffect(() => {
    tempModel.param = "600e56750c756e6cdf5bda92";
    dispatch(globalVariable({ tempModel }));
    dispatch(globalVariable({ helpLink: `/model/edit?step=${currentStep}` }));
  }, []);

  const onValuesChange = (allValues) => {
    setChangeParam(allValues?.selectForm);
  };

  const showFormList = () => {
    let cardinit = (
      <>
        <ModelViewParameter onValuesChange={onValuesChange} />
      </>
    );
    setCardprops(cardinit);
  };
  const clearFormList = () => {
    let cardinit = (
      <div style={{ textAlign: "center" }}>
        <Button
          icon={<PlusOutlined />}
          size={"large"}
          type="dashed"
          style={{ width: 300, height: 100 }}
          onClick={showFormList}
        >
          ADD NEW FORM
        </Button>
      </div>
    );
    setCardprops(cardinit);
    if (tempModel?.properties) {
      delete tempModel.properties.paramid;
      delete tempModel.properties.multiArr;
      delete tempModel.param;
    }
    tempModel.param = "600e56750c756e6cdf5bda92";
    dispatch(globalVariable({ tempModel }));
  };

  const saveFormList = () => {
    let newtempModel = { ...tempModel, param: changeParam };
    dispatch(globalVariable({ tempModel: newtempModel }));
    dispatch(globalVariable({ currentStep: currentStep + 1 }));
  };

  return (
    <>
      <div style={{ marginTop: 10, marginRight: 10, minHeight: 400 }}>
        <PageHeader className="site-page-header" title="Parameters" />
        <div style={{ marginLeft: 20, marginBottom: 20, float: "right" }}>
          <Tooltip title="Get Form">
            <Button
              icon={<AddBox fontSize="small" />}
              size="small"
              onClick={() => {
                $("#btnformsave").click();
              }}
            >
              FormAdd
            </Button>
          </Tooltip>
          <Tooltip title="Clear Form">
            <Button
              icon={<IndeterminateCheckBoxIcon fontSize="small" />}
              size="small"
              onClick={clearFormList}
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip title="Save & Next">
            <Button
              icon={<Save fontSize="small" />}
              size="small"
              onClick={saveFormList}
            >
              Submit
            </Button>
          </Tooltip>
        </div>
        <br />
        <br />
        <div style={{ marginLeft: 20, marginBottom: 60 }}>
          {cardprops ? (
            cardprops
          ) : (
            <ModelViewParameter
              onValuesChange={onValuesChange}
              editmode={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ModelEdit1;
