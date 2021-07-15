import axios from "axios";
import { currentsetting } from "../functions/config";
import { funLoading } from "./core";
import { menuMy } from "./Common_menu";
import { useSelector } from "react-redux";
import $ from "jquery";

axios.defaults.headers.common = {
  Authorization: `bearer ` + localStorage.getItem("token"),
};
export const jsonReadMyAjax = (
  storename,
  myinfo,
  dataname,
  keycode,
  keyvalue,
  callback,
  opt
) => {
  if (typeof dataname == "undefined") dataname = "";
  if (typeof keycode == "undefined") keycode = "";
  if (typeof keyvalue == "undefined") keyvalue = "";
  const path = "/data/json/" + storename + ".json";
  axios({
    method: "post",
    url: currentsetting.webserviceprefix + "readDataMy",
    data: {
      path: path,
      myinfo: myinfo,
      dataname: dataname,
      keycode: keycode,
      keyvalue: keyvalue,
    },
  }).then((response) => {
    console.log(response.data);
    switch (storename) {
      case "imctable":
        jsoncombine(storename, myinfo, response.data, "jsonreadmyajax");
        break;
    }
    if (typeof callback == "function")
      callbackwithdata(callback, JSON.stringify(response.data), opt);
  });
};
const gb = useSelector((state) => state.global);
export function jsonDataMyAjax(datacode, callback, callbackorigin, optorigin) {
  //myinfo:comp,staff(or comp only ok)
  var path = "/data/json/imcdata.json";
  //const gb = useSelector(state => state.global);
  funLoading();
  axios({
    method: "post",
    url: currentsetting.webserviceprefix + "ReadDatasrcMy",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    data: {
      path: path,
      myinfo: gb.mycomp,
      dataname: "",
      keycode: "code",
      keyvalue: datacode,
    },
  }).then((response) => {
    if (response.data != "") {
      //btnclickexecute를 정상화한후 살릴것!!!!!!!!!!!!!
      // if (callback == btnclickexecute) {
      //   btnclickexecute(response.data, optorigin[0]);
      // } else {
      console.log(response.data);
      callbackwithdata(callback, JSON.stringify(response.data), optorigin);
      //}
    } else {
      callbackwithdata(callback, "", optorigin);
    }
  });
}
export function jsoncombine(storename, myinfo, json, src) {
  console.log(storename, myinfo, json, src);
  localStorage.setItem(storename, JSON.stringify(json));
}
export function callbackwithdata(callback, rtndt, opt) {
  let dt;
  if (typeof callback === "function") {
    if (typeof rtndt == "object") dt = rtndt;
    else if (typeof rtndt == "string") {
      if (rtndt == "") rtndt = "[]";
      dt = JSON.parse(rtndt);
    }
    if (typeof opt != "undefined" && opt != "")
      //not knowing dynamic add parameter!!!!
      switch (opt.length) {
        case 0:
        default:
          callback(dt);
        case 1:
          callback(dt, opt[0]);
          break;
        case 2:
          callback(dt, opt[0], opt[1]);
          break;
        case 3:
          callback(dt, opt[0], opt[1], opt[2]);
          break;
        case 4:
          callback(dt, opt[0], opt[1], opt[2], opt[3]);
          break;
        case 5:
          callback(dt, opt[0], opt[1], opt[2], opt[3], opt[4]);
          break;
        case 6:
          callback(dt, opt[0], opt[1], opt[2], opt[3], opt[4], opt[5]);
          break;
        case 7:
          callback(dt, opt[0], opt[1], opt[2], opt[3], opt[4], opt[5], opt[6]);
          break;
        case 8:
          callback(
            dt,
            opt[0],
            opt[1],
            opt[2],
            opt[3],
            opt[4],
            opt[5],
            opt[6],
            opt[7]
          );
          break;
      }
    else {
      callback(dt);
    }
  }
  gb.ajaxrtn = rtndt;
}
export function datacodereturn(dtsrc) {
  var datacode = "";
  if (dtsrc.hasOwnProperty("datacode")) datacode = dtsrc.datacode;
  else if (dtsrc.hasOwnProperty("code")) datacode = dtsrc.code;
  return datacode;
}
export function datalistreturn(data, datalist, opt) {
  //opt={applyfilter:false}
  //apply filter database and others differently with data as input
  //find datalist from dataset
  //if dtype==database,datalist in querylist( sqlcommand='select')

  var rtn = "",
    dtlist = "",
    dsrc = $("#spdataajax"),
    datacode = "",
    filter,
    applyfilter = true;
  if (typeof opt != "undefined" && !opt.applyfilter) applyfilter = false;
  //if (dsrc.length > 0)
  //    data = JSON.parse(dsrc.text());
  if (typeof datalist != "undefined" && datalist != "") {
    dtlist = datalist;
  }
  else if ($("#spdtlist").text() != "") {
    dtlist = JSON.parse($("#spdtlist").text());
  }
  if (typeof data != "undefined" && data != "") {
    if (data.hasOwnProperty("datalist")) {
      rtn = data.datalist;
      filter = datafilterreturn(data);
    } else if (data.dtype == "database") {
      if (data.hasOwnProperty("querylist")) {
        $(data.querylist).each(function (i, k) {
          if (k.sqlcommand == "select") {
            rtn = k.datalist;
            filter = k.filter;
          }
        });
      }
    } else {
      rtn = data.datalist;
      filter = data.filter;
    }
  }
  //if (dtlist != "") {
  //    rtn = dtlist;
  //    var fieldnum=$(Object.keys(rtn[0])).length;
  //    //clean up wrong data(all field blank or null)
  //    $(rtn).each(function (a, b) {
  //        var cnt=0;
  //        $(Object.keys(b)).each(function (c, d) {
  //            if (b[d] == "" | b[d] == null)
  //                cnt++;

  //        });
  //        if (cnt == fieldnum)
  //            rtn.splice(a, 1);
  //    });
  //}
  if (applyfilter && typeof filter != "undefined" && filter != "")
    rtn = applyFilter(rtn, filter);

  // //add missing field
  if (
    typeof data != "undefined" &&
    data.hasOwnProperty("datascheme") &&
    data.datascheme.length > 0
  ) {
    $(data.datascheme).each(function (i, k) {
      $(rtn).each(function (a, b) {
        if (!b.hasOwnProperty(k.fieldname)) b[k.fieldname] = "";
      });
    });
  }
  return rtn;
}
function datafilterreturn(data) {
  //find filter by datatype
  var rtn = "";
  if (typeof data != "undefined") {
    if (data.dtype == "database") {
      if (data.hasOwnProperty("querylist")) {
        $(data.querylist).each(function (i, k) {
          if (k.sqlcommand == "select") {
            rtn = k.filter;
          }
        });
      }
    } else rtn = data.filter;
  }
  return rtn;
}
function applyFilter(src, filter, option) {
  return src;
}
export const selectimctable = (menuid, subid, dvid) => {
  let rtn;
  //if ( selectimc("imclist", "", "code", dvid) != "")
  //    rtn = selectimc("imclist", "", "code", dvid);
  if (dvid != "" && typeof dvid != "undefined") {
    let list = menuMy("control"); //selectimc("imctable", menutoggle+"control")
    if (typeof list != "undefined")
      $.each(list, function (i, k) {
        if (k != null && k.dvid == dvid) {
          rtn = k;
        }
      });
  } else if (subid != "" && typeof subid != "undefined") {
    let list = menuMy("submenu"); //selectimc("imctable", menutoggle+"submenu")
    $.each(list, function (i, k) {
      if (k != null && k != "" && k.subid == subid) {
        rtn = k;
      }
    });
  } else if (menuid != "" && typeof menuid != "undefined") {
    let list = menuMy("menu"); //selectimc("imctable", menutoggle+"menu")
    $.each(list, function (i, k) {
      if (k != null && k != "" && k.menuid == menuid) {
        rtn = k;
      }
    });
  }
  return rtn;
};

export function selectimc(storename, dataname, keycode, keyvalue) {
  let json = "",
    json1 = "";
  let rtn = "";

  if (localStorage.getItem(storename) != null) {
    json = localStorage.getItem(storename);
    if (json != "" && json != "undefined") {
      json1 = JSON.parse(json);
      if ((dataname == "") | (dataname == "*")) {
        let olist = Object.keys(json1);
        $(olist).each(function (i, k) {
          let dt1 = [];
          $(json1[k]).each(function (a, b) {
            if (b != "") dt1.push(b);
            if (typeof keycode != "undefined" && b[keycode] == keyvalue)
              dt1.push(b);
          });
          //let dt1 = $.grep(json1[k], function (a) {
          //    return  a[keycode] == keyvalue;
          //});
          if (dt1.length > 0) rtn = dt1[0];
        });
      } else {
        if (typeof keycode != "undefined") {
          let dt1 = [];
          $(json1[dataname]).each(function (a, b) {
            if (b != "" && b[keycode] == keyvalue) dt1.push(b);
          });

          //let dt1 = $.grep(json1[dataname], function (a) {
          //    return a[keycode] == keyvalue;
          //});
          if (dt1.length > 0) rtn = dt1[0];
        } else {
          //$(json1[dataname]).each(function (i, k) {
          //    if (k == "")
          //        json1[dataname].splice(i, 1);
          //})
          rtn = json1[dataname];
        }
      }
    }
  }

  return rtn;
}
