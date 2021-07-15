import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import DataSrc from "./DataSrc";
import AntFormBuild from "Form/AntFormBuild";
import DenseAppBar from "components/Common/AppBar";
import IconBtn from "components/Common/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";

// const formData = {
//   setting: {
//     formItemLayout: {
//       labelCol: { span: 8 },
//       wrapperCol: { span: 16 },
//     },
//     layout: "horizontal",
//     size: "middle",
//     initialValues: { name: "hhh" },
//     onFinish: (values) => {
//       console.log("Received values of form: ", values);
//     },
//     onFinishFailed: (values, errorFields, outOfDate) => {
//       console.log(values, errorFields, outOfDate);
//     },
//   },
//   list: [
//     { label: "Name", name: "name", type: "input", seq: 1 },
//     {
//       label: "Pass",
//       name: "password",
//       type: "input.password",
//       rules: [{ required: true, message: "enter!!!" }],
//       seq: 2,
//     },
//     {
//       type: "button",
//       seq: 1000,
//       tailLayout: {
//         wrapperCol: { offset: 8, span: 16 },
//       },
//       btnArr: [
//         {
//           btnLabel: "Submit",
//           btnStyle: "secondary",
//           htmlType: "submit",
//           seq: 0,
//         },
//         {
//           btnLabel: "Cancel",
//           btnStyle: "primary",
//           htmlType: "button",
//           seq: 1,
//         },
//       ],
//     },

//     {
//       label: "Date",
//       name: "date",
//       type: "datepicker",
//       rules: [
//         { type: "object", required: true, message: "Please select time!" },
//       ],
//       seq: 0,
//     },
//   ],
// };
// const Fetch = () => {
//   const dispatch = useDispatch();
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     (async () => {
//       // let res = await fetch(
//       //   "http://localhost:3001/bootform/5e8054063346b1dd6ce970aa" //example and simple data
//       // );
//       const result = await axios.get(
//         "http://localhost:3001/bootform/5e8054063346b1dd6ce970aa"
//       );
//       // let response = await res.json();
//       dispatch(globalVariable({ formData: result.data.data }));
//       setData(JSON.stringify(result.data.data));
//       console.log(result.data.data);
//     })();
//   }, []);
//   return <div>{data}</div>;
// };

const EditTab = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const NItem = ({ indx, title }) => {
    return (
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === indx })}
          onClick={() => {
            toggle(indx);
          }}
        >
          {title}
        </NavLink>
      </NavItem>
    );
  };
  const dispatch = useDispatch();
  const pathname = encodeURIComponent(window.location.pathname);
  console.log(pathname);
  // useEffect(() => {
  //   setFetching(true);
  //   fetch(
  //     `${currentsetting.webserviceprefix}bootform/5e8054063346b1dd6ce970aa`
  //   ).then(response =>
  //     dispatch(globalVariable({ formData: response.data[0].data }))
  //   );
  //   setFetching(false);

  // }, []);

  // useEffect(async () => {
  //   const result = await axios.get(
  //     `${currentsetting.webserviceprefix}bootform/id?pathname=${pathname}`
  //   );
  //   dispatch(globalVariable({ formData: result.data.data }));
  //   setting = result.data.data.setting;
  //   list = result.data.data.list;
  //   console.log(result.data.data, result);
  // }, []);

  let edit = useSelector((state) => state.global.formEdit);
  const handleEdit = () => {
    dispatch(globalVariable({ formEdit: !edit }));
  };
  const right = (
    <IconBtn tooltip={"Edit Page"} handleClick={handleEdit}>
      <SettingsIcon />
    </IconBtn>
  );

  return (
    <>
      <DenseAppBar title={"Control Edit"} right={right} />

      <div style={{ paddingLeft: 5, marginTop: 10 }}>
        <Nav tabs>
          <NItem indx={"1"} title={"Summary"} />
          <NItem indx={"2"} title={"DataSource"} />
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <AntFormBuild />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <DataSrc />
                {/* <BootFormDisplay edit={true} formArray={formArray} /> */}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default EditTab;
