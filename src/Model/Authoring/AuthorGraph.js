import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import "components/Common/Antd.css";
import { globalVariable } from "actions";
import {
  Typography,
  Row,
  Col,
  Button,
  Tooltip,
  Tabs,
  Input,
  Popover,
} from "antd";
import { makeStyles } from "@material-ui/core/styles";
import AntFormDisplay from "Form/AntFormDisplay";
import { idMake } from "components/functions/dataUtil";
import VisGraph from "components/Graph/visnetwork/VisGraph";
import { FiRefreshCw } from "react-icons/fi";
import {
  pickAndRename2,
  loopCommaToObject,
} from "components/functions/dataUtil";
import Goptions from "./AuthorGraphOptions";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const AuthorGraph = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [setting, setSetting] = useState({});
  const [initGraph, setInitGraph] = useState();
  //nodes and edges
  const [initNodes, setInitNodes] = useState();
  const [initEdges, setInitEdges] = useState();
  const [nodesText, setNodesText] = useState("");
  const [edgesText, setEdgesText] = useState("");
  const [patchedges, setPatchedges] = useState();
  const [patchnodes, setPatchnodes] = useState();
  const [gdataset, setGdataset] = useState();
  //option
  const [optionsJson, setOptionsJson] = useState();
  const [optionsComma, setOptionsComma] = useState();

  //test
  const [initTest, setInitTest] = useState();

  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  const makeGdata = (nd) => {
    //nd: nodes or edges setting
    if (!nd) return false;
    const obj = _.find(tempModel.properties.source, (o) => {
      return o.key === nd.data;
    });
    if (!obj) return false;
    let dt = [];

    if (obj.dtlist) dt = [...obj.dtlist];
    let newdt = pickAndRename2(dt, nd);

    return newdt;
  };

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "model/edit/graph?type=graph" }));
    let nodeslist, edgeslist;
    makePatch();
    if (authObj) {
      setData(authObj);
      let ds = authObj.setting;
      if (ds) {
        setInitGraph(ds);
        setSetting(ds);
        if (ds.nodes) {
          makePatch("nodesStyle", ds.nodes.data);
          setInitNodes(ds.nodes);

          localStorage.setItem("nodes", JSON.stringify(ds.nodes));
          nodeslist = makeGdata(ds.nodes);
          setNodesText(JSON.stringify(nodeslist));
        }
        if (ds.edges) {
          makePatch("edgesStyle", ds.edges.data);
          setInitEdges(ds.edges);
          localStorage.setItem("edges", JSON.stringify(ds.edges));
          edgeslist = makeGdata(ds.edges);
          setEdgesText(JSON.stringify(edgeslist));
        }
        if (ds.options) {
          let optComma = ds.options;
          if (typeof ds.options === "string") optComma = JSON.parse(ds.options);

          //setOptionsText(JSON.stringify(optJson, undefined, 2));

          //simple, script
          // const dsv = objectToComma(optJson);
          // const dsv = optJson;
          // const objagain = loopCommaToObject(dsv);
          setOptionsComma(optComma);
          setOptionsJson(loopCommaToObject(optComma));
          // updateOptionsInit(dsv);
          // setInitOptionsScript({
          //   script: JSON.stringify(objagain, undefined, 2),
          // });
        }
        if (nodeslist && edgeslist) {
          setGdataset({ nodes: nodeslist, edges: edgeslist });
        }
      }
    }
  }, []);
  //make link and node
  //add node group(clustered)
  //groupby node attribute-> add node value(sum), groupby link and add value(sum/avg)

  const makePatch = (type, datakey) => {
    let child = [],
      plist = [],
      src = [],
      dtlist,
      dtvalarr = [];
    if (tempModel && tempModel.properties && tempModel.properties.source)
      src = tempModel.properties.source;
    dtlist = _.find(src, (o) => {
      return o.key === datakey;
    });
    if (dtlist) {
      dtlist = dtlist.dtlist;
      if (dtlist && dtlist.length > 0) {
        Object.keys(dtlist[0]).map((k) => {
          dtvalarr.push({ text: k, value: k });
          return null;
        });
        dtvalarr.unshift({ text: "n/a", value: "" });
      }
    }
    src.map((k, i) => {
      child.push({ text: k.title, value: k.key });
      return null;
    });
    plist.push({ name: "data", optionArray: child });
    switch (type) {
      default:
        setPatchnodes(plist);
        setPatchedges(plist);
        break;
      case "nodesStyle":
        plist.push({ name: "data", optionArray: child });
        ["id", "label", "value", "group", "color", "size", "shape"].map((k) => {
          plist.push({ name: k, optionArray: dtvalarr });
          return null;
        });
        setPatchnodes(plist);
        setInitNodes({ data: datakey, id: "key", label: "@LABEL" });
        break;
      case "edgesStyle":
        [
          "from",
          "to",
          "value",
          "tickness",
          "color",
          "head",
          "line",
          "directed",
        ].map((k) => {
          plist.push({ name: k, optionArray: dtvalarr });
          return null;
        });

        setPatchedges(plist);
        setInitEdges({ data: datakey, from: "src", to: "tgt", value: "wgt" });
        break;
      case "graphoptions":
        //setPatchoptions(plist);
        break;
    }
  };
  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;
    const parseItem = (name) => {
      let item = localStorage.getItem(name);
      if (item) {
        item = JSON.parse(item);
        Object.keys(item).map((k, i) => {
          if ((item[k] === "undefined") | (item[k] === "")) delete item[k];
          return null;
        });
      } else item = null;
      localStorage.removeItem(name);
      return item;
    };
    let summary = parseItem("graphsummary");
    let nodes = parseItem("nodes");
    let edges = parseItem("edges");
    let set = {};
    set = setting;
    if (summary) set = { ...set, ...summary };
    if (nodes) set = { ...set, nodes };
    if (edges) set = { ...set, edges };

    set = { ...set, options: optionsComma };
    setSetting(set);

    const nodeslist = makeGdata(nodes);
    const edgeslist = makeGdata(edges);
    setGdataset({ nodes: nodeslist, edges: edgeslist });
    if (trigger.length > 0 && trigger[0] === "save") {
      let datanew = {};
      if (data) datanew = data;
      if (!datanew.id) {
        const id = idMake();
        datanew = { ...datanew, id: id, key: id, type: "graph" };
      }
      datanew = {
        ...datanew,
        setting: set,
      };
      delete datanew.nodelist;
      let notexist = true;
      authorlist.map((k, i) => {
        if (k.id === datanew.id) {
          authorlist.splice(i, 1, datanew);
          notexist = false;
        }
        return null;
      });
      if (notexist) authorlist.push(datanew);
      tempModel.properties.resultsAuthor = authorlist;
      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ triggerChild: [] }));
    }
  };
  if (trigger.length > 0 && trigger[0] === "save") saveTemp(trigger);

  const onValuesChangeNodes = (changedValues, allValues) => {
    localStorage.setItem("nodes", JSON.stringify(allValues));
    if (changedValues.data) {
      makePatch("nodesStyle", changedValues.data);
    }
  };
  const onValuesChangeEdges = (changedValues, allValues) => {
    localStorage.setItem("edges", JSON.stringify(allValues));
    if (changedValues.data) {
      makePatch("edgesStyle", changedValues.data);
    }
  };

  const onFinishSummary = (val) => {
    let newsetting = { ...setting, ...val };
    setSetting(newsetting);
  };
  const onFinishNodes = (val) => {
    const nodeslist = makeGdata(val);
    let gset = { ...gdataset, nodes: nodeslist };
    setGdataset(gset);
    setNodesText(JSON.stringify(nodeslist));
  };
  const onFinishEdges = (val) => {
    const edgeslist = makeGdata(val);
    let gset = { ...gdataset, edges: edgeslist };
    setGdataset(gset);
    setEdgesText(JSON.stringify(edgeslist));
  };

  const onFinishTest = () => {
    const dt = JSON.parse(initTest);
    let gset = { ...dt };
    delete gset.options;
    setGdataset(gset);
    setOptionsJson(dt.options);
  };
  const onChangeTest = ({ target: { value } }) => {
    setInitTest(value);
  };
  let titlestyle = { marginTop: 10, marginLeft: 20, marginBottom: 10 };
  const tabChange = (key) => {
    console.log(key);
  };

  const content = (
    <div>
      <Title level={5}> Nodes:</Title>
      <p>{nodesText}</p>
      <Title level={5}>Edges:</Title>
      <p>{edgesText}</p>
      <Title level={5}>Options:</Title>
      <p>{JSON.stringify(optionsJson, null, 4)}</p>
    </div>
  );

  const tabRightButton = (
    <div>
      <Popover
        placement="bottomLeft"
        title={"Code"}
        content={content}
        trigger="click"
      >
        <Button>Code</Button>
      </Popover>
    </div>
  );

  const onFinishOptions = (objComma) => {
    setOptionsComma(objComma);
    setOptionsJson(loopCommaToObject(objComma));
  };

  return (
    <>
      {setting && title && (
        <div style={title && titlestyle}>
          <Title level={4}>{setting.title}</Title>
          <Text>{setting.desc}</Text>
        </div>
      )}
      <Row gutter={4}>
        <Col span={edit ? 14 : 24}>
          <VisGraph options={optionsJson} data={gdataset} />
        </Col>
        {edit && (
          <Col span={10}>
            <Tabs
              onChange={tabChange}
              type="card"
              tabBarExtraContent={tabRightButton}
            >
              <TabPane tab="Summary" key="1">
                <div style={{ textAlign: "right", marginTop: 10 }}>
                  <Tooltip title="Test run">
                    <Button onClick={saveTemp} icon={<FiRefreshCw />} />
                  </Tooltip>
                </div>
                <div style={{ marginTop: 2, marginRight: 5 }}>
                  <AntFormDisplay
                    formid="5f27f3e012d3bf701818e585"
                    onFinish={onFinishSummary}
                    initialValues={initGraph}
                  />
                </div>
              </TabPane>
              <TabPane tab="Nodes" key="2">
                <div style={{ marginTop: 2, marginRight: 5 }}>
                  <AntFormDisplay
                    formid="5f61aa619b954d3dd4877559"
                    onValuesChange={onValuesChangeNodes}
                    onFinish={onFinishNodes}
                    patchlist={patchnodes}
                    initialValues={initNodes}
                  />
                  <div className={"dvNodes"} style={{ display: "none" }}>
                    <TextArea
                      autoSize={{ minRows: 5, maxRows: 155 }}
                      value={nodesText}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Edges" key="3">
                <div style={{ marginTop: 2, marginRight: 5 }}>
                  <AntFormDisplay
                    formid="5f61ae469b954d3dd487755c"
                    onValuesChange={onValuesChangeEdges}
                    onFinish={onFinishEdges}
                    patchlist={patchedges}
                    initialValues={initEdges}
                  />
                  <Button
                    onClick={() => {
                      makeGdata();
                    }}
                  >
                    makegdata
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="Options" key="4">
                <div style={{ marginTop: 2, marginRight: 5 }}>
                  <Goptions
                    authObj={authObj}
                    onFinishOptions={onFinishOptions}
                  />
                </div>
              </TabPane>
              <TabPane tab="Test" key="5">
                <div style={{ marginTop: 2, marginRight: 5 }}>
                  <TextArea
                    autoSize={{ minRows: 5, maxRows: 15 }}
                    onChange={onChangeTest}
                    value={initTest}
                  />
                  <div style={{ marginTop: 5 }}>
                    <Row justify="end">
                      <Col>
                        <Button
                          onClick={() => {
                            let test = {
                              nodes: JSON.parse(nodesText),
                              edges: JSON.parse(edgesText),
                              options: optionsJson,
                            };

                            setInitTest(JSON.stringify(test, null, 4));
                          }}
                        >
                          Copy Code
                        </Button>
                        <Button onClick={onFinishTest}>Run</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Col>
        )}
      </Row>
      <Button
        onClick={() => {
          console.log(optionsJson);
        }}
      >
        OptionsJson
      </Button>
    </>
  );
};

export default AuthorGraph;
