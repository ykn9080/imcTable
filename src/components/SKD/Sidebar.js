/*
 * @Author: yknam
 * @Date: 2020-2-29 14:34
 * @Last Modified by: yknam
 * @Last Modified time: 2020-2-29 14:34
 * @Desc: Side Menu Bar Open when click top tab
 * Work on contextmenu 2-29
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import "antd/dist/antd.css";
import TreeAnt from "components/Common/TreeAnt";
import "./SKD.css";

const Sidebar = (props) => {
  //selectedKey
  const [key, setKey] = useState("");
  let selectedKey = useSelector((state) => state.global.selectedKey);
  if (selectedKey !== key) setKey(selectedKey);
  let setting = {};
  if (props.defaultExpandAll)
    setting = { defaultExpandAll: props.defaultExpandAll };
  //let treeData = getNodeData(tempMenu, selectedKey, "_id", "pid", "", "title");

  const onSelect = (selectedObj) => {
    if (props.onSelect) props.onSelect(selectedObj);
  };
  let contextItems = [
    { label: "Item 2" },
    { label: "Menu item 3" },
    { label: "Apple1" },
    { label: "This is orange1" },
    { label: "Conetxt menu is fun1" },
    { label: "Cool1" },
  ];
  const contextCallback = (index, node) => {
    console.log(index, node);
  };

  return (
    <>
      <TreeAnt
        onSelect={onSelect}
        contextItems={contextItems}
        contextCallback={contextCallback}
        {...setting}
        id={"_id"}
      />
    </>
  );
};

export default Sidebar;
