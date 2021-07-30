import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import "components/Common/Antd.css";
import axios from "axios";
import { globalVariable } from "actions";
import { currentsetting } from "components/functions/config";
import { Typography, Row, Col, Tabs, Divider, Card, Button } from "antd";
import AntFormDisplay from "Form/AntFormDisplay";
import { idMake } from "components/functions/dataUtil";
import Dataget from "Model/Author/Dataget";
import Rechart from "Model/Chart/ReChart";
// import Chartjs2 from "components/Chart/react-chartjs-2";
// import Reactvis from "components/Chart/react-vis";
// import VicScatter from "Model/Chart/Victory";
import PieChart from "Model/Chart/antv/PieChart";
import BarChart from "Model/Chart/antv/BarChart";
// import Bar from "Model/Chart/@nivo/Bar";
import LineChart from "Model/Chart/antv/LineChart";
import BoxPlot from "Model/Chart/antv/BoxPlot";
import ScatterPlot from "Model/Chart/antv/ScatterPlot";
import MatrixDiagram from "Model/Chart/antv/MatrixDiagram";
import ParallelCoordinatesChart from "Model/Chart/@nivo/nivoParallel";
import { pcData } from "Model/Chart/@nivo/parallelData";
import AreaBar from "Model/Chart/antv/AreaBar";
import Dendrogram from "Model/Chart/react-tree/Dendrogram";
import Treemap from "Model/Chart/d3/Treemap";
import treemapdata from "Model/Chart/d3/treemapData";

var randomColor = require("randomcolor");

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthorChart = ({ authObj, edit, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState();
  const [formlist, setFormlist] = useState();
  const [initChart, setInitChart] = useState();
  const [chartData, setChartData] = useState([]);
  const [labelName, setLabelName] = useState();
  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  const makeOptionArray = (obj) => {
    let oparr = [{ value: null, text: "N/A" }];

    Object.keys(obj).map((k, i) => {
      oparr.push({ value: k, text: k.charAt(0).toUpperCase() + k.slice(1) });
      return null;
    });
    console.log(oparr);
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
      console.log(flist);
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
    xlist.map((k, i) => {
      const listbyx = _.filter(nodelist, (o) => {
        return o[x] === k;
      });
      let obj = { [x]: k };
      console.log(listbyx, obj);
      val.map((v, i) => {
        let sum = _.sumBy(listbyx, v);
        if (typeof sum !== "int") sum = sum.toFixed(2);
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
    console.log(listx, setting1, nodelist);
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
        if (setting1 && setting1.value && setting1.aggregate) aggre();
        else setFilterlist(authObj.dtlist);
        if (authObj.dtlist.length > 0) makeOptionArray(authObj.dtlist[0]);
      }
      if (authObj.setting) {
        const ds = authObj.setting;
        setSetting1(ds);
        setInitChart(ds);
        let src = {};
        if (ds.initVal) src.initVal = ds.initVal;
        if (ds.result) src.result = ds.result;
        setDtsrc(src);
      } else {
        setInitChart({});
      }
      if (authObj.dtsrc) setDtsrc(authObj.dtsrc);
    }
    if (setting1 && setting1.value && setting1.charttype) chartchart(setting1);
    // setTimeout(() => {
    //   $(".ant-row.ant-form-item").css("margin-bottom", 1);
    // }, 500);
  }, [authObj]);

  useEffect(() => {
    console.log(setting1);
    if (setting1 && setting1.value && setting1.aggregate) aggre();
    else if (setting1) chartchart(setting1);
  }, [setting1]);

  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;
    if (trigger.length > 0 && trigger[0] === "save") {
      let datanew = { ...data };
      let mdtb = localStorage.getItem("modelchart");
      let set = {};
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
    // if (
    //   [
    //     "charttype",
    //     "brush",
    //     "cartesiangrid",
    //     "aggregate",
    //     "legend",
    //     "tooltip",
    //     "value",
    //     "xaxis",
    //     "yaxis",
    //   ].indexOf(Object.keys(changedValues)[0]) > -1
    // )

    setSetting1({ ...set2, ...changedValues });

    console.log(changedValues, { ...set2, ...changedValues });
    //use localstorage to prevent state change
    localStorage.setItem("modelchart", JSON.stringify(allValues));
  };
  //pie chart
  const chartjsData = () => {
    if (!setting1 | !setting1.value) return false;
    const x = setting1.xaxis;
    const val = setting1.value[0];
    let lbl = [],
      dtt = [],
      i;
    _.sortBy(filterlist, [val]);
    filterlist.map((dt) => lbl.push(_.pick(dt, x)[x]));
    filterlist.map((dt) => dtt.push(_.pick(dt, val)[val]));

    let colors = ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#36A2EB"];
    if (lbl.length > 5)
      while (i < lbl.length - 5) {
        colors.push(randomColor());
        i++;
      }
    else colors.splice(lbl.length);
    const data = {
      labels: lbl,
      datasets: [
        {
          data: dtt,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    };
    return data;
  };

  // chart Data conversion
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
      console.log(newlist);
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

    switch (setting.charttype) {
      default:
        return;
      case "pie":
        let piedata = xaxisV.map((v, i) => ({
          rowHeader: `${v}`,
          frequency: valueV[i],
        }));
        return setChartData(piedata);
      case "bar":
        // valueV = valueV.map(Number)
        let bardata = xaxisV.map((v, i) => ({
          title: `${v}`,
          value: valueV[i],
        }));
        return setChartData(bardata);
      case "line":
        // xaxisV = xaxisV.map(Number)
        valueV = valueV.map(Number);
        let linedata = xaxisV.map((v, i) => ({
          title: `${v}`,
          value: valueV[i],
        }));
        return setChartData(linedata);
      case "scatter plot":
        xaxisV = xaxisV.map(Number);
        yaxisV = yaxisV.map(Number);
        let scatterdata = xaxisV.map((v, i) => ({
          XAxisVector: v,
          YAxisVector: yaxisV[i],
        }));
        return setChartData(scatterdata);
      case "matrixdiagram":
        let matrixdata = xaxisV.map((v, i) => ({
          xaxis: `${v}`,
          yaxis: `${yaxisV[i]}`,
          value: valueV[i],
        }));
        return setChartData(matrixdata);
    }
  };

  //box plot - duration +
  const boxData = [
    {
      x: "Finance",
      mean: 21,
      stdDev: 0,
      min: 21,
      q1: 21,
      median: 21,
      q3: 21,
      max: 21,
      outliers: [],
    },
    {
      x: "Marketing",
      mean: 8.292,
      stdDev: 16.07,
      min: 0.5,
      q1: 4.5,
      median: 8.5,
      q3: 13,
      max: 15,
      outliers: [],
    },
    {
      x: "Sales",
      mean: 6.222,
      stdDev: 13.695,
      min: 2,
      q1: 3,
      median: 5,
      q3: 7,
      max: 12,
      outliers: [16],
    },
  ];

  //scatter
  const VicScatterData = () => {
    if (!setting1) return false;
    const x = setting1.xaxis;
    const y = setting1.yaxis;

    let dt = [];
    if (nodelist) dt = nodelist;
    dt.map((k, i) => {
      k.x = k[x];
      k.y = k[y];
      // delete k[x];
      // delete k[y];
      return null;
    });
    return dt;
  };
  //treemap
  //Reactvis
  let data2 = [
    { title: "테스트1", weather: "good", value: 38 },
    { title: "테스트2", weather: "good", value: 52 },
    { title: "테스트3", weather: "bad", value: 61 },
    { title: "테스트4", weather: "good", value: 145 },
    { title: "테스트5", weather: "good", value: 48 },
    { title: "테스트6", weather: "bad", value: 38 },
    { title: "테스트7", weather: "good", value: 38 },
    { title: "테스트8", weather: "good", value: 38 },
  ];
  const onDataGet = (val) => {
    const newData = { ...data, dtlist: val };
    setFilterlist(val);
    setNodelist(val);
    if (val.length > 0) makeOptionArray(val[0]);
  };
  let titlestyle = { marginTop: 10, marginLeft: 20, marginBottom: 10 };
  console.log("chartdata", chartData);
  const chtonly = (
    <>
      <Row gutter={4}>
        <Col span={edit ? 14 : 24}>
          <div
            style={{
              margin: 20,
            }}
          >
            {setting1 &&
              (() => {
                switch (setting1.charttype) {
                  // case "pie":
                  //   const dt = chartjsData(filterlist, setting1);
                  //   return <Chartjs2 data={dt} />;
                  // case "treemap":
                  //   return <Reactvis />;
                  // case "scatter":
                  //   const dt2 = VicScatterData();
                  //   return (
                  //     setting1 &&
                  //     setting1.value && (
                  //       <VicScatter dt={dt2} bubble={setting1.value[0]} />
                  //     )
                  //   );
                  case "pie":
                    return <PieChart data={chartData} />;
                  case "bar":
                    return <BarChart data={chartData} label={labelName} />;
                  case "line":
                    return <LineChart data={chartData} />;
                  case "box plot":
                    return <BoxPlot data={boxData} />;
                  case "scatter plot":
                    return <ScatterPlot data={chartData} label={labelName} />;
                  case "parallel coordinates":
                    return <ParallelCoordinatesChart data={pcData} />;
                  case "matrixdiagram":
                    return <MatrixDiagram data={chartData} />;
                  case "areabox":
                    return <AreaBar />;
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
    </>
  );

  return (
    <>
      {edit ? (
        <Tabs tabPosition={"left"}>
          <TabPane tab="Author" key="1">
            <>
              <Title level={4}>Chart</Title>
              <Divider style={{ marginTop: 0 }} />
              {chtonly}
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
      ) : (
        <div style={{ marginTop: 100 }}>{chtonly}</div>
      )}
    </>
  );
};
export default AuthorChart;
