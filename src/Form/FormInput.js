import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";

import AntFormBuild from "Form/AntFormBuild";

const FormInput = (props) => {
  const dispatch = useDispatch();

  let formdt = props.formdt; // useSelector((state) => state.global.currentData);
  console.log(formdt);
  const onFinish = (val) => {
    console.log(val);
    if (props.onFinish) props.onFinish(val);
  };
  const formdt1 = {
    data: {
      setting: {
        formItemLayout: {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        },
        layout: "horizontal",
        formColumn: 1,
        size: "middle",
        onFinish: { onFinish },
      },
      list: [],
    },
  };
  useEffect(() => {
    if (!formdt | (formdt === "")) {
      formdt = formdt1;
      dispatch(globalVariable({ currentData: formdt }));
    }
  }, []);

  return (
    <>
      <AntFormBuild formdt={formdt} />
    </>
  );
};

export default FormInput;
