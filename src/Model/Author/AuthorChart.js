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
// import VicScatter from "components/Chart/Victory";

var randomColor = require("randomcolor");

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthorChart = ({ authObj, edit = true, title }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [dtsrc, setDtsrc] = useState({});
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState(true);
  const [formlist, setFormlist] = useState([]);
  const [initChart, setInitChart] = useState();
  const tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  const makeOptionArray = (obj) => {
    let oparr = [];

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
    xlist.map((k, i) => {
      const listbyx = _.filter(nodelist, (o) => {
        return o[x] === k;
      });
      let obj = { [x]: k };
      val.map((v, i) => {
        let sum = _.sumBy(listbyx, v);

        let count = listbyx.length;
        switch (setting1.aggregate) {
          case "sum":
            obj[v] = sum;
            break;
          case "average":
            obj[v] = parseFloat(sum / count);
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

    setFilterlist(listx);
  };
  useEffect(() => {
    dispatch(globalVariable({ helpLink: "model/edit/graph?type=chart" }));
    localStorage.removeItem("modelchart");
  }, []);
  useEffect(() => {
    if (authObj) {
      if (authObj.dtlist) {
        setData(authObj);
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
    // setTimeout(() => {
    //   $(".ant-row.ant-form-item").css("margin-bottom", 1);
    // }, 500);
  }, [authObj]);

  useEffect(() => {
    if (setting1 && setting1.value && setting1.aggregate) aggre();
  }, [setting1]);

  const saveTemp = (trigger) => {
    let authorlist = tempModel?.properties?.resultsAuthor;
    if (trigger.length > 0 && trigger[0] === "save") {
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
      let datanew = {};
      datanew = data;
      // if (!datanew.id) {
      //   datanew = { ...datanew, id: idMake(), type: "chart" };
      // }
      datanew = {
        ...datanew,
        setting: set,
      };
      //delete datanew.nodelist;
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
  saveTemp(trigger);

  const onValuesChangeTable1 = (changedValues, allValues) => {
    let set2 = {};
    if (setting1) set2 = { ...setting1 };
    if (
      [
        "charttype",
        "brush",
        "cartesiangrid",
        "aggregate",
        "legend",
        "tooltip",
        "value",
        "xaxis",
        "yaxis",
      ].indexOf(Object.keys(changedValues)[0]) > -1
    ) {
      setSetting1({ ...set2, ...changedValues });
    }
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
  const onDataGet = (val) => {
    const newData = { ...data, dtlist: val };
    setFilterlist(val);
    if (val.length > 0) makeOptionArray(val[0]);
  };
  let titlestyle = { marginTop: 10, marginLeft: 20, marginBottom: 10 };
  return (
    <>
      <Tabs tabPosition={"left"}>
        <TabPane tab="Author" key="1">
          {
            <>
              <Title level={4}>Chart</Title>
              <Divider style={{ marginTop: 0 }} />
              <Row gutter={4}>
                <Col span={edit ? 14 : 24}>
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
                        default:
                          return (
                            <div style={{ margin: 20, marginRight: 7 }}>
                              <Rechart
                                data={filterlist}
                                {...setting1}
                                aspect={1.6}
                              />
                            </div>
                          );
                      }
                    })()}
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
          }
          {<div style={{ marginTop: 40 }}></div>}
        </TabPane>
        <TabPane tab="Data" key="2">
          <Dataget onDataGet={onDataGet} dtsrc={dtsrc} />
        </TabPane>
      </Tabs>
    </>
  );
  // return (
  //   <div style={{ padding: "5px 5px 10px 10px" }}>
  //     <Tabs tabPosition={"left"}>
  //       <TabPane tab="Author" key="1">
  //         {
  //           <>
  //             <Title level={4}>Chart</Title>
  //             <Divider style={{ marginTop: 0 }} />
  //             <Card>
  //               <AntFormDisplay
  //                 formid="5f1a590712d3bf549d18e583"
  //                 onValuesChange={onValuesChangeTable1}
  //                 patchlist={formlist}
  //                 initialValues={initChart}
  //               />
  //             </Card>
  //           </>
  //         }
  //         {<div style={{ marginTop: 40 }}></div>}
  //       </TabPane>
  //       <TabPane tab="Data" key="2">
  //         <Dataget onDataGet={onDataGet} />
  //         {/* dtsrc={dtsrc} /> */}
  //       </TabPane>
  //     </Tabs>

  //     <Button
  //       onClick={() => {
  //         console.log(tempModel);
  //       }}
  //     >
  //       tempModel
  //     </Button>
  //   </div>
  // );
};
export default AuthorChart;
