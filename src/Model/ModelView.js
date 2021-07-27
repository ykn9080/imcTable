import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { currentsetting } from "config/index.js";
import _ from "lodash";
import axios from "axios";
import querySearch from "stringquery";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import { Typography, Modal } from "antd";
import Description from "components/SKD/Description";
import ModelViewLayout from "Model/ModelViewLayout";
import ListGen from "components/SKD/ListGen";
import Dt from "./block.json";

const { Title } = Typography;

const ModelView = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [summary, setSummary] = useState();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  let tempModel = useSelector((state) => state.global.tempModel);

  let query = querySearch(location.search);
  let linkname, nodename, linktype;

  useEffect(() => {
    dispatch(globalVariable({ display: "list" })); //modellist compact
    if (!tempModel) {
      dispatch(globalVariable({ tempModel: location.state }));
      //dispatch(globalVariable({ tempModel: Dt }));
    }
    if (tempModel) {
      let linknode = tempModel?.properties?.linknode;
      if (linknode) {
        if (linknode.name) linkname = linknode.name.join(",");
        if (linknode.nodesetname) nodename = linknode.nodesetname.join(",");
        linktype = linknode.type;
      }
      let summary1 = {
        title: tempModel.title,
        description: tempModel.desc,
        type: tempModel.type,
        data: "[" + linktype + "] " + linkname,
        nodeset: nodename,
        apiurl: tempModel.properties?.apiurl,
        // parameter: tempModel.properties.modelscript,
      };
      // if(d1.dtorigin)
      // summary1={...summary1, size: d1.dtorigin.length}
      setSummary(summary1);
    }
  }, [tempModel]);
  const edit = () => {
    //dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: query._id }));
    history.push(`/model/edit`);

    dispatch(globalVariable({ currentStep: 4 }));
    //dispatch(globalVariable({ currentData: null }));
    // dispatch(globalVariable({ tempData: null }));
    // dispatch(globalVariable({ tempModel: null }));
  };
  const setting = () => {
    //dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: query._id }));
    history.push(`/model/setting`);
  };
  //model setup summary
  //parameter
  const btnArr = [
    // {
    //   tooltip: "Back to List",
    //   awesome: "level-up-alt",
    //   fontSize: "small",
    //   color: "inherit",
    //   onClick: () => history.push("./model"),
    // },
    {
      tooltip: "List",
      awesome: "list-alt",
      fontSize: "small",
      color: "inherit",

      onClick: () => setVisible(true), //history.push("./model/list"),
    },
    {
      tooltip: "Edit",
      awesome: "pencil-alt",
      fontSize: "small",
      color: "inherit",
      onClick: edit,
    },
    {
      tooltip: "Setting",
      awesome: "cog",
      fontSize: "small",
      color: "inherit",
      onClick: setting,
    },
  ];

  const handleOk = () => {
    setConfirmLoading(true);
    setVisible(false);
    // if (selectChart) {
    //   let newtempModel = { ...tempModel };
    //   let odr = newtempModel.properties.resultsAuthor;
    //   let filtered = _.filter(odr, { checked: true });
    //   let currArr = pick(filtered, "id");
    //   let removelist = [],
    //     addedlist = [];
    //   currArr.map((k, i) => {
    //     if (selectChart.indexOf(k) === -1) removelist.push(k);
    //     return null;
    //   });
    //   selectChart.map((k, i) => {
    //     if (currArr.indexOf(k) === -1) addedlist.push(k);
    //     return null;
    //   });
    //   addItem(addedlist);
    //   removeItem(removelist);
    //   dispatch(globalVariable({ tempModel: newtempModel }));
    //   //편법!!, force reload by go back and forth
    //   dispatch(globalVariable({ currentStep: currentStep - 1 }));
    //   dispatch(globalVariable({ nextStep: currentStep }));
    // }
    setConfirmLoading(false);
  };
  const dataformat = ["_id", "data", "title", "desc", "type"];
  const selectHandler = (item) => {
    console.log("selected123", item, item.id);
    dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    axios
      .get(`${currentsetting.webserviceprefix}model/${item._id}`)
      .then((response) => {
        dispatch(globalVariable({ tempModel: response.data }));
      });
    history.push(`/model/view?_id=${item._id}`);
    setVisible(false);
  };
  return (
    <>
      {!props.blank && (
        <>
          <DenseAppBar
            title={"Dashboard"}
            right={<IconArray1 btnArr={btnArr} />}
          ></DenseAppBar>
          <div
            style={{
              paddingLeft: 10,
              paddingTop: 5,
            }}
          >
            <AntBreadCrumb />
          </div>
        </>
      )}
      {tempModel ? (
        <div>
          <div
            style={{
              padding: 15,
              border: "1px solid #d8d4d4",
              borderRadius: 5,
              margin: "10px 10px 0 10px",
              backgroundColor: "white",
            }}
          >
            <Title level={3}>{tempModel.title}</Title>
            {summary && <Description data={summary} />}
          </div>
          <ModelViewLayout data={tempModel} errorurl={props.errorurl} />
        </div>
      ) : null}
      <Modal
        title="Title"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <>
          <ListGen
            url="model"
            notitle={true}
            nodelete
            noedit
            selectHandler={selectHandler}
            dataformat={["_id", "data", "title", "desc", "type"]}
          />
        </>
      </Modal>
    </>
  );
};

export default ModelView;
