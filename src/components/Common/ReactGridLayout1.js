import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import $ from "jquery";
import { Responsive, WidthProvider } from "react-grid-layout";
import AuthorChart from "Model/Authoring/AuthorChart";
import AuthorGraph from "Model/Authoring/AuthorGraph";
import AuthorTable from "Model/Authoring/AuthorTable";
import AuthorHtml from "Model/Authoring/AuthorHtml";
import AuthorMatrix from "Model/Authoring/AuthorMatrix";
import CardSimple from "components/Common/CardSimple";
import { Popconfirm, Tooltip } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import "./react-grid-layout.css";
import DisplayMore from "components/SKD/DisplayMore";
var ReactGridLayout = require("react-grid-layout");

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class ShowcaseLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 300,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "horizontal",
      mounted: false,
      layouts: { lg: this.props.resultsLayout },
      items: this.props.resultsLayout,
      remove: props.remove,
      chartdata: [],
      newCounter: 0,
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
    this.createElement = this.createElement.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onSortAscending = this.onSortAscending.bind(this);
    this.onSortDescending = this.onSortDescending.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
    console.log("component num", $(".react-grid-item").length);
    $(".react-grid-item").each((index, item) => {
      //console.log("children length", $(item).children());
      console.log("ant-table-content", $(item).find(".ant-table-content"));
    });
  }

  generateDOM(items) {
    return _.map(items, (el) => this.createElement(el));
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint,
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: this.state.item },
    });
  }
  createElement(el) {
    let removeStyle = {
      position: "absolute",
      right: "50px",
      top: "8px",
      cursor: "pointer",
    };
    let editStyle = { ...removeStyle, right: "31px" };
    if (this.props.remove === false)
      removeStyle = { ...removeStyle, display: "none" };
    if (this.props.edit === false)
      editStyle = { ...editStyle, display: "none" };
    if (el.i === "undefined") el.i = "0";
    const i = el.i;
    let style = {
      padding: 5,
      marginRight: 5,
      height: "auto",
    };
    if (["graph"].indexOf(el.type) === -1)
      style = { ...style, overflow: "hidden" };
    let moreStyle = { ...removeStyle, right: "8px", top: "8px" };

    const menu = [
      {
        title: (
          <Tooltip title="ascending" placement="left">
            <RiseOutlined />
          </Tooltip>
        ),
        onClick: () => this.onSortAscending(el),
      },
      {
        title: (
          <Tooltip title="descending" placement="left">
            <FallOutlined />
          </Tooltip>
        ),
        onClick: () => this.onSortDescending(el),
      },
    ];

    const editbtn = (
      <>
        <span className="icon1" style={editStyle}>
          <Tooltip title="Edit" key="editlayout">
            <EditOutlined onClick={() => this.onEditItem(i)} />
          </Tooltip>
        </span>
        <Popconfirm
          placement="top"
          title={"Delete?"}
          onConfirm={() => this.onRemoveItem(i)}
          okText="Yes"
          cancelText="No"
        >
          <span className="icon1" style={removeStyle}>
            <Tooltip title="Remove from layout" key="removelayout">
              <CloseOutlined />
            </Tooltip>
          </span>
        </Popconfirm>
        <span className="icon1" style={moreStyle}>
          <Tooltip title="More" key="morelayout">
            {/* <Dropdown.Button overlay={menu}></Dropdown.Button> */}
            {/* <MoreOutlined className="moreb" onClick={() => this.onMoreItem(el)} /> */}
            <DisplayMore menu={menu} />
          </Tooltip>
        </span>
        {/* <span className="test" style={testStyle}>
            <button onClick={() => this.onTestItem(el)}>test</button>
          </span> */}
      </>
    );

    return (
      <div key={i} data-grid={i} style={style}>
        <CreateContent {...el} />
        {this.props.show !== false && editbtn}
      </div>
    );
  }

  onSortDescending(el) {
    const data = el.dtlist;
    const value = el.setting.value[0];

    el.dtlist = _.sortBy(data, value).reverse();

    this.setState({ chartdata: el.dtlist });
  }

  onEditItem(i) {
    this.props.onEditItem(i);
  }
  onRemoveItem(i) {
    let removedItems = _.reject(this.state.items, { i: i });
    // setItems([...removedItems]);
    this.setState({
      items: removedItems,
    });
    this.props.onRemoveItem(i);
  }

  onSortAscending(el) {
    const data = el.dtlist;
    const value = el.setting.value[0];

    el.dtlist = _.sortBy(data, value);

    this.setState({ chartdata: el.dtlist });
  }
  onAddItem() {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
    });
  }
  render() {
    console.log(this.props.resultsLayout);
    return (
      <div>
        <button onClick={this.onAddItem}>+</button>
        <ResponsiveReactGridLayout
          {...this.props}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM(this.props.resultsLayout)}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
const CreateContent = (k) => {
  return (() => {
    switch (k.type) {
      case "html":
        return <AuthorHtml authObj={k} title={true} className="gridcontent" />;
      case "table":
        return <AuthorTable authObj={k} title={true} className="gridcontent" />;
      case "matrix":
        return <AuthorMatrix obj={k} title={true} className="gridcontent" />;
      case "chart":
        return <AuthorChart authObj={k} title={true} className="gridcontent" />;
      case "graph":
        return <AuthorGraph authObj={k} title={true} className="gridcontent" />;
      default:
        return <CardSimple className="gridcontent" />;
    }
  })();
};
const extractLayout = (allList) => {
  let layList = [];
  if (allList)
    allList.map((k, i) => {
      layList.push({ x: k.x, y: k.y, w: k.w, h: k.w, i: k.i });
      return null;
    });
  return layList;
};
ShowcaseLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

ShowcaseLayout.defaultProps = {
  className: "layout",
  rowHeight: 20,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //initialLayout: generateLayout(),
  //initialLayout: extractLayout(this.props.resultsLayout),
};

function generateLayout() {
  return _.map(_.range(0, 3), function (item, i) {
    var y = 16; // Math.ceil(Math.random() * 14) + 1;
    return {
      x: (_.random(0, 5) * 2) % 2,
      y: Math.floor(i / 6) * y,
      w: 6,
      h: y,
      i: i.toString(),
    };
  });
}
