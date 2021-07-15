import React from "react";
import { useSelector,  } from "react-redux";

export const EditForm = () => {
  let show = useSelector(state => state.global.menuedit);
  return show ? <h1>input form</h1> : "";
};
