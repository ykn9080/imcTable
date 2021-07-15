import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import { Nav, Navbar, NavDropdown, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdHelp } from "react-icons/md";
import "./Head.css";
import { helpSet } from "Admin/Help";
const adminMenu = [
  {
    access: [],
    _id: "5e8ed662bdb50363914263af",
    desc: "",
    layout: [],
    seq: 0,
    title: "Organization",
    type: "admin",
    pid: "",
    path: "/admin/organization",
  },

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
  {
    access: [],
    _id: "5e8ed662bdb5036391426999",
    desc: "",
    layout: [],
    seq: 3,
    title: "Model",
    pid: "",
    type: "admin",
    path: "/model",
    breadcrumbName: "/admin/model",
  },
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
  {
    access: [],
    _id: "5e8ed662bdb50363914263x9",
    desc: "universial purpose, input data, make report with them",
    layout: [],
    seq: 1,
    title: "Allpurpose",
    pid: "5e8ed662bdb50363914263b1",
    type: "admin",
    path: "/admin/control/allpurpose",
    breadcrumbName: "/admin/Allpurpose Build",
  },

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
  {
    access: [],
    _id: "5e8ed662bdb50363914263x1",
    desc: "",
    layout: [],
    seq: 0,
    title: "Data",
    pid: "5e8ed662bdb50363914263b2",
    type: "admin",
    path: "/admin/system/data",
  },
  {
    access: [],
    _id: "5e8ed662bdb50363914263x5",
    desc: "",
    layout: [],
    seq: 1,
    title: "Style",
    pid: "5e8ed662bdb50363914263b2",
    type: "admin",
    path: "/admin/system/style",
  },
  {
    access: [],
    _id: "5e8ed662bdb50363914263x6",
    desc: "",
    layout: [],
    seq: 0,
    title: "Icon",
    pid: "5e8ed662bdb50363914263x5",
    type: "admin",
    path: "/admin/system/style/icon",
  },
  {
    access: [],
    _id: "5e8ed662bdb50363914263x7",
    desc: "",
    layout: [],
    seq: 0,
    title: "Image",
    pid: "5e8ed662bdb50363914263x5",
    type: "admin",
    path: "/admin/system/style/image",
  },
  {
    access: [],
    _id: "5e8ed662bdb50363914263x2",
    desc: "",
    layout: [],
    seq: 1,
    title: "Help",
    pid: "",
    type: "admin",
    path: "/admin/help",
  },
  {
    access: [],
    _id: "5e8ed71cbdb50363914263b3",
    desc: "",
    layout: [],
    pid: "5e8ed662bdb50363914263af",
    seq: 0,
    title: "Company",
    type: "admin",
    path: "/admin/organization/company",
  },
  {
    access: [],
    _id: "5e8ed71cbdb50363914263b4",
    desc: "",
    layout: [],
    pid: "5e8ed662bdb50363914263af",
    seq: 1,
    title: "User",
    type: "admin",
    path: "/admin/organization/user",
  },
  {
    access: [],
    _id: "5e8ed71cbdb50363914263b5",
    desc: "",
    layout: [],
    pid: "5e8ed662bdb50363914263af",
    seq: 2,
    title: "Group",
    type: "admin",
    path: "/admin/organization/group",
  },
  {
    access: [],
    _id: "5e8ed71cbdb50363914263b6",
    desc: "",
    layout: [],
    pid: "5e8ed662bdb50363914263af",
    seq: 3,
    title: "Organization",
    type: "admin",
    path: "/admin/organization/organization",
  },
  {
    access: [],
    _id: "5e8ed71cbdb50363914263b7",
    desc: "",
    layout: [],
    pid: "5e8ed662bdb50363914263af",
    seq: 4,
    title: "Product/Service",
    type: "admin",
    path: "/admin/organization/product & Service",
  },
];
const Topmenu = ({ menu }) => {
  const history = useHistory();
  function handleSelect(selectedKey) {
    const ctrlist = menu.filter((item, itemIndex) => item._id === selectedKey);

    history.push(ctrlist[0].path);

    //dispatch(globalVariable({ controls: ctrlist.layout }));
  }
  //const menulist = JSON.parse(localStorage.getItem("imctable")).menu;

  // useEffect(() => {
  //   //login후 /function/api.js의 remotelogin callback에서 dispatch를 못해서
  //   //일단 localStorage에 저장한후 메뉴로 historyback할때 globalVariable로 dispatch시킴
  //   let menu = myData;
  //   if (localStorage.getItem("menu"))
  //     menu = JSON.parse(localStorage.getItem("menu"));
  //   // else{
  //   //   //openmenu를 fetch해서 가져옴
  //   // }
  //   dispatch(globalVariable({ menu: menu }));
  // }, []);

  // let token = useSelector((state) => state.persist.token);
  // let menu = useSelector((state) => state.persist.menu);
  // let menupersist = useSelector(
  //   (state) => state.persist["persist/REHYDRATE"].persist.menu
  // );
  // let openmenu = useSelector((state) => state.persist.openmenu);
  let topmenu = [];
  if (menu)
    topmenu = menu
      //.filter((item, itemIndex) => item.comp === login.comp && typeof item.pid === "undefined")
      .filter(
        (item, itemIndex) =>
          (item.pid === "") | (typeof item.pid === "undefined")
      )
      .sort(function (a, b) {
        return a.seq < b.seq ? -1 : 1;
      });
  console.log(menu);
  return (
    // <Nav className="mr-auto" onSelect={handleSelect}>
    //   <AntMenu menuList={topmenu} />
    // </Nav>
    <Nav className="mr-auto" onSelect={handleSelect}>
      {topmenu &&
        topmenu.map((dt, i) => {
          //const ddList = menulist(dt, dt.id);
          const ddList = menu
            .filter((item, itemIndex) => item.pid === dt._id)
            .sort(function (a, b) {
              return a.seq < b.seq ? -1 : 1;
            });
          return ddList.length === 0 ? (
            <Nav.Link key={dt.title + i} onClick={() => handleSelect(dt._id)}>
              {dt.title}
            </Nav.Link>
          ) : (
            <NavDropRecur
              myData={menu}
              dt={ddList}
              title={dt.title}
              id={dt._id}
              key={dt._id}
            />
          );
        })}
    </Nav>
  );
};

const NavDropRecur = (props) => {
  /*make menu recursive, */

  const subfilter = (id) => {
    return props.myData
      .filter((item, itemIndex) => id === item.pid)
      .sort(function (a, b) {
        return a.seq < b.seq ? -1 : 1;
      });
  };

  return (
    <NavDropdown title={props.title} id={props.id}>
      {props.dt.map((dtt, index) => {
        //let subdata = menulist(props.myData, dtt.id);
        let subdata = subfilter(dtt._id);

        return subdata.length === 0 ? (
          <NavDropdown.Item eventKey={dtt._id} key={dtt._id + index}>
            {dtt.title}
          </NavDropdown.Item>
        ) : (
          <NavDropRecur
            dt={subdata}
            myData={props.myData}
            title={dtt.title}
            id={dtt._id}
            key={dtt._id}
          />
        );
      })}
    </NavDropdown>
  );
};

const Head1 = (props) => {
  let menu1;
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.global.token);
  const [menu, setMenu] = useState();

  // const match = props.match;
  // let title = match.params.name,
  //   titleUpper = "";
  // if (typeof match.params.child != "undefined") title = match.params.child;
  // if (typeof match.params.grandchild != "undefined")
  //   title = match.params.grandchild;
  // console.log(match.params, title);
  // if (title) titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
  useEffect(() => {
    const usermenu = localStorage.getItem("menu");
    const openmenu = localStorage.getItem("openmenu");
    const token1 = localStorage.getItem("token");

    if (token1) {
      menu1 = JSON.parse(usermenu);
      dispatch(globalVariable({ token: token1 }));
    } else {
      //localStorage.removeItem("menu");
      menu1 = JSON.parse(openmenu);
    }
    //setMenu(menu1);
    setMenu(adminMenu);
  }, [token]);
  function handleSelect(selectedKey) {
    switch (selectedKey) {
      case "edit":
        //const menu = JSON.parse(localStorage.getItem("menu"));
        //const submenu = directChild(menu, "", "seq");
        var clone = cloneDeep(menu);
        clone.map((k, i) => {
          k.path = "/edit" + k.path;
          return null;
        });
        dispatch(globalVariable({ tempMenu: clone }));
        //dispatch(globalVariable({ subMenu: submenu }));
        break;
      case "admin":
        break;
      default:
        break;
    }
  }
  const topbrand = (
    <Navbar.Brand href="#home">
      {/* <img
        src={process.env.PUBLIC_URL + "/netminer.png"}
        className="d-inline-block align-top"
        style={{ width: 20, marginRight: 4, paddingTop: 7 }}
      /> */}
      IMCMaster
    </Navbar.Brand>
  );

  const navDropdownTitle = <FontAwesomeIcon icon="user" size="lg" />;

  const navCog = (
    <FontAwesomeIcon icon="cog" size="lg" style={{ marginTop: 8 }} />
  );
  const help = () => {
    const his = helpSet({ query: "home", tag: "new" });
    history.push(his);
  };
  const logout = () => {
    // dispatch(persistVariable({ token: "" }));
    // dispatch(persistVariable({ menu: "" }));

    // dispatch(persistVariable({ login: "" }));
    //aft login menu delete
    //user delete
    localStorage.removeItem("token");
    localStorage.removeItem("menu");
    dispatch(globalVariable({ token: null }));
    // const usermenu = localStorage.getItem("menu");
    // const openmenu = localStorage.getItem("openmenu");
  };
  const topright = (
    <Nav onSelect={handleSelect}>
      <Nav.Link>
        <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown1">
          <NavDropdown.Item>
            <Link to="/Login">Log In</Link>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <Link to="/Join">Join</Link>
          </NavDropdown.Item>
        </NavDropdown>
      </Nav.Link>

      <Nav.Link href="#link" onClick={help}>
        {/* <FontAwesomeIcon
          icon="question-circle"
          size="lg"
          style={{ marginTop: "10" }}
        /> */}
        <MdHelp style={{ fontSize: 25, marginTop: 6 }} />
      </Nav.Link>
    </Nav>
  );
  const toprightAfterLogin = (
    <Nav onSelect={handleSelect}>
      <Nav.Link>
        <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown1">
          <NavDropdown.Item>
            <Link to="/" onClick={logout}>
              Log Out
            </Link>
          </NavDropdown.Item>
        </NavDropdown>
      </Nav.Link>
      <Nav.Link>
        <Link to="/admin" style={{ color: "inherit" }}>
          {navCog}
        </Link>

        {/* <NavDropdown title={navCog} id="basic-nav-dropdown2">
          <NavDropdown.Item eventKey={"edit"}>
            <Link to="/Edit">Edit</Link>
          </NavDropdown.Item>
          <NavDropdown.Item eventKey={"admin"}>
            <Link to="/admin">Admin</Link>
          </NavDropdown.Item>
        </NavDropdown> */}
      </Nav.Link>

      <Nav.Link href="#link" onClick={help}>
        <MdHelp style={{ fontSize: 25, marginTop: 6 }} />
      </Nav.Link>
    </Nav>
  );
  return (
    <>
      {!token ? (
        <Navbar bg="dark" variant="dark">
          {topbrand}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Topmenu menu={menu} />

            <Form inline style={{ paddingRight: "40" }}>
              {toprightAfterLogin}
            </Form>
          </Navbar.Collapse>
        </Navbar>
      ) : (
        <Navbar bg="dark" variant="dark">
          {topbrand}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Topmenu menu={menu} />
            <Form inline style={{ paddingRight: "40" }}>
              {topright}
            </Form>
          </Navbar.Collapse>
        </Navbar>
      )}
    </>
  );
};

export default Head1;
