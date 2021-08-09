import React, { useEffect } from "react";
import { DefaultEditor } from "react-simple-wysiwyg";

const SimpleEditor = (props) => {
  const [html, setHtml] = React.useState("my <b>HTML</b>");
  useEffect(() => {
    setHtml(props.html);
  }, [props]);
  function onChange(e) {
    setHtml(e.target.value);
    localStorage.setItem("editcontent1", e.target.value);
  }

  return <DefaultEditor value={html} onChange={onChange} />;
};
export default SimpleEditor;
