import React, { useEffect, useState } from "react";
import { useRouteMatch, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import { globalVariable } from "actions";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import AuthorTable from "Author/AuthorTable";
import AuthorHtml from "Author/AuthorHtml";
import AuthorChart from "Author/AuthorChart";
import AuthorGraph from "Author/AuthorGraph";

const Author = (props) => {
  const [authObj, setAuthObj] = useState();
  const [title, setTitle] = useState();

  const history = useHistory();
  const dispatch = useDispatch();
  let match = useRouteMatch("/author/:id").url.split("/");
  //const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    $(".MuiIconButton-root").css("padding", 0);
    $(".ant-col.ant-col-2").css("text-align", "right");

    console.log("match id is ", match);
    let tt = match[match.length - 1];
    if (tt) {
      setTitle(tt.toLowerCase());
    }

    const author = location?.state?.author;
    if (author) {
      setAuthObj(author);
    }
  }, []);
  const handleSave = () => {
    dispatch(globalVariable({ triggerChild: ["save", "list"] }));
  };

  const btnArr = [
    {
      tooltip: "Save and Show Authoring List",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      onClick: handleSave,
    },
    {
      tooltip: "Go to Previous",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => {
        history.push("/model/edit");
      },
    },
  ];
  return (
    <>
      <DenseAppBar
        title={"Author"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 20,
          paddingTop: 5,
          paddingBottom: 10,
        }}
      >
        <AntBreadCrumb />
      </div>
      {(() => {
        switch (title) {
          case "table":
            return <AuthorTable authObj={authObj} edit={true} />;
          case "html":
            return <AuthorHtml />;
          case "chart":
            return <AuthorChart />;
          case "graph":
            return <AuthorGraph />;

          default:
            return null;
        }
      })()}
    </>
  );
};

export default Author;
