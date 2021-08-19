import React, { useState, useEffect } from "react";
import _ from "lodash";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, Select } from "antd";
import "components/Common/Antd.css";
import { globalVariable } from "actions";
import AntFormDisplay from "imcformbuilder";
import { arrayToObjectFilter } from "Data/DataEdit1";

import UploadFile from "components/Common/UploadFile";

const { Option } = Select;

const DataGet = ({ curobj, curdatalist }) => {
  const dispatch = useDispatch();
  let tempData = useSelector((state) => state.global.tempData);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);
  let currentStep = useSelector((state) => state.global.currentStep);
  let subStep = useSelector((state) => state.global.subStep);
  const [uploaded, setUploaded] = useState();
  const [uploadList, setUploadList] = useState();
  const [sheetChildren, setSheetChildren] = useState(null);
  const [leftChild, setLeftChild] = useState(null);
  const [rightChild, setRightChild] = useState(null);

  let init = {},
    datasrc,
    stype,
    defaultArr;
  useEffect(() => {
    if (curobj) combineChange(curobj.type, "datasrc");
    else {
      const obj = _.find(tempData.source, (o) => {
        return o.key === selectedKey1;
      });
      if (obj) combineChange(obj.type, "datasrc");
    }
  }, [tempData]);
  const combineChange = (allVal, from) => {
    $(".dvUpload").hide();
    localStorage.setItem(from, JSON.stringify(allVal));
    if (!allVal) {
      setUploadList(null);
      return false;
    }

    switch (from) {
      default:
        return null;
      case "datasrc":
        if ((allVal.type === "upload") | (allVal.stype === "upload")) {
          $(".dvUpload").show();
          $(".dvFileuploader").show();
          if (allVal.filepath) {
            $(".dvFileuploader").hide();
            setUploadList([
              {
                name: allVal.originalname,
                filepath: allVal.filepath,
                size: allVal.size,
              },
            ]);
          }
        }
        if ((allVal.type === "join") | (allVal.stype === "join")) {
          ["lefttable", "righttable"].map((k, i) => {
            const obj = _.find(tempData.source, { key: allVal[k] });
            let child = [];
            if (obj && obj.dtlist && obj?.dtlist.length > 0) {
              const objdt = arrayToObjectFilter(obj);
              Object.keys(objdt[0]).map((a, j) => {
                child.push(<Option key={a}>{a}</Option>);
                return null;
              });
              if (i === 0) setLeftChild(child);
              else setRightChild(child);
            }
            return null;
          });
          defaultArr = [allVal.leftkey, allVal.rightkey];
        }
        break;
    }
  };

  const createPatchList = (type) => {
    let plist = [];
    switch (type) {
      case "datasrc":
        let arr1 = [],
          arr2 = [],
          arr3 = [];
        if (curdatalist) arr2 = curdatalist;
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

        if (curobj && curobj.type && curobj.type.stype === "result") {
          let first;
          if (typeof curobj.dtlist !== "undefined") {
            first = curobj.dtlist[0];
            if (Array.isArray(first) | (typeof first === "string"))
              arr3.push({ text: "root", value: "root" });
            else
              Object.keys(curobj.dtlist).map((k, i) => {
                arr3.push({ text: k, value: k });
                return null;
              });
            plist.push({ name: "subresult", optionArray: arr3 });
          }
        }

        return plist;
      default:
        break;
    }
  };

  init = {};
  if (curobj && curobj.type) {
    stype = curobj.type.stype;
    init = { initialValues: { type: stype, [stype]: curobj.type.code } };
    switch (stype) {
      case "api":
        init = { initialValues: { type: stype, api: curobj.type.api } };
        break;
      case "join":
        init = { initialValues: { type: stype, ...curobj.type } };
        defaultArr = [curobj.type.leftkey, curobj.type.rightkey];
        break;
      case "result":
        init = {
          initialValues: { type: stype, subresult: curobj.type.subresult },
        };
        break;
      default:
        break;
    }

    localStorage.setItem("datasrc", JSON.stringify(init.initialValues));
  }
  datasrc = {
    formid: "5f45f4389461621a00fbe017",
    patchlist: createPatchList("datasrc"),
    onValuesChange: (changedValues, allValues) => {
      combineChange(allValues, "datasrc");
    },
    ...init,
  };
  const afterDeletedList = (list) => {
    //if(list="error")
    $(".dvFileuploader").show();
  };
  const uploadedData = (dt) => {
    let dtlist;
    const dtt = dt.data[0];
    const sheets = dtt.dtarr;
    const sheetnames = Object.keys(sheets);

    let sheetnum = sheetnames.length;

    if (sheetnum > 1) {
      sheetnum = 0;
      sheetnames.map((k, i) => {
        if (sheets[k].length > 0) sheetnum++;
        return null;
      });
    }
    if (sheetnum === 1) {
      dtlist = sheets[sheetnames[0]];
    }
    const filepath = dtt.filepath;
    const originalname = dtt.originalname;
    const size = dtt.size;
    const upobj = {
      dtlist: dtlist,
      sheets: sheets,
      type: { stype: "upload", filepath, originalname, size },
    };
    setUploaded(upobj);
    const children = [];

    if (sheetnum > 1) {
      sheetnames.map((k, i) => {
        children.push(<Option key={k}>{k}</Option>);
        return null;
      });
      setSheetChildren(children);
    } else {
      let obj = _.find(tempData.source, { key: selectedKey1 });

      if (!obj) obj = {};
      obj.type = upobj.type;
      obj.dtlist = upobj.dtlist;
      obj.dtorigin = upobj.dtlist;

      let notexist = true;
      tempData.source.map((k, i) => {
        if (k.key === obj.key) {
          tempData.source.splice(i, 1, obj);
          notexist = false;
        }
        return null;
      });
      if (notexist) {
        tempData.source.push(obj);
      }

      dispatch(globalVariable({ tempData }));
    }
  };

  const keyChange0 = (keyvalue) => {
    localStorage.setItem("key0", keyvalue.key);
  };
  const keyChange1 = (keyvalue) => {
    localStorage.setItem("key1", keyvalue.key);
  };
  const sheetChange = (sheetname) => {
    if (uploaded) {
      let uploaded1 = { ...uploaded, dtlist: uploaded.sheets[sheetname] };
      uploaded1.type = { ...uploaded.type, subtype: sheetname };
      setUploaded(uploaded1);
    }
  };
  const realtimeSelect = (
    rowTitle,
    placeholder,
    onChange,
    children,
    defaultArr
  ) => {
    const singleSelect = (onChange, placeholder, childArr, defaultArr) => {
      const spann = 22 / childArr.length;
      return (
        childArr &&
        childArr.map((k, i) => {
          let setting = {};
          if (defaultArr && defaultArr[0] && defaultArr[1])
            setting = { value: defaultArr[i] };
          return (
            <Col span={spann}>
              <Select
                placeholder={placeholder}
                onChange={onChange[i]}
                style={{ width: "100%" }}
                labelInValue
                defaultValue={setting}
              >
                {k}
              </Select>
            </Col>
          );
        })
      );
    };
    return (
      <Row gutter={4}>
        <Col span={2} style={{ textAlign: "right", paddingRight: 8 }}>
          {rowTitle}
        </Col>
        {singleSelect(onChange, placeholder, children, defaultArr)}
      </Row>
    );
  };
  const localtoObject = (itemname) => {
    let item = localStorage.getItem(itemname);
    function testJSON(text) {
      if (typeof text !== "string") {
        return false;
      }
      try {
        JSON.parse(text);
        return true;
      } catch (error) {
        return false;
      }
    }
    if (testJSON(item)) item = JSON.parse(item);

    localStorage.removeItem(itemname);
    return item;
  };
  const onFinish1 = (uploadeddata) => {
    let obj = {},
      type = {},
      src = tempData.source;
    if (!src) src = [];
    obj = _.find(src, { key: selectedKey1 });
    let datasrc = localtoObject("datasrc");

    if (datasrc) {
      // type: {type:"current data(copy,upload,api,database)",code:"layer or nodeset,(tabkey,uploadfilename,apiurl,dbconnectionstr+table+sqlquery)",},
      type = { stype: datasrc.type };
      switch (datasrc.type) {
        case "current data":
        case "copy":
          type = { ...type, code: datasrc[datasrc.type] };
          const cobj = _.find(curdatalist, (o) => {
            return o.value === datasrc[datasrc.type];
          });
          if (cobj) {
            if (cobj.text.indexOf("[node]") > -1) type.subtype = "node";
            else if (cobj.text.indexOf("[layer]") > -1) type.subtype = "layer";
          }
          break;
        case "upload":
          if (uploaded) {
            type = { ...type, ...uploaded.type };
            obj = { ...obj, dtlist: uploaded.dtlist };
          }
          break;
        case "api":
          type = { ...type, api: datasrc.api };
          break;
        case "join":
          const key0 = localtoObject("key0");
          const key1 = localtoObject("key1");
          type = { ...type, ...datasrc, leftkey: key0, rightkey: key1 };

          delete type.type;
          break;
        case "result":
          type = { ...datasrc };
          break;
        default:
          break;
      }
    }
    if (obj) {
      const newtype = { ...obj.type, ...type };
      _.unset(obj, "type");

      obj.type = { ...newtype };
      // if (datasrc.type === "upload" && !uploaded) {
      //   delete obj.type;
      //   obj.type = { stype: "upload" };
      //   $(".dvFileuploader").show();
      // }
      let notexist = true;
      tempData.source.map((k, i) => {
        if (k.key === obj.key) {
          tempData.source.splice(i, 1, obj);
          notexist = false;
        }
        return null;
      });
      if (notexist) {
        tempData.source.push(obj);
      }
    }

    dispatch(globalVariable({ tempData: tempData }));
    dispatch(globalVariable({ currentStep: currentStep - 1 }));
    dispatch(globalVariable({ nextStep: currentStep }));
    dispatch(globalVariable({ selectedKey1 }));

    if (["current data"].indexOf(datasrc.type) > -1)
      dispatch(globalVariable({ subStep: subStep + 1 }));
  };
  return (
    <>
      <AntFormDisplay {...datasrc} />
      <div className={"dvUpload"} style={{ display: "none" }}>
        <Row>
          <Col span={2} style={{ textAlign: "right", paddingRight: 8 }}>
            File:
          </Col>
          <Col span={20}>
            <UploadFile
              dir="/data/datasrc/"
              accept="xls,xlsx,csv"
              size={2000}
              listData={uploadList}
              uploadedData={uploadedData}
              deleteHandler={afterDeletedList}
            />
          </Col>
        </Row>
      </div>
      {sheetChildren &&
        realtimeSelect(
          "Sheet:",
          "Select a sheet",
          [sheetChange],
          [sheetChildren]
        )}

      {leftChild &&
        rightChild &&
        realtimeSelect(
          "Key:",
          "Select key",
          [keyChange0, keyChange1],
          [leftChild, rightChild],
          defaultArr
        )}
      <div style={{ textAlign: "right", marginTop: 5 }}>
        <Button id="btnDataget" onClick={onFinish1}>
          Get Data
        </Button>

        {/* <Button
          onClick={() => {
            console.log("sheetChildren:", sheetChildren);
          }}
        >
          sheetChildren
        </Button> */}
      </div>
    </>
  );
};

export default DataGet;
