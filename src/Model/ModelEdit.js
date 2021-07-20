import { globalVariable } from "actions";
import { message } from "antd";
import axios from "axios";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import StepAnt from "components/Common/StepAnt";
import { currentsetting } from "config/index.js";
import IconArray1 from "components/SKD/IconArray1";
import $ from "jquery";
import React, { useEffect } from "react";
import { GoDeviceDesktop } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import ModelEdit3 from "./ModelEdit3";
import ModelEdit4 from "./ModelEdit4";

const ModelEdit = (props) => {
  const history = useHistory(); // do this inside the component
  const dispatch = useDispatch();
  const step = [
    { title: "Summary", description: "Model description" },
    { title: "Parameter", description: "Define parameters for post" },
    {
      title: "ModelRun",
      description: "Define data and parameter and execute",
    },
    {
      title: "Data Manipulate",
      description: "Manipulate raw data for reporting",
    },
    { title: "Display", description: "Layout output" },
  ];
  let currentStep = useSelector((state) => state.global.currentStep);
  let tempModel = useSelector((state) => state.global.tempModel);
  let tempData = useSelector((state) => state.global.tempData);

  useEffect(() => {
    $(".ant-col.ant-col-6").css({
      "text-align": "right",
      "padding-right": "30px",
    });
  }, []);

  const saveToserver = () => {
    // dispatch(globalVariable({ triggerChild: ["save"] }));
    if (tempModel === "") {
      message.error("Incomplete file.");
      return false;
    }
    let newtempModel = { ...tempModel };
    if (tempData && tempData.source) {
      // tempData.source.map((k, i) => {
      //   delete k.dtlist;
      //   delete k.dtorigin;
      //   tempData.source.splice(i, 1, k);
      // });
      newtempModel.properties.source = tempData.source;
    }
    if (newtempModel.properties) {
      const prop = newtempModel.properties;
      if (props.resultsAuthor)
        prop.resultsAuthor.map((k, i) => {
          delete k.dtlist;
          prop.resultsAuthor.splice(i, 1, k);
          return null;
        });
      if (props.source)
        prop.source.map((k, i) => {
          delete k.dtlist;
          delete k.dtorigin;
          delete k.nodelist;
          prop.source.splice(i, 1, k);
          return null;
        });
      if (prop.origindata) delete prop.origindata;
    }

    let method = "post",
      id = "";
    if (newtempModel.hasOwnProperty("_id")) {
      method = "put";
      id = newtempModel._id;
    }

    let config = {
      method: method,
      url: `${currentsetting.webserviceprefix}model/${id}`,
      data: newtempModel,
    };

    axios(config).then((r) => {
      if (method === "post") {
        tempModel._id = r.data._id;
        dispatch(globalVariable({ tempModel }));
      }
      message.success("File successfully saved");
    });
  };

  const gotoView = () => {
    dispatch(globalVariable({ selectedKey: tempModel._id }));
    history.push(`/Model/view?_id=${tempModel._id}`);
  };
  const btnArr = [
    {
      tooltip: "View",
      icon: <GoDeviceDesktop color="white" onClick={gotoView} />,
    },
    {
      tooltip: "Save to Server",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "save_server",
      onClick: saveToserver,
    },
    // {
    //   tooltip: "Go to previous",
    //   awesome: "level-up-alt",
    //   fontSize: "small",
    //   color: "inherit",
    //   onClick: () => {
    //     dispatch(globalVariable({ currentStep: 0 }));
    //     history.goBack();
    //   },
    // },
  ];
  const onChangeStep = (current) => {
    dispatch(globalVariable({ currentStep: current }));
  };
  return (
    <>
      <DenseAppBar
        title={"Model Edit"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 25,
          paddingTop: 5,
          paddingBottom: 12,
          backgroundColor: "#F7F7F7",
        }}
      >
        <div style={{ paddingLeft: 0, paddingBottom: 20 }}>
          <AntBreadCrumb />
        </div>
        {/* <StepAnt
          className="site-navigation-steps"
          inline={true}
          iconbutton={true}
          //ghost={true}
          onChange={onChangeStep}
          size="small"
          stepInfo={step}
        /> */}
      </div>

      {(() => {
        switch (currentStep) {
          // case 0:
          //   return <ModelEdit0 />;
          // case 1:
          //   return <ModelEdit1 />;
          // case 2:
          //   return <ModelEdit2 />;
          case 3:
            return <ModelEdit3 />;
          case 4:
            return <ModelEdit4 />;
          default:
            return null;
        }
      })()}
    </>
  );
};

export default ModelEdit;
