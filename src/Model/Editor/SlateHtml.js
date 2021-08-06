import * as React from "react";
import { Editor as SlateEditor } from "slate-react";
import { Value } from "slate";
import { Toolbar, Button } from "@material-ui/core";
import { isKeyHotkey } from "is-hotkey";

const existingValue = JSON.parse(localStorage.getItem("content"));
const initialValue = Value.fromJSON(
  existingValue || {
    object: "value",
    document: {
      object: "document",
      nodes: [
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              text: "This is editable ",
            },
            {
              object: "text",
              text: "rich",
              marks: [{ type: "bold" }],
            },
            {
              object: "text",
              text: " text, ",
            },
            {
              object: "text",
              text: "much",
              marks: [{ type: "italic" }],
            },
            {
              object: "text",
              text: " better than a ",
            },
            {
              object: "text",
              text: "<textarea>",
              marks: [{ type: "code" }],
            },
            {
              object: "text",
              text: "!",
            },
          ],
        },
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              text: "Since it's rich text, you can do things like turn a selection of text ",
            },
            {
              object: "text",
              text: "bold",
              marks: [{ type: "bold" }],
            },
            {
              object: "text",
              text: ", or add a semantically rendered block quote in the middle of the page, like this:",
            },
          ],
        },
        {
          object: "block",
          type: "block-quote",
          nodes: [
            {
              object: "text",
              text: "A wise quote.",
            },
          ],
        },
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              text: "Try it out for yourself!",
            },
          ],
        },
      ],
    },
  }
);

const DEFAULT_NODE = "paragraph";

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

// Define our app...
class RichText extends React.Component {
  editor = React.createRef();
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue,
  };

  ref = (editor) => (this.editor = editor);

  hasMark = (type) => {
    const { value } = this.state;
    return value.activeMarks.some((mark) => mark.type === type);
  };

  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some((node) => node.type === type);
  };

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    if (value.document != this.state.value.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem("content", content);
    }

    this.setState({ value });
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  onClickMark = (type) => (event) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  onClickBlock = (type) => (event) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some((block) => {
        return !!document.getClosest(
          block.key,
          (parent) => parent.type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <IconButton active={isActive} onMouseDown={this.onClickMark(type)}>
        <i className="material-icons">{icon}</i>
      </IconButton>
    );
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].indexOf(type) !== -1) {
      const {
        value: { document, blocks },
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <IconButton active={isActive} onMouseDown={this.onClickBlock(type)}>
        <i className="material-icons">{icon}</i>
      </IconButton>
    );
  };

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (props.node.type) {
      case "code":
        return <CodeNode {...props} />;
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  // Render the editor.
  render() {
    return (
      <div>
        <Toolbar
          style={{
            backgroundColor: "#e2e2e2",
            height: 50,
            minHeight: 50,
            padding: "0 0.5rem",
            color: "#777",
          }}
        >
          {this.renderMarkButton("bold", "format_bold")}
          {this.renderMarkButton("italic", "format_italic")}
          {this.renderMarkButton("underlined", "format_underlined")}
          {this.renderMarkButton("code", "code")}
          {this.renderBlockButton("heading-one", "looks_one")}
          {this.renderBlockButton("heading-two", "looks_two")}
          {this.renderBlockButton("block-quote", "format_quote")}
          {this.renderBlockButton("numbered-list", "format_list_numbered")}
          {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
        </Toolbar>
        <SlateEditor
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
          autoFocus={true}
          spellCheck={true}
          placeholder="Enter some values"
        />
      </div>
    );
  }
}

const CodeNode = (props) => (
  <pre {...props.attributes}>
    <code>{props.children}</code>
  </pre>
);

const IconButton = (props) => {
  const { active, ...rest } = props;
  return (
    <Button
      color={active ? "primary" : "inherit"}
      style={{ minWidth: 40, width: 40 }}
      {...rest}
    />
  );
};

export default RichText;
