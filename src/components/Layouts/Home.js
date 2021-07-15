import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Head from "./Head";
import { CenteredGrid } from "./Body";

import Footer from "./Footer";
import { globalVariable } from "actions";
import { addedmenu, addRootPid, addPath1 } from "components/functions/dataUtil";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngry } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { currentsetting } from "config/index.js";
import {
  faCheckSquare,
  faCoffee,
  faUser,
  faQuestionCircle,
  faArrowCircleDown,
  faArrowCircleRight,
  faAdjust,
  faGlobe,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCheckSquare,
  faCoffee,
  faUser,
  faQuestionCircle,
  faArrowCircleDown,
  faArrowCircleRight,
  faAdjust,
  faAngry,
  faGlobe,
  faCog
);

// export const addPath1 = (menu, pid, pathname) => {
//   _.filter(menu, function (o) {
//     return o.pid === pid;
//   }).map((k, i) => {
//     k.path = pathname + "/" + k.title;
//     addedmenu.push(k);
//     addPath1(menu, k._id, k.path);
//   });
// };
// export const addRootPid = (data) => {
//   _.forEach(data, function (value, key) {
//     if (typeof value.pid === "undefined") value.pid = "";
//   });
//   return data;
// };

//1. chk redux menu
//2. if not redux openmenu
//3. if not fetch openmenu->dispatch openmenu,
const Home = ({ match }) => {
  let title = match.params.name,
    titleUpper;
  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;
  if (title) titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
  const dispatch = useDispatch();
  const openm = [
    {
      access: [],
      _id: "5ed1c7f116d4fdc25c28c7e4",
      title: "Service",
      desc: "Service and product introduction.... ",
      layout: [],
      path: "/open/service",
      pid: "",
      seq: 0,
      type: "open",
    },
    {
      access: [],
      _id: "5ed1c7f116d4fdc25c28c7e5",
      title: "About us",
      desc: "Company introduction",
      layout: [],
      path: "/open/about us",
      seq: 1,
      pid: "",
      type: "open",
    },
  ];
  dispatch(globalVariable({ openmenu: openm }));
  //!!!!알수 없는 이유로 db의  path 가 /open/ 사라짐
  let openmenu = openm; //useSelector((state) => state.global.openmenu);

  useEffect(() => {
    if ((typeof openmenu === "undefined") | (openmenu.length === 0)) {
      axios
        .get(currentsetting.webserviceprefix + "menu/any?type=open")
        .then((response) => {
          let dt = addRootPid(response.data);
          addPath1(dt, "", "");
          dispatch(globalVariable({ openmenu: addedmenu }));
        })
        .catch((Error) => {
          console.log(Error);
        });
    }
  }, []);
  return (
    <>
      <Head />
      <CenteredGrid />
      <Footer />
    </>
  );
};

export default Home;
