import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import querySearch from "stringquery";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import { Typography } from "antd";
import Description from "components/SKD/Description";
import ModelViewLayout from "Model/ModelViewLayout";
import Dt from "./block.json";
const { Title } = Typography;

const ModelView = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [summary, setSummary] = useState();
  let tempModel = useSelector((state) => state.global.tempModel);

  console.log(Dt);
  let query = querySearch(location.search);
  let linkname, nodename, linktype;
  useEffect(() => {
    if (!tempModel) {
      //dispatch(globalVariable({ tempModel: location.state }));
      dispatch(globalVariable({ tempModel: Dt }));
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
  //model setup summary
  //parameter
  const btnArr = [
    {
      tooltip: "Back to List",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => history.push("./model"),
    },
    {
      tooltip: "Edit",
      awesome: "pencil-alt",
      fontSize: "small",
      color: "inherit",
      onClick: edit,
    },
  ];
  return (
    <>
      {!props.blank && (
        <>
          <DenseAppBar
            title={"Model View"}
            right={<IconArray1 btnArr={btnArr} />}
          ></DenseAppBar>
          <div
            style={{
              paddingLeft: 25,
              paddingTop: 5,
              paddingBottom: 12,
              backgroundColor: "#F7F7F7",
            }}
          >
            <div style={{ paddingLeft: 0, paddingBottom: 20 }}>
              <AntBreadCrumb />
            </div>
          </div>
        </>
      )}
      {tempModel ? (
        <div style={{ margin: 5 }}>
          <Title level={3}>{tempModel.title}</Title>
          <div
            style={{
              padding: 5,
              border: "1px solid #d8d4d4",
              marginBottom: 10,
            }}
          >
            {summary && <Description data={summary} />}
          </div>
          <ModelViewLayout data={tempModel} errorurl={props.errorurl} />
        </div>
      ) : null}
    </>
  );
};

export default ModelView;
