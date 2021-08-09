import React, { useState, useEffect } from "react";
import $ from "jquery";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

let content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "Initialized from content state.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};
const Reditor = (props) => {
  console.log(props);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentState, setContentState] = useState();
  const [htmlcontent, setHtmlcontent] = useState("");

  useEffect(() => {
    if (props.content) content = props.content;
    const contentState = convertFromRaw(content);
    const editorstate = EditorState.createWithContent(contentState);
    setEditorState(editorstate);
  }, []);
  //   useEffect(() => {
  //     if (editorState) {
  //       var myString = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //       var $jQueryObject = $($.parseHTML(myString));
  //       setHtmlcontent($jQueryObject.html());
  //     }
  //   }, [editorState]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const onContentStateChange = (contentState) => {
    setContentState(contentState);
    props.onContentStateChange(contentState);
  };

  return (
    <div>
      {(() => {
        switch (props.type) {
          case "view":
            <div id="dvHtml">{htmlcontent}</div>;
            return;
          default:
            return (
              <>
                <Editor
                  editorState={editorState}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  onEditorStateChange={onEditorStateChange}
                  onContentStateChange={onContentStateChange}
                />

                <textarea
                  value={draftToHtml(
                    convertToRaw(editorState.getCurrentContent())
                  )}
                />
              </>
            );
        }
      })()}
      <div id="dvHtml"></div>
    </div>
  );
};

export default Reditor;
