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

const FormList = (props) => {
  let title = props.type,
    titleUpper = "";
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const forceUpdate = useForceUpdate();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${currentsetting.webserviceprefix}bootform/any?type=${props.type}`)
      .then((response) => {
        let imsiData1 = [];
        response.data.map((k, i) => {
          return imsiData1.push({
            _id: k._id,
            data: k.data,
            name: k.name,
            description: k.desc,
            titleHandler: true,
            href: {
              pathname: `/admin/control/${props.type}/${props.type}view`,
              search: `?_id=${k._id}`,
              state: k,
            },
            avatar: {
              size: 24,
              style: { backgroundColor: "#87d068" },
              shape: "square",
              icon: <FormOutlined />,
            },
            desc: k.desc,
          });
        });

        dispatch(globalVariable({ listData: imsiData1 }));
        setListData(imsiData1);
        setLoading(false);
      });
  }, [props.type]);

  const createHandler = () => {
    dispatch(globalVariable({ currentData: "" }));
    dispatch(globalVariable({ selectedKey: "imsi" }));
    history.push(`/admin/control/${props.type}/${props.type}edit`);
  };

  const editHandler = (item) => {
    dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    history.push(`/admin/control/${props.type}/${props.type}edit`);
  };

  const deleteHandler = (item) => {
    let config = {
      method: "delete",
      url: `${currentsetting.webserviceprefix}bootform/${item._id}`,
    };
    axios(config).then((r) => {
      _.remove(listData, function (currentObject) {
        return currentObject._id === item._id;
      });

      setListData(listData);
      localStorage.removeItem("imsi");
      dispatch(globalVariable({ currentData: "" }));
      forceUpdate();
    });
  };

  let propSetting = {};
  if (props.selectHandler) {
    propSetting = { selectHandler: props.selectHandler };
  }

  const footer = (
    <div>
      <b>ant design</b> footer part
    </div>
  );
  const pagination = {
    onChange: (page) => {},
    pageSize: 25,
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
  if (title) titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <>
      <PageHead title={titleUpper} extra={extra}></PageHead>
      <AntList
        listData={listData}
        loading={loading}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        size={"small"}
        layout={"horizontal"}
        footer={footer}
        pagination={pagination}
        {...propSetting}
      />
    </>
  );
};

export default FormList;
