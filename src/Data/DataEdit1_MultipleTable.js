import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import TabEditable from "components/Common/TabEditable";
import PaneEdit from "Data/DataEdit1_PaneEdit";
import "components/Common/Antd.css";
import { globalVariable } from "actions";

const MultipleTable = (props) => {
  const dispatch = useDispatch();
  let tempData = useSelector((state) => state.global.tempData);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);
  const [paness, setPaness] = useState();
  const [activeKey, setActiveKey] = useState();
  useEffect(() => {
    setTimeout(() => {
      if (props.tempData1) {
        const pn = makePanes(props.tempData1);
        setPaness(pn);
        let kk;
        if (selectedKey1) {
          kk = selectedKey1;
        } else if (pn.length > 0) {
          kk = pn[0].key;
        }
        setActiveKey(kk);
        dispatch(globalVariable({ selectedKey1: kk }));
      }
    }, 100);
  }, []);
  useEffect(() => {
    setPaness(makePanes());
  }, [tempData]);

  const makePanes = (fromParent) => {
    if (fromParent) tempData = fromParent;
    let rtn = [];
    if (tempData?.source) {
      tempData.source.map((k) => {
        rtn.push({
          title: k.title,
          content: <PaneEdit curobj={k} curdatalist={props.curdatalist} />,
          key: k.key,
          seq: k.seq,
        });
        return null;
      });
      _.sortBy(rtn, ["seq"]);
    }
    return rtn;
  };

  const add = (activeKey1) => {
    // setPaness(panelist);
    setActiveKey(activeKey);
    dispatch(globalVariable({ selectedKey1: activeKey1 }));
    dispatch(globalVariable({ subStep: 0 }));
  };
  const remove = (targetKey, panelist, activeKey1) => {
    _.remove(tempData.source, function (n) {
      return n.key === targetKey;
    });

    dispatch(globalVariable({ tempData }));
    dispatch(globalVariable({ selectedKey1: activeKey1 }));
    setActiveKey(activeKey);
  };
  const onChange = (activeKey1) => {
    setActiveKey(activeKey);
    dispatch(globalVariable({ subStep: 0 }));
    dispatch(globalVariable({ selectedKey1: activeKey1 }));
  };
  return (
    <>
      <div style={{ padding: 5 }}>
        <TabEditable
          panes={paness}
          newpane={<PaneEdit curdatalist={props.curdatalist} />}
          //combineChange={combineChange}
          ActiveKey={selectedKey1}
          onChange={onChange}
          add={add}
          remove={remove}
        />
      </div>

      {/* <Button
        onClick={() => {
          console.log(tempData, leftChild, rightChild, selectedKey1);
        }}
      >
        tempData
      </Button> */}
    </>
  );
};
export default MultipleTable;
