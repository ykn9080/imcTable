/*
 * @Author: yknam
 * @Date: 2020-2-29 14:34
 * @Last Modified by: yknam
 * @Last Modified time: 2020-2-29 14:34
 * @Desc: Side Menu Bar Open when click top tab
 * Work on contextmenu 2-29
 */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import "antd/dist/antd.css";
import SubMenuHead from "./SubMenuHead";
import TreeAnt from "components/Common/TreeAnt";

export const SubMenu = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  //selectedKey
  const [key, setKey] = useState("");
  let selectedKey = useSelector((state) => state.global.selectedKey);
  //const login = useSelector((state) => state.global.login);
  let showSidebar = useSelector((state) => state.global.showSidebar);
  if (selectedKey !== key) setKey(selectedKey);

  //let treeData = getNodeData(tempMenu, selectedKey, "_id", "pid", "", "title");
  const [reload, setReload] = useState(false); //for reload from child

  const onSelect = (selectedObj) => {
    if (selectedObj) history.push(selectedObj.path);
    dispatch(globalVariable({ control: selectedObj.layout }));
    dispatch(globalVariable({ selectedKey: selectedObj._id }));
    dispatch(globalVariable({ currentData: selectedObj }));
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
    <div>
      {showSidebar ? <SubMenuHead callBack={setReload} /> : null}
      {showSidebar ? (
        <>
          <TreeAnt
            onSelect={onSelect}
            contextItems={contextItems}
            contextCallback={contextCallback}
            id={"_id"}
          />
        </>
      ) : null}
    </div>
  );
};
