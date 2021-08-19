import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import $ from "jquery";
import { currentsetting } from "config/index.js";
import { globalVariable } from "actions";
import { Row, Col, message, Button } from "antd";
import TreeAnt from "components/Common/TreeAnt";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import { sweetmsgconfirm } from "fromImc/Common_make";
import ViewHead, { ViewTail } from "./view";

export const helpSet = (qry) => {
  //example code
  //const his=HelpSet({query:"home",tag:"new"})
  //history.push(his)

  const his = {
    pathname: "/open/help",
    search: `?query=${qry.query}&tag=${qry.tag}`,
  };
  return his;
};
const Help = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [selcontent, setSelcontent] = useState();
  const [node, setNode] = useState();
  const [initialValues, setInitialValues] = useState();
  const [patchlist, setPatchlist] = useState();
  const [reload, setReload] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newkey, setNewkey] = useState();
  const [selected_id, setSelected_id] = useState();
  let helpcontent = useSelector((state) => state.global.help);
  let helpLink = useSelector((state) => state.global.helpLink);

  useEffect(() => {
    //help menu get from server
    if (!helpcontent | reload) {
      axios.get(`${currentsetting.webserviceprefix}help`).then((res) => {
        dispatch(globalVariable({ help: res.data }));
        dispatch(globalVariable({ treeData: res.data }));
        locationFind(res.data);
        setReload(false);
        //setSelected_id(null);
      });
    }
  }, [reload]);
  useEffect(() => {
    dispatch(globalVariable({ helpLink: null }));
    if (props.edit) setEdit(props.edit);
    setTimeout(() => {
      $(".ant-tree-treenode").css("padding", 0);
    }, 500);
  }, []);
  useEffect(() => {
    locationFind(helpcontent);
  }, [location.pathname, helpLink]);

  const treeData = [
    {
      title: "parent 1",
      key: "0-0",
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          disabled: true,
          children: [
            {
              title: "leaf",
              key: "0-0-0-0",
              disableCheckbox: true,
            },
            {
              title: "leaf",
              key: "0-0-0-1",
            },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          children: [
            {
              title: <span style={{ color: "#1890ff" }}>sss</span>,
              key: "0-0-1-0",
            },
          ],
        },
      ],
    },
  ];

  const locationFind = (helplist) => {
    // const queryParams = new URLSearchParams(location.search);
    // const qry = queryParams.get("query");
    if (!helpLink) helpLink = location.pathname;
    console.log(helpLink);
    if (!helplist) return;
    const curhelp = _.find(helplist, (o) => {
      let linkarr;
      if (o.link) linkarr = o.link.split(";");
      if (linkarr) return linkarr.indexOf(helpLink) > -1;
    });
    if (curhelp) {
      onSelect(curhelp);
      setSelected_id(curhelp._id);
    }
  };
  let contextItems = [{ label: "New" }, { label: "Edit" }, { label: "Delete" }];
  const contextCallback = (index, node) => {
    if (node && typeof node === "string") node = JSON.parse(node);
    setNode(node);
    contextAction(contextItems[index].label, node);
  };
  const contextAction = (type, node) => {
    let find;

    switch (type) {
      default:
        return null;
      case "New":
        let pid1 = null;
        if (node) pid1 = node._id;
        const add = {
          title: "Newnode",
          pid: pid1,
          content: "",
        };
        setNewkey(pid1);
        helpcontent.push(add);
        dispatch(globalVariable({ help: helpcontent }));
        dispatch(globalVariable({ treeData: helpcontent }));
        setNode(add);
        setInitialValues({
          title: "Newnode",
          desc: "",
          link: "",
          tag: "",
          type: "",
          related: null,
        });
        setSelcontent("");
        break;
      case "Edit":
        find = _.find(helpcontent, (o) => {
          return o._id === node._id;
        });

        if (find) {
          onSelect(find);
        }
        break;
      case "Delete":
        //chk if node has children, if any can't delete
        find = _.filter(helpcontent, (o) => {
          return o.pid === node._id;
        });
        if (find && find.length > 0) {
          //error msg
          message.error("Fail to delete!! Please children first");
        } else {
          const opt = { title: "Delete?" };
          sweetmsgconfirm(() => {
            helpcontent.map((k, i) => {
              if (k._id === node._id) helpcontent.splice(i, 1);
              return null;
            });

            dispatch(globalVariable({ help: helpcontent }));

            if (node._id)
              axios
                .delete(`${currentsetting.webserviceprefix}help/${node._id}`)
                .then((rsp) => {
                  setReload(true);
                });
          }, opt);
        }
        break;
    }
  };
  const onSelect = (val) => {
    const summary = {
      _id: val._id,
      pid: val.pid,
      title: val.title,
      desc: val.desc,
      link: val.link,
      tag: val.tag,
      type: val.type,
      related: val.related,
    };
    setInitialValues(summary);
    if (val.contents) setSelcontent(val.contents);
    setNode(summary);
  };
  const onSummaryChange = (changedValues, allValues) => {
    localStorage.removeItem("persist.root");
    localStorage.setItem("helpsummray", JSON.stringify(allValues));
  };
  const onSave = (contents) => {
    let val1 = {},
      val2;
    let local = localStorage.getItem("helpsummray");
    if (local) {
      local = JSON.parse(local);
      val1 = {
        title: local.title,
        desc: local.desc,
        link: local.link,
        tag: local.tag,
        type: local.type,
        related: local.related,
        contents: contents,
      };
    }
    val2 = { ...node, contents: contents, ...val1 };

    let config = {
      method: "post",
      url: `${currentsetting.webserviceprefix}help`,
      data: { ...val2, pid: node.pid },
    };
    if (node._id) {
      config.method = "put";
      config.url += "/" + node._id;
    }

    axios(config).then((r) => {
      message.info("File Saved");
      helpcontent.map((k, i) => {
        if (k._id === node._id) helpcontent.splice(i, 1, config.data);
        return null;
      });
      dispatch(globalVariable({ help: helpcontent }));
      setReload(true);
    });
    localStorage.removeItem("helpsummray");
  };
  const onDrop = (dropobj) => {
    if (!dropobj) return;
    let config = {
      method: "put",
      url: `${currentsetting.webserviceprefix}help/${dropobj._id}`,
      data: dropobj,
    };

    axios(config).then((r) => {
      message.info("File Updated");
      setReload(true);
    });
  };
  let setting = {};
  if (edit === true) {
    setting = {
      contextItems: contextItems,
      contextCallback: contextCallback,
    };
  }
  return (
    <div style={{ marginTop: 10, width: "97%" }}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={5}>
          {helpcontent && (
            <>
              <TreeAnt
                treeData={helpcontent}
                treedatatype="flat"
                treeProps={{
                  root: null,
                }}
                onSelect={onSelect}
                search={true}
                newkey={newkey}
                selected_id={selected_id}
                edit={edit}
                onDrop={onDrop}
                {...setting}
              />
            </>
          )}
        </Col>
        <Col span={19}>
          <div style={{ marginRight: 5, marginBottom: 20 }}>
            {edit ? (
              <>
                <div
                  style={{
                    border: "solid #E5E5E5 1px",
                    marginBottom: "5px",
                    padding: "10px 5px 0 0",
                  }}
                >
                  <AntFormDisplay
                    formArray={formdt["5f7180353f15603130abe066"]}
                    onValuesChange={onSummaryChange}
                    patchlist={patchlist}
                    initialValues={initialValues}
                  />
                </div>
              </>
            ) : (
              <ViewHead initialValues={initialValues} />
            )}
            {/* <ToastEditor
              previewStyle="vertical"
              height="100%"
              // edit={edit}
              //initialEditType={edittype}
              //initialValue={contents}
              edit={edit}
              selcontent={selcontent}
              onSave={onSave}
            /> */}
            {!edit && <ViewTail initialValues={initialValues} />}
          </div>
        </Col>
      </Row>
      <Button
        onClick={() => {
          console.log(helpcontent, treeData, selcontent);
        }}
      >
        helpcontent,treedata
      </Button>
    </div>
  );
};
export default Help;
