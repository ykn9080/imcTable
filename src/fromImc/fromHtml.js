
import $ from "jquery";
import { funLoading } from "./core";
import { useSelector } from "react-redux";

const gb = useSelector(state => state.global);
function lazyLoadImages() {
  // get all images with 'lazyload' class
  var $images = $(".deferload");

  // if there are images on the page run through each and update src
  if ($images.length > 0) {
    $($images).each(function(i) {
      var image_url = $(this).attr("data-src");
      $(this).prop("src", image_url);

      // debugging
      var $lognumber = i + 1;
      console.log("Image No." + $lognumber + " loaded");
    });
  }
}
export function toggleLogin(type) {
  $(document).unbind("keypress");
  switch (type) {
    case "login":
      $("#form1").hide();
      $("#exTab2").show();
      $("body").css("background-color", "");
      setTimeout(function() {
        $("a[href$='dvLogin']").click();
      }, 100);
      $(document).keypress(function(e) {
        if (e.which == 13) {
          $("input[value='Log In']").click();
        }
      });
      break;
    case "join":
      $("#form1").hide();
      $("#exTab2").show();
      $("body").css("background-color", "");
      setTimeout(function() {
        $("a[href$='dvJoin']").click();
        $(
          '<button id="btnCancel1" class="btn btn-secondary btn-lg btn-block" lang="en">Cancel</button>'
        ).insertAfter($("#btnRegister"));
        $("#btnCancel1").click(function() {
          toggleLogin("cancel");
        });
      }, 1000);
      break;
    case "logout":
      var tb = JSON.parse(localStorage.getItem("imctable"));
      if (tb == null) return false;
      $([
        "menu",
        "submenu",
        "control",
        "adminmenu",
        "adminsubmenu",
        "admincontrol"
      ]).each(function(i, k) {
        if (tb.hasOwnProperty(k)) delete tb[k];
      });
      localStorage.setItem("imctable", JSON.stringify(tb));
      localStorage.removeItem("imcsetting");
      localStorage.removeItem("imccss");
      localStorage.removeItem("imcsystem");
      localStorage.removeItem("token");
      localStorage.removeItem("imclist");
      //$.removeCookie('imcvisit', { path: '/' });
      gb.menutoggle = "open";
      //pageInit();
      break;
    case "cancel":
      $("#form1").show();
      $("#exTab2").hide();
      $("body").css("background-color", "rgb(239, 239, 231)");
      break;
  }
}
function editUser(id) {
  // window.location.assign("/setting/admin/usermanage.aspx?code=" + id);
  funLoading(true);
  $("#tableinsert").remove();
  $("#dvamin").remove();
  $("#ifuseredit").remove();
  $("<div id='dvadmin' style='padding:0 10px 0 5px'/>").insertAfter(
    $("#dvTitle")
  );
  //.append("<iframe id='ifuseredit' style='border: 0px;' onload='funStop()' src='/setting/admin/usermanage.aspx?code=" + id+"' width='100%' min-height='700px'></iframe>")
  $("#dvName")
    .find("label")
    .text("User Edit");
  //$('#ifuseredit').load(function () {
  //    this.style.height = parseInt(this.contentWindow.document.body.offsetHeight) + 50 + 'px';
  //});
}

function triggerHtmlEvent(element, eventName) {
  var event;
  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
  } else {
    event = document.createEventObject();
    event.eventType = eventName;
    element.fireEvent("on" + event.eventType, event);
  }
}
$(".translation-links a").click(function(e) {
  e.preventDefault();
  var lang = $(this).data("lang");
  $("#google_translate_element select option").each(function() {
    if (
      $(this)
        .text()
        .indexOf(lang) > -1
    ) {
      $(this)
        .parent()
        .val($(this).val());
      var container = document.getElementById("google_translate_element");
      var select = container.getElementsByTagName("select")[0];
      triggerHtmlEvent(select, "change");
    }
  });
});
