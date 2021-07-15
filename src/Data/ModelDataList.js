import { FormOutlined } from "@ant-design/icons";
import { globalVariable } from "actions";
import { Tooltip } from "antd";
import axios from "axios";
import PageHead from "components/Common/PageHeader";
import { currentsetting } from "config/index.js";
import { getNodeData } from "components/functions/dataUtil";
import { pickuniq } from "components/functions/LodashUtil";
import ModelDataTree from "Data/ModelDataTree";
import { loadCSS } from "fg-loadcss";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FiGitCommit, FiGitPullRequest } from "react-icons/fi";
import { GiPlainCircle } from "react-icons/gi";
import { RiDatabase2Line, RiFolder2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

export const makeVectorList = (dataArr, allData) => {
  let nodeset = [],
    rtn = {};

  //const alldt= await axios.post(`${currentsetting.webserviceprefix}datasetbundle`, { ids: ids })
  dataArr.map((r) => {
    switch (r.vtype[0]) {
      default:
        return null;
      case "layer":
        //self, related nodeset add
        const node1 = _.find(allData.nodeset, (o) => {
          return o._id === r.pid;
        });
        if (node1?.attribute && node1.attribute.length > 0) {
          rtn.vectors = pickuniq(node1.attribute, "fieldname");
        }
        nodeset.push(node1);
        if (r.hasOwnProperty("pid1") && r.pid !== r.pid1) {
          const node2 = _.find(allData.nodeset, (o) => {
            return o._id === r.pid1;
          });
          if (node2?.attribute && node2.attribute.length > 0) {
            rtn.vectors = rtn.vectors.concat(
              pickuniq(node2.attribute, "fieldname")
            );
          }
          nodeset.push(node2);
        }
        rtn.nodeset = nodeset;
        break;
      case "nodeset":
        break;
    }
  });
  return rtn;
};
export const makeTreeData = (curdataset, allData) => {
  return new Promise((resolve, reject) => {
    /*stuff using username, password*/
    const findname = (nodeset, pid) => {
      return _.find(nodeset, (o) => {
        return o._id === pid;
      })?.title;
    };
    allData.then((json) => {
      json.dataset = curdataset;
      json.dataset.map((k) => {
        k.pid = "";
        k.vtype = ["dataset"];
        k.disabled = true;
        k.icon = <RiFolder2Line />;
        return null;
      });
      json.nodeset.map((k) => {
        k.vtype = ["nodeset"];
        k.icon = <GiPlainCircle />;
        return null;
      });
      json.rawdataset.map((rds) => {
        rds.vtype = ["rawdataset"];
        rds.icon = <RiDatabase2Line />;
        return null;
      });
      json.layer.map((k, i) => {
        k.vtype = ["layer"];
        if (k.pid === k.pid1) {
          k.vtype = k.vtype.concat("bomb");
          k.icon = <FiGitCommit />;
        } else {
          k.vtype = k.vtype.concat("mars-double");
          k.pid1name =
            findname(json.nodeset, k.pid) +
            " - " +
            findname(json.nodeset, k.pid1);
          k.icon = (
            <Tooltip title={k.pid1name}>
              <FiGitPullRequest />
            </Tooltip>
          );
        }
        return null;
      });
      const merged = [].concat(
        json.dataset,
        json.nodeset,
        json.layer,
        json.rawdataset
      );
      let treeData = getNodeData(merged, "", "_id", "pid", "", "title");

      resolve({ treeData, json });
    });
  });
};

const ModelDataList = (props) => {
  const [dataset, setDataset] = useState([]);
  const dispatch = useDispatch();

  let allData = useSelector((state) => state.global.allData);
  let treeData = useSelector((state) => state.global.treeData);

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  useEffect(() => {
    const datasetList = new Promise((resolve, reject) => {
      axios
        .get(`${currentsetting.webserviceprefix}dataset`)
        .then((response) => {
          resolve(response.data);
        });
    });
    datasetList.then((data) => {
      let imsiData1 = [];
      data.map((k, i) => {
        return imsiData1.push({
          _id: k._id,
          data: k.data,
          name: k.title,
          description: k.desc,
          titleHandler: true,
          href: {
            pathname: `/data/view`,
            search: `?_id=${k._id}`,
            state: k,
          },
          avatar: {
            size: 32,
            style: { backgroundColor: "#87d068" },
            shape: "square",
            icon: <FormOutlined />,
          },
          desc: k.desc,
          graphData: k.graphData,
          source: k.source,
          option: k.option,
        });
      });

      setDataset(datasetList);
      dispatch(globalVariable({ listData: imsiData1 }));
    });

    datasetList.then((data) => {
      let ids = [];
      data.map((k) => {
        ids.push(k._id);
        return null;
      });
      const allData = new Promise((resolve, reject) => {
        axios
          .post(`${currentsetting.webserviceprefix}datasetbundle`, { ids: ids })
          .then((res) => {
            resolve(res.data);
          });
      });

      const rtn = makeTreeData(data, allData);
      rtn.then((rsp) => {
        dispatch(globalVariable({ allData: rsp.json }));
        dispatch(globalVariable({ treeData: rsp.treeData }));
      });
    });
  }, []);

  const onCheck = (record, selected, selectedRows) => {
    //make projectbundle based on layer,nodeset, or dataset key

    let nodeset = [],
      rtn = {};
    record.map((r) => {
      switch (r.vtype[0]) {
        default:
          return null;
        case "layer":
          //self, related nodeset add
          const node1 = _.find(allData.nodeset, (o) => {
            return o._id === r.pid;
          });
          if (node1?.attribute && node1.attribute.length > 0) {
            rtn.vectors = pickuniq(node1.attribute, "fieldname");
          }
          nodeset.push(node1);
          if (r.hasOwnProperty("pid1") && r.pid !== r.pid1) {
            const node2 = _.find(allData.nodeset, (o) => {
              return o._id === r.pid1;
            });
            if (node2?.attribute && node2.attribute.length > 0) {
              rtn.vectors = rtn.vectors.concat(
                pickuniq(node2.attribute, "fieldname")
              );
            }
            nodeset.push(node2);
          }
          rtn.nodeset = nodeset;
          break;
        case "nodeset":
          break;
      }
    });
    // if (props.onCheck) props.onCheck(record, nodeset);
    if (props.onCheck) props.onCheck(record, rtn.nodeset);
    dispatch(globalVariable({ openDialog: false }));
  };
  return (
    <>
      <PageHead title={"List"} />
      <div style={{ margin: 10 }}>
        {treeData && <ModelDataTree treeData={treeData} onCheck={onCheck} />}
      </div>
    </>
  );
};

export default ModelDataList;
