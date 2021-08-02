// var data = [
//   {
//     year: "1958 年",
//     value: 48,
//   },
//   {
//     name: "Berlin",
//     月份: "Aug.",
//     月均降雨量: 42.4,
//   },
//   {},
//   {
//     country: "Europe",
//     year: "2050",
//     value: 628,
//   },
// ];

// var config = [
//   {
//     data: data,
//     xField: "value",
//     yField: "year",
//     seriesField: "year",
//     legend: { position: "top-left" },
//   },
//   {
//     data: data,
//     isGroup: true,
//     xField: "月份",
//     yField: "月均降雨量",
//     seriesField: "name",
//     label: {
//       position: "middle",
//       layout: [
//         { type: "interval-adjust-position" },
//         { type: "interval-hide-overlap" },
//         { type: "adjust-color" },
//       ],
//     },
//   },
//   {
//     //stacked
//     date: data,
//     xField: "product_type",
//     yField: "order_amt",
//     isGroup: true,
//     isStack: true,
//     seriesField: "product_sub_type",
//     groupField: "sex",
//   },
//   {
//     //percent stack
//     date: date,
//     xField: "year",
//     yField: "value",
//     seriesField: "country",
//     isPercent: true,
//     isStack: true,
//     label: {
//       position: "middle",
//       content: function content(item) {
//         return item.value.toFixed(2);
//       },
//       style: { fill: "#fff" },
//     },
//   },
// ];
