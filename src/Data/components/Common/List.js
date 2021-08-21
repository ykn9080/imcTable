import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  List,
  Avatar,
  Skeleton,
  Button,
  Popconfirm,
  Input,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { highlightString } from "../functions/dataUtil";
import { GrEdit, GrTrash } from "react-icons/gr";
import MoreMenu from "../SKD/MoreMenu";

const { Search } = Input;
const AntList = (props) => {
  //loading for skeleton
  const loading = props.loading ? props.loading : false;
  const [attr, setAttr] = useState(null);
  const [searchstr, setSearchstr] = useState();
  //layout,datasource,size,footer,pagination

  useEffect(() => {
    let listAttr = {
      className: "demo-loadmore-list",
      dataSource: props.listData,
      itemLayout: props.layout ? props.layout : "horizontal",
    };
    if (props.size) listAttr = { ...listAttr, size: props.size };
    if (props.footer) listAttr = { ...listAttr, footer: props.footer };
    paging();
    listAttr = sorting(listAttr);
    setAttr(listAttr);
  }, [props]);
  // useEffect(() => {
  //   paging();
  // }, [display, sortAction]);

  // useEffect(() => {
  //   sorting();
  // }, [sortAction]);
  const paging = () => {
    let size = 20,
      newattr = { ...attr };
    //if (display === "list") size = 50;
    if (props.pagination)
      newattr = { ...newattr, pagination: props.pagination };

    newattr = {
      ...newattr,
      pagination: { ...newattr.pagination, pageSize: size },
    };
    setAttr(newattr);
  };
  const sorting = (newAttr) => {
    if (!newAttr) newAttr = { ...attr };
    // if (sortAction) {
    //   const sorted = _.sortBy(newAttr.dataSource, [
    //     function (o) {
    //       return o.name;
    //     },
    //   ]);
    //   newAttr = { ...newAttr, dataSource: sorted };
    // } else

    newAttr = { ...newAttr, dataSource: props.listData };

    setAttr(newAttr);
    return newAttr;
  };

  const ListItem = ({ item }) => {
    //action icon: edit/delete icon
    let actlist = [];
    if (props.moremenu) {
      actlist.push(
        <>
          <Row>
            <Col span={1}>
              <div style={{ width: "99%", padding: 5 }}>
                <MoreMenu
                  menu={[
                    {
                      title: (
                        <Tooltip title="Edit" placement="left">
                          <GrEdit />
                        </Tooltip>
                      ),
                      onClick: () => {
                        props.moremenu(item, "edit");
                      },
                    },
                    {
                      title: (
                        <Tooltip title="Delete" placement="left">
                          <GrTrash />
                        </Tooltip>
                      ),
                      onClick: () => {
                        props.moremenu(item, "delete");
                      },
                    },
                  ]}
                  button
                />
              </div>
            </Col>
          </Row>
        </>
      );
    }

    if (props.editHandler)
      actlist.push(<EditOutlined onClick={() => props.editHandler(item)} />);
    if (props.deleteHandler)
      actlist.push(
        <Popconfirm
          placement="topRight"
          title="Are you sure to delete ?"
          onConfirm={() => props.deleteHandler(item)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined />
        </Popconfirm>
      );
    if (props.selectHandler) {
      actlist = [];
      actlist.push(
        <Button
          type="text"
          icon={<CheckSquareOutlined />}
          onClick={() => props.selectHandler(item)}
        />
      );
    }

    let itemAttr = { actions: actlist };
    //extra for image
    if (item.extra) {
      const extra = (
        <img
          width={item.extra.width}
          alt={item.extra.alt}
          src={item.extra.src}
        />
      );
      itemAttr = { ...itemAttr, extra: extra };
    }
    itemAttr = {
      ...itemAttr,
      onClick: () => {
        item.avatar.icon = <CheckSquareOutlined />;
      },
    };
    //title,desc,size,avatar
    let metaAttr = {};
    if (item.size) metaAttr = { ...metaAttr, size: item.size };
    if (item.description) {
      let desc = highlightString(item.description, searchstr);
      metaAttr = {
        ...metaAttr,
        description: <p dangerouslySetInnerHTML={{ __html: desc }} />,
      };
    }
    if (item.name) {
      let name = highlightString(item.name, searchstr);
      if (item.href)
        metaAttr = {
          ...metaAttr,
          title: (
            <Link to={item.href}>
              <p dangerouslySetInnerHTML={{ __html: name }} />
            </Link>
          ),
        };
      else metaAttr = { ...metaAttr, title: name };
    }
    if (item.avatar) {
      const av = item.avatar;
      let av1 = {};
      if (av.size) av1 = { ...av1, size: av.size };
      // if (display === "list") av1 = { ...av1, size: 5 };
      if (av.shape) av1 = { ...av1, shape: av.shape };
      if (av.style) av1 = { ...av1, style: av.style };
      if (av.icon) av1 = { ...av1, icon: av.icon };
      if (av.src) av1 = { ...av1, src: av.src };
      metaAttr = {
        ...metaAttr,
        avatar: <Avatar {...av1} />,
      };
    }
    return (
      <List.Item {...itemAttr}>
        <List.Item.Meta {...metaAttr} />
        {/* <div>{item.content}</div> */}
      </List.Item>
    );
  };
  const onChange = (e) => {
    const { value } = e.target;
    let newattr = { ...attr };
    if (value !== "") {
      newattr = { ...newattr, pagination: false };
      setAttr(newattr);
    } else {
      newattr = { ...newattr, pagination: props.pagination };
      setAttr(newattr);
    }
    setSearchstr(value);
  };

  const show = (item) => {
    return (
      (searchstr === "") |
      (item.name && item.name.toLowerCase().indexOf(searchstr) > -1) |
      (item.desc && item.desc.toLowerCase().indexOf(searchstr) > -1) |
      (item._id && item._id.indexOf(searchstr) > -1)
    );
  };

  return (
    <>
      <div style={{ paddingRight: 5 }}>
        {props.search !== false && (
          <div style={{ textAlign: "right" }}>
            <Search
              placeholder="input search text"
              allowClear
              onSearch={(value) => console.log(value)}
              value={searchstr}
              onChange={onChange}
              defaultValue={searchstr}
              style={{ width: 200 }}
            />
          </div>
        )}

        <Skeleton loading={loading} active avatar>
          <List
            {...attr}
            renderItem={(item) => {
              return show(item) ? <ListItem item={item} /> : null;
            }}
          />
        </Skeleton>
      </div>
    </>
  );
};

export default AntList;
