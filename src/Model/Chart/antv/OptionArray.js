const Options = {
  line: [
    {
      option: {
        padding: "auto",
        xAxis: { tickCount: 5 },
        slider: {
          start: 0.1,
          end: 0.5,
        },
      },
      key: 1,
    },
    {
      option: {
        padding: "auto",
        xAxis: { tickCount: 5 },
        smooth: true,
      },
      key: 2,
    },
    {
      option: {
        yAxis: {
          label: {
            formatter: function formatter(v) {
              return ""
                .concat(v)
                .replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                  return "".concat(s, ",");
                });
            },
          },
        },
        color: ["#1979C9", "#D62A0D", "#FAA219"],
      },
      key: 3,
    },

    {
      option: {
        annotations: [
          {
            type: "regionFilter",
            start: ["min", "median"],
            end: ["max", "0"],
            color: "#F4664A",
          },
          {
            type: "text",
            position: ["min", "median"],
            content: "median",
            offsetY: -4,
            style: { textBaseline: "bottom" },
          },
          {
            type: "line",
            start: ["min", "median"],
            end: ["max", "median"],
            style: {
              stroke: "#F4664A",
              lineDash: [2, 2],
            },
          },
        ],
      },
      key: 4,
    },
  ],
  pie: [
    {
      radius: 0.9,
      label: {
        type: "inner",
        offset: "-30%",
        content: function content(_ref) {
          var percent = _ref.percent;
          return "".concat((percent * 100).toFixed(0), "%");
        },
        style: {
          fontSize: 14,
          textAlign: "center",
        },
      },
      interactions: [{ type: "element-active" }],
    },
  ],
  scatter: [
    {
      shape: "circle",
      yAxis: {
        nice: false,
        min: -20000,
        tickCount: 5,
        position: "right",
        label: {
          formatter: function formatter(value) {
            return Math.floor(value / 1000) + "K";
          },
        },
        grid: { line: { style: { stroke: "#eee" } } },
        line: { style: { stroke: "#aaa" } },
      },
      // tooltip: {
      //   fields: ['probability', 'Average annual wage', 'numbEmployed'],
      // } ,
      legend: { position: "top" },
      xAxis: {
        min: -0.04,
        max: 1.04,
        nice: false,
        grid: { line: { style: { stroke: "#eee" } } },
        line: false,
        label: false,
      },
      // label:{
      //   formatter:functionformatter(item){
      //     return labels.includes(item['short occupation']) ? item['short occupation'] : '';
      //   } ,
      //   offsetY: -10,
      // } ,
    },
    {
      color: [
        "r(0.4, 0.3, 0.7) 0:rgba(255,255,255,0.5) 1:#5B8FF9",
        "r(0.4, 0.4, 0.7) 0:rgba(255,255,255,0.5) 1:#61DDAA",
      ],
      size: [5, 20],
      shape: "circle",
      yAxis: {
        nice: true,
        line: { style: { stroke: "#eee" } },
      },
      xAxis: {
        grid: { line: { style: { stroke: "#eee" } } },
        line: { style: { stroke: "#eee" } },
      },
    },
    {
      size: [4, 30],
      shape: "circle",
      pointStyle: {
        fillOpacity: 0.8,
        stroke: "#bbb",
      },
      xAxis: {
        min: -25,
        max: 5,
        grid: { line: { style: { stroke: "#eee" } } },
        line: { style: { stroke: "#aaa" } },
      },
      yAxis: { line: { style: { stroke: "#aaa" } } },
      quadrant: {
        xBaseline: 0,
        yBaseline: 0,
        labels: [
          { content: "Male decrease,\nfemale increase" },
          { content: "Female decrease,\nmale increase" },
          { content: "Female & male decrease" },
          { content: "Female &\n male increase" },
        ],
      },
    },
    {
      shape: "circle",
      size: 4,
      yAxis: {
        nice: true,
        line: { style: { stroke: "#aaa" } },
      },
      xAxis: {
        min: -100,
        grid: { line: { style: { stroke: "#eee" } } },
        line: { style: { stroke: "#aaa" } },
      },
    },
    {
      size: 5,
      shape: "circle",
      pointStyle: { fillOpacity: 1 },
      yAxis: {
        nice: true,
        line: { style: { stroke: "#aaa" } },
      },
      xAxis: {
        grid: { line: { style: { stroke: "#eee" } } },
        line: { style: { stroke: "#aaa" } },
      },
      label: {},
    },
  ],
};

export default Options;
