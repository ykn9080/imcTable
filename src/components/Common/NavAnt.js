import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const NavAnt = (props) => {
  let tab = [
    { title: "1st", content: "1st contetnt" },
    { title: "2nd", content: "2nd contetnt" },
  ];
  if (props.tab) tab = props.tab;
  function callback(key) {
    console.log(key);
  }
  return (
    <Tabs tabPosition={"top"} onChange={callback}>
      {tab.map((k, i) => {
        return (
          <TabPane tab={k.title} key={i}>
            {k.content}
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default NavAnt;
