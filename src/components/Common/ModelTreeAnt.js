import { DownOutlined } from "@ant-design/icons";
import { Button, Tree } from "antd";
import "antd/dist/antd.css";
import {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from "components/functions/dataUtil";
import { loadCSS } from "fg-loadcss";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-sortable-tree/style.css";
import "./Antd.css";
const { TreeNode } = Tree;

export const makeTreeDt = (flatData, props) => {
  let treeDt = getTreeFromFlatData({
    flatData: flatData.map((node) => ({
      ...node,
      title: node[props.title],
    })),
    getKey: (node) => node[props._id], // resolve a node's key
    getParentKey: (node) => node[props.pid], // resolve a node's parent's key
    rootKey: props.root, // The value of the parent key when there is no parent (i.e., at root level)
  });

  const addKey = (_tns, _preKey) => {
    const preKey = _preKey || "0";
    const tns = _tns || treeDt;
    tns.map((v, i) => {
      const key = `${preKey}-${i}`;
      v.key = key;
      if (v.hasOwnProperty("children")) {
        addKey(v.children, key);
      }
      return null;
    });
  };

  addKey();
  return treeDt;
};
export const makeFlatFromTree = (treeData) => {
  const flatAgainWithKey = getFlatDataFromTree({
    treeData: treeData,
    getNodeKey: ({ node }) => node.key,
    ignoreCollapsed: false,
  });
  const findPkey = (rtn1, pid) => {
    const pobj = _.find(rtn1, (o) => {
      return o._id === pid;
    });
    if (pobj) return pobj.key;
  };
  const rtn1 = _.map(flatAgainWithKey, "node");
  //add parentkey as pkey
  rtn1.map((k, i) => {
    const pkey = findPkey(rtn1, k.pid);
    k.pkey = pkey;
    rtn1.splice(i, 1, k);
    return null;
  });
  return rtn1;
};

export const loop = (data, selectedKeys, modetype) => {
  return data.map((item) => {
    const title = <span>{item.title}</span>;
    let disabled = false;

    if (item.vtype[0] === "dataset" || item.vtype[0] === "nodeset") {
      disabled = true;
    }

    switch (modetype) {
      default:
        return null;
      case "os": // one-mode single
        if (item.pid !== item.pid1) {
          disabled = true;
        }
        selectedKeys.forEach((s) => {
          if (s === "" || s !== item.key) {
            disabled = true;
          }
        });
        break;
      case "om": // one-mode multi
        if (item.pid !== item.pid1) {
          disabled = true;
        }
        break;
      case "ts": // two-mode single
        if (item.pid === item.pid1) {
          disabled = true;
        }
        selectedKeys.forEach((s) => {
          if (s === "" || s !== item.key) {
            disabled = true;
          }
        });
        break;
      case "tm": // two-mode multi
        if (item.pid === item.pid1) {
          disabled = true;
        }
        break;
      case "vs": // vector single
        if (item.vtype[0] === "nodeset") {
          disabled = false;
        }
        if (item.vtype[0] === "layer") {
          disabled = true;
        }
        selectedKeys.forEach((s) => {
          if (s === "" || s !== item.key) {
            disabled = true;
          }
        });
        break;
      case "sv": // M/L nodeset or rawdata select
        if (item.vtype[0] === "nodeset") {
          disabled = false;
        }
        if (item.vtype[0] === "layer") {
          disabled = true;
        }
        if (item.vtype[0] === "rawdataset") {
          disabled = false;
        }
        selectedKeys.forEach((s) => {
          if (s === "" || s !== item.key) {
            disabled = true;
          }
        });
        break;
      case "gp": // M/L network select
        if (item.pid !== item.pid1) {
          disabled = true;
        }
        selectedKeys.forEach((s) => {
          if (s === "" || s !== item.key) {
            disabled = true;
          }
        });
        break;
    }

    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.key}
          title={title}
          icon={item.icon}
          disabled={disabled}
        >
          {loop(item.children, selectedKeys, modetype)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={item.key}
        title={title}
        icon={item.icon}
        disabled={disabled}
      />
    );
  });
};

const ModelTreeAnt = (props) => {
  let treeData = useSelector((state) => state.global.treeData);
  let tempModel = useSelector((state) => state.global.tempModel);

  const [initTree, setInitTree] = useState(props.treeData);
  const [gData, setgData] = useState();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    treeData = initTree;

    if (props.treeData !== initTree) {
      treeData = props.treeData;
      setInitTree(props.treeData);
    }

    if (props.treedatatype === "flat") {
      let treeProps = { title: "title", _id: "_id", pid: "pid", root: "root" };
      if (props.treeProps) treeProps = { ...treeProps, ...props.treeProps };

      treeData = makeTreeDt(treeData, { ...treeProps });
    }
    if (props.expandedKeys) setExpandedKeys(props.expandedKeys);
    setgData(treeData);
  }, [props]);

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  const onCheck = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
  };

  const onClickTree = () => {
    let key = selectedKeys;
    setSelectedKeys(key);

    const dt = gData;
    const flatData = getFlatDataFromTree({
      treeData: dt,
      getNodeKey: ({ node }) => node._id,
      ignoreCollapsed: false,
    });
    const rtn1 = _.map(flatData, "node");

    let filteredKey = rtn1.filter((v) => {
      const f_key = v.key;
      return key.some((k) => f_key === k);
    });
    if (props.onCheck) props.onCheck(filteredKey);
  };

  return (
    <div>
      <Button type="primary" onClick={onClickTree}>
        Confirm
      </Button>
      <br /> <br />
      <Tree
        checkable
        onCheck={onCheck}
        className="draggable-tree"
        showIcon
        switcherIcon={<DownOutlined />}
        onExpand={onExpand}
        defaultExpandedKeys={expandedKeys}
        expandedKeys={expandedKeys}
        height={800}>
        {gData && loop(gData, selectedKeys, tempModel.properties.modetype)}
      </Tree>
    </div>
  );
};

export default ModelTreeAnt;
