import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import _ from "lodash";
import { globalVariable } from "actions";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import AntFormDisplay from "Form/AntFormDisplay";
import CardFullscreenWrapper from "components/Common/CardFullscreenWrapper";
import CardAnt from "components/Common/CardAnt";
import { Button, Row, Col, Typography, Select, Modal, Checkbox } from "antd";
import DataBundleClick from "Data/DataManipulation/DataBundleClick";
import IconArray1 from "components/SKD/IconArray1";
import AuthorChart from "./AuthorChart";
import AuthorGraph from "./AuthorGraph";
import AuthorTable from "./AuthorTable";
import AuthorHtml from "./AuthorHtml";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import querySearch from "stringquery";
import ReactJson from "react-json-view";
import { JsonToTable } from "react-json-to-table";
import { sweetmsgconfirm } from "fromImc/Common_make";

const { Option } = Select;
const { Text, Title } = Typography;

const ModelGraph = (props) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  let query = querySearch(location.search);

  let dataResults, authorlist;
  let projectbundle = useSelector((state) => state.global.projectbundle);
  let tempModel = useSelector((state) => state.global.tempModel);

  if (!tempModel) history.push("/model");
  //if (tempModel?.properties?.results[query.name]) {
  //dataResults = tempModel.properties.results[query.name]; //blockdensity object
  else {
    dataResults = tempModel?.properties?.source; //blockdensity object
    tempModel.properties["resultsAuthor"] =
      tempModel.properties["resultsAuthor"] || [];
    // authorlist = _.filter(tempModel.properties["resultsAuthor"], {
    //   results: query.name,
    // });
    authorlist = tempModel.properties["resultsAuthor"];
    // if (tempModel.properties["resultsAuthor"].length === 0)
    //   dispatch(globalVariable({ tempModel }));
    //console.log(JSON.parse(JSON.stringify(authorlist[1].setting.options)));
  }
  const [type, setType] = useState();
  const [showType, setShowType] = useState("list");
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showJson, setShowJson] = useState(true);
  const [node, setNode] = useState([]); //edgelist name
  const [results, setResults] = useState(dataResults); //propertiest.results["blockdensity"]
  const [authArr, setAuthArr] = useState(); //authoring array
  const [authObj, setAuthObj] = useState(); //results.edgelist
  const [jsonTable, setJsonTable] = useState();
  const [initialValues, setInitialValues] = useState();
  const [nodeChecked, setNodeChecked] = useState();
  const [linknode_id, setLinknode_id] = useState();
  const [linkclick, setLinkclick] = useState(false); //checkbox for selecting chart/table/graph show in layout

  if (authArr && authorlist.length !== authArr.length) {
    setAuthArr(JSON.parse(JSON.stringify(authorlist)));
  }
  const onValuesChange = (changedValues, allValues) => {
    setType(changedValues.type);
    let obj = { ...authObj, type: changedValues.type };

    setAuthObj(obj);
    setShowJson(false);
  };
  const editItem = (json) => {
    let nodelist = results[json.node];

    json.nodelist = nodelist;

    setInitialValues({ type: json.type });
    setAuthObj(json);
    setType(json.type);
    setShow(!show);
    setShowList(!showList);
    setShowType("");
  };
  const AuthorList = ({ authArr }) => {
    const editItemHandler = (id) => {
      let json = _.find(authArr, { id });
      editItem(json);
    };
    const onCheckChange = (e) => {
      let nodechk1 = { ...nodeChecked };
      if (!nodechk1) nodechk1 = {};
      let nodechk = { ...nodechk1, [e.target.id]: e.target.checked };

      let author = tempModel.properties.resultsAuthor;
      //search already checked items
      let checkedlist = _.filter(author, { checked: true });
      _.sortBy(checkedlist, "i");
      checkedlist.map((k, i) => {
        return (k.i = i);
      });
      const num = checkedlist.length;
      let addnew = {
        x: (num % 2) * 6,
        y: parseInt(num / 2) * 6,
        w: 6,
        h: 6,
        i: num.toString(),
      };
      //x,y,w,h,i: w:6(half), h:6, x:(num%2*6), y:(parseInt(num/2)*6, i:num(sort and assiang index each)
      author.map((k, i) => {
        if (k.id === e.target.id) {
          k = { ...k, checked: e.target.checked, ...addnew };
          return author.splice(i, 1, k);
        }
        return null;
      });

      setNodeChecked(nodechk);
      dispatch(globalVariable({ tempModel }));
    };
    const removeItemHandler = (id) => {
      const { confirm } = Modal;
      return new Promise((resolve, reject) => {
        confirm({
          title: "Are you sure you want to Delete ?",
          onOk: () => {
            resolve(true);

            let arr = {};
            arr = authArr;
            _.remove(arr, function (n) {
              return n.id === id;
            });
            setAuthObj(arr);
            _.remove(tempModel.properties["resultsAuthor"], function (n) {
              return n.id === id;
            });
            dispatch(globalVariable({ tempModel }));
          },
          onCancel: () => {
            reject(true);
          },
        });
      });
    };
    let contentlist = [];

    if (authArr) {
      authArr.map((k, i) => {
        if (k.node) k.nodelist = results[k.node];
        return contentlist.push(
          <CardAnt
            editItemHandler={editItemHandler}
            removeItemHandler={removeItemHandler}
            extra={
              <Checkbox
                id={k.id}
                onChange={onCheckChange}
                checked={nodeChecked && nodeChecked[k.id]}
                valuePropName="checked"
              />
            }
            actions={true}
            title={k.setting.title}
            id={k.id}
          >
            {(() => {
              switch (k.type) {
                case "html":
                  return <AuthorHtml authObj={k} />;
                case "table":
                  return <AuthorTable authObj={k} />;

                case "chart":
                  return <AuthorChart authObj={k} />;
                case "graph":
                  return <AuthorGraph authObj={k} />;
                default:
                  return null;
              }
            })()}
          </CardAnt>
        );
      });
    }
    return contentlist.length > 0 ? (
      <CardFullscreenWrapper size={6} content={contentlist} />
    ) : (
      <Button type="dashed" size="large" onClick={handleAddControl}>
        + Add New
      </Button>
    );
  };

  useEffect(() => {
    $(".MuiIconButton-root").css("padding", 0);
    $(".ant-col.ant-col-2").css("text-align", "right");

    setAuthArr(JSON.parse(JSON.stringify(authorlist)));
    let nodechk = {};

    if (authorlist) {
      authorlist.map((k, i) => {
        if (k.checked === true) return (nodechk = { ...nodechk, [k.id]: true });
        return null;
      });
      setNodeChecked(nodechk);
      if (query.id) {
        let json = _.find(authorlist, { id: query.id });

        editItem(json);
      }
    }

    if (results) {
      let nodes = Object.keys(results);
      nodes.unshift("root");
      setNode(nodes);
    }
    if (projectbundle === "") {
      const pro = tempModel.properties;
      if (pro && pro.linknode) {
        const linknode1 = pro.linknode;

        setLinkclick(true);

        setLinknode_id(linknode1._id);
      }
    }
  }, []);

  const handleSave = () => {
    dispatch(globalVariable({ triggerChild: ["save", "list"] }));
    setTimeout(function () {
      history.push("/model/edit");
      // setType("");
      // setShowType("list");
      // setAuthArr([]);
      // setShow(!show);
      // setInitialValues({ type: "" });
      // setJsonTable([]);
    }, 300);
  };
  const handleAddControl = () => {
    if (show) {
      setShowType("list");
    } else {
      setAuthObj({ results: query.name });
      setShowType("addnew");
    }
    setType("");
    setShow(!show);
    setInitialValues({ type: "" });
    setJsonTable([]);
  };

  const goback = [];
  const btnArr = [
    show && {
      tooltip: "Save and Show Authoring List",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      onClick: handleSave,
    },
    // {
    //   tooltip: "Delete",
    //   awesome: "trash-alt",
    //   fontSize: "small",
    //   color: "inherit",
    //   onClick: () => {
    //     const opt = { title: "Delete?" };
    //     sweetmsgconfirm(() => {
    //       tempModel.properties.resultsAuthor.map((k, i) => {
    //         if (k.id === query.id)
    //           return tempModel.properties.resultsAuthor.splice(i, 1);
    //         return null;
    //       });
    //       dispatch(globalVariable({ tempModel }));
    //       history.push("/model/edit");
    //     }, opt);
    //   },
    // },
    {
      tooltip: !show ? "Add Controls" : "Back to List",
      awesome: !show ? "plus" : "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => {
        history.push("/model/author");
      },
    },
    {
      tooltip: "Go to Previous",
      awesome: "times",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "back",
      onClick: () => history.push("/model/edit"),
    },
    // showType === "list"
    //   ? {
    //       tooltip: "Go to Previous",
    //       awesome: "level-up-alt",
    //       fontSize: "small",
    //       color: "inherit",
    //       onClick: () => {
    //         history.push("/model/edit");
    //       },
    //     }
    //   : {},
  ];

  const onSelectNode = (n) => {
    // let au = {};
    // au = authObj;
    // au = au || {};
    // au = { ...au, node: n };

    if (n === "root") {
      setJsonTable(results);
      setAuthObj({ results: query.name, nodelist: results, node: "root" });
    } else {
      setJsonTable(results[n]);
      setAuthObj({ results: query.name, nodelist: results[n], node: n });
    }
  };

  const list = (
    <>
      <Title level={4}>{query.name}</Title>
      <AuthorList authArr={authArr} />
    </>
  );
  const nodeselect = (
    <Select onSelect={onSelectNode} placeholder="Select users">
      {node.map((d) => (
        <Option key={d}>{d}</Option>
      ))}
    </Select>
  );
  const showhidebtn = showJson ? (
    <MinusSquareOutlined onClick={() => setShowJson(!showJson)} />
  ) : (
    <PlusSquareOutlined onClick={() => setShowJson(!showJson)} />
  );
  const addnew = (
    <div
      style={{
        paddingLeft: 25,
        paddingRight: 5,
        marginTop: 20,
      }}
    >
      <Row gutter={10}>
        <Col>
          <Text>Node:{showhidebtn}</Text>
        </Col>
        <Col>{nodeselect}</Col>
        <Col>
          <ReactJson
            src={results}
            theme="summerfruit:inverted"
            enableClipboard={false}
            collapsed={true}
            displayObjectSize={false}
            displayDataTypes={false}
            sortKey={false}
            // shouldCollapse={shouldCollapse}
          />
        </Col>
      </Row>
      <div style={{ marginTop: 10 }}>
        <AntFormDisplay
          formid="5f0e8d8689db1023b0165b18"
          onValuesChange={onValuesChange}
          initialValues={initialValues}
        />
      </div>
      {showJson && (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Row>
            <Col offset={1} span={22}>
              <JsonToTable json={jsonTable} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DenseAppBar
        title={"Object List"}
        //left={<IconArray1 btnArr={goback} />}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 20,
          paddingTop: 5,
          paddingBottom: 10,
        }}
      >
        <AntBreadCrumb />
      </div>
      <div style={{ marginTop: 10, marginLeft: 20 }}>
        {(() => {
          switch (showType) {
            case "addnew":
              return addnew;
            case "list":
              return list;
            default:
              return null;
          }
        })()}

        {(() => {
          let setting = { authObj: authObj, edit: true, title: true };
          switch (type) {
            case "html":
              return <AuthorHtml {...setting} />;
            case "table":
              return <AuthorTable authObj={authObj} edit={true} title={true} />;
            case "chart":
              return <AuthorChart authObj={authObj} edit={true} title={true} />;
            case "graph":
              return <AuthorGraph authObj={authObj} edit={true} title={true} />;

            default:
              return null;
          }
        })()}
        {/* {linkclick && <MakeProjectBundle selectedKey={linknode_id} />} */}
        {linkclick && <DataBundleClick linkid={linknode_id} />}
      </div>
    </>
  );
};

export default ModelGraph;
