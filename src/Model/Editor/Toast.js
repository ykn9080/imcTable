import React, { useState, useEffect } from "react";

import { Tag, Typography } from "antd";
import ToastEditor from "Model/Editor/Toast/ToastEditor";
const Toast = (props) => {
  const [selcontent, setSelcontent] = useState();
  const [node, setNode] = useState();
  const [initialValues, setInitialValues] = useState();
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (props.edit) setEdit(props.edit);
  }, []);

  const onSave = (contents) => {
    let val1 = {},
      val2;
    let local = localStorage.getItem("helpsummray");
    if (local) {
      local = JSON.parse(local);
      val1 = {
        title: local.title,
        desc: local.desc,
        link: local.link,
        tag: local.tag,
        type: local.type,
        related: local.related,
        contents: contents,
      };
    }
    val2 = { ...node, contents: contents, ...val1 };

    // let config = {
    //   method: "post",
    //   url: `${currentsetting.webserviceprefix}help`,
    //   data: { ...val2, pid: node.pid },
    // };
    // if (node._id) {
    //   config.method = "put";
    //   config.url += "/" + node._id;
    // }

    // axios(config).then((r) => {
    //   message.info("File Saved");
    //   helpcontent.map((k, i) => {
    //     if (k._id === node._id) helpcontent.splice(i, 1, config.data);
    //     return null;
    //   });
    //   dispatch(globalVariable({ help: helpcontent }));
    //   setReload(true);
    // });
    // localStorage.removeItem("helpsummray");
  };
  return (
    <div>
      <ToastEditor
        previewStyle="vertical"
        height="100%"
        // edit={edit}
        //initialEditType={edittype}
        //initialValue={contents}
        edit={edit}
        selcontent={selcontent}
        onSave={onSave}
      />
      {!edit && <ViewTail initialValues={initialValues} />}
    </div>
  );
};

export const ViewTail = (props) => {
  console.log(props.initialValues);
  let tags = [];
  if (props?.initialValues?.tag) tags = props.initialValues.tag;
  return (
    <>
      <h2>ViewTail</h2>
      {tags.map((tag) => {
        return <Tag color="purple">{tag}</Tag>;
      })}
    </>
  );
};
export default Toast;
