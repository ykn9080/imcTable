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
  Tooltip,
  Result,
  Spin,
} from "antd";
import { RedoOutlined } from "@ant-design/icons";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import Dataget from "Model/Author/Dataget";
import PieChart from "Model/Chart/antv/PieChart";
import BarChart from "Model/Chart/antv/BarChart";
import LineChart from "Model/Chart/antv/LineChart";
import ColumnChart from "Model/Chart/antv/ColumnChart";
import BoxPlot from "Model/Chart/antv/BoxPlot";
import ScatterPlot from "Model/Chart/antv/ScatterPlot";
import MatrixDiagram from "Model/Chart/antv/MatrixDiagram";
import AreaChart from "Model/Chart/antv/AreaChart";
import Treemap from "Model/Chart/d3/Treemap";
import treemapdata from "Model/Chart/d3/treemapData";
import ChartOption from "Model/Author/AuthorOption";
import AntChart from "Model/Chart/antv/AntChart";
import { ErrorBoundary } from "react-error-boundary";
import { DarkBackground } from "Model/Author/Dataget";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    </div>
  );
}

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AuthorChart = ({ authObj, edit, errorurl }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [data, setData] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState();
  const [patch, setPatch] = useState();
  const [initChart, setInitChart] = useState();
  const [config, setConfig] = useState();
  const [chartOpt, setChartOpt] = useState("");
  const [charttypeopt, setCharttypeopt] = useState();
  const [loading, setLoading] = useState(false);
  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "/edit/graph?type=chart" }));
    localStorage.removeItem("modelchart");
  }, []);
  useEffect(() => {
    if (authObj) {
      setLoading(true);
      setData(authObj);
      if (authObj.dtlist) {
        setNodelist(authObj.dtlist);
        aggre();

        //AntFormDisplay dropdown patchlist make
        if (authObj.dtlist.length > 0) makeOptionArray(authObj.dtlist[0]);
      }
      if (authObj.setting) {
        const ds = authObj.setting;
        setSetting1(ds);
        setCharttypeopt(ds.charttype);
        //AntFormDisplay init
        setInitChart(ds); //initialValues
        //setPatch(ds.patchlist);//Dropdown patchlist

        //dataget init
        let src = {};
        if (ds.initVal) src.initVal = ds.initVal;
        if (ds.result) {
          src.result = orderByX(ds.result, ds.xField);
        }
        setDtsrc(src);

        //config textarea init
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
      setLoading(false);
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
    // if (setting1 && setting1.yField && setting1.aggregate) aggre();
    // else if (setting1) chartchart(setting1);

    if (setting1 && nodelist) aggre();
  }, [setting1]);

  const makeOptionArray = (obj) => {
    let oparr = [{ value: "n/a", text: "n/a" }];

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
      setPatch(flist);
    });
  };
  const aggre = () => {
    if (!setting1) return false;
    let listx = [],
      xlist = [],
      x = setting1.xField,
      val = setting1.yField;
    //x uniq list
    nodelist.map((dt) => xlist.push(_.pick(dt, x)[x]));
    xlist = _.uniq(xlist);
    if (setting1.aggregate && setting1.aggregate !== "n/a")
      xlist.map((k, i) => {
        const listbyx = _.filter(nodelist, (o) => {
          return o[x] === k;
        });
        let obj = { [x]: k };

        // val.map((v, i) => {
        let sum = _.sumBy(listbyx, val);
        //if (typeof sum !== "int") sum = sum.toFixed(2);
        let avg = _.meanBy(listbyx, val).toFixed(2);
        let count = listbyx.length;

        switch (setting1.aggregate) {
          case "sum":
            obj[val] = sum;
            break;
          case "average":
            obj[val] = avg; //parseFloat(sum / count);
            break;
          case "count":
            obj[val] = count;
            break;
          default:
            break;
        }
        // });
        listx.push(obj);
        return null;
      });
    else listx = nodelist;
    setFilterlist(listx);
    //setNodelist(listx);

    chartchart(setting1, listx);
  };
  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;
    if (trigger.length > 0 && trigger[0] === "save") {
      let datanew = { ...data };
      let mdtb = localStorage.getItem("modelchart");
      let set = { patchlist: patch };
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

      if (chartOpt && chartOpt !== "") {
        console.log(chartOpt);
        set = { ...set, options: JSON.parse(chartOpt) };
      } else if (set?.options) {
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
    //allValues = cleanupObj(changedValues, allValues);
    let set2 = {};
    if (setting1) set2 = { ...setting1 };
    set2 = { ...set2, ...changedValues };
    set2 = CleanupObj(set2);
    if (changedValues.charttype) {
      setCharttypeopt(null);
      setTimeout(function () {
        setCharttypeopt(set2.charttype);
      }, 0);
    }
    setSetting1(set2);

    //use localstorage to prevent state change
    localStorage.setItem("modelchart", JSON.stringify(allValues));
  };

  // chart Data conversion
  const chartOrigin = (allValues) => {
    if (allValues) setting1 = allValues;
    if (!(setting1 && setting1?.yField)) return false;
    const x = setting1.xField;
    const val = setting1.yField;
    let newlist1 = filterlist;
    const newlist = _.sortBy(newlist1, x);

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
      case "scatterr":
        conf = { ...conf, yField: x, xField: val };
        break;
    }

    return conf;
  };

  const chartchart = (setting, newlist) => {
    if (!newlist) newlist = filterlist;
    if (!setting | !setting.yField) return false;
    const x = setting.xField;
    const val = setting.yField;
    const series = setting.series;
    const color = setting.colorField;
    const size = setting.sizeField;
    newlist = _.sortBy(newlist, x);

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
        if (series) conf = { ...conf, seriesField: series };
        break;
      case "bar":
        conf = { ...conf, yField: x, xField: val };
        if (series) conf = { ...conf, seriesField: series };
        break;
      case "scatter":
        conf = { ...conf, yField: val, xField: x };
        if (series) conf = { ...conf, seriesField: series };
        if (color) conf = { ...conf, colorField: color };
        if (size) conf = { ...conf, sizeField: size };
        break;
    }
    //const conf1 = cleanupObj(conf);

    if (val) setConfig(conf);
  };

  const onDataGet = (val) => {
    setFilterlist(val);
    setNodelist(val);
    if (val.length > 0) makeOptionArray(val[0]);
  };

  const onOptionClick = (opt) => {
    console.log(opt);
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
    setConfig({ ...chartOrigin(), ...opt });
    setTimeout(function () {
      setSetting1({ ...setting1, charttype: chart1 });
    }, 100);
  };
  const reloadChart = () => {
    const chart1 = setting1.charttype;
    setSetting1({ ...setting1, charttype: null });
    setTimeout(function () {
      setSetting1({ ...setting1, charttype: chart1 });
      setChartOpt("");
      form.setFieldsValue({
        textarea: "",
      });
    }, 100);
  };

  const myErrorHandler = (error, info) => {
    //window.location.reload(false);
    if (errorurl) window.location.href = errorurl;
    else window.location.reload(false);
    // Do something with the error
    // E.g. log to an error logging client here
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
            {edit && (
              <div style={{ textAlign: "right" }}>
                <Tooltip title="Reload Chart">
                  <Button
                    type="link"
                    icon={<RedoOutlined />}
                    onClick={reloadChart}
                  />
                </Tooltip>
              </div>
            )}
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
                    // return <ParallelCoordinatesChart data={pcData} />;
                    return <AntChart />;
                  case "matrixdiagram":
                    return <MatrixDiagram />;

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
              {patch && (
                <AntFormDisplay
                  formArray={formdt["5f1a590712d3bf549d18e583"]}
                  onValuesChange={onValuesChangeTable1}
                  patchlist={patch}
                  initialValues={initChart}
                />
              )}
            </div>
          </Col>
        )}
      </Row>
      <div>
        {edit && setting1 && setting1.charttype && (
          <ChartOption
            // type={setting1.charttype}
            type={charttypeopt}
            config={chartOrigin()}
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
    // console.log(val);
    setChartOpt(val.textarea);

    reloadChart();
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
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
        {edit ? (
          <>
            <Tabs tabPosition={"left"}>
              <TabPane tab="Author">
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
                      console.log(
                        tempModel,
                        nodelist,
                        filterlist,
                        chartOrigin()
                      );
                    }}
                  >
                    tempModel,nodelist,filterlist,chartOrigin
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
      </ErrorBoundary>
      <DarkBackground disappear={loading}>
        <div style={{ position: "absolute", top: 200, left: "50%" }}>
          <Spin spinning={loading} />
        </div>
      </DarkBackground>
    </>
  );
};
export const CleanupObj = (obj) => {
  const keyarr = Object.keys(obj);
  keyarr.map((k, i) => {
    if (!obj[k] | (obj[k] === "n/a")) delete obj[k];
    return null;
  });

  return obj;
};
export default AuthorChart;
