import React from "react";
import { useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

const AntBreadCrumb = (props) => {
  const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{_}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
};
export default AntBreadCrumb;
