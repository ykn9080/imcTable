
import {
  jsoncombine,
  callbackwithdata,
} from "./Common_data.js";
import axios from "axios";

function imctableload(storename, callback, opt) {
  if (typeof storename == "undefined") storename = "imctable";
  var myinfo = mycomp + "," + login.id;
  if (mycomp == "") myinfo = "";
  //  jsonReadMyAjax(storename, myinfo, "", "", "", init);

  var path = "/data/json/";
  path += storename + ".json";
  axios({
    method: "post",
    url: webserviceprefix + "readDataMy",
    data: {
      path: path,
      myinfo: myinfo,
      dataname: "",
      keycode: "",
      keyvalue: ""
    }
  }).then(response => {
    jsoncombine(storename, myinfo, response.data, "imctableload");
    var imc = localStorage.getItem("imctable");
    process(imc);
    if (typeof callback == "function")
      callbackwithdata(callback, response.data, opt);
  });

  // testapi();
  return false;
}
