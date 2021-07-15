import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { currentsetting } from "config/index.js";
import AntList from "components/Common/List";
import { Tooltip, Button } from "antd";
import PageHead from "components/Common/PageHeader";
import { FileAddOutlined, FormOutlined } from "@ant-design/icons";
import useForceUpdate from "use-force-update";

const FormList = () => {
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const forceUpdate = useForceUpdate();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(currentsetting.webserviceprefix + "bootform/any?type=table")
      .then((response) => {
        let imsiData1 = [];
        response.data.map((k, i) => {
          imsiData1.push({
            _id: k._id,
            id: k.id,
            data: k.data,
            name: k.name,
            description: k.desc,
            titleHandler: true,
            href: {
              pathname: "/admin/control/table/tableview",
              search: `?_id=${k._id}`,
              state: k,
            },
            avatar: {
              size: 32,
              style: { backgroundColor: "#87d068" },
              shape: "square",
              icon: <FormOutlined />,
            },
            desc: k.desc,
          });
        });
        setListData(imsiData1);

        dispatch(globalVariable({ listData: imsiData1 }));
        console.log(listData);
        setLoading(false);
      });
  }, []);

  const createHandler = () => {
    dispatch(globalVariable({ currentData: "" }));
    dispatch(globalVariable({ selectedKey: "" }));
    history.push("/admin/control/table/tableedit");
  };

  const editHandler = (item) => {
    dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    history.push("/admin/control/table/tabledit");
  };

  const deleteHandler = (item) => {
    let config = {
      method: "delete",
      url: `${currentsetting.webserviceprefix}bootform/${item._id}`,
    };
    axios(config).then((r) => {
      console.log(r);
      console.log(listData);
      _.remove(listData, function (currentObject) {
        return currentObject._id === item._id;
      });
      console.log(listData);
      setListData(listData);
      localStorage.removeItem("imsi");
      dispatch(globalVariable({ currentData: "" }));
      forceUpdate();
    });
  };
  const footer = (
    <div>
      <b>ant design</b> footer part
    </div>
  );
  const pagination = {
    onChange: (page) => {
      console.log(page);
    },
    pageSize: 5,
  };
  const extra = [
    <Tooltip title="Create New" key="1create">
      <Button
        shape="circle"
        icon={<FileAddOutlined />}
        onClick={createHandler}
      />
    </Tooltip>,
  ];
  return (
    <>
      <PageHead title="Table" extra={extra}></PageHead>
      <AntList
        listData={listData}
        loading={loading}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        size={"small"}
        layout={"vertical"}
        // footer={footer}
        pagination={pagination}
      />
    </>
  );
};

export default FormList;
