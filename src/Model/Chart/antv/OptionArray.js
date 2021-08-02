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
};

export default Options;
