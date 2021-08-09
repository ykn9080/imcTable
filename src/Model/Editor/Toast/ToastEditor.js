import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Button } from "antd";
import { Editor, Viewer } from "@toast-ui/react-editor";

const ToastEditor = (props) => {
  const editorRef = useRef();
  const [contents, setContents] = useState("");
  //editorRef = React.createRef();
  // useEffect(() => {
  //   const ui = editorRef.current.getInstance().invoke("getUI");
  //   const toolbar = ui.getToolbar();
  //   toolbar.addButton(
  //     {
  //       name: "fullscreen",
  //       tooltip: "fullscreen",
  //       $el: $('<button type="button"><!-- iCon--></button>'),
  //     },
  //     1
  //   );
  // }, []);
  // useEffect(() => {
  //   if (props.edit === false) {
  //     $(".te-toolbar-section").css("display", "none");
  //     $(".te-mode-switch-section").css("display", "none");
  //     $(".te-editor.te-tab-active").css("display", "none");
  //     $(".te-md-splitter").css("display", "none");
  //     $(".te-preview").css("width", "100%");
  //     console.log($(".te-preview").clientHeight);
  //     //setEdittype("wysiwyg");
  //   }
  // }, []);
  useEffect(() => {
    setContents(props.selcontent);
    let cont = "";
    if (props.selcontent) cont = props.selcontent;
    editorRef.current.getInstance().setMarkdown(`${cont}`);
  }, [props.selcontent]);
  // const youtubePlugin = (editor) => {
  //   const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  //   codeBlockManager.setReplacer("youtube", (youtubeId) => {
  //     const wrapperId = `yt${Math.random().toString(36).substr(2, 10)}`;
  //     setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);
  //     return `<div id="${wrapperId}"></div>`;
  //   });
  // };

  function renderYoutube(wrapperId, youtubeId) {
    const el = document.querySelector(`#${wrapperId}`);
    el.innerHTML = `<iframe allowfullscreen width="640" height="500" src="https://www.youtube.com/embed/${youtubeId}"></iframe>`;
  }

  const handleSave = () => {
    console.log("clicked", editorRef.current.getInstance().getMarkdown());
    //editorRef.current.getRootElement().classList.add("my-editor-root");

    setContents(editorRef.current.getInstance().getMarkdown());
    if (props.onSave)
      props.onSave(editorRef.current.getInstance().getMarkdown());
  };

  function uploadImage(blob) {
    let formData = new FormData();

    formData.append("image", blob);

    return axios("http://localhost:3001/imageupload", {
      method: "POST",

      data: formData,

      headers: { "Content-type": "multipart/form-data" },
    }).then((response) => {
      if (response.data) {
        if (this.state.thumbnailcheck === 0) {
          this.setState({
            thumbnailchekc: 1,

            thumbnail: response.data,
          });
        }

        return response.data;
      }

      throw new Error("Server or network error");
    });
  }

  const toolbarItems = [
    "heading",
    "bold",
    "italic",
    "strike",
    "divider",
    "hr",
    "quote",
    "divider",
    "ul",
    "ol",
    "task",
    "indent",
    "outdent",
    "divider",
    "table",
    "image",
    "link",
    "divider",
    "code",
    "codeblock",
  ];
  console.log(props.edit);
  return (
    <>
      {props.edit ? (
        <>
          <Editor
            previewStyle="vertical"
            height="800px"
            initialEditType={"markdown"}
            initialValue={contents}
            ref={editorRef}
            // plugins={[youtubePlugin]}
            toolbarItems={toolbarItems}
            hooks={{
              addImageBlobHook: async (fileOrBlob, callback, source) => {
                const uploadedImageURL = await uploadImage(fileOrBlob);
                callback(uploadedImageURL, "alt text");
                return false;
              },
            }}
          />
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </>
      ) : (
        <Viewer
          initialValue={contents}
          ref={editorRef}
          // plugins={[youtubePlugin]}
        />
      )}
    </>
  );
};
export default ToastEditor;
