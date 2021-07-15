import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { makeStyles } from "@material-ui/core/styles";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import _ from "lodash";
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.min.css";
import "./Head.css";
import { directChild } from "components/functions/findChildrens";
import IconButton from "@material-ui/core/IconButton";
import AddBox from "@material-ui/icons/AddCircle";
import useForceUpdate from "use-force-update";
import { ObjectID } from "bson"; //_id maker for MongoDB

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginLeft: theme.spacing(1),
  },
}));
export const Sortable = (props) => {
  let tempMenu = useSelector((state) => state.global.tempMenu);
  let keyval = props.pid;
  let selectedKey = useSelector((state) => state.global.selectedKey);
  let login = useSelector((state) => state.global.login);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    //$(refs.sortable);
    const $node = $("#ulSortable");

    $node.sortable({
      opacity: props.opacity,
      // Get the incoming onChange function
      // and invoke it on the Sortable `change` event
      drop: function (event, ui) {
        props.onChange(event, ui);
      },
      change: (event, ui) => props.onChange(event, ui),
    });
    return () => {
      $node.sortable();
    };
    keyval = selectedKey;
  }, [selectedKey]);

  const classes = useStyles();
  let menuList =
    // directChild(tempMenu, keyval, "seq");
    tempMenu
      .filter((subitem, itemIndex) => subitem.pid === keyval)
      .sort(function (a, b) {
        return a["seq"] < b["seq"] ? -1 : 1;
      });

  const addTopMenu = () => {
    let obj = _.maxBy(menuList, "seq");
    let type = "user";
    const findtype = _.filter(menuList, function (o) {
      return o.hasOwnProperty("type");
    });
    if (findtype.length > 0) type = findtype[0].type;
    let newobj = {
      _id: new ObjectID(),
      comp: login.comp,
      creator: login.user,
      desc: "",
      pid: "",
      type: type,
      seq: obj.seq + 1,
      title: "New Menu",
      layout: [],
    };
    tempMenu.push(newobj);
    dispatch(globalVariable({ tempMenu: tempMenu }));
    forceUpdate();
  };
  return (
    <ul className={props.ulclass} id="ulSortable">
      {menuList ? (
        <>
          <DropList
            menuList={menuList}
            tempMenu={tempMenu}
            depth={props.depth}
            liclass={props.liclass}
            selectedmenu={props.selectedmenu}
          />
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={addTopMenu}
          >
            <AddBox />
          </IconButton>
        </>
      ) : (
        <li
          className={["ui-state-default"]}
          onClick={() => props.selectedmenu("")}
          key={findmaxnum}
        >
          new menu
        </li>
      )}
    </ul>
  );
};

const DropList = (props) => {
  return props.menuList.map((item, i) => {
    let selectli = "";
    if (i === 0) selectli = "selectli";
    let delicon = delbtn(item._id);
    let moduleicon = "";
    let subdata = [];
    const subMenu = directChild(props.tempMenu, item._id, "seq");
    const li = (
      <li
        key={"droplist" + item._id}
        id={item._id}
        className={[props.liclass, selectli, "ui-state-default"].join(" ")}
        onClick={() => props.selectedmenu(item._id)}
      >
        {item.title}
        {delicon}
      </li>
    );

    return subMenu.length > 0 && props.depth === "all" ? (
      <li
        key={"droplist" + item._id}
        id={item._id}
        className={[props.liclass, selectli, "ui-state-default"].join(" ")}
        onClick={() => props.selectedmenu(item._id)}
      >
        {item.title}
        <NestedList data={subMenu} tempMenu={props.tempMenu} />
        {delicon}
      </li>
    ) : (
      li
    );
  });
};

const markTab = (id) => {
  $(".dropli").removeClass("selectli");
  $("#" + id).addClass("selectli");
};
const NestedList = (props) => {
  return props.data ? (
    <ul>
      {props.data.map((item, i) => {
        let delicon = delbtn(item.id);
        let subdata = directChild(props.tempMenu, item._id, "seq");
        return subdata ? (
          <li
            key={"droplist" + item.id}
            id={item.id}
            className={["ui-state-default"].join(" ")}
            onClick={() => props.selectedmenu(item._id)}
          >
            {item.title}
            <NestedList data={subdata} tempMenu={props.tempMenu} />
            {delicon}
          </li>
        ) : (
          <li
            key={"droplist" + item.id}
            id={item.id}
            className={["ui-state-default"].join(" ")}
            onClick={() => props.selectedmenu(item._id)}
          >
            {item.title}
            {delicon}
          </li>
        );
      })}
    </ul>
  ) : (
    ""
  );
};

const findmaxnum = () => {
  return "test";
};
const delbtn = (id) => {
  //delete button at topmenu tab
  return (
    <React.Fragment>
      <FontAwesomeIcon
        style={{ float: "right", marginTop: 5, marginRight: 2, marginLeft: 5 }}
        icon={faTimes}
        key={"del" + id}
        onClick={() => console.log("deleled ud: ", id)}
      />
    </React.Fragment>
  );
};
