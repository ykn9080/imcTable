import React, { useRef, useState, useEffect } from "react";
import "./ContextMenu.css";

const ContextMenu = (props) => {
  const contextRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  let items = [],
    node = {};
  if (props.items) items = props.items;
  if (props.node) node = props.node;

  useEffect(() => {
    const click = (index, node) => {
      if (!index) {
        setVisible(false);
        setPosition({ x: 0, y: 0 });
        return false;
      }
      if (props.callback) {
        props.callback(index, JSON.parse(node));
      }
    };

    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();

      const clickX = event.clientX;
      const clickY = event.clientY;
      setVisible(true);

      const yoffset = contextRef.current?.clientHeight;
      if (yoffset) setPosition({ x: clickX + 20, y: clickY - yoffset - 30 });
    });
    document.addEventListener("click", function (event) {
      if (contextRef.current && contextRef.current.id === "customcontext") {
        click(
          event.target.getAttribute("index"),
          event.target.getAttribute("node")
        );
      }
      event.preventDefault();

      setVisible(false);
      setPosition({ x: 0, y: 0 });
    });
  }, []);

  const returnMenu = (items, node) => {
    var myStyle = {
      position: "absolute",
      top: `${position.y}px`,
      left: `${position.x + 5}px`,
    };

    return (
      <div
        className="custom-context"
        id="customcontext"
        style={myStyle}
        ref={contextRef}
      >
        {items.map((item, index, arr) => {
          return (
            <div
              key={index}
              className={
                arr.length - 1 === index
                  ? "custom-context-item-last"
                  : "custom-context-item"
              }
              index={index}
              node={JSON.stringify(node)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };
  return <div id="cmenu">{visible ? returnMenu(items, node) : null}</div>;
};

export default ContextMenu;
