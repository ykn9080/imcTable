import React, { useEffect } from "react";
import $ from "jquery";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";

export const ActiveLastBreadcrumb = props => {
  let keyval = "BreadCrumb";
  const dispatch = useDispatch();
  keyval = useSelector(state => state.global.selectedKey);
  useEffect(() => {
    $(".MuiBox-root-246").css({ padding: 0 });
  });
  function handleClick(event) {
    event.preventDefault();
    dispatch(globalVariable({ selectedKey: event.href }));
  }
  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Material-UI
        </Link>
        <Link
          color="inherit"
          href="/getting-started/installation/"
          onClick={handleClick}
        >
          Core
        </Link>
        <Link
          color="textPrimary"
          href="/components/breadcrumbs/"
          onClick={handleClick}
          aria-current="page"
        >
          {keyval}
        </Link>
      </Breadcrumbs>
    </div>
  );
};
