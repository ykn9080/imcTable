/*
 * @Author: yknam
 * @Date: 2020-2-29 14:34
 * @Last Modified by: yknam
 * @Last Modified time: 2020-2-29 14:34
 * @Desc: Side Menu Bar Open when click top tab
 * Work on contextmenu 2-29
 */

import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import "antd/dist/antd.css";
import "./Antd.css";
import { Tree, Button, Input, Col, Row } from "antd";
import ContextMenu from "./ContextMenu";
import { loadCSS } from "fg-loadcss";
import {
  getTreeFromFlatData,
  getFlatDataFromTree,
} from "components/functions/dataUtil";
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

/**
 * Make Tree node with flattened datalist
 * @param {Object} data Tree data list flatted
 * @param {String} searchValue keyword if any
 * @returns {Object}
 */
export const loop = (data, searchValue) => {
  if (data)
    return data.map((item) => {
      let index = -1,
        slength,
        setting = {};
      if (searchValue) {
        index = item.title.indexOf(searchValue);
        slength = searchValue.length;
      }

      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + slength);

      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "red" }} className="site-tree-search-value">
              {searchValue}
            </span>
            {afterStr}
          </span>
        ) : (
          item.title
        );
      if (item.icon) setting = { ...setting, icon: item.icon };
      if (item.disabled) setting = { ...setting, disabled: item.disabled };
      if (item.key) setting = { ...setting, key: item.key };
      if (item._id) setting = { ...setting, _id: item._id };
      if (item.children && item.children.length) {
        return (
          <TreeNode title={title} {...setting}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} {...setting} />;
    });
};
const TreeAnt = (props) => {
  let treeData = useSelector((state) => state.global.treeData);

  const [initTree, setInitTree] = useState(props.treeData);
  const [gData, setgData] = useState();
  const [flatAgain, setFlatAgain] = useState();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [newkey, setNewkey] = useState(props.newkey);
  const [selected_id, setSelected_id] = useState();

  const { Search } = Input;

  useEffect(() => {
    //if datatype is "flat", convert to treeData type,
    //props.treeProps designate fields of title,_id,pid,root of flat data

    //default is {title,_id,pid,root}

    // if (treeData === "")
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

    //make treeData flat again for added key value
    let rtn1 = makeFlatFromTree(treeData);
    if (newkey !== props.newkey) newCreateSelect(rtn1);

    if (props.selected_id && props.selected_id !== selected_id) {
      selectedfrom_id(rtn1, props.selected_id);
      setSelected_id(props.selected_id);
    }
    setFlatAgain(rtn1);
  }, [props]);
  useEffect(() => {
    setNewkey(props.newkey);
  }, [props.newkey]);

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const newCreateSelect = (flatData) => {
    // expanding,selecting new node & delete new mark

    const list = _.filter(flatData, (o) => {
      return o.pid === props.newkey;
    });
    if (list.length > 0) {
      const node1 = list[list.length - 1];
      if (selectedKeys !== node1.key) {
        expandSelect(node1.key);
      }
    }
  };
  const selectedfrom_id = (flatData, _id) => {
    const list = _.find(flatData, (o) => {
      return o._id === _id;
    });
    if (list) expandSelect(list.key);
  };
  const expandSelect = (key) => {
    let expkeys = [...expandedKeys];
    expkeys.push(key);
    setExpandedKeys(_.uniq(expkeys));
    setSelectedKeys([key]);
  };
  /* #region search collection */
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e) => {
    const { value } = e.target;
    const expandedKeys = flatAgain
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
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

  /* #region anttree eventhandler collection */
  const onDragEnter = (info) => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  const onSelect = (selectedKeys, info) => {
    //find id from key
    //setSelected_id(null);

    let key = "";
    if (selectedKeys.length === 1) key = selectedKeys[0];

    setSelectedKeys(selectedKeys);
    const dt = gData;
    const flatData = getFlatDataFromTree({
      treeData: dt,
      //getNodeKey: ({ node }) => node._id, // This ensures your "id" properties are exported in the path
      getNodeKey: ({ node }) => node._id, // This ensures your "id" properties are exported in the path
      ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
    });
    const rtn1 = _.map(flatData, "node"); //select node from each object
    rtn1.map((v) => {
      if (v.key === key) {
        if (props.onSelect) props.onSelect(v);
      }
      return null;
    });
  };
  const onDrop = (info) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    let data = gData; //[...this.state.gData];
    if (data === "") data = [];
    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setgData(data);
    const rtn1 = makeFlatFromTree(data);
    const pid = findPid(rtn1, dropKey);
    let curobj;

    rtn1.map((k, i) => {
      if (k.key === dragKey) {
        k.pid = pid;
        rtn1.splice(i, 1, k);
        curobj = k;
      }
      return null;
    });
    if (props.onDrop) {
      props.onDrop(curobj);
    }
    setFlatAgain(rtn1);
    // forceUpdate();
  };
  const addNew = () => {
    if (props.contextCallback) props.contextCallback(0, null);
  };
  const findPid = (flatData, pkey) => {
    const pobj = _.find(flatData, (o) => {
      return o.key === pkey;
    });
    if (pobj) return pobj._id;
  };
  /* #endregion */

  const onRightClick = ({ event, node }) => {
    if (props.edit === false) return;
    const flatwithkey = _.find(flatAgain, (o) => {
      return o.key === node.key;
    });
    localStorage.setItem("node", JSON.stringify(flatwithkey));
  };

  //sample contextItems
  let contextItems = [
    { label: "Item 1" },
    { label: "Menu item 2" },
    { label: "Apple" },
    { label: "This is orange" },
    { label: "Conetxt menu is fun" },
    { label: "Cool" },
  ];
  if (props.contextItems) contextItems = props.contextItems;

  //when contextMenu clicked,
  const contextCallback = (index) => {
    const nodewithkey = localStorage.getItem("node");

    // console.log(
    //   `you clicked ${index}, ${contextItems[index].label} and node key is ${nodeVal.key}`
    // );
    if (props.contextCallback) props.contextCallback(index, nodewithkey);
    localStorage.removeItem("node");
  };
  let setting = {};
  if (props.edit === true) {
    setting = {
      onRightClick: onRightClick,
      draggable: true,
      onDragEnter: onDragEnter,
      onDrop: onDrop,
    };
  }
  if (props.defaultExpandAll) setting = { ...setting, defaultExpandAll: true };
  if (props.defaultSelectedKeys && props.defaultSelectedKeys.length > 0)
    setting = { ...setting, defaultSelectedKeys: props.defaultSelectedKeys }; //arraytype

  return (
    <div>
      {props.search && (
        <Row gutter={2}>
          <Col flex="auto">
            <Search
              style={{ marginBottom: 8 }}
              placeholder="Search"
              onChange={onChange}
            />
          </Col>
          {props.edit && (
            <Col span={1}>
              <Button icon={<PlusOutlined />} onClick={addNew} />
            </Col>
          )}
        </Row>
      )}
      <Tree
        className="draggable-tree"
        //defaultExpandAll
        defaultExpandedKeys={expandedKeys}
        //defaultSelectedKeys={["0-0-0"]}
        //defaultExpandedKeys={["0-0"]}
        //blockNode //mark whole row
        showIcon
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        //selectedKeys={["0-0"]}
        autoExpandParent={autoExpandParent}
        {...setting}
        height={800}
      >
        {gData && loop(gData, searchValue)}
      </Tree>
      {props.edit === true && (
        <ContextMenu
          items={contextItems}
          callback={contextCallback}
          // nodekey={nodekey}
        ></ContextMenu>
      )}
      {/* <Button
        onClick={() => {
          console.log(selectedKeys, expandedKeys, newkey, props.newkey);
        }}
      >
        sel,exp
      </Button> */}
    </div>
  );
};

export default TreeAnt;
