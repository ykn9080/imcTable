import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { Button, Tabs } from "antd";
import MTable from "./ModelEdit4_Table";
import MLayout from "./ModelEdit4_Layout";

const { TabPane } = Tabs;

const ModelEdit4 = (props) => {
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);
  let currentStep = useSelector((state) => state.global.currentStep);
  let skey = useSelector((state) => state.global.selectedKey);

  if (skey === "") skey = 1;
  function callback(key) {
    dispatch(globalVariable({ selectedKey: key }));
    dispatch(
      globalVariable({ helpLink: `/model/edit?step=${currentStep}&${key}` })
    );
  }
  useEffect(() => {
    dispatch(globalVariable({ helpLink: `/model/edit?step=${currentStep}` }));
  }, []);
  // useEffect(() => {
  //   //if resultsAuthor don't have nodelist copy from source
  //   dispatch(globalVariable({ tempModel: fillNodelist(tempModel) }));
  // }, []);
  return (
    <>
      <div style={{ marginTop: 10, marginLeft: 5, marginRight: 5, padding: 5 }}>
        <Tabs type="card" defaultActiveKey={skey} onChange={callback}>
          <TabPane tab="Layout" key="1">
            <MLayout />
          </TabPane>
          <TabPane tab="Returned Data" key="2">
            <MTable />
          </TabPane>
        </Tabs>

        <Button onClick={() => console.log(tempModel.properties)}>
          tempModel
        </Button>
      </div>
    </>
  );
};

export default ModelEdit4;
