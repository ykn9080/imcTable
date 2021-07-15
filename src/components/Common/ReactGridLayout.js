import React, { useState, useEffect } from "react";
import _ from "lodash";
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import "./react-grid-layout.css";
import "./react-resizable.css";
import { Popconfirm } from "antd";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AuthorChart from "Model/Authoring/AuthorChart";
import AuthorGraph from "Model/Authoring/AuthorGraph";
import AuthorTable from "Model/Authoring/AuthorTable";
import AuthorMatrix from "Model/Authoring/AuthorMatrix";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const GridLay = (props) => {
  const defaultProps = {
    className: "layout",
    // items: 20,
    rowHeight: 100,

    measureBeforeMount: false,
    // mounted: false,
    //autoSize: false,
    compactType: null,
    currentBreakpoint: "lg",
    useCSSTransforms: true,
    preventCollision: false,

    // onDrop: { onDrop },
    // isDraggable: false,
    // isResizable: false,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },

    // isDroppable: true,
  };

  // useEffect(() => {
  //   $(".MuiCard-root").css("overflow", "auto");
  // }, []);
  props = { ...defaultProps, ...props };

  let ww = 3,
    hh = 6;
  if (props.w) ww = props.w;
  if (props.h) hh = props.h;
  const itemCreate = (arr) => {
    return arr.map(function (k, i) {
      const y = 6,
        x = 3;
      return {
        i: i.toString(),
        title: k.title,
        x: (i * 3) % (cols || 12),
        y: Math.floor(i / x) * y,
        w: ww,
        h: hh,
      };
    });
  };
  useEffect(() => {
    if (props.resultsLayout) setItems(props.resultsLayout);
    else setItems(itemCreate(props.children));
  }, []);
  //const layout1 = generateLayout();
  const [layout, setLayout] = useState();
  const [items, setItems] = useState();
  const [newCounter, setNewCounter] = useState(0);
  const [breakpoint, setBreakpoint] = useState(null);
  const [cols, setCols] = useState(null);

  const onLayoutChange = (layout) => {
    //if (props.onLayoutChange)
    props.onLayoutChange(layout);
  };

  const CreateContent = (k) => {
    return (() => {
      switch (k.type) {
        case "table":
          return <AuthorTable authObj={k} />;
        case "matrix":
          return <AuthorMatrix obj={k} />;
        case "chart":
          return <AuthorChart authObj={k} />;
        case "graph":
          return <AuthorGraph authObj={k} />;
        default:
          break;
      }
    })();
  };
  let contentarr = [];
  if (props.children) contentarr = props.children;
  const createElement = (el) => {
    let removeStyle = {
      position: "absolute",
      right: "5px",
      top: "5px",
      cursor: "pointer",
    };
    if (props.remove === false)
      removeStyle = { ...removeStyle, display: "none" };
    const i = el.i;
    return (
      <div key={i} data-grid={el}>
        {/* <span className="text">{i}</span> */}
        {/* {contentarr[i].content} */}
        <CreateContent {...el} />
        <Popconfirm
          placement="top"
          title={"Delete?"}
          onConfirm={() => onRemoveItem(i)}
          okText="Yes"
          cancelText="No"
        >
          <span className="remove" style={removeStyle}>
            <HighlightOffIcon />
          </span>
        </Popconfirm>
      </div>
    );
  };

  let childcomponent = [];
  if (items) childcomponent = _.map(items, (el) => createElement(el));
  // const onAddItem = () => {
  //   /*eslint no-console: 0*/
  //   console.log("adding", "n" + newCounter);
  //   setNewCounter(newCounter + 1);
  //   let newitems = items.concat({
  //     i: "n" + newCounter,
  //     x: (items.length * 2) % (cols || 12),
  //     y: Infinity, // puts it at the bottom
  //     w: 2,
  //     h: 2,
  //   });
  //   setItems(newitems);
  // };

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint, cols) => {
    setBreakpoint(breakpoint);
    setCols(cols);
  };
  const onRemoveItem = (i) => {
    let removedItems = _.reject(items, { i: i });
    setItems([...removedItems]);
  };
  const onDrop = (elemParams) => {
    setNewCounter(newCounter + 1);
    let newitems = items.concat({
      ...elemParams,
      i: "n" + newCounter,
    });
    setItems(newitems);
  };

  return (
    <ResponsiveReactGridLayout
      onLayoutChange={onLayoutChange}
      layout={layout}
      onDrop={onDrop}
      onBreakpointChange={onBreakpointChange}
      isDroppable={true}
      {...props}
      currentBreakpoint={breakpoint}
    >
      {childcomponent}
    </ResponsiveReactGridLayout>
  );
};

export default GridLay;
