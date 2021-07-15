import axios from "axios";
import { currentsetting } from "./config_del";
import { sweetmsgautoclose } from "fromImc/Common_make";
import { trackPromise } from "react-promise-tracker";

export const remotelogin = (username, password, props) => {
  console.log(username, password);
  trackPromise(
    axios({
      method: "post",
      url: currentsetting.webserviceprefix + "login",
      data: {
        username: username,
        password: password,
      },
    }).then((response) => {
      //console.log(response.data.file);

      if (response.data.hasOwnProperty("token")) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "imcsetting",
          JSON.stringify({ login: response.data.user })
        );
        localStorage.setItem("imcsystem", JSON.stringify(response.data.system));
        localStorage.setItem("imctable", response.data.file);
        localStorage.setItem("imclist", response.data.list);
        localStorage.setItem("imcdata", response.data.dtsrc);
        localStorage.setItem("menu", response.data.menu);
        // let store = createStore(
        //   glovalVariableReducer,
        //   window.STATE_FROM_SERVER
        // );
        // store.dispatch(globalVariable({ tt: "ss" }));

        //toggleLogin('cancel');
        //pageInit();
        sweetmsgautoclose("success", "very bood");
        props.history.push(`/`);
      } else {
        console.log(response.data.message);
      }
    })
  );
};
