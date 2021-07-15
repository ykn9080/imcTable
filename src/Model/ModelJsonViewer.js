import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { globalVariable } from "actions";
import { Row, Col, Switch } from "antd";
import { JSONEditor, JSONViewer } from "react-json-editor-viewer";
import CardForm from "components/Common/CardForm";

const ModelJsonViewer = (props) => {
  const dispatch = useDispatch();

  let toggleView = useSelector((state) => state.global.openDialog2);
  let data = { a: 1, b: 2 };
  if (props.data) data = props.data;
  const styles = {
    dualView: {
      display: "flex",
      backgroundColor: "black",
    },
    jsonViewer: {
      borderLeft: "1px dashed white",
      width: "40%",
      margin: 5,
      lineHeight: 1.25,
    },
    jsonEditor: {
      width: "60%",
      fontSize: 12,
      fontFamily: "Lucida Console, monospace",
      margin: 5,
      lineHeight: 1.25,
    },
    root: {
      fontSize: 12,
      margin: 5,
      fontFamily: "Lucida Console, monospace",
      backgroundColor: "black",
      lineHeight: 1.25,
      /*color: "#3E3D32"*/
    },
    label: {
      color: "DeepPink",
      marginTop: 3,
    },
    value: {
      marginLeft: 10,
    },
    row: {
      display: "flex",
    },
    withChildrenLabel: {
      color: "DeepPink",
    },
    select: {
      borderRadius: 3,
      borderColor: "grey",
      backgroundColor: "DimGray",
      color: "khaki",
    },
    input: {
      borderRadius: 3,
      border: "1px solid #272822",
      padding: 2,
      fontFamily: "Lucida Console, monospace",
      fontSize: 12,
      backgroundColor: "DimGray",
      color: "khaki",
      width: "200%",
    },
    addButton: {
      cursor: "pointer",
      color: "LightGreen",
      marginLeft: 15,
      fontSize: 12,
    },
    removeButton: {
      cursor: "pointer",
      color: "magenta",
      marginLeft: 15,
      fontSize: 12,
    },
    saveButton: {
      cursor: "pointer",
      color: "green",
      marginLeft: 15,
      fontSize: 12,
    },
    builtin: {
      color: "green",
      fontSize: 12,
    },
    text: {
      color: "khaki",
      fontSize: 12,
    },
    number: {
      color: "purple",
      fontSize: 12,
    },
    property: {
      color: "DeepPink",
      fontSize: 12,
    },
    collapseIcon: {
      cursor: "pointer",
      fontSize: 8,
      color: "teal",
    },
  };

  const avataricon = (
    //left side
    <Switch
      checkedChildren="Edit"
      unCheckedChildren="View"
      defaultChecked
      onChange={(checked, event) => {
        dispatch(globalVariable({ openDialog2: !toggleView }));
      }}
    />
  );
  //right side buttons

  const onJsonChange = (key, value, parent, data) => {
    console.log(key, value, parent, data);
  };
  // const jsonMaker = (modeltype) => {
  //   const cleanup = (link, layerid) => {
  //     let newedge = [];
  //     link.map((k) => {
  //       let kk = k.linklist;
  //       if (k.pid === layerid)
  //         newedge.push({ src: kk[1] - 1, tgt: kk[2] - 1, wgt: kk[3] });
  //     });
  //     return newedge;
  //   };
  //   const vectorArray = (nodelist, nodesetid, nodeattributekey) => {
  //     let newedge = [],
  //       srcSize,
  //       tgtSize;
  //     nodelist = _.filter(nodelist, (o) => o.pid === nodesetid);

  //     nodelist.map((k) => {
  //       newedge.push(k.nodeattribute);
  //     });
  //     const kl = _.orderBy(newedge, ["seq"], ["asc"]);
  //     return _.map(kl, nodeattributekey);
  //   };

  //   const layerObj = value;
  //   let matrixes = [],
  //     matrix = {},
  //     model = {},
  //     paramObj = {},
  //     srcSize;
  //   const matrixMaker = (k) => {
  //     const edgelist = cleanup(projectbundle.link, k._id);
  //     srcSize = _.filter(projectbundle.node, (o) => {
  //       return o.pid === k.pid;
  //     }).length;
  //     const tgtSize = _.filter(projectbundle.node, (o) => {
  //       return o.pid === k.pid1;
  //     }).length;
  //     return {
  //       edgelist,
  //       srcSize,
  //       tgtSize,
  //     };
  //   };
  //   if (!layerObj) return false;
  //   if (layerObj.length > 0) {
  //     layerObj.map((k, i) => {
  //       let mat = matrixMaker(k);
  //       if (tempModel.directed) mat.directed = true;
  //       matrixes.push(mat);
  //     });
  //     model.matrixes = matrixes;
  //   } else {
  //     matrix = matrixMaker(layerObj);
  //     if (tempModel.directed) matrix.directed = true;
  //     model.matrix = matrix;
  //   }
  //   //add custom by model
  //   switch (modeltype) {
  //     case "blockmodel":
  //       model.unpreprocessedMatrix = matrix;
  //       const vector = vectorArray(
  //         projectbundle.node,
  //         layerObj.pid,
  //         "Education"
  //       );
  //       model.vector = { type: "TEXT", values: vector };
  //       paramObj = {
  //         // mainNodesetSize: srcSize,
  //         // goodnessOfFitIndex: 0,
  //         // inputType: 0,
  //         // blockDichotomizeOperator: 0,
  //         // roleDichotomizeValue: 0.1,
  //         // roleDichotomizeOperator: 0,
  //         // sentThresholdValue: 0.0,
  //         // receivedThresholdValue: 0.0,
  //         goodnessOfFitIndex: 0,
  //         numberOfIteration: 0,
  //         blockDichotomizeOperator: 0,
  //         inputType: 0,
  //         cutoff: 0,
  //         roleDichotomizeOperator: 0,
  //         roleDichotomizeValue: 0,
  //         sentThresholdValue: 0,
  //         receivedThresholdValue: 0,
  //       };
  //       break;
  //     default:
  //       paramObj = tempModel.param.setting.initialValues;
  //       break;
  //   }

  //   //add param
  //   var modelfile = {
  //     ...model,
  //     ...paramObj,
  //   };
  //   setValue1(modelfile);
  // };

  // const runModel1 = async () => {
  //   const url = tempModel.properties.apiurl;

  //   let config = {
  //     method: "post",
  //     url,
  //     data: value1,
  //   };
  //   const modelreturn = await axios(config);
  //   console.log(modelreturn.data);
  // };
  return (
    <>
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <CardForm title="" avataricon={avataricon}>
            {toggleView ? (
              <JSONViewer data={data} collapsible styles={styles} />
            ) : (
              <JSONEditor
                data={data}
                collapsible
                styles={styles}
                onChange={onJsonChange}
              />
            )}
          </CardForm>
        </Col>
      </Row>
    </>
  );
};

export default ModelJsonViewer;
