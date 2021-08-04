import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import $ from "jquery";
import "components/Common/Antd.css";
import axios from "axios";
import { globalVariable } from "actions";
import { currentsetting } from "components/functions/config";
import {
  Typography,
  Row,
  Col,
  Tabs,
  Divider,
  Table,
  Button,
  Input,
  Form,
  Collapse,
} from "antd";
import AntFormDisplay from "Form/AntFormDisplay";
import Dataget from "Model/Author/Dataget";
import PieChart from "Model/Chart/antv/PieChart";
import BarChart from "Model/Chart/antv/BarChart";
import LineChart from "Model/Chart/antv/LineChart";
import ColumnChart from "Model/Chart/antv/ColumnChart";
import BoxPlot from "Model/Chart/antv/BoxPlot";
import ScatterPlot from "Model/Chart/antv/ScatterPlot";
import MatrixDiagram from "Model/Chart/antv/MatrixDiagram";
import ParallelCoordinatesChart from "Model/Chart/@nivo/nivoParallel";
import { pcData } from "Model/Chart/@nivo/parallelData";
import AreaChart from "Model/Chart/antv/AreaChart";
import Dendrogram from "Model/Chart/react-tree/Dendrogram";
import Treemap from "Model/Chart/d3/Treemap";
import treemapdata from "Model/Chart/d3/treemapData";
import ChartOption from "Model/Author/AuthorOption";

var randomColor = require("randomcolor");

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AuthorChart = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [data, setData] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState();
  const [formlist, setFormlist] = useState();
  const [initChart, setInitChart] = useState();
  const [chartData, setChartData] = useState([]);
  const [config, setConfig] = useState();
  const [chartOpt, setChartOpt] = useState("");
  const [labelName, setLabelName] = useState();
  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  const makeOptionArray = (obj) => {
    let oparr = [{ value: null, text: "N/A" }];

    Object.keys(obj).map((k, i) => {
      oparr.push({ value: k, text: k.charAt(0).toUpperCase() + k.slice(1) });
      return null;
    });
    //formid axios.get
    let url = `${currentsetting.webserviceprefix}bootform/5f1a590712d3bf549d18e583`;

    axios.get(url).then((rsp) => {
      let flist = [];
      let noDataOption = _.filter(rsp.data.data.list, (o) => {
        return (
          (o.type.indexOf("select") > -1) |
            (o.type.indexOf("checkbox") > -1) |
            (o.type.indexOf("radio") > -1) && !o.optionArray
        );
      });
      noDataOption.map((k) => {
        flist.push({ name: k.name, optionArray: oparr });
        return null;
      });
      setFormlist(flist);
    });
  };
  const aggre = () => {
    if (!setting1) return false;
    let listx = [],
      xlist = [],
      ylist = [],
      x = setting1.xaxis,
      y = setting1.yaxis,
      val = setting1.value;

    //x uniq list
    nodelist.map((dt) => xlist.push(_.pick(dt, x)[x]));
    nodelist.map((dt) => ylist.push(_.pick(dt, y)[y]));
    xlist = _.uniq(xlist);
    ylist = _.uniq(ylist);
    if (setting1.aggregate && setting1.aggregate !== "n/a")
      xlist.map((k, i) => {
        const listbyx = _.filter(nodelist, (o) => {
          return o[x] === k;
        });
        let obj = { [x]: k };

        val.map((v, i) => {
          let sum = _.sumBy(listbyx, v);
          //if (typeof sum !== "int") sum = sum.toFixed(2);
          let avg = _.meanBy(listbyx, v).toFixed(2);
          let count = listbyx.length;

          switch (setting1.aggregate) {
            case "sum":
              obj[v] = sum;
              break;
            case "average":
              obj[v] = avg; //parseFloat(sum / count);
              break;
            case "count":
              obj[v] = count;
              break;
            default:
              break;
          }
          return null;
        });
        listx.push(obj);
        return null;
      });
    else listx = setting1.result;
    setFilterlist(listx);
    //setNodelist(listx);

    chartchart(setting1, listx);
  };
  useEffect(() => {
    dispatch(globalVariable({ helpLink: "/edit/graph?type=chart" }));
    localStorage.removeItem("modelchart");
  }, []);
  useEffect(() => {
    if (authObj) {
      setData(authObj);
      if (authObj.dtlist) {
        setNodelist(authObj.dtlist);
        aggre();
        // if (setting1 && setting1.value && setting1.aggregate) aggre();
        // else setFilterlist(authObj.dtlist);
        if (authObj.dtlist.length > 0) makeOptionArray(authObj.dtlist[0]);
      }
      if (authObj.setting) {
        const ds = authObj.setting;
        setSetting1(ds);
        setInitChart(ds);
        setFormlist(ds.patchlist);
        let src = {};
        if (ds.initVal) src.initVal = ds.initVal;
        if (ds.result) {
          src.result = orderByX(ds.result, ds.xField);
        }
        setDtsrc(src);
        if (ds.options) {
          const optt = JSON.stringify(ds.options, null, 4);
          setChartOpt(optt);
          form.setFieldsValue({
            textarea: optt,
          });
        }
      } else {
        setInitChart({});
      }
      if (authObj.dtsrc) setDtsrc(authObj.dtsrc);
    }
    //if (setting1 && setting1.value && setting1.charttype) chartchart(setting1);
    // setTimeout(() => {
    //   $(".ant-row.ant-form-item").css("margin-bottom", 1);
    // }, 500);
  }, [authObj]);
  const orderByX = (data, xfield) => {
    return _.sortBy(data, xfield);
  };
  useEffect(() => {
    // if (setting1 && setting1.value && setting1.aggregate) aggre();
    // else if (setting1) chartchart(setting1);
    aggre();
  }, [setting1]);

  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;
    if (trigger.length > 0 && trigger[0] === "save") {
      let datanew = { ...data };
      let mdtb = localStorage.getItem("modelchart");
      let set = { patchlist: formlist };
      set = setting1;
      if (mdtb) {
        mdtb = JSON.parse(mdtb);
        set = { ...setting1, ...mdtb };
        setSetting1(set);
        localStorage.removeItem("modelchart");
      }

      let dtsrc = localStorage.getItem("modeldtsrc");
      if (dtsrc) {
        dtsrc = JSON.parse(dtsrc);
        set = { ...set, ...dtsrc };
        localStorage.removeItem("modeldtsrc");
      }
      if (chartOpt !== "") {
        set = { ...set, options: JSON.parse(chartOpt) };
      } else if (set.options) {
        console.log(chartOpt, "herere");
        delete set.options;
      }

      // if (!datanew.id) {
      //   datanew = { ...datanew, id: idMake(), type: "chart" };
      // }
      datanew = {
        ...datanew,
        dtlist: filterlist,
        setting: set,
      };
      //delete datanew.nodelist;
      let notexist = true;
      authorlist.map((k, j) => {
        if (k.i === datanew.i) {
          authorlist.splice(j, 1, datanew);
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
  saveTemp(trigger);

  const onValuesChangeTable1 = (changedValues, allValues) => {
    let set2 = {};
    if (setting1) set2 = { ...setting1 };
    if (["scatter"].indexOf(allValues.charttype) > -1) set2.aggregate = null;
    //if (["pie"].indexOf(allValues.charttype) > -1) set2.aggregate = "sum";
    setSetting1({ ...set2, ...changedValues });

    //use localstorage to prevent state change
    localStorage.setItem("modelchart", JSON.stringify(allValues));
  };

  // chart Data conversion
  const chartOrigin = () => {
    if (!setting1 | !setting1.value) return false;
    const x = setting1.xaxis;
    const val = setting1.value[0];
    const y = setting1.yaxis;

    let newlist = filterlist;

    newlist = _.sortBy(newlist, setting1.xaxis);

    let conf = { data: newlist };
    switch (setting1.charttype) {
      default:
        return;
      case "pie":
        conf = { ...conf, angleField: val, colorField: x };
        break;
      case "line":
      case "area":
      case "column":
        conf = { ...conf, yField: val, xField: x };
        if (setting1.series) conf = { ...conf, seriesField: setting1.series };
        break;

      case "bar":
        conf = { ...conf, yField: x, xField: val };
        if (setting1.series) conf = { ...conf, seriesField: setting1.series };
        break;
    }
    return conf;
  };

  const chartchart = (setting, newlist) => {
    if (!setting | !setting.value) return false;
    const x = setting.xaxis;
    const val = setting.value[0];
    const y = setting.yaxis;

    let xaxisV = [],
      valueV = [],
      yaxisV = [];
    if (!newlist) newlist = filterlist;
    if (newlist) {
      newlist.map((dt) => {
        xaxisV.push(_.pick(dt, x)[x]);
        valueV.push(_.pick(dt, val)[val]);
        yaxisV.push(_.pick(dt, y)[y]);
        return null;
      });
    }
    let label = [];
    label.push(x);
    label.push(y);
    label.push(val);
    if (label) {
      setLabelName(label);
    }
    newlist = _.sortBy(newlist, setting.xaxis);

    let conf = { data: newlist };
    if (setting.options) conf = { ...conf, ...setting.options };
    switch (setting.charttype) {
      default:
        return;
      case "pie":
        conf = { ...conf, angleField: val, colorField: x };

        break;
      case "line":
      case "area":
      case "column":
        conf = { ...conf, yField: val, xField: x };
        if (setting.series) conf = { ...conf, seriesField: setting.series };
        break;
      case "bar":
        conf = { ...conf, yField: x, xField: val };
        if (setting.series) conf = { ...conf, seriesField: setting.series };
        break;
      case "scatter":
        conf = { ...conf, yField: val, xField: x };
        if (setting.series) conf = { ...conf, seriesField: setting.series };
        if (setting.colorField)
          conf = { ...conf, colorField: setting.colorField };
        if (setting.sizeField) conf = { ...conf, sizeField: setting.sizeField };
        break;
    }
    if (val) setConfig(conf);
  };

  const onDataGet = (val) => {
    const newData = { ...data, dtlist: val };
    setFilterlist(val);
    setNodelist(val);
    if (val.length > 0) makeOptionArray(val[0]);
  };

  const onOptionClick = (opt) => {
    let optt = " ";
    let settingg = { ...setting1 };
    const chart1 = setting1.charttype;
    if (opt) optt = JSON.stringify(opt, null, 4);
    if (optt === " ") {
      setSetting1({ ...settingg, charttype: null });
    }
    form.setFieldsValue({
      textarea: optt,
    });
    setChartOpt(optt);
    console.log(chartOrigin(), opt);
    setConfig({ ...chartOrigin(), ...opt });
    setTimeout(function () {
      setSetting1({ ...setting1, chartype: chart1 });
    }, 100);
  };

  const chtonly = (
    <div id="dvCht" style={{ display: "block" }}>
      <Row gutter={4}>
        <Col span={edit ? 14 : 24}>
          <div
            style={{
              margin: 20,
            }}
          >
            {setting1 &&
              config &&
              (() => {
                switch (setting1.charttype) {
                  case "pie":
                    return <PieChart config={config} />;
                  case "bar":
                    return <BarChart config={config} />;
                  case "line":
                    return <LineChart config={config} />;
                  case "column":
                    return <ColumnChart config={config} />;
                  case "area":
                    return <AreaChart config={config} />;
                  case "box plot":
                    return <BoxPlot />;
                  case "scatter":
                    return <ScatterPlot config={config} />;
                  case "parallel coordinates":
                    return <ParallelCoordinatesChart data={pcData} />;
                  case "matrixdiagram":
                    return <MatrixDiagram data={chartData} />;

                  case "dendrogram":
                    return <Dendrogram />;
                  case "treemap":
                    return (
                      <Treemap data={treemapdata} width={600} height={400} />
                    );
                  default:
                    return null;
                  // <div style={{ margin: 20, marginRight: 7 }}>
                  //   <Rechart data={filterlist} {...setting1} aspect={1.6} />
                  // </div>
                }
              })()}
          </div>
        </Col>
        {edit && (
          <Col span={10}>
            <div style={{ marginTop: 10, marginRight: 5 }}>
              {formlist && (
                <AntFormDisplay
                  formid="5f1a590712d3bf549d18e583"
                  onValuesChange={onValuesChangeTable1}
                  patchlist={formlist}
                  initialValues={initChart}
                />
              )}
            </div>
          </Col>
        )}
      </Row>
      <div>
        {setting1 && setting1.charttype && (
          <ChartOption
            type={setting1.charttype}
            config={config}
            onOptionClick={onOptionClick}
          />
        )}
      </div>
    </div>
  );

  const makeTableColumn = (datalist) => {
    let col = [];
    if (datalist && datalist.length > 0)
      Object.keys(datalist[0]).map((k, i) => {
        col.push({ title: k, dataIndex: k, key: k });
        return null;
      });
    return col;
  };
  const tbonly = (
    <div style={{ marginRight: 10 }}>
      <Table
        size="small"
        columns={makeTableColumn(nodelist)}
        scroll={{ x: 2000, y: 500 }}
        dataSource={nodelist}
      />
    </div>
  );

  const onConfigFinish = (val) => {
    console.log(val);
    setChartOpt(val.textarea);
  };
  // const onReset = () => {
  //   form.resetFields();
  //   setChartOpt("");
  // };

  const form1 = (
    <Form
      layout="vertical"
      form={form}
      name="control-hooks"
      onFinish={onConfigFinish}
    >
      <Form.Item name="textarea" label="textarea">
        <TextArea autoSize={{ minRows: 15, maxRows: 26 }} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="button"
          onClick={() => {
            form.resetFields();
            setChartOpt("");
          }}
        >
          Reset
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <>
      {edit ? (
        <>
          <Tabs tabPosition={"left"}>
            <TabPane tab="Author" key="1">
              <>
                <Title level={4}>Chart</Title>
                <Divider style={{ marginTop: 0 }} />
                <Tabs size="small">
                  <TabPane tab="Chart" key="1">
                    {chtonly}
                  </TabPane>
                  <TabPane tab="Table" key="2">
                    {tbonly}
                  </TabPane>
                  <TabPane tab="Config" key="3">
                    <div style={{ marginRight: 10 }}>{form1}</div>
                  </TabPane>
                </Tabs>

                <Button
                  onClick={() => {
                    console.log(tempModel);
                  }}
                >
                  tempModel
                </Button>
              </>
            </TabPane>
            <TabPane tab="Data" key="2">
              <Dataget onDataGet={onDataGet} dtsrc={dtsrc} />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <div style={{ marginTop: 100 }}>{chtonly}</div>
      )}
    </>
  );
};

export default AuthorChart;
