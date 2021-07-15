import $ from "jquery";
import Swal from "sweetalert2";

function sweetmsg(title, body, icon) {
  if ((typeof body === "undefined") | (body === ""))
    Swal.fire({ title: "", text: title });
  else Swal.fire({ title: title, text: body });

  // Swal.fire({
  //   icon: "error",
  //   title: title,
  //   text: body,
  //   footer: "<a href>Why do I have this issue?</a>"
  // });
}

function sweetmsgautoclose(title, body, options) {
  var timer = 2500;
  if (typeof options !== "undefined") {
    if (options.hasOwnProperty("timer")) timer = options.timer;
  }
  if ((typeof body === "undefined") | (body === ""))
    Swal.fire({
      title: "",
      text: title,
      timer: timer,
      showConfirmButton: false,
    });
  else
    Swal.fire({
      title: title,
      text: body,
      timer: timer,
      showConfirmButton: false,
    });
}
function idMake(option) {
  var d = new Date();
  var yr = d.getFullYear().toString().substr(2, 2);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hr = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  var msec = d.getMilliseconds();
  var id =
    yr +
    (("" + month).length < 2 ? "0" : "") +
    month +
    (("" + day).length < 2 ? "0" : "") +
    day +
    hr +
    min +
    sec;
  if (typeof option != "undefined") {
    //leaver the num from right side
    id += msec;
    var num = id.length - parseInt(option);
    id = id.substring(num);
  }
  return id;
}

const sweetmsgLoading = (confirmfunc, option) => {
  let timerInterval;
  Swal.fire({
    title: option?.title || "Auto close alert!",
    html: option?.html || "I will close in <b></b> milliseconds.",
    timer: option?.timer || 2000,
    timerProgressBar: option?.timerProgressBar || true,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const content = Swal.getContent();
        if (content) {
          const b = content.querySelector("b");
          if (b) {
            b.textContent = Swal.getTimerLeft();
          }
        }
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if ((result.dismiss === Swal.DismissReason.timer) | result.isConfirmed) {
      console.log("I was closed by the timer");
      confirmfunc();
    }
  });
};

const sweetmsgconfirm1 = (confirmfunc, option) => {
  Swal.fire({
    title: option?.title || "Are you sure?",
    text: option?.text || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      confirmfunc();
    }
  });
};
const sweetmsgconfirm = (confirmfunc, option) => {
  var title = "Delete Confirm",
    body = "Are your sure to delete?",
    cookiekey = "cookie" + idMake();
  if (typeof option != "undefined") {
    if (option.hasOwnProperty("title")) title = option.title;
    if (option.hasOwnProperty("body")) body = option.body;
    if (option.hasOwnProperty("cookiekey")) cookiekey = option.cookiekey;
  }
  // body =
  //   "<div>" +
  //   body +
  //   "</div><div style='margin:0'><label id='cbcookie' type='checkbox'><i class='fa fa-square-o imdim'/>Don't ask</label></div>";
  Swal.fire({
    title: title,
    text: body,
    html: true,
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, do it!",
    cancelButtonText: "No, cancel!",
    closeOnConfirm: true,
    closeOnCancel: true,
  }).then((isConfirm) => {
    console.log(isConfirm);
    if (isConfirm.value) {
      switch (typeof confirmfunc) {
        case "string":
          eval(confirmfunc);
          break;
        case "function":
          confirmfunc();
          break;
        default:
          return null;
      }
    }
  });
};
function clearinserted() {
  //remove all the inserted
  $("#spdlist").remove();
  $("#archivegdt").remove();
  $("#spdataajax").remove();
}

export {
  sweetmsg,
  sweetmsgautoclose,
  sweetmsgconfirm,
  sweetmsgconfirm1,
  clearinserted,
  sweetmsgLoading,
};
