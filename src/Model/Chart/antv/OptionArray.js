const option = {
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
      option: {
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
      key: 1,
    },

    {
      option: {
        appendPadding: 10,
        radius: 0.8,
        label: {
          type: "outer",
          content: "{name} {percentage}",
        },
        interactions: [
          { type: "pie-legend-active" },
          { type: "element-active" },
        ],
      },
      key: 3,
    },
    {
      option: {
        appendPadding: 10,
        radius: 0.8,
        label: {
          type: "outer",
          content: function content(item) {
            return item.value ? item.value.toFixed(2) : null;
          },
        },
        interactions: [{ type: "element-active" }],
      },
      key: 4,
    },
    {
      option: {
        appendPadding: 10,
        radius: 0.8,
        legend: false,
        label: {
          type: "inner",
          offset: "-50%",
          style: {
            fill: "#fff",
            fontSize: 18,
            textAlign: "center",
          },
        },
        pieStyle: function pieStyle(_ref) {
          var sex = _ref.sex;
          if (sex === "man") {
            return {
              fill: "p(a)https://gw.alipayobjects.com/zos/antfincdn/FioHMFgIld/pie-wenli1.png",
            };
          }
          return {
            fill: "p(a)https://gw.alipayobjects.com/zos/antfincdn/Ye2DqRx%2627/pie-wenli2.png",
          };
        },
        tooltip: false,
        interactions: [{ type: "element-single-selected" }],
      },
      key: 5,
    },
    {
      option: {
        appendPadding: 10,
        radius: 1,
        startAngle: Math.PI,
        endAngle: Math.PI * 1.5,
        label: {
          type: "inner",
          offset: "-8%",
          content: "{name}",
          style: { fontSize: 18 },
        },
        interactions: [{ type: "element-active" }],
        pieStyle: { lineWidth: 0 },
      },
      key: 6,
    },
    {
      option: {
        appendPadding: 10,
        radius: 0.75,
        label: {
          type: "spider",
          labelHeight: 28,
          content: "{name}\n{percentage}",
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      },
      key: 7,
    },
    {
      option: {
        appendPadding: 10,
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            content: "Inner Content",
          },
        },
      },
      key: 8,
    },
  ],
  scatter: [
    {
      option: {
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
        // label: {
        //   formatter: function formatter(item) {
        //     return labels.includes(item["short occupation"])
        //       ? item["short occupation"]
        //       : "";
        //   },
        //   offsetY: -10,
        // },
      },
      key: 1,
    },
    // {
    //   option: {
    //     color: [
    //       "r(0.4, 0.3, 0.7) 0:rgba(255,255,255,0.5) 1:#5B8FF9",
    //       "r(0.4, 0.4, 0.7) 0:rgba(255,255,255,0.5) 1:#61DDAA",
    //     ],
    //     size: [5, 20],
    //     shape: "circle",
    //     yAxis: {
    //       nice: true,
    //       line: { style: { stroke: "#eee" } },
    //     },
    //     xAxis: {
    //       grid: { line: { style: { stroke: "#eee" } } },
    //       line: { style: { stroke: "#eee" } },
    //     },
    //   },
    //   key: 2,
    // },
    {
      option: {
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
      key: 3,
    },
    {
      option: {
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
      key: 4,
    },
    {
      option: {
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
      key: 5,
    },
  ],
  area: [
    {
      option: {
        color: ["#82d1de", "#cb302d", "#e3ca8c"],
        areaStyle: { fillOpacity: 0.7 },
        appendPadding: 10,
        isPercent: true,
        yAxis: {
          label: {
            formatter: function formatter(value) {
              return value * 100;
            },
          },
        },
      },
      key: 1,
    },
    {
      option: {
        xAxis: { tickCount: 5 },
        animation: false,
        slider: {
          start: 0.1,
          end: 0.9,
          trendCfg: { isArea: true },
        },
      },
      key: 2,
    },
    {
      option: {
        xAxis: {
          range: [0, 1],
          tickCount: 5,
        },
        areaStyle: function areaStyle() {
          return { fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff" };
        },
      },
      key: 3,
    },
    {
      option: {
        annotations: [
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
              stroke: "red",
              lineDash: [2, 2],
            },
          },
        ],
      },
      key: 4,
    },
    {
      option: {
        color: [
          "#6897a7",
          "#8bc0d6",
          "#60d7a7",
          "#dedede",
          "#fedca9",
          "#fab36f",
          "#d96d6f",
        ],
        // xAxis: {
        //   type: "time",
        //   mask: "YYYY",
        // },
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
        legend: { position: "top" },
      },
      key: 5,
    },
  ],
  bar: [
    {
      option: {
        legend: { position: "top-left" },
        barBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
        interactions: [
          {
            type: "active-region",
            enable: false,
          },
        ],
      },
      key: 1,
    },
    // {
    //   option: {
    //     yAxis: { label: { autoRotate: false } },
    //     scrollbar: { type: "vertical" },
    //   },
    //   key: 2,
    // },

    {
      option: {
        marginRatio: 0,
        label: {
          position: "right",
          offset: 4,
        },
        barStyle: {
          radius: [2, 2, 0, 0],
        },
      },
      key: 7,
    },

    {
      option: {
        isPercent: true,
        isStack: true,
        label: {
          position: "middle",
          content: function content(item) {
            return item.value ? item.value.toFixed(2) : null;
          },
          style: { fill: "#fff" },
        },
      },
      key: 9,
    },
  ],
  column: [
    {
      option: {
        xAxis: { label: { autoRotate: false } },
        slider: {
          start: 0.1,
          end: 0.2,
        },
      },
      key: 1,
    },
    // {
    //   option: {
    //     columnWidthRatio: 0.8,
    //     xAxis: {
    //       label: {
    //         autoHide: true,
    //         autoRotate: false,
    //       },
    //     },
    //   },
    //   key: 2,
    // },
    {
      option: {
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        minColumnWidth: 20,
        maxColumnWidth: 20,
      },
      key: 3,
    },
    {
      option: {
        isGroup: true,

        label: {
          position: "middle",
          layout: [
            { type: "interval-adjust-position" },
            { type: "interval-hide-overlap" },
            { type: "adjust-color" },
          ],
        },
      },
      key: 4,
    },
    // {
    //   option: {
    //     isGroup: "true",
    //     columnStyle: {
    //       radius: [20, 20, 0, 0],
    //     },
    //   },
    //   key: 5,
    // },
    // {
    //   option: {
    //     isGroup: true,
    //     dodgePadding: 2,
    //     label: {
    //       position: "middle",
    //       layout: [
    //         { type: "interval-adjust-position" },
    //         { type: "interval-hide-overlap" },
    //         { type: "adjust-color" },
    //       ],
    //     },
    //   },
    //   key: 6,
    // },

    { option: { isGroup: true, isStack: true }, key: 8 },
    // {
    //   option: {
    //     isPercent: true,
    //     isStack: true,
    //     label: {
    //       position: "middle",
    //       content: function content(item) {
    //         return item.value ? item.value.toFixed(2) : null;
    //       },
    //       style: { fill: "#fff" },
    //     },
    //   },
    //   key: 9,
    // },
    {
      option: {
        isPercent: true,
        isStack: true,
        meta: {
          value: {
            min: 0,
            max: 1,
          },
        },
        label: {
          position: "middle",
          content: function content(item) {
            return "".concat((item.value * 100).toFixed(2), "%");
          },
          style: { fill: "#fff" },
        },
        tooltip: false,
        interactions: [
          { type: "element-highlight-by-color" },
          { type: "element-link" },
        ],
      },
      key: 10,
    },
    // {
    //   option: {
    //     isStack: true,
    //     label: {
    //       position: "middle",
    //       layout: [
    //         { type: "interval-adjust-position" },
    //         { type: "interval-hide-overlap" },
    //         { type: "adjust-color" },
    //       ],
    //     },
    //   },
    //   key: 11,
    // },
    // {
    //   option: {
    //     isStack: true,
    //     label: { position: "middle" },
    //     interactions: [
    //       {
    //         type: "active-region",
    //         enable: false,
    //       },
    //     ],
    //     columnBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    //   },
    //   key: 12,
    // },
  ],
};

export default option;
