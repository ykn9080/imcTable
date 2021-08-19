import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "antd/dist/antd.css";
import { Row, Col } from "antd";
import $ from "jquery";
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.min.css";
import { globalVariable } from "actions";
import Helpdialog from "Admin/Help/Icon";

import { FaQuestionCircle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
let Style = {
  root: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10000,
    backgroundColor: "white",
    border: "solid 1px gray",
    overflow: "auto",
    boxShadow: "3px 5px #888888",
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "black",
    textAlign: "right",
    cursor: "move",
  },
  close: {
    color: "white",
    fontSize: 20,
    cursor: "pointer",
    margin: 20,
    paddingTop: 40,
  },
  content: {
    padding: 10,
    marginTop: 30,
  },
  helpButton: {
    position: "absolute",
    right: 10,
    top: 10,
    color: "inherit",
  },
  iconStyle: {
    color: "white",
    cursor: "pointer",
    marginTop: 10,
    marginRight: 10,
    fontSize: 20,
  },
};

const Popup = (props) => {
  let x = 0,
    y = 0,
    w = "100%",
    h = "100%";
  if (props.x) x = props.x;
  if (props.y) y = props.y;
  if (props.w) w = props.w;
  if (props.h) h = props.h;

  Style.root = { ...Style.root, left: x, top: y, width: w, height: h };
  let openPopup = useSelector((state) => state.global.openPopup);
  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(globalVariable({ openPopup: false }));
  };
  let link = null;
  if (props.helpLink) link = props.helpLink;
  useEffect(() => {
    dispatch(globalVariable({ helpLink: link }));
    setTimeout(() => {
      $(".popdiv").draggable();
    }, 2500);
  }, []);
  const ModalText = props.children;

  return (
    openPopup && (
      <>
        <div style={Style.root} className={"popdiv"}>
          <div style={Style.header}>
            <Row justify="end">
              <Col>
                <FaQuestionCircle
                  style={Style.iconStyle}
                  onClick={() => {
                    dispatch(globalVariable({ openHelp: true }));
                  }}
                />
              </Col>
              <Col>
                <AiOutlineClose
                  style={Style.iconStyle}
                  onClick={handleCancel}
                />
              </Col>
            </Row>
          </div>
          <div style={Style.content}>{ModalText}</div>
        </div>
        <Helpdialog />
      </>
    )
  );
};

export default Popup;
