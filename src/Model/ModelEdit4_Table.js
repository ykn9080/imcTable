import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Tag, Space, Tooltip } from "antd";
import JSONViewer from "react-json-viewer";
import ReactJson from "react-json-view";
import TableAntSort from "components/Common/TableAntSort";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";

const ModelEdit4_Table = (props) => {
  const history = useHistory();
  const [expandAll, setExpandAll] = useState(false);
  let tempModel = useSelector((state) => state.global.tempModel);

  const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
  };
  const collapseBtn = (
    <div>
      <Tooltip title="Expand/Collapse">
        {!expandAll ? (
          <div style={{ marginLeft: -50 }}>
            <PlusSquareOutlined
              style={{ fontSize: "18px", color: "#c1b4b4" }}
              onClick={() => {
                setExpandAll(!expandAll);
              }}
            />
          </div>
        ) : (
          <MinusSquareOutlined
            style={{ fontSize: "18px", color: "#c1b4b4" }}
            onClick={() => {
              setExpandAll(!expandAll);
            }}
          />
        )}
      </Tooltip>
    </div>
  );
  const columns = [
    { title: <div>{collapseBtn}</div>, width: 1 },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 50,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Table",
      dataIndex: "table",
      key: "table",
    },

    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <a
            onClick={() => {
              history.push("./edit/graph?name=" + text.name);
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];
  if (!expandAll) columns.splice(2, 1);
  let data = [];
  let results = tempModel?.properties?.results;
  if (!results) results = {};
  const namelist = Object.keys(results);
  const dtlist = Object.values(results);
  namelist.map((k, i) => {
    const json = (
      <ReactJson
        src={dtlist[i]}
        theme="summerfruit:inverted"
        collapsed={true}
      />
    );

    data.push({
      key: i,
      name: k,
      table: (
        <>
          <JSONViewer json={dtlist[i]} style={styles} />
          {json}
        </>
      ),
      tags: ["nice"],
    });
    return null;
  });

  let setting = {};
  if (!expandAll)
    setting = {
      expandable: {
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.table}</p>
        ),
      },
    };
  return (
    <>
      <TableAntSort columns={columns} data={data} {...setting} />
    </>
  );
};

export default ModelEdit4_Table;
