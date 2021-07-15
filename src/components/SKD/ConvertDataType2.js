import React, { useEffect, useState } from "react";
import { Row, Col, Radio, Select, Table, Switch } from "antd";
import _ from "lodash";

const { Option } = Select;

const ConvertDataType2 = ({
  treeval,
  firstModalData,
  treedt,
  columnName,
  cd,
  importData,
  deactivateNext,
}) => {
  //props
  // const [allData, setAllData] = useState(); // treeval
  const [treeData, setTreeData] = useState(treedt);
  //const [dataItemTitle, setDataItemTitle] = useState();
  const [dataItemId, setDataItemId] = useState();
  const [dataSetId, setDataSetId] = useState();
  const [fromType, setFromType] = useState();
  //const [dataItemAttr, setDataItemAttr] = useState();
  const [toType, setToType] = useState();
  const [toName, setToName] = useState();
  const [toDesc, setToDesc] = useState();

  const [tableSelectedRows, setTableSelectedRows] = useState();
  const [definitionValue, setDefinitionValue] = useState();
  const [tableData, setTableData] = useState();

  const [colInfo, setColInfo] = useState();
  const [networkProperty, setNetworkProperty] = useState();
  const [referenceNodeSet, setReferenceNodeSet] = useState();

  // NetworkProperty
  const [direction, setDirection] = useState(false);
  const [multipleLink, setMultipleLink] = useState(false);
  const [multipleOpt, setMultipleOpt] = useState("Sum");

  // Reference Nodeset
  const [srcRefNodeSet, setSrcRefNodeset] = useState(null);
  const [tgtRefNodeSet, setTgtRefNodeset] = useState(null);
  const [srcAddNewNodes, setSrcAddNewNodes] = useState(false);
  const [tgtAddNewNodes, setTgtAddNewNodes] = useState(false);
  const [dataSetName, setDataSetName] = useState();
  const [chooseSrcNodeset, setChooseSrcNodeset] = useState();
  const [chooseTgtNodeset, setChooseTgtNodeset] = useState();
  const [connectNodeSrcParam, setConnectNodeSrcParam] = useState();
  const [connectNodeTgtParam, setConnectNodeTgtParam] = useState();

  useEffect(() => {
    if (treeval) {
      //setAllData(treeval)
      //setDataItemTitle(treeval.title)
      setDataItemId(treeval._id);
      setDataSetId(treeval.pid);
      //setDataItemAttr(treeval.attribute)
    }
    if (firstModalData) {
      setToType(firstModalData.toType);
      setFromType(firstModalData.fromType);
      setToName(firstModalData.name);
      setToDesc(firstModalData.desc);
      setDataSetId(firstModalData.datasetID);
    }
    if (treeData) {
      let dataList = [];
      if (treeData[0].children) {
        treeData[0].children.map((td) => {
          dataList.push(td);
          return null;
        });

        let nodeSetList = _.filter(dataList, (o, i) => {
          return o.vtype[0] === "nodeset";
        });

        let nodeSetTitle = nodeSetList.map((v) => v.title);
        setDataSetName(nodeSetTitle);
      }
    }
  }, [treeval, firstModalData, treeData]);

  useEffect(() => {
    if (!tableSelectedRows) {
      deactivateNext(true);
    }
    if (tableSelectedRows) {
      if (tableSelectedRows.length === 0) {
        deactivateNext(true);
      } else {
        deactivateNext(false);
      }

      let colN = [];
      let colD = [];
      let colInfo = {};

      tableSelectedRows.map((v) => colN.push(v.columnname));
      tableSelectedRows.map((v) => colD.push(v.definition));

      colN.map((v, i) => (colInfo[v] = colD[i]));
      setColInfo(colInfo);
    }
  }, [tableSelectedRows, definitionValue]);

  useEffect(() => {
    if (treeval) {
      let dt = treeval.attribute;
      let colName = [];
      let valType = [];
      dt.map((v) => colName.push(v.fieldname));
      dt.map((v) => valType.push(v.datatype));

      let referenceNodeSet = {};
      if (toType === "network_1") {
        referenceNodeSet.srcNodeSet = srcRefNodeSet;
        referenceNodeSet.srcAddNew = srcAddNewNodes;
        setReferenceNodeSet(referenceNodeSet);
      } else if (toType === "network_2") {
        referenceNodeSet.srcNodeSet = srcRefNodeSet;
        referenceNodeSet.srcAddNew = srcAddNewNodes;
        referenceNodeSet.tgtNodeSet = tgtRefNodeSet;
        referenceNodeSet.tgtAddNew = tgtAddNewNodes;
        setReferenceNodeSet(referenceNodeSet);
      }

      switch (fromType) {
        case "nodeset":
          switch (toType) {
            case "raw":
              let nodeRawData = colName.map((v, i) => ({
                key: i,
                columnname: v,
                valuetype: valType[i],
                definition: "Attribute",
              }));
              let datakeylist = [];
              nodeRawData.map((v, i) => {
                datakeylist.push(v.key);
              });
              let label = {};
              label.key = datakeylist.length;
              label.columnname = "@LABEL";
              label.valuetype = "TEXT";
              label.definition = "Attribute";
              nodeRawData.push(label);
              return setTableData(nodeRawData);
            default:
              //nodeset > net1 or net2
              let nodeNet1Data = colName.map((v, i) => ({
                key: i,
                columnname: v,
                valuetype: valType[i],
              }));
              let datakeylist2 = [];
              nodeNet1Data.map((v, i) => {
                datakeylist2.push(v.key);
                return null;
              });
              let label2 = {};
              label2.key = datakeylist2.length;
              label2.columnname = "@LABEL";
              label2.valuetype = "TEXT";
              label2.definition = "Attribute";
              nodeNet1Data.push(label2);
              return setTableData(nodeNet1Data);
          }
        case "network":
          // let networkColumn = ["from", "to", "value"];
          let networkType = ["TEXT", "TEXT", "NUMBER"];
          let netData = columnName.map((v, i) => ({
            key: i,
            columnname: v,
            valuetype: networkType[i],
            definition: "Attribute",
          }));
          return setTableData(netData);
        default:
          //raw > node or net1 or net2
          let nodeNet1Data = colName.map((v, i) => ({
            key: i,
            columnname: v,
            valuetype: valType[i],
          }));
          return setTableData(nodeNet1Data);
      }
    } else if (importData) {
      let colName = [];
      let valType = [];
      let propsImportData = importData.dataType;
      propsImportData.map((v) => colName.push(v.title));
      propsImportData.map((v) => valType.push(v.valType));

      let referenceNodeSet = {};
      if (toType === "network_1") {
        referenceNodeSet.srcNodeSet = srcRefNodeSet;
        referenceNodeSet.srcAddNew = srcAddNewNodes;
        setReferenceNodeSet(referenceNodeSet);
      } else if (toType === "network_2") {
        referenceNodeSet.srcNodeSet = srcRefNodeSet;
        referenceNodeSet.srcAddNew = srcAddNewNodes;
        referenceNodeSet.tgtNodeSet = tgtRefNodeSet;
        referenceNodeSet.tgtAddNew = tgtAddNewNodes;
        setReferenceNodeSet(referenceNodeSet);
      }

      switch (fromType) {
        case "fileImportData":
        case "dbImportData":
          switch (toType) {
            case "raw":
              let toRawData = colName.map((v, i) => ({
                key: i,
                columnname: v,
                valuetype: valType[i],
                definition: "Attribute",
              }));
              return setTableData(toRawData);
            default:
              let toDefaultData = colName.map((v, i) => ({
                key: i,
                columnname: v,
                valuetype: valType[i],
              }));
              return setTableData(toDefaultData);
          }
        default:
          return;
      }
    }
  }, [
    fromType,
    toType,
    srcRefNodeSet,
    tgtRefNodeSet,
    srcAddNewNodes,
    tgtAddNewNodes,
    connectNodeSrcParam,
    connectNodeTgtParam,
  ]);

  useEffect(() => {
    if (toType === "network_1" || "network_2") {
      let networkProperty = {};
      networkProperty.direction = direction;
      networkProperty.multipleLink = multipleLink;
      if (multipleLink === true && multipleOpt) {
        networkProperty.multipleOpt = multipleOpt;
      }
      setNetworkProperty(networkProperty);
    }
  }, [direction, multipleLink, multipleOpt]);

  useEffect(() => {
    if (importData) {
      inputImportConvertData();
    } else {
      inputTreeSelectConvertData();
    }
  }, [colInfo, networkProperty, referenceNodeSet]);

  useEffect(() => {
    if (
      treeData &&
      (connectNodeSrcParam || connectNodeTgtParam === "connect")
    ) {
      let dataList = [];
      if (treeData[0].children) {
        treeData[0].children.map((td) => {
          dataList.push(td);
          return;
        });
        let nodeSetList = _.filter(dataList, (o) => {
          return o.vtype[0] === "nodeset";
        });

        if (toType === "network_1") {
          if (chooseSrcNodeset && connectNodeSrcParam === "connect") {
            let selectSrcNodeSet = _.filter(nodeSetList, (o) => {
              return o.title === chooseSrcNodeset;
            });
            let selectSrcNodeSetId = selectSrcNodeSet[0]._id;
            setSrcRefNodeset(`${selectSrcNodeSetId}`);
          } else if (connectNodeSrcParam === "create") {
            setSrcRefNodeset(null);
            // setSrcAddNewNodes(false)
          }
        } else if (toType === "network_2") {
          if (chooseSrcNodeset && connectNodeSrcParam === "connect") {
            let selectSrcNodeSet = _.filter(nodeSetList, (o) => {
              return o.title === chooseSrcNodeset;
            });
            let selectSrcNodeSetId = selectSrcNodeSet[0]._id;
            setSrcRefNodeset(`${selectSrcNodeSetId}`);
          } else if (connectNodeSrcParam === "create") {
            setSrcRefNodeset(null);
            // setSrcAddNewNodes(false)
          }
          if (chooseTgtNodeset && connectNodeTgtParam === "connect") {
            let selectTgtNodeSet = _.filter(nodeSetList, (o) => {
              return o.title === chooseTgtNodeset;
            });
            let selectTgtNodeSetId = selectTgtNodeSet[0]._id;
            setTgtRefNodeset(`${selectTgtNodeSetId}`);
          } else if (connectNodeTgtParam === "create") {
            setTgtRefNodeset(null);
            // setTgtAddNewNodes(false)
          }
        }
      }
    }
  }, [
    chooseSrcNodeset,
    chooseTgtNodeset,
    connectNodeSrcParam,
    connectNodeTgtParam,
  ]);

  const inputTreeSelectConvertData = () => {
    let convertData = {
      dataItem_ID: `${dataItemId}`,
      fromType: fromType,
      toType: toType,
      name: toName,
      desc: toDesc,
      colInfo: colInfo,
      networkProperty: networkProperty,
      referenceNodeSet: referenceNodeSet,
    };
    return cd(convertData);
  };

  const inputImportConvertData = () => {
    let importOriginData = importData.dataType.map((v) => ({
      title: `${v.title}`,
      dataIndex: v.dataIndex,
      valType: v.valType,
    }));
    if (fromType === "fileImportData") {
      let convertData = {
        datasetID: dataSetId,
        filePath: importData.filePath,
        tableName: importData.tableName,
        addHeader: importData.addHeader,
        columnDataType: importOriginData,
        toType: toType,
        name: toName,
        desc: toDesc,
        colInfo: colInfo,
        networkProperty: networkProperty,
        referenceNodeSet: referenceNodeSet,
      };
      return cd(convertData);
    } else if (fromType === "dbImportData") {
      let convertData = {
        datasetID: `${dataSetId}`,
        dbInfo: importData.dbInfo,
        tableName: importData.tableName,
        columnDataType: importOriginData,
        toType: toType,
        name: toName,
        desc: toDesc,
        colInfo: colInfo,
        networkProperty: networkProperty,
        referenceNodeSet: referenceNodeSet,
      };
      return cd(convertData);
    }
  };

  const onSelect = (text, record, index) => {
    switch (record.valuetype) {
      default:
        return;
      case "TEXT":
        switch (text) {
          case "Source Node":
          case "Target Node":
          case "Link Attribute":
          case "Node ID":
          case "Node Attribute":
            record.definition = text;
            return setDefinitionValue(record);
          default:
            return;
        }
      case "NUMBER":
        switch (text) {
          case "Weight":
          case "Link Attribute":
          case "Node Attribute":
            record.definition = text;
            return setDefinitionValue(record);
          default:
            return;
        }
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setTableSelectedRows(selectedRows);
    },
  };

  function onDirectionChange(checked) {
    setDirection(checked);
  }
  function onMultipleLinkChange(checked) {
    setMultipleLink(checked);
  }

  function onMultipleOption(value) {
    setMultipleOpt(value);
  }

  const onChangesrcRefNodeset = (e) => {
    setConnectNodeSrcParam(e.target.value);
  };
  const onChangetgtRefNodeset = (e) => {
    setConnectNodeTgtParam(e.target.value);
  };

  function onSrcAddNewNodes(checked) {
    setSrcAddNewNodes(checked);
  }
  function onTgtAddNewNodes(checked) {
    setTgtAddNewNodes(checked);
  }

  function handleChangeSrc(value) {
    setChooseSrcNodeset(value);
  }

  function handleChangeTgt(value) {
    setChooseTgtNodeset(value);
  }

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const rawNodeColumns = [
    {
      title: "Column Name",
      dataIndex: "columnname",
      width: 120,
    },
    {
      title: "Value Type",
      dataIndex: "valuetype",
      width: 100,
    },
    {
      title: "Definition",
      dataIndex: "definition",
      width: 180,
      render: (text, record, index) => (
        <div>
          <Select
            style={{ width: 150 }}
            name="select"
            onChange={(text) => {
              onSelect(text, record, index);
            }}
            // defaultValue={record.valuetype === "TEXT" ? "Node ID" : "Node Attribute"}
            placeholder="Choose Definition"
          >
            {record.valuetype === "NUMBER" ? (
              <>
                <Option value="Node ID" disabled>
                  Node ID
                </Option>
                <Option value="Node Attribute">Node Attribute</Option>
              </>
            ) : record.valuetype === "TEXT" ? (
              <>
                <Option value="Node ID">Node ID</Option>
                <Option value="Node Attribute">Node Attribute</Option>
              </>
            ) : null}
          </Select>
        </div>
      ),
    },
  ];

  const toRawColumns = [
    {
      title: "Column Name",
      dataIndex: "columnname",
      width: 120,
    },
    {
      title: "Value Type",
      dataIndex: "valuetype",
      width: 100,
    },
    {
      title: "Definition",
      dataIndex: "definition",
      width: 180,
      render: () => (
        <div>
          <Select
            style={{ width: 150 }}
            name="select"
            defaultValue="Attribute"
            disabled
          />
        </div>
      ),
    },
  ];

  const toNetColumns = [
    {
      title: "Column Name",
      dataIndex: "columnname",
      width: 120,
    },
    {
      title: "Value Type",
      dataIndex: "valuetype",
      width: 100,
    },
    {
      title: "Definition",
      dataIndex: "definition",
      width: 180,
      render: (text, record, index) => (
        <div>
          <Select
            style={{ width: 150 }}
            name="select"
            onChange={(text) => {
              onSelect(text, record, index);
            }}
            // defaultValue={() => record.valuetype === "TEXT" ? "Source Node"
            // : record.valuetype === "TEXT" && text === "Source Node" ? "Target Node"
            // : record.valuetype === "NUMBER" ? "Weight" : null}
            placeholder="Choose Definition"
          >
            {record.valuetype === "TEXT" ? (
              <>
                <Option value="Source Node">Source Node</Option>
                <Option value="Target Node">Target Node</Option>
                <Option value="Weight" disabled>
                  Weight
                </Option>
                <Option value="Link Attribute">Link Attribute</Option>
              </>
            ) : record.valuetype === "NUMBER" ? (
              <>
                <Option value="Source Node" disabled>
                  Source Node
                </Option>
                <Option value="Target Node" disabled>
                  Target Node
                </Option>
                <Option value="Weight">Weight</Option>
                <Option value="Link Attribute">Link Attribute</Option>
              </>
            ) : (
              <>
                <Option value="Source Node">Source Node</Option>
                <Option value="Target Node" disabled>
                  Target Node
                </Option>
                <Option value="Weight">Weight</Option>
                <Option value="Link Attribute">Link Attribute</Option>
              </>
            )}
          </Select>
        </div>
      ),
    },
  ];

  const network_1View = (
    <>
      <Table
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={toNetColumns}
        dataSource={tableData}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 240 }}
      />

      <Row>
        <Col span={12}>
          <div>Network Property</div>
          <div>Direction(Source → Target)</div>
          <div>Merge Multiple Link</div>
        </Col>
        <Col span={12}>
          <br />
          <div>
            <Switch onChange={onDirectionChange} />
          </div>
          <div>
            <Switch onChange={onMultipleLinkChange} />

            {multipleLink === true ? (
              <>
                <Select
                  style={{ marginLeft: 30, width: 100 }}
                  name="mergemultiple"
                  onChange={onMultipleOption}
                >
                  <Option value="Sum">Sum</Option>
                  <Option value="Average">Average</Option>
                  <Option value="Max">Max</Option>
                  <Option value="Min">Min</Option>
                </Select>
              </>
            ) : (
              <>
                <Select
                  style={{ marginLeft: 30, width: 100 }}
                  name="mergemultiple"
                  defaultValue="Sum"
                  disabled
                />
              </>
            )}
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={12}>
          <div>Reference Nodeset</div>
          {toType === "network_2" ? <div>Source Nodeset</div> : null}
          <Radio.Group onChange={onChangesrcRefNodeset} defaultValue="create">
            <Radio style={radioStyle} value="create">
              Create new reference Nodeset
            </Radio>
            <Radio style={radioStyle} value="connect">
              Connect to Existing Nodeset
            </Radio>
          </Radio.Group>

          {connectNodeSrcParam === "connect" ? (
            <div>
              <Select
                placeholder="Choose Nodeset"
                style={{ marginLeft: 30, width: 150 }}
                onSelect={handleChangeSrc}
              >
                {dataSetName ? (
                  dataSetName.map((v, i) => {
                    return (
                      <Option value={v} key={i}>
                        {v}
                      </Option>
                    );
                  })
                ) : (
                  <Option disabled>None Nodeset</Option>
                )}
              </Select>
            </div>
          ) : (
            <div>
              <Select
                placeholder="Choose Nodeset"
                disabled
                style={{ marginLeft: 30, width: 150 }}
              />
            </div>
          )}
        </Col>
        <Col span={12}>
          <br />
          <br />
          {connectNodeSrcParam === "connect" ? (
            <div style={{ position: "absolute", bottom: 0 }}>
              Add new nodes{" "}
              <Switch onChange={onSrcAddNewNodes} value={srcAddNewNodes} />
            </div>
          ) : (
            <div style={{ position: "absolute", bottom: 0 }}>
              Add new nodes{" "}
              <Switch
                disabled
                onChange={onSrcAddNewNodes}
                value={srcAddNewNodes}
              />
            </div>
          )}
        </Col>
      </Row>
    </>
  );

  const network_2View = (
    <Row>
      <Col span={12}>
        <div>Target Nodeset</div>
        <Radio.Group onChange={onChangetgtRefNodeset} defaultValue="create">
          <Radio style={radioStyle} value="create">
            Create new reference Nodeset
          </Radio>
          <Radio style={radioStyle} value="connect">
            Connect to Existing Nodeset
          </Radio>
        </Radio.Group>
        {connectNodeTgtParam === "connect" ? (
          <div>
            <Select
              placeholder="Choose Nodeset"
              style={{ marginLeft: 30, width: 150 }}
              onChange={handleChangeTgt}
            >
              {dataSetName.map((v, i) => {
                return (
                  <Option value={v} key={i}>
                    {v}
                  </Option>
                );
              })}
            </Select>{" "}
          </div>
        ) : (
          <div>
            <Select
              placeholder="Choose Nodeset"
              disabled
              style={{ marginLeft: 30, width: 150 }}
            />
          </div>
        )}
      </Col>
      <Col span={12}>
        <br />
        <br />
        {connectNodeTgtParam === "connect" ? (
          <div style={{ position: "absolute", bottom: 0 }}>
            Add new nodes{" "}
            <Switch onChange={onTgtAddNewNodes} value={tgtAddNewNodes} />
          </div>
        ) : (
          <div style={{ position: "absolute", bottom: 0 }}>
            Add new nodes{" "}
            <Switch
              disabled
              onChange={onTgtAddNewNodes}
              value={tgtAddNewNodes}
            />
          </div>
        )}
      </Col>
    </Row>
  );
  return (
    <>
      <div>Choose and Define Column</div>
      {(() => {
        switch (fromType) {
          case "fileImportData":
          case "dbImportData":
            switch (toType) {
              case "raw":
                return (
                  <Table
                    rowSelection={{ type: "checkbox", ...rowSelection }}
                    columns={toRawColumns}
                    dataSource={tableData}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 240 }}
                  />
                );
              case "nodeset":
                return (
                  <Table
                    rowSelection={{ type: "checkbox", ...rowSelection }}
                    columns={rawNodeColumns}
                    dataSource={tableData}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 240 }}
                  />
                );
              case "network_1":
                return <div>{network_1View}</div>;
              case "network_2":
                return (
                  <div>
                    {network_1View} {network_2View}
                  </div>
                );
              default:
                return null;
            }
          case "raw":
            switch (toType) {
              case "nodeset":
                return (
                  <Table
                    rowSelection={{ type: "checkbox", ...rowSelection }}
                    columns={rawNodeColumns}
                    dataSource={tableData}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 240 }}
                  />
                );
              case "network_1":
                return <div>{network_1View}</div>;
              case "network_2":
                return (
                  <div>
                    {network_1View} {network_2View}
                  </div>
                );
              default:
                return null;
            }
          case "nodeset":
            switch (toType) {
              case "raw":
                return (
                  <Table
                    rowSelection={{ type: "checkbox", ...rowSelection }}
                    columns={toRawColumns}
                    dataSource={tableData}
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 240 }}
                  />
                );
              case "network_1":
                return <div>{network_1View}</div>;
              case "network_2":
                return (
                  <div>
                    {network_1View} {network_2View}
                  </div>
                );
              default:
                return null;
            }
          case "network":
            return (
              <Table
                rowSelection={{ type: "checkbox", ...rowSelection }}
                columns={toRawColumns}
                dataSource={tableData}
                pagination={{ pageSize: 100 }}
                scroll={{ y: 240 }}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default ConvertDataType2;
