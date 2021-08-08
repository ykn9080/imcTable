import React, { useState, useEffect } from "react";
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentState, setContentState] = useState();
  useEffect(() => {
    if (props.content) content = props.content;
    const contentState = convertFromRaw(content);
    const editorstate = EditorState.createWithContent(contentState);
    setEditorState(editorstate);
  }, []);
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const onContentStateChange = (contentState) => {
    setContentState(contentState);
    props.onContentStateChange(contentState);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        onContentStateChange={onContentStateChange}
      />
      <div style={{ width: 500 }}>
        <textarea
          row={15}
          width="100%"
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </div>
      <div>{draftToHtml(convertToRaw(editorState.getCurrentContent()))}</div>
    </div>
  );
};

export default Reditor;
