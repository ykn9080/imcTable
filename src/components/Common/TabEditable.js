import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import { sweetmsgconfirm } from "fromImc/Common_make";
import ButtonNew from "Collections/Buttons";

const { TabPane } = Tabs;

const TabEditable = (props) => {
  //props:panes, newpane,extra,handleAction
  const [panes, setPanes] = useState();
  const [activeKey, setActiveKey] = useState();

  useEffect(() => {
    if (props.panes) {
      setPanes(props.panes);
      if (props.panes.length > 0) {
        setActiveKey(props.panes[0].key);
        // props.onChange(props.panes[0].key);
      }
    }
    if (props.ActiveKey) setActiveKey(props.ActiveKey);
  }, [props.panes]);

  const onChange = (activeKey) => {
    setActiveKey(activeKey);
    props.onChange(activeKey);
  };

  const onEdit = (targetKey, action) => {
    //[action](targetKey);
    console.log(targetKey, action);
    switch (action) {
      case "remove":
        const opt = { title: "Delete?" };
        sweetmsgconfirm(() => remove(targetKey), opt);
        break;
      case "add":
        add();
        break;
      default:
        break;
    }
  };
  // const combineChange = (allVal, from) => {
  //   if (props.combineChange) props.combineChange(allVal, from);
  // };

  const add = () => {
    const maxseq = () => {
      let seq = 0;
      panes.map((k, i) => {
        if (k.seq > seq) seq = k.seq;
        return null;
      });
      return seq;
    };
    const activeKey1 = parseInt(Math.random() * 100000).toString();

    let newPanes = [];
    if (panes) newPanes = [...panes];

    let newpane = {
      title: "New Tab",
      content: "Content of new Tab",
      key: activeKey1,
      seq: maxseq(),
    };
    if (props.newpane) newpane = { ...newpane, content: { ...props.newpane } }; //{title:"",content:""}
    newPanes.push(newpane);
    setPanes(newPanes);
    setActiveKey(activeKey1);
    if (props.add) props.add(activeKey1);
  };

  const remove = (targetKey) => {
    console.log(targetKey);
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);

    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
    if (props.remove) props.remove(targetKey, newPanes, newActiveKey);
  };
  let extra = "";
  if (props.extra) extra = props.extra;

  return (
    <>
      <Tabs
        type="editable-card"
        tabBarExtraContent={extra}
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
      >
        {panes &&
          panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {pane.content}
            </TabPane>
          ))}
      </Tabs>
      {panes && panes.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <ButtonNew onClick={add} />
        </div>
      )}
    </>
  );
};

export default TabEditable;
