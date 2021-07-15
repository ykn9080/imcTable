import React, { useEffect, useMemo, useState, Component } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { makeStyles } from "@material-ui/core/styles";
import { Sortable } from "./MenuSortable";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TextField from "@material-ui/core/TextField";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import {
  getTreeFromFlatData,
  getFlatDataFromTree,
} from "components/functions/dataUtil";

import { Container, Draggable } from "react-smooth-dnd";
import DragHandleIcon from "@material-ui/icons/DragHandle";

import "antd/dist/antd.css";
import { Tree } from "antd";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import { directChild, getChildren } from "../functions/findChildrens";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AddBox from "@material-ui/icons/AddBox";
import Grid from "@material-ui/core/Grid";

import useForceUpdate from "use-force-update";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));
const initialState = {
  mouseX: null,
  mouseY: null,
};
export const SubMenu = (props) => {
  let subMenu = useSelector((state) => state.global.subMenu);
  let tempMenu = useSelector((state) => state.global.tempMenu);
  const dispatch = useDispatch();
  const classes = useStyles();

  // react-sortable-tree execution
  const [treeData, setTreeData] = useState([
    { title: "Chicken", expanded: true, children: [{ title: "Egg" }] },
  ]);

  //for panel expansion
  const [panelExpanded, setPanelExpanded] = React.useState("panel2");
  const panelChange = (panel) => (event, isExpanded) => {
    setPanelExpanded(isExpanded ? panel : false);
  };

  //for context
  const [state, setState] = React.useState(initialState);
  const handleContext = (id, event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    console.log(id);
  };
  const handleClose = () => {
    setState(initialState);
  };

  //for sub menu fold/unfold
  const [open, setOpen] = React.useState({});
  const [expanded, setExpanded] = React.useState([]);
  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };
  const handleClick = (id, e) => {
    if (expanded === id) setExpanded([]);
    else setExpanded(id);
    setOpen((prevState) => ({
      ...prevState,
      [id]: !open[id],
    }));
  };
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const addSubMenu = () => {
    console.log("add menu");
  };
  const selectedmenu = (id) => {
    dispatch(globalVariable({ selectedKey: id }));
    const ctr = findControl(tempMenu, "1", id);
    console.log("it's from submenu", ctr);
    dispatch(globalVariable({ control: ctr }));
  };
  const findControl = (tempMenu, comp, id) => {
    const ctr = tempMenu.filter(
      (item, itemIndex) => item.comp === comp && item.id === id
    );

    if (ctr) {
      return ctr[0].layout.sort(function (a, b) {
        return a.rowseq < b.rowseq ? -1 : 1;
      });
    }
  };

  const NestedList = (props) => {
    return (
      <>
        <Draggable key={props.id}>
          <ListItem
            button
            onClick={(e) => handleClick(props.id, e)}
            onContextMenu={(e) => handleContext(props.id, e)}
            style={{ cursor: "context-menu" }}
          >
            <ListItemText
              primary={props.title}
              style={{ paddingLeft: props.depth * 15 }}
              className="drag-handle"
            />
            {expanded === props.id ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </Draggable>
        <Collapse in={open[props.id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {props.data.map((sub, i) => {
              let subdata = directChild(tempMenu, sub.id, "seq");
              return subdata.length > 0 ? (
                <NestedList
                  id={sub.id}
                  title={sub.title}
                  data={subdata}
                  depth={props.depth + 1}
                />
              ) : (
                <Draggable key={sub.id}>
                  <ListItem
                    onContextMenu={(e) => handleContext(sub.id, e)}
                    button
                    selected={selectedIndex === sub.id}
                    onClick={(event) => {
                      handleListItemClick(event, sub.id);
                      selectedmenu(sub.id);
                    }}
                    className={classes.nested}
                  >
                    <ListItemText
                      primary={sub.title}
                      style={{ paddingLeft: props.depth * 15 }}
                      className="drag-handle"
                    />
                  </ListItem>
                </Draggable>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  };

  // //react-sortable-hoc
  // const DragHandle = SortableHandle(() => (
  //   <ListItemIcon>
  //     <DragHandleIcon />
  //   </ListItemIcon>
  // ));
  // const SortableItem = SortableElement(({ text }) => (
  //   <ListItem ContainerComponent="div">
  //     <ListItemSecondaryAction>
  //       <DragHandle />
  //     </ListItemSecondaryAction>
  //     <ListItemText primary={text} />
  //   </ListItem>
  // ));

  //react-smooth-dnd
  const [items, setItems] = useState([
    { id: "1", text: "Item 1" },
    { id: "2", text: "Item 2" },
    { id: "3", text: "Item 3" },
    { id: "4", text: "Item 4" },
  ]);
  const onDrop = ({ removedIndex, addedIndex }) => {
    console.log({ removedIndex, addedIndex });
    // setItems(items => arrayMove(items, removedIndex, addedIndex));
  };

  const contextmenu = (
    <Menu
      keepMounted
      open={state.mouseY !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        state.mouseY !== null && state.mouseX !== null
          ? { top: state.mouseY, left: state.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleClose}>Copy</MenuItem>
      <MenuItem onClick={handleClose}>Print</MenuItem>
      <MenuItem onClick={handleClose}>Highlight</MenuItem>
      <MenuItem onClick={handleClose}>Email</MenuItem>
    </Menu>
  );
  const SubList = (
    <List
      style={{ cursor: "context-menu" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {subMenu.map((m, index) => {
          let subdata = directChild(tempMenu, m.id, "seq");
          return subdata.length > 0 ? (
            <NestedList data={subdata} id={m.id} title={m.title} depth={0} />
          ) : (
            <Draggable key={m.id}>
              <ListItem
                onContextMenu={(e) => handleContext(m.id, e)}
                button
                selected={selectedIndex === m.id}
                onClick={(event) => {
                  handleListItemClick(event, m.id);
                  selectedmenu(m.id);
                }}
              >
                <ListItemText primary={m.title} className="drag-handle" />
              </ListItem>
            </Draggable>
          );
        })}
      </Container>
      {contextmenu}
    </List>
  );

  console.log(treeData);
  return (
    <div>
      <ExpansionPanel
        expanded={panelExpanded === "panel1"}
        onChange={panelChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ArrowDropDown />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Summary</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>space for menu edit</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={panelExpanded === "panel2"}
        onChange={panelChange("panel2")}
      >
        <ExpansionPanelSummary
          expandIcon={<ArrowDropDown />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.Heading}>Menu</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <SortableTree
            treeData={treeData}
            onChange={(treeData) => setTreeData(treeData)}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export const SubMenu2 = () => {
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
  const data = [
    {
      title: "0-0",
      key: "0-0",
      children: [
        {
          title: "0-0-0",
          key: "0-0-0",
          children: [
            { title: "0-0-0-0", key: "0-0-0-0" },
            { title: "0-0-0-1", key: "0-0-0-1" },
            { title: "0-0-0-2", key: "0-0-0-2" },
          ],
        },
        {
          title: "0-0-1",
          key: "0-0-1",
          children: [
            { title: "0-0-1-0", key: "0-0-1-0" },
            { title: "0-0-1-1", key: "0-0-1-1" },
            { title: "0-0-1-2", key: "0-0-1-2" },
          ],
        },
        { title: "0-0-2", key: "0-0-2" },
      ],
    },
    {
      title: "0-1",
      key: "0-1",
      children: [
        {
          title: "0-1-0",
          key: "0-1-0",
          children: [
            { title: "0-1-0-0", key: "0-1-0-0" },
            { title: "0-1-0-1", key: "0-1-0-1" },
            { title: "0-1-0-2", key: "0-1-0-2" },
          ],
        },
        {
          title: "0-1-1",
          key: "0-1-1",
          children: [
            { title: "0-1-1-0", key: "0-1-1-0" },
            { title: "0-1-1-1", key: "0-1-1-1" },
            { title: "0-1-1-2", key: "0-1-1-2" },
          ],
        },
        { title: "0-1-2", key: "0-1-2" },
      ],
    },
    { title: "0-2", key: "0-2" },
  ];
  let dataList = [
    {
      access: [],
      _id: "5e3bc558069da0e31aa6d891",
      id: "s3",
      comp: "1",
      creator: "ykn",
      desc: "sub3페이지",
      pid: "m2",
      private: false,
      seq: 0,
      title: "Sub3페이지임다다",
      layout: [],
    },
    {
      access: [],
      _id: "5e3bcb7f069da0e31aa6eb91",
      id: "m1",
      comp: "1",
      creator: "ykn",
      desc: "첫페이지소개",
      layout: [{ rowseq: 0, colseq: 0, ctrid: "" }],
      pid: "",
      private: false,
      seq: 0,
      title: "FristMenu",
    },
    {
      access: [],
      _id: "5e3bcb7f069da0e31aa6eb92",
      id: "m2",
      comp: "1",
      creator: "ykn",
      desc: "second페이지소개",
      pid: "",
      private: false,
      seq: 1,
      title: "SecondMenu",
      layout: [],
    },
    {
      access: [],
      _id: "5e3bcb7f069da0e31aa6eb93",
      id: "s2",
      comp: "1",
      creator: "ykn",
      desc: "sub2페이지",
      pid: "m1",
      private: false,
      seq: 1,
      title: "Sub2",
      layout: [],
    },
    {
      access: [],
      _id: "5e3bcb7f069da0e31aa6eb94",
      id: "s2-1",
      comp: "1",
      creator: "ykn",
      desc: "sub2-1페이지",
      pid: "s2",
      private: false,
      seq: 0,
      title: "Sub2-1",
      layout: [],
    },
    {
      access: [],
      _id: "5e3f6650069da0e31aa96369",
      id: "s1",
      comp: "1",
      creator: "ykn",
      desc: "sub1페이지1111",
      pid: "m1",
      private: false,
      seq: 0,
      title: "Sub1",
      layout: [
        { _id: "5e45f3d7df0eeb50f8ea1078", ctrid: "c1", rowseq: 0, colseq: 0 },
        { _id: "5e45f3d7df0eeb50f8ea1077", ctrid: "c2", rowseq: 1, colseq: 0 },
        { _id: "5e45f3d7df0eeb50f8ea1076", ctrid: "c3", rowseq: 1, colseq: 1 },
      ],
    },
  ];

  let tempMenu = useSelector((state) => state.global.tempMenu);
  let selectedKey = useSelector((state) => state.global.selectedKey);
  if (selectedKey !== key) setKey(selectedKey);
  const { TreeNode } = Tree;
  const [expandedKeys, setExpendedKeys] = useState([]);

  let treeDt = getTreeFromFlatData({
    flatData: tempMenu.map((node) => ({ ...node, title: node.title })),
    getKey: (node) => node.id, // resolve a node's key
    getParentKey: (node) => node.pid, // resolve a node's parent's key
    rootKey: "", // The value of the parent key when there is no parent (i.e., at root level)
  });
  const subList = getChildren(treeDt, selectedKey);
  treeDt = getTreeFromFlatData({
    flatData: subList.map((node) => ({ ...node, title: node.title })),
    getKey: (node) => node.id, // resolve a node's key
    getParentKey: (node) => node.pid, // resolve a node's parent's key
    rootKey: selectedKey, // The value of the parent key when there is no parent (i.e., at root level)
  });
  const addKey = (_tns, _preKey) => {
    const preKey = _preKey || "0";
    const tns = _tns || treeDt;
    tns.map((v, i) => {
      const key = `${preKey}-${i}`;
      console.log(key, v);
      v.key = key;
      if (v.hasOwnProperty("children")) {
        addKey(v.children, key);
      }
      return null;
    });
  };
  addKey();
  localStorage.setItem("subList", JSON.stringify(treeDt));
  const [gData, setgData] = useState(treeDt);

  const onDragEnter = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  const findControl = (tempMenu, comp, id) => {
    const ctr = tempMenu.filter(
      (item, itemIndex) => item.comp === comp && item.id === id
    );

    if (ctr) {
      return ctr[0].layout.sort(function (a, b) {
        return a.rowseq < b.rowseq ? -1 : 1;
      });
    }
  };
  const onSelect = (selectedKeys, info) => {
    //find id from key
    let key = "";
    if (selectedKeys.length === 1) key = selectedKeys[0];
    const dt = JSON.parse(localStorage.getItem("subList"));
    const flatData = getFlatDataFromTree({
      treeData: dt,
      getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
      ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
    });
    const rtn1 = _.map(flatData, "node"); //select node from each object
    rtn1.map((v) => {
      console.log(v, key);
      if (v.key === key) {
        const ctr = findControl(tempMenu, "1", v.id);
        dispatch(globalVariable({ control: ctr }));
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

    const data = gData; //[...this.state.gData];

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
    console.log(data);
    localStorage.setItem("subList", JSON.stringify(data));
    setgData(data);

    setTimeout(function () {
      forceUpdate();
    }, 0);
    // this.setState({
    //   gData: data,
    // });
  };
  const loop = (data) => {
    console.log(data, JSON.parse(localStorage.getItem("subList")));
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.key} title={item.title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} />;
    });
  };

  return (
    <Tree
      className="draggable-tree"
      defaultExpandedKeys={expandedKeys}
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
    >
      {/* {loop(gData)} */}
      {loop(JSON.parse(localStorage.getItem("subList")))}
    </Tree>
  );
};
