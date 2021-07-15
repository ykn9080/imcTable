import React from "react";
import $ from "jquery";
import { selectimc} from "./Common_data";
import { getlogin } from "./core";
import { useSelector } from "react-redux";

const gb = () => {
  const gg = useSelector(state => state.global);
  return <>gg</>;
};
export function menuMy(menu, menutype) {
  if (typeof menutype == "undefined") menutype = gb.menutoggle;
  let sl, grp;
  let storename = "imctable";
  //if (menutype == "template")
  //    storename = 'imclist';
  // menutype = menutypereturn();
  let mm = selectimc(storename, menutype + menu);
  if (typeof mm == "undefined") {
    return [];
    return false;
  }
  {
    let my = getlogin();
    if (my != "" && gb.menutoggle != "open") {
      sl = [];
      if (my.hasOwnProperty("slevel")) sl = permissionarray(my.slevel);
      grp = permissionarray(my.group);

      $(mm).each(function(i, k) {
        let chk = false;
        if (k.hasOwnProperty("permission") && k.permission != "") {
          let list = k.permission.split(",");
          $(list).each(function(a, b) {
            if (a == 0 && $.inArray(b, grp) == -1) chk = true;
            if (a == 1 && sl.length > 0 && $.inArray(b, sl) == -1) chk = true;
          });
          if (chk) mm.splice(i, 1);
        }
      });
    }
  }

  return mm;
}
export function permissionarray(my) {
  let myarr = [];
  switch (my) {
    case "SystemAdmins":
      my = ["CommonAdmins", "CommonUsers", "SystemAdmins"];
      break;
    case "CommonAdmins":
      my = ["CommonAdmins", "CommonUsers"];
      break;
    case "CommonUsers":
      my = ["CommonUsers"];
      break;
    case "SL00000004":
      my = ["SL00000004", "SL00000003", "SL00000002", "SL00000001"];
      break;
    case "SL00000003":
      my = ["SL00000003", "SL00000002", "SL00000001"];
      break;
    case "SL00000002":
      my = ["SL00000002", "SL00000001"];
      break;
    case "SL00000001":
      my = ["SL00000001"];
      break;
  }
  return my;
}
// export const menuInit = extlink => {
//   funStop();
//   let imc = localStorage.getItem("imctable");
//   if ((imc == null) | (imc == "") | isrefreshready()) {
//     let id = "";
//     if (getlogin() != "") id = getlogin().id;
//     let myinfo = gb.mycomp + "," + id;
//     if (gb.mycomp == "") myinfo = "";
//     funLoading();
//     jsonReadMyAjax("imctable", myinfo, "", "", "", menuInit);
//     return false;
//   }
//   menuAdminInit();
//   menuHead(extlink);
//   // menuSide(extlink);
//   //cssInsert("menu-css", "/js2/menu_slide/menu.css");
//   menuMain(extlink);
//   $("#menu")
//     .find("ul")
//     .find("a")
//     .css("width", $("#menu").css("width"));
//   imc = localStorage.getItem("imctable");
//   findsubid(JSON.parse(imc));
//   setTimeout(function() {
//     $("#main-menu>li>ul>li>a[subid='" + gb.subid + "']").click();
//   }, 500);

//   //if first login CommonAdmins, dialog shows to setup company setting
//   if (
//     getlogin().group == "CommonAdmins" &&
//     $("#dvsetup").length == 0 &&
//     ($.cookie("noaskdel_setupinit") == null) |
//       ($.cookie("noaskdel_setupinit") == "false")
//   ) {
//     setupdialog();
//     $("#cbsetupinit").on("change", function() {
//       switch ($(this).is(":checked")) {
//         case true:
//           $.cookie("noaskdel_setupinit", true, { expires: 1 });
//           break;
//         case false:
//           $.removeCookie("noaskdel_setupinit", { path: "/" });
//           break;
//       }
//     });
//   }

//   function setupdialog() {
//     let contain = $("<div id='dvsetup'/>");
//     contain.append(makejumbotron());

//     contain.dialog({
//       autoOpen: true,
//       width: 800,
//       modal: true,
//       title: "Setup company detail",
//       close: function(event, ui) {
//         $(this)
//           .dialog("destroy")
//           .remove();
//       },
//       buttons: [
//         {
//           text: "Setup Now!!",
//           click: function() {
//             menuAdmin();
//             menutoggle = "admin";
//             loadwizard();
//             $(this)
//               .dialog("destroy")
//               .remove();
//           }
//         },
//         {
//           text: "Later",
//           click: function() {
//             $(this)
//               .dialog("destroy")
//               .remove();
//           }
//         }
//       ]
//     });
//     $(".ui-dialog-buttonset")
//       .addClass("form-inline")
//       .prepend(
//         makebootcustom("checkbox", ["Do not show again"], "cbsetupinit")
//       );
//   }

//   funStop();
// };

// export function menuHead(extlink) {
//   let person = selectimc("imcsetting", "personal");
//   // let gtran = false;
//   // if (typeof person != "undefined") {
//   //     if (person.hasOwnProperty("use_googletrans"))
//   //         gtran = JSON.parse(person.use_googletrans);
//   // }
//   $.fn.reverse = [].reverse;
//   $("#main-top").remove();
//   let topm = menuMy("menu"); //selectimc("imctable", menutoggle + "menu");
//   let shead = "clean";
//   if (typeof topm != "undefined" && topm.hasOwnProperty("topmenu"))
//     shead = topm[0].topmenu;
//   let ul = $(
//     '<ul id="main-top" style="margin-bottom:2px" class="sm sm-' + shead + '"/>'
//   ).prependTo($("form")[0]);
//   let ins = ["user", "globe", "cog", "question-circle"];
//   if (getlogin() == "") ins.splice(2, 1); //before login hide cog
//   if (isMobile()) {
//     ins.splice(ins.indexOf("cog"), 1);
//     ins.splice(ins.indexOf("question-circle"), 1);
//   }
//   //if (menutoggle == "open") ins = ["user", "globe", "question-circle"];
//   $(ins)
//     .reverse()
//     .each(function(i, k) {
//       let ahr = $("<a class='imdim'></a>");
//       let icon = $("<i class='fa fa-" + k + "'/>");
//       let txt = $("<span>test</span>");
//       ahr.append(icon);
//       let ll = $("<li/>");
//       if (k == "globe") ll = $("<li class='language' />");
//       ll.append(ahr).appendTo(ul);
//       let ulc = $("<ul>"),
//         str = "";
//       switch (k) {
//         case "user":
//           let id = getuserid1();
//           if (id != "") {
//             ahr.append(
//               $(`<span lang='en' onClick={editUser(${id})}>" + id + "</span>`)
//             );
//             str = `<li><a id='alog' lang='en' onClick={() => { toggleLogin('logout');pageInit();}}>Log Out</a><li>`;
//             str += `<li><a lang='en'  onClick={editUser(${id})} >User Setting</a><li>`;
//           } else {
//             str =
//               "<li><a id='alog' lang='en' onClick={toggleLogin('login')} >Log In</a><li>";
//             str +=
//               "<li><a lang='en' onClick={toggleLogin('join')} >Join</a><li>";
//           }

//           break;
//         // case "globe":
//         //     if (!gtran) {
//         //         let obj = [];// = Lang.prototype.pack;
//         //         multilangReadListAjax();
//         //         if (jsonlist != "") obj = jsonlist.split(';');
//         //         let set = $.merge(['en', 'us'], obj);
//         //     }
//         //     break;
//         case "cog":
//           ahr.attr("onClick", "()=>{menuAdmin();menutoggle='admin'}");
//           //ahr.append($("<span lang='en' onClick='editUser()'>" + id + "</span>"));
//           str =
//             "<li><a onClick={()=>{menuAdmin();menutoggle='admin'} lang='en'>Admin Page</a><li>";
//           str += "<li><a id='ahbuild' lang='en'>Page Build</a><li>";
//           str += "<li><a id='ahmenu' lang='en'>Menu Edit</a><li>";
//           // str += "<li><a id='areload' lang='en'>Menu Reload</a><li>";
//           // str += "<li><a id='ashowmenu' lang='en'>Menu Show</a><li>";

//           //ll.attr("onClick", "menutoggle='admin';menuAdmin();setTimeout(function(){adminpage('page')},100);");
//           break;
//         // case "question-circle":
//         //     ahr.on("click", function () {
//         //         if ($("#dvName>label").text() == "CSSEdit")
//         //             helpclick("cssedit");
//         //         else
//         //             helpclick();

//         //     });

//         //     break;
//       }
//       if (str != "") {
//         // if(k=="user")
//         //ll.attr("onClick", ($(str).children().first().attr("onClick")));
//         ulc.appendTo(ll);
//         $(str).appendTo(ulc);
//         $("#ahmenu").click(function() {
//           $("#header-wrapper").remove();
//           //menutoggle = "";
//           adminpage("menu");
//           $("#dvName")
//             .empty()
//             .append(
//               $(
//                 `<label id='lbedit' style={{fontSize:"26px",margin:{"20px", 0,0,0}}}>Menu Edit</label>`
//               )
//             );
//           ////$("<label style='font-size:2em;padding-top:10px;'>Menu Edit</label>").appendTo($("#dvName"));
//           //setTimeout(function () {
//           //    menuAdmin();
//           //    setTimeout(function () {
//           //        if ($("#lbedit").length == 0)
//           //            $("#dvName").append($("<label id='lbedit' style='font-size:2em;margin:20px 0 0 0;'>Menu Edit</label>"));

//           //    }, 1000);
//           // }, 2000);
//         });

//         $("#ahbuild").on("click", function(e) {
//           // if(timestamp==e.timeStamp) return false;
//           // timestamp=e.timeStamp;
//           //  console.log("ahbuild click", timestamp, e)
//           $("#header-wrapper").remove();
//           let curname = $("#dvName")
//             .find("label")
//             .text();
//           //menutoggle = "";
//           funLoading(true);

//           switch (gb.menutoggle) {
//             case "":
//               gb.umenuid = gb.menuid;
//               gb.usubid = gb.subid;
//               setTimeout(function() {
//                 adminpage("page");
//               }, 500);
//               // menutoggle = 'admin';
//               setTimeout(function() {
//                 menuMain();
//                 gb.menutoggle = "";
//               }, 1000);
//               break;
//             case "admin":
//               console.log("admin click");
//               // if (getlogin().comp == "1") {
//               //    sweetmsg("Ooops!", "you cannot edit admin menu! pls change after debugging");
//               //    funStop();
//               //    return false;
//               //}
//               //else {
//               $("#dvadmin").empty();
//               initEdit();
//               redips.init();
//               //adminfix = "menutoggle = 'admin'; menuMain();";
//               let onc = $("#inE").attr("onClick");
//               $("#inE").attr("onClick", onc);
//               //    }
//               break;
//             case "open":
//               adminpage("openpage");
//               break;
//             case "template":
//               adminpage("page");
//               break;
//           }
//           setTimeout(function() {
//             if ($("#lbedit").length == 0) {
//               if (curname != "")
//                 curname = ": " + curname.replace("Page Build :", "");
//               $("#dvName").empty();
//               $("#dvName").append(
//                 $(
//                   "<label id='lbedit' style='font-size:26px;margin:20px 0 0 0;'>Page Build " +
//                     curname +
//                     "</label>"
//                 )
//               );
//             }
//             funStop();
//           }, 300);
//         });
//         $("#areload").click(function() {
//           //menutoggle = "";
//           localStorage.removeItem("imctable");
//           localStorageinit({ reset: true }, pageInit);
//           $(
//             "<div>" +
//               JSON.stringify(
//                 JSON.parse(localStorage.getItem("imctable")).menu
//               ) +
//               "</div>"
//           ).dialog();
//         });
//         $("#ashowmenu").click(function() {
//           $(
//             "<div>" +
//               JSON.stringify(
//                 JSON.parse(localStorage.getItem("imctable")).menu
//               ) +
//               "</div>"
//           ).dialog();
//         });
//       }
//     });
//   ul.prepend(
//     $(
//       `<div id="splogo" onClick={()=>menuHome()} style={{margin:{"8px", 0, 0, "10px"},float:"left"}}><img style={{width:"120px"}} src="/images/logo/imcmaster.png"/>`
//     )
//   );
//   $("#main-top").smartmenus({
//     mainMenuSubOffsetX: -1,
//     mainMenuSubOffsetY: 4,
//     subMenusSubOffsetX: -1,
//     subMenusSubOffsetY: -6
//   });
//   $("#main-top").css({
//     "z-index": 10,
//     border: "none",
//     "background-color": "white"
//   });
//   $("#main-top >li").css({ float: "right" });

//   //     if (gtran) {
//   //         $("li.language,#google_translate_element").hover(
//   // function (e) {
//   //     let tp = parseInt(e.pageY) - 5, lf = parseInt(e.pageX) - 60;
//   //     let topbar = $(".skiptranslate");
//   //     if (topbar.find(".goog-te-banner-frame").length > 0 && $(topbar[0]).css("display") == "block") {
//   //         tp = parseInt(e.pageY) - 45;
//   //     }

//   //     $("#google_translate_element").css({ position: 'absolute', top: tp, left: lf }).show();
//   // }, function () {
//   //     setTimeout(function () { $("#google_translate_element").hide(); }, 3000);
//   // });
//   //    }
// }
// export const adminpage = pagename => {
//   //for admin menu: create div,insertafter dvTitle,remove `
//   $("#tableinsert").remove();
//   var clientid = "";
//   $("#dvadmin")
//     .show()
//     .empty();
//   $("#splistdata").remove();
//   if ($("#dvadmin").length == 0)
//     $(
//       "<div id='dvadmin' style={{paddingRight:10, paddingBottom:5}}/>"
//     ).insertAfter($("#dvTitle"));
//   var x = 0;
//   switch (pagename) {
//     case "datalist":
//       $("#dvadmin").append($(makeDatasrc()));
//       var dtsrc = selectimcdata("imcdata");
//       if (dtsrc == "")
//         jsonReadMyAjax("imcdata", gb.mycomp, "", "", "", dataList);
//       else dataList(dtsrc);
//       break;
//     case "dbmapping":
//       gb.pstatus = "";
//       $("#dvadmin").append(dbmaplayout());
//       dbmapshowhide("list");
//       jsonReadMyAjax("imcdata", gb.mycomp, "", "", "", gb.dbmaplist, []);
//       break;
//     case "csslist":
//       if ($("#dvCsscontain").length > 0) $("#dvCsscontain").remove();
//       $("#dvadmin").append($("<div id='dvCsscontain'/>"));
//       jsonReadAjax("imcsetting", "csslist", "", "", cssList);
//       break;
//     case "statmodel":
//       $("#dvadmin").append(statAuthorlist());
//       break;
//     case "content":
//     case "map":
//     case "form":
//     case "googlechart":
//     case "fullcalendar":
//     case "jstree":
//     case "jqgrid":
//     case "pivot":
//     case "html":
//     case "rstat":
//       gb.menutoggle = "admin";
//       jsonReadMyAjax("imclist", gb.mycomp, gb.pagename, "", "", archiveList, [
//         { type: gb.pagename }
//       ]);

//       //archiveList({type:pagename});
//       break;
//     case "menu":
//       //menutoggle = "";
//       menuEditInit();
//       //setTimeout(function () {
//       //menutoggle = "admin";
//       //mtogg = "admin";
//       //}, 500);
//       break;
//     case "page":
//       $("#dvadmin").empty();
//       initEdit();
//       redips.init();
//       x = 1000;
//       mtogg = "admin";

//       break;
//     case "openpage":
//       setTimeout(function() {
//         gb.menutoggle = "open";
//         //omenuid = "open1";
//         //var sub = selectimc("imctable", "opensubmenu");
//         //if (sub.length > 0)
//         //    osubid = sub[0].subid;
//         gb.omenuid = gb.menuid;
//         gb.osubid = gb.subid;
//         //menuid = omenuid; subid = osubid; //menuselected();
//         $("#dvadmin").empty();
//         initEdit();
//         redips.init();
//         menuEditReload();
//       }, 1000);
//       x = 1000;
//       mtogg = "admin";
//       break;

//     case "language":
//       funLoading(true);
//       multilangReadListAjax();
//       multilangReadAjax();
//       //multilangWordmake();
//       setTimeout(function() {
//         multilangList();
//         funStop();
//       }, 2000);
//       x = 2000;
//       break;
//     case "system":
//       funLoading(true);
//       console.log("imcsetting...", systemSetting);
//       jsonReadAjax("imcsetting", "system", "", "", systemSetting);
//       x = 1200;
//       break;
//     case "wizard":
//       setTimeout(function() {
//         loadwizard();
//       }, 0);
//       console.log(pagename);
//       funLoading(true);
//       x = 1200;
//       break;
//     default:
//       //funStop();
//       //setTimeout(function () {
//       //    menutoggle = "admin";
//       //    $("#dvadmin").empty(); initEdit(); redips.init(); menuEditReload();
//       //}, 1000);
//       //x = 1000;
//       //if (pagename != "undefined") {
//       //    var option = {};
//       //    option.src = pagename;
//       //    iframeappend("dvadmin", option);
//       //}
//       break;
//   }
//   setTimeout(function() {
//     jsonlang = "";
//     multilangInject();
//   }, x + 1000);
// };
// export function menuData(module) {
//   var treedata = [],
//     rtndata = {},
//     modumenu = [],
//     modusubmenu = [],
//     modusubmenu1 = [];
//   var modulearr = [moduleobj.code];
//   if (typeof module != "undefined") {
//     modulearr = module.split(",");
//   }
//   var mainlist = menuMy("menu"); //selectimc("imctable", "menu");
//   var ttllist = menuMy("submenu"); //selectimc("imctable", "submenu");

//   $.each(ttllist, function(i, k) {
//     if (k != null) {
//       var set = {},
//         modulechk = false;
//       set.id = k.subid;
//       if (k.hasOwnProperty("text")) set.text = k.text;
//       if (k.hasOwnProperty("parent")) set.parent = k.parent;
//       if (k.hasOwnProperty("icon")) set.icon = "fa " + k.icon;
//       treedata.push(set);
//       if (k.hasOwnProperty("module")) {
//         if ($.inArray(k.module, modulearr) > -1) modulechk = true;
//       } else modulechk = true;

//       if (modulechk) {
//         modusubmenu.push(k);
//         modusubmenu.sort(function(a, b) {
//           return parseFloat(a.odr) - parseFloat(b.odr);
//         });
//         modusubmenu1.push(k.menuid);
//       }
//     }
//   });
//   $.each(mainlist, function(i, k) {
//     if (k != null) {
//       var set = {};
//       set.parent = "#";
//       set.id = k.menuid;
//       if (k.hasOwnProperty("title")) set.text = k.title;
//       set.icon = "fa fa-folder";
//       treedata.push(set);
//       if (
//         k.hasOwnProperty("module") &&
//         ($.inArray(k.module, modulearr) > -1) |
//           ($.inArray(k.menuid, $.unique(modusubmenu1)) > -1)
//       ) {
//         modumenu.push(k);
//         modumenu.sort(function(a, b) {
//           return parseFloat(a.odr) - parseFloat(b.odr);
//         });
//       }
//     }
//   });
//   rtndata.menu = mainlist;
//   rtndata.submenu = ttllist;
//   rtndata.treedata = treedata;
//   rtndata.modumenu = modumenu;
//   rtndata.modusubmenu = modusubmenu;
//   return rtndata;
// }
// export function menuMainApp() {
//   var topm = menuMy("menu");
//   topm.sort(function(a, b) {
//     return parseFloat(a.odr) - parseFloat(b.odr);
//   });
//   var subm = menuMy("submenu");
//   var nav = $("#nav-panel");
//   var cururl = window.location.pathname; // /android_asset/www/index.html
//   //$("#main-menu").empty();
//   $("#dvTitle").remove();
//   $("#main-menu>li:not(:eq(0))").remove();
//   var ul = $("#main-menu"); //<ul id="main-menu" data-role="listview"/>').appendTo(nav);
//   $("<table id='dvTitle' width='100%'><tbody><tr/></tbody></table>").prependTo(
//     $("#dvContent123")
//   );
//   //$("<table id='dvTitle' width='100%'/>").prependTo($("#dvContent123"));
//   //}
//   $("<td id='dvName' style='padding:0 0 0 10px'/>").appendTo(
//     $("#dvTitle>tbody>tr")
//   );
//   var hr = "#",
//     defarr = ["/"];
//   // $('<li data-icon="delete"><a href="#" data-rel="close">MENU</a></li>').appendTo(ul).trigger('create');    ul.listview('refresh');
//   $(topm).each(function(i, k) {
//     hr = "/?menuid=" + k.menuid;
//     var ahr = $("<a lang='en' menuid='" + k.menuid + "'>" + k.title + "</a>");
//     var ll = $("<li/>");
//     var dt = $.grep(subm, function(a) {
//       return a.parent == k.menuid;
//     });
//     if (dt.length > 0) {
//       ll.attr("data-role", "collapsible");
//       ll.attr("data-iconpos", "right");
//       ll.attr("data-inset", "true");
//       ll.append($("<h2>" + k.title + "</h2>"));
//       ll.append(menuSub(dt)).appendTo(ul);
//     } else ll.append(ahr).appendTo(ul);
//     ul.append(ll).trigger("create");
//     ul.listview("refresh");
//   });

//   if (getuserid1() == "") menutoggle = "open";
//   var smenu = menuMy("submenu");
//   if (smenu.length > 0) {
//     var menuid1 = smenu[0].menuid,
//       subid1 = smenu[0].subid;
//   }
//   function menuSub(dt) {
//     var ulc = $("<ul data-role='listview' data-theme='b'>");
//     $(dt).each(function(i, k) {
//       hr = "#";
//       // hr = "/?menuid=" + k.menuid + "&subid=" + k.subid;
//       var ahr = $(
//         "<a  lang='en'   href='" +
//           hr +
//           "' menuid='" +
//           k.menuid +
//           "'  subid='" +
//           k.subid +
//           "' onclick=\"clickmenu('" +
//           k.menuid +
//           "','" +
//           k.subid +
//           "','" +
//           k.text +
//           "')\" >" +
//           k.text +
//           "</a>"
//       );
//       var ls = $("<li/>");
//       var dt1 = $.grep(subm, function(a) {
//         return a.parent == k.subid;
//       });
//       if (dt1.length > 0) {
//         ll.attr("data-role", "collapsible");
//         ll.attr("data-iconpos", "right");
//         ll.attr("data-inset", "true");
//         ll.append($("<h2>" + k.title + "</h2>"));
//         ls.append(menuSub(dt1)).appendTo(ulc);
//       } else ls.append(ahr).appendTo(ulc);
//     });
//     return ulc;
//   }
// }
// export function getcompmodule() {
//   getcompmodule.process = process;
//   jsonDataMyAjax("company", datasetRead, "", [
//     { callback: getcompmodule.process }
//   ]);
//   function process(datasrc) {
//     let dtlist = datalistreturn(datasrc);
//     $(dtlist).each(function(i, k) {
//       if (k.comp == getlogin().comp && k.module != "") {
//         $.globalEval("let mycompmodule='" + k.module + "';");
//       } else $.globalEval("let mycompmodule='basic';");
//     });
//   }
// }
