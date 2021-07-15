import { globalVariable } from "actions";
import { Button, Tag, Typography } from "antd";
import DialogFull from "components/Common/DialogFull";
import { pick } from "components/functions/LodashUtil";
import ModelDataList from "Data/ModelDataList";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

export const matrixBymodetype = (modetype, linkidArr, fromType) => {
  switch (modetype) {
    default:
      return null;
    case "os":
    case "ts":
      return { matrix: linkidArr[0] };
    case "om":
    case "tm":
      return { matrices: linkidArr };
    case "vs":
      return { nodesetId: linkidArr[0] };
    case "sv":
      return { dataID: linkidArr[0], fromType: fromType };
    case "gp":
      return { linkDataID: linkidArr[0] }
  }
};
export const makeLinkNode = (value, nodesetValue) => {
  let linknode1;
  let vnameNumber = [];
  let vnameText = [];
  let vnameAll = [];
  // let nodesetAtt = pick(nodesetValue, "attribute.fieldname");
  let nodesetAtt = pick(nodesetValue, "attribute");
  let att = pick(value, "attribute");
  const title = pick(value, "title");
  const _id = pick(value, "_id");
  const pid = pick(value, "pid");
  const vtype = pick(value, "vtype");
  const nodesetname = _.uniq(pick(value, "title"));
  let fromType;

  for(const vt in vtype){
    if(vtype[vt][0] === "layer"){
      att = nodesetAtt;
    }
  }

  for (const key in att[0]) {
    if (att[0][key].datatype === "NUMBER") {
      vnameNumber.push(att[0][key].fieldname);
    }
  }

  for (const key in att[0]) {
    if (att[0][key].datatype === "TEXT") {
      vnameText.push(att[0][key].fieldname);
    }
  }

  for (const key in att[0]) {
    vnameAll.push(att[0][key].fieldname);
  }

  let vname = {
    vnameNumber: vnameNumber,
    vnameText: vnameText,
    vnameAll: vnameAll,
  };

  vtype.forEach((v) => {
    if (v[0] === "layer") {
      linknode1 = {
        type: "Linkset",
        color: "#f50",
        name: title,
        _id: _id,
        nodesetname: nodesetname,
        nodesetid: pid,
        vname: vname,
      };
      fromType = "link";
      //dispatch(globalVariable({ fromType: "link" }));
    } else if (v[0] === "nodeset") {
      linknode1 = {
        type: "Nodeset",
        color: "#108ee9",
        name: title,
        _id: _id,
        nodesetname: nodesetname,
        nodesetid: _id,
        vname: vname,
      };
      fromType = "node";
      // dispatch(globalVariable({ fromType: "node" }));
    } else if (v[0] === "rawdataset") {
      linknode1 = {
        type: "Rawdataset",
        color: "#ffd700",
        name: title,
        _id: _id,
        nodesetname: nodesetname,
        nodesetid: _id,
        vname: vname,
      };
      fromType = "raw";
      //dispatch(globalVariable({ fromType: "raw" }));
    }
  });
  // if (linknode1) {
  //   setLinknode(linknode1);
  //   let prop = tempModel.properties;
  //   if (!prop) {
  //     tempModel.properties = {};
  //     prop = tempModel.properties;
  //   }
  //   prop.linknode = linknode1;
  //   let newtempModel = { ...tempModel, properties: prop };
  //   dispatch(globalVariable({ tempModel: newtempModel }));
  // }
  console.log(linknode1, value, nodesetValue);
  return { linknode: linknode1, fromType };
};
const ModelViewDataSelect = () => {
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);

  const [value, setValue] = useState();
  const [nodesetValue, setNodesetValue] = useState();
  const [linknode, setLinknode] = useState();

  useEffect(() => {
    const pro = tempModel.properties;
    if (pro) {
      const linknode1 = pro.linknode;
      if (linknode1) {
        setLinknode(linknode1);
      }
    }
  }, []);

  useEffect(() => {
    // let linknode1;
    // let vnameNumber = [];
    // let vnameText = [];
    // let vnameAll = [];
    // let nodesetAtt = pick(nodesetValue, "attribute.fieldname");
    // let att = pick(value, "attribute");
    // const title = pick(value, "title");
    // const _id = pick(value, "_id");
    // const pid = pick(value, "pid");
    // const vtype = pick(value, "vtype");
    // const nodesetname = _.uniq(pick(value, "title"));

    // for (const key in att[0]) {
    //   if (att[0][key].datatype === "NUMBER") {
    //     vnameNumber.push(att[0][key].fieldname);
    //   }
    // }

    // for (const key in att[0]) {
    //   if (att[0][key].datatype === "TEXT") {
    //     vnameText.push(att[0][key].fieldname);
    //   }
    // }

    // for (const key in att[0]) {
    //   vnameAll.push(att[0][key].fieldname);
    // }

    // let vname = {
    //   vnameNumber: vnameNumber,
    //   vnameText: vnameText,
    //   vnameAll: vnameAll,
    // };

    // vtype.forEach((v) => {
    //   if (v[0] === "layer") {
    //     linknode1 = {
    //       type: "Linkset",
    //       color: "#f50",
    //       name: title,
    //       _id: _id,
    //       nodesetname: nodesetname,
    //       nodesetid: pid,
    //       vname: {
    //         vnameAll: nodesetAtt[0],
    //       },
    //     };
    //     dispatch(globalVariable({ fromType: "link" }));
    //   } else if (v[0] === "nodeset") {
    //     linknode1 = {
    //       type: "Nodeset",
    //       color: "#108ee9",
    //       name: title,
    //       _id: _id,
    //       nodesetname: nodesetname,
    //       nodesetid: _id,
    //       vname: vname,
    //     };
    //     dispatch(globalVariable({ fromType: "node" }));
    //   } else if (v[0] === "rawdataset") {
    //     linknode1 = {
    //       type: "Rawdataset",
    //       color: "#ffd700",
    //       name: title,
    //       _id: _id,
    //       nodesetname: nodesetname,
    //       nodesetid: _id,
    //       vname: vname,
    //     };
    //     dispatch(globalVariable({ fromType: "raw" }));
    //   }
    // });
    // if (linknode1) {
    //   setLinknode(linknode1);
    //   let prop = tempModel.properties;
    //   if (!prop) {
    //     tempModel.properties = {};
    //     prop = tempModel.properties;
    //   }
    //   prop.linknode = linknode1;
    //   let newtempModel = { ...tempModel, properties: prop };
    //   dispatch(globalVariable({ tempModel: newtempModel }));
    // }
    const rtn = makeLinkNode(value, nodesetValue);
    dispatch(globalVariable({ fromType: rtn.fromType }));
    if (rtn.linknode) {
      setLinknode(rtn.linknode);
      let prop = tempModel.properties;
      if (!prop) {
        tempModel.properties = {};
        prop = tempModel.properties;
      }
      prop.linknode = rtn.linknode;
      let newtempModel = { ...tempModel, properties: prop };
      dispatch(globalVariable({ tempModel: newtempModel }));
    }
  }, [value]);

  const onCheck = (layerObj, nodesetObj) => {
    setValue(layerObj);
    setNodesetValue(nodesetObj);
  };
  return (
    <>
      {linknode ? (
        <>
          <Tag
            closable
            color={linknode.color}
            onClose={() => setLinknode(null)}
          >
            {linknode.type}
          </Tag>
          <Text>{linknode.name.join(",")}</Text>
        </>
      ) : (
        <Button
          onClick={() => {
            dispatch(globalVariable({ openDialog: true }));
          }}
        >
          Get Data
        </Button>
      )}
      <DialogFull title="Data List" fullScreen={true}>
        <ModelDataList onCheck={onCheck} />
      </DialogFull>
    </>
  );
};

export default ModelViewDataSelect;
