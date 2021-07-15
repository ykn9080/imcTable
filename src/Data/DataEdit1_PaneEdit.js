import React, { useState, useEffect } from "react";
import _ from "lodash";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Button, message, Row, Col } from "antd";
import "components/Common/Antd.css";
import { globalVariable } from "actions";
import AntFormDisplay from "Form/AntFormDisplay";
import SingleTable from "Data/DataEdit1_SingleTable";
import SingleView from "Data/DataEdit1_SingleView";
import DataGet from "Data/DataManipulation/DataGet";
import StepAnt from "components/Common/StepAnt";
import { BiMessageRoundedEdit } from "react-icons/bi";
import { ImDatabase } from "react-icons/im";
import { FaFlagCheckered } from "react-icons/fa";
import { BiWrench } from "react-icons/bi";

const PaneContent = ({ curobj, curdatalist }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  let tempData = useSelector((state) => state.global.tempData);
  let subStep = useSelector((state) => state.global.subStep);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);
  const [curobj1, setCurobj1] = useState();
  const [single, setSingle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [cdtlist] = useState(curdatalist);
  let init = {},
    content;
  useEffect(() => {
    // if (!curobj | (curobj && curobj.key !== selectedKey1)) {
    if (!curobj) {
      let cobj = curobj;
      if (Array.isArray(curobj)) {
        cobj = _.find(tempData.source, { key: selectedKey1 });
      }
      if (cobj) {
        content = makeSingle(cobj);
        curobj = cobj;
      } else {
        let seq = 0;
        if (tempData && tempData.source) seq = tempData.source.length;
        curobj = { key: selectedKey1, seq: seq };
      }
    } else {
      content = makeSingle(curobj);

      init = { initialValues: { title: curobj.title, desc: curobj.desc } };
    }
    localStorage.setItem("summary", JSON.stringify(init.initialValues));

    const summary1 = {
      formid: "5f51a349e306ac1cac618797",
      patchlist: createPatchList("summary"),
      onFinish: onFinish1,
      ...init,
    };

    setSummary(summary1);
    setSingle(content);
    setCurobj1(curobj);
    // dispatch(
    //   globalVariable({
    //     helpLink: location.pathname + `?step=${1}&substep=${0}`,
    //   })
    // );
  }, [selectedKey1]);

  const saveSingle = (data, key1) => {
    // let key = activeKey;
    // if (!key && paness && paness.length > 0) key = paness[0].key;
    // else if (!key && props.tempData1.source.length > 0)
    //   key = props.tempData1.source[0].key;
    tempData.source.map((k, i) => {
      if (k.key === key1) {
        let kk = { ...k };
        kk.dtlist = data.dtlist;
        kk.setting = data.setting;
        tempData.source.splice(i, 1, kk);
      }
      return null;
    });
    // setActiveKey(key1);
    dispatch(globalVariable({ tempData: tempData }));
    message.success("Saved temporarily.");
  };
  const makeSingle = (obj) => {
    if (!obj) return false;

    let dataObj = { dtlist: obj.dtlist };
    if (!dataObj.dtlist && obj.dtorigin) {
      dataObj.dtlist = obj.dtorigin;
    }
    if (obj.setting) dataObj = { ...dataObj, setting: obj.setting };
    return (
      <SingleTable
        dataObj={dataObj}
        edit={true}
        save={saveSingle}
        activeKey={obj.key}
      />
    );
  };
  const createPatchList = (type) => {
    let plist = [];
    switch (type) {
      case "datasrc":
        let arr1 = [],
          arr2 = [];
        if (cdtlist) arr2 = cdtlist;
        if (tempData.source)
          tempData.source.map((k, i) => {
            arr1.push({ text: k.title, value: k.key });
            return null;
          });
        ["copy", "lefttable", "righttable"].map((k) => {
          plist.push({ name: k, optionArray: arr1 });
          return null;
        });

        plist.push({ name: "current data", optionArray: arr2 });
        return plist;
      default:
        break;
    }
  };
  const onFinish1 = (summary) => {
    let newtempData = { ...tempData };
    let src = newtempData.source,
      seq,
      obj;

    if (!src) {
      src = [];
      seq = 0;
    } else seq = src.length;

    let obj1 = _.find(src, { key: selectedKey1 });
    if (!obj1) {
      obj1 = {};
      if (src.length > 0) seq++;
    }
    if (summary) {
      obj = { ...obj, ...summary, key: selectedKey1 };
    }

    obj1 = { ...obj1, ...summary, seq: seq, key: selectedKey1 };
    let notexist = true;
    src.map((k, i) => {
      if (k.key === obj1.key) {
        src.splice(i, 1, obj1);
        notexist = false;
      }
      return null;
    });
    if (notexist) {
      src.push(obj1);
      // dispatch(globalVariable({ currentStep: 0 }));
      // dispatch(globalVariable({ nextStep: 1 }));
    }
    newtempData.source = src;
    dispatch(globalVariable({ tempData: newtempData }));
  };

  const onChangeSubStep = (current) => {
    dispatch(globalVariable({ subStep: current }));
    dispatch(
      globalVariable({
        helpLink: location.pathname + `?step=${1}&substep=${current}`,
      })
    );
    const cobj = _.find(tempData.source, { key: selectedKey1 });

    if (cobj) setSingle(makeSingle(cobj));
  };
  const step = [
    {
      title: "Summary",
      description: "Data title & desc",
      icon: <BiMessageRoundedEdit />,
    },
    {
      title: "Get Data",
      description: "Load data from local or remote",
      icon: <ImDatabase />,
      disabled: true,
    },
    {
      title: "Manipulation",
      description: "Rename,reorder,data filter,calculate column,groupby",
      icon: <BiWrench />,
    },
    {
      title: "Finish",
      description: "View finished data",
      icon: <FaFlagCheckered />,
    },
  ];
  const stepprocess = (
    <div
      style={{
        marginTop: -15,
        marginBottom: 10,
        padding: 20,
        paddingLeft: 0,
        width: "70%",
        //backgroundColor: "#F7F7F7",
      }}
    >
      <StepAnt
        stepname="subStep"
        processDot={true}
        inline={true}
        iconbutton={true}
        //ghost={true}
        onChange={onChangeSubStep}
        //size="small"
        stepInfo={step}
      />
    </div>
  );

  return (
    <>
      <Row justify="center">
        <Col offset={2} span={22}>
          {stepprocess}
        </Col>
      </Row>
      {(() => {
        switch (subStep) {
          case 0:
            return (
              <>
                <AntFormDisplay {...summary} />
              </>
            );
          case 1:
            return <DataGet curobj={curobj1} curdatalist={cdtlist} />;
          case 2:
            return single;
          case 3:
            return (
              <>
                <SingleView dataObj={curobj1} />
                <div style={{ textAlign: "right" }}>
                  <Button
                    onClick={() => {
                      $(".dvPaneView").toggle();
                      $(".dvPaneEdit").toggle();
                    }}
                  >
                    View
                  </Button>
                </div>
              </>
            );
          default:
            break;
        }
      })()}
    </>
  );
};

export default PaneContent;
