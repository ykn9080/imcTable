import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const TabAnt = (props) => {
  let mode = "top"; //"left"
  if (props.mode) mode = props.mode;
  function callback(key) {
    console.log(key);
  }
  return (
    <Tabs
      defaultActiveKey="0"
      onChange={callback}
      tabPosition={mode}
      style={{ height: 350 }}
    >
      {props.tabArray.map((k, i) => {
        let setting = {};
        if (k.disabled) setting = { disabled: true };
        return (
          <TabPane tab={`${k.title}`} key={k.title + i} {...setting}>
            {k.content}
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default TabAnt;
