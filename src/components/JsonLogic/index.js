// var data = [
//   {
//     id: 1,
//     name: "Oliver",
//     email: "email1@mail.com",
//   },
//   {
//     id: 2,
//     name: "Jack",
//     email: "email2@mail.com",
//   },
//   {
//     id: 3,
//     name: "Harry",
//     email: "email3@mail.com",
//   },
//   {
//     id: 4,
//     name: "Jacob",
//     email: "email4@mail.com",
//   },
//   {
//     id: 5,
//     name: "Charlie",
//     email: "email5@mail.com",
//   },
//   {
//     id: 6,
//     name: "Thomas",
//     email: "email6@mail.com",
//   },
//   {
//     id: 7,
//     name: "George",
//     email: "email7@mail.com",
//   },
//   {
//     id: 8,
//     name: "Oscar",
//     email: "email8@mail.com",
//   },
//   {
//     id: 9,
//     name: "James",
//     email: "email9@mail.com",
//   },
//   {
//     id: 10,
//     name: "William",
//     email: "email10@mail.com",
//   },
// ];

// var filter = {
//   or: [
//     { and: [{ ">=": [{ var: "id" }, 3] }, { "<=": [{ var: "id" }, 5] }] },
//     { ">": [{ var: "id" }, 7] },
//   ],
// };
export const JsonLogicRunReverse = (data1, filter1) => {
  var jsonLogic = require("./logic.js");

  const rtn = data1.filter(function (item) {
    return !jsonLogic.apply(filter1, item);
  });
  return rtn;
};
export const JsonLogicRun = (data1, filter1, reverse) => {
  var jsonLogic = require("./logic.js");
  // if (data1) data = data1;
  // if (filter1) {
  //   filter = filter1;
  // }
  const rtn = data1.filter(function (item) {
    return jsonLogic.apply(filter1, item);
  });

  return rtn;
};
export default JsonLogicRun;
