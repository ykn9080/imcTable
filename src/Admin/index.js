import React, { useEffect } from "react";
import AntMenu from "components/Common/Menu";
import DenseAppBar from "components/Common/AppBar";
import FormList from "Form/FormList";
import FormView from "Form/FormView";
import FormEdit from "Form/FormEdit";
import FormMulti from "Form/ModelViewParameter";
import PageHead from "components/Common/PageHeader";

const adminMenu = [
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263af",
  //   desc: "",
  //   layout: [],
  //   seq: 0,
  //   title: "Organization",
  //   type: "admin",
  //   pid: "",
  //   path: "/admin/organization",
  // },

  {
    access: [],
    _id: "5e8ed662bdb50363914263b1",
    desc: "",
    layout: [],
    seq: 2,
    title: "Control",
    pid: "",
    type: "admin",
    path: "/admin/control",
    breadcrumbName: "/admin/control",
  },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb5036391426999",
  //   desc: "",
  //   layout: [],
  //   seq: 3,
  //   title: "Model",
  //   pid: "",
  //   type: "admin",
  //   path: "/model",
  //   breadcrumbName: "/admin/model",
  // },
  {
    access: [],
    _id: "5e8ed662bdb50363914263x1",
    desc: "",
    layout: [],
    seq: 0,
    title: "Form",
    pid: "5e8ed662bdb50363914263b1",
    type: "admin",
    path: "/admin/control/form",
    breadcrumbName: "/admin/Form Build",
  },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x9",
  //   desc: "universial purpose, input data, make report with them",
  //   layout: [],
  //   seq: 1,
  //   title: "Allpurpose",
  //   pid: "5e8ed662bdb50363914263b1",
  //   type: "admin",
  //   path: "/admin/control/allpurpose",
  //   breadcrumbName: "/admin/Allpurpose Build",
  // },

  {
    access: [],
    _id: "5e8ed662bdb50363914263b2",
    desc: "",
    layout: [],
    seq: 4,
    title: "System",
    pid: "",
    type: "admin",
    path: "/admin/system",
  },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x1",
  //   desc: "",
  //   layout: [],
  //   seq: 0,
  //   title: "Data",
  //   pid: "5e8ed662bdb50363914263b2",
  //   type: "admin",
  //   path: "/admin/system/data",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x5",
  //   desc: "",
  //   layout: [],
  //   seq: 1,
  //   title: "Style",
  //   pid: "5e8ed662bdb50363914263b2",
  //   type: "admin",
  //   path: "/admin/system/style",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x6",
  //   desc: "",
  //   layout: [],
  //   seq: 0,
  //   title: "Icon",
  //   pid: "5e8ed662bdb50363914263x5",
  //   type: "admin",
  //   path: "/admin/system/style/icon",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x7",
  //   desc: "",
  //   layout: [],
  //   seq: 0,
  //   title: "Image",
  //   pid: "5e8ed662bdb50363914263x5",
  //   type: "admin",
  //   path: "/admin/system/style/image",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed662bdb50363914263x2",
  //   desc: "",
  //   layout: [],
  //   seq: 1,
  //   title: "Help",
  //   pid: "",
  //   type: "admin",
  //   path: "/admin/help",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed71cbdb50363914263b3",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263af",
  //   seq: 0,
  //   title: "Company",
  //   type: "admin",
  //   path: "/admin/organization/company",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed71cbdb50363914263b4",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263af",
  //   seq: 1,
  //   title: "User",
  //   type: "admin",
  //   path: "/admin/organization/user",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed71cbdb50363914263b5",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263af",
  //   seq: 2,
  //   title: "Group",
  //   type: "admin",
  //   path: "/admin/organization/group",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed71cbdb50363914263b6",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263af",
  //   seq: 3,
  //   title: "Organization",
  //   type: "admin",
  //   path: "/admin/organization/organization",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed71cbdb50363914263b7",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263af",
  //   seq: 4,
  //   title: "Product/Service",
  //   type: "admin",
  //   path: "/admin/organization/product & Service",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed7adbdb50363914263b8",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263b0",
  //   seq: 0,
  //   title: "MenuBuild",
  //   type: "admin",
  //   path: "/admin/menu/menubuild",
  // },
  // {
  //   access: [],
  //   _id: "5e8ed7adbdb50363914263b9",
  //   desc: "",
  //   layout: [],
  //   pid: "5e8ed662bdb50363914263b0",
  //   seq: 1,
  //   title: "PageBuild",
  //   type: "admin",
  //   path: "/admin/menu/pagebuild",
  // },
];

const Admin = ({ match }) => {
  let title = match.params.name,
    titleUpper = "";
  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;
  console.log(title);
  if (title) {
    titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
    if (title.indexOf("allpurpose") > -1) {
      let up = titleUpper.replace("Allpurpose", "");
      titleUpper = up.charAt(0).toUpperCase() + up.slice(1);
    }
  }
  useEffect(() => {}, []);
  return (
    <>
      <DenseAppBar title={"Admin"}>
        <AntMenu menuList={adminMenu} />
      </DenseAppBar>
      {/* formview, formedit은 독립적인 pagehead를 가짐 */}
      {["formview", "formedit", "form"].indexOf(title) === -1 ? (
        <PageHead title={titleUpper} />
      ) : null}
      {(() => {
        switch (title) {
          case "form":
          case "table":
          case "chart":
          case "data":
            return <FormList type={title} />;
          case "formview":
            return <FormView />;
          case "formedit":
            return <FormEdit />;
          case "formmulti":
            return <FormMulti />;
          default:
            return null;
        }
      })()}
    </>
  );
};

export default Admin;
