import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Radio,
  Checkbox,
  Switch,
} from "antd";
import _ from "lodash";
import { GrEdit, GrCheckmark } from "react-icons/gr";

const { Option } = Select;

const CreateInterface = ({ onChangeToName, onChangeToDesc }) => {
  const onChangeNValue = (e) => {
    return onChangeToName(e.target.value);
  };
  const onChangeDValue = (e) => {
    return onChangeToDesc(e.target.value);
  };

  return (
    <>
      <div style={{ width: "100%" }}>Name</div>
      <Input width="300" onChange={onChangeNValue} />
      <div style={{ width: "100%" }}>Description</div>
      <Input width="300" onChange={onChangeDValue} />
    </>
  );
};

const AddAttributeInterface = ({
  data,
  onSelect,
  compoData,
  prefixStatus,
  onChangePrefix,
}) => {
  const [tableData, setTableData] = useState();
  const [preDisabled, setPreDisabled] = useState(true);
  const [isInputDisabled, setInputDisabled] = useState(true); //input disabled

  useEffect(() => {
    if (data) {
      let tableDataColumn = data.setting.column;

      let valueColumn = _.filter(tableDataColumn, (o) => {
        return o.title !== "-";
      });

      let tableData = valueColumn.map((v, i) => ({
        key: i,
        tableField: v.title,
        newFieldName: v.title,
      }));
      setTableData(tableData);
      // return makeTableData(tableData)
    }
  }, [data]);

  useEffect(() => {
    if (preDisabled) prefixStatusPassing(preDisabled);
  }, [preDisabled]);

  const prefixStatusPassing = (preDisabled) => {
    return prefixStatus(preDisabled); // Passing status to parent
  };

  const onSelectV = (e, text, record, index) => {
    if (e.target.value) {
      record.newFieldName = e.target.value;
      return onSelect(record);
    }
  };

  const onRename = (e) => {
    setInputDisabled(false);
  };
  const onApply = (e) => {
    setInputDisabled(true);
  };

  function isPrefix(e) {
    setPreDisabled(!e.target.checked);
  }

  function onChangePrefixV(e) {
    return onChangePrefix(e);
  }

  const rowSelectionV = {
    onChange: (selectedRowKeys, selectedRows) => {
      return compoData(selectedRows);
    },
  };

  const tableColumns = [
    {
      title: "Table Field",
      dataIndex: "tableField",
      width: 120,
    },
    {
      title: "New Field Name",
      dataIndex: "newFieldName",
      width: 180,
      render: (text, record, index) => (
        <div>
          <Input
            key={index}
            style={{ width: 150 }}
            defaultValue={record.tableField}
            disabled={isInputDisabled && true}
            // onClick={onDeActivateInput}
            onChange={(e) => {
              onSelectV(e, text, record, index);
            }}
          />
          <Button
            style={{ marginLeft: "20px" }}
            icon={<GrEdit />}
            size={"small"}
            onClick={onRename}
          />
          <Button icon={<GrCheckmark />} size={"small"} onClick={onApply} />
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}>
        {" "}
        Choose Column{" "}
      </div>
      <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}>
        <Checkbox onChange={isPrefix}>Prefix</Checkbox>
        <Input
          style={{ width: 100 }}
          disabled={preDisabled && true}
          onChange={onChangePrefixV}
        />
      </div>
      <Table
        rowSelection={{ type: "checkbox", ...rowSelectionV }}
        columns={tableColumns}
        dataSource={tableData}
        pagination={{ pageSize: 100 }}
        scroll={{ y: 240 }}
      />
    </>
  );
};

const CreateData = (props) => {
  // analysis result
  const [data, setData] = useState();

  // JSON - inputedData
  const [dataId] = useState(props.dataID);
  const [dataType] = useState(props.dataType);

  // table data
  const [newFieldName, setNewFieldName] = useState(); //table newFieldName

  // JSON - insertParam
  const [outputType] = useState(props.outputType);
  const [enableAdd] = useState(props.enableAdd);
  const [insertType, setInsertType] = useState(); //radio insert
  const [param, setParam] = useState();
  // JSON - insertParam > param - create
  const [toName, setToName] = useState();
  const [toDesc, setToDesc] = useState();
  // JSON - insertParam > param - create network
  const [srcRefNodeSet, setSrcRefNodeset] = useState(null);
  const [tgtRefNodeSet] = useState(null);
  const [srcAddNewNodes, setSrcAddNewNodes] = useState(false);
  const [tgtAddNewNodes, setTgtAddNewNodes] = useState(false);
  const [chooseSrcNodeset, setChooseSrcNodeset] = useState();
  const [chooseTgtNodeset, setChooseTgtNodeset] = useState();
  const [connectNodeSrcParam, setConnectNodeSrcParam] = useState();
  const [connectNodeTgtParam, setConnectNodeTgtParam] = useState();

  // ######
  const [referenceNodeSet, setReferenceNodeSet] = useState();

  // JSON - insertParam > param > Add NetworkAttribute

  // JSON - insertParam > param > Add RawAttribute or Add NodeAttribute
  const [selectedField, setSelectedField] = useState(); //selected row
  const [tableSelectedRows, setTableSelectedRows] = useState(); // table select

  const [prefix, setPrefix] = useState(null); // prefix add input

  // ######
  const [insertParam, setInsertParam] = useState();

  // JSON - outputData
  // ######
  const [outputData, setOutputData] = useState();

  // insertType
  useEffect(() => {
    setData(props.data);
    switch (outputType) {
      default:
        return null;
      case "raw":
        switch (enableAdd) {
          case false:
            return setInsertType("Create RawData");
          case true:
            return setInsertType("Add RawAttribute");
        }
        break;
      case "nodeset":
        switch (enableAdd) {
          case false:
            return setInsertType("Create NodeData");
        }
        break;
      case "network_1":
      case "network_2":
        switch (enableAdd) {
          case false:
            return setInsertType("Create Network");
          default:
            return;
        }
        break;
    }
  }, [outputType, enableAdd]);

  // create outputData, tableData
  useEffect(() => {
    if (data) {
      let originDt = data.dtlist;
      let tableDataColumn = data.setting.column;

      let originDataTitle = [];
      let originDataType = [];

      tableDataColumn.map((v, i) => originDataTitle.push(v.title));
      tableDataColumn.map((v, i) => originDataType.push(v.datatype));
      let dataType = {};
      originDataTitle.map((v, i) => (dataType[v] = originDataType[i]));

      let outputData = {
        data: originDt,
        dataType: dataType,
      };
      setOutputData(outputData);

      // let fixedValue = _.filter(tableDataColumn, (o) => {
      //     return o.title === "-";
      // })
      // console.log("label값 -", fixedValue)

      // let valueColumn = _.filter(tableDataColumn, (o) => {
      //     return o.title !== "-";
      // })
      // console.log("고정값 제외 데이터", valueColumn)

      // let tableData = valueColumn.map((v, i) => ({ key: i, tableField: v.title, newFieldName: v.title }))
      // console.log("테이블데이터", tableData)
      // setTableData(tableData)
    }
  }, [data]);

  useEffect(() => {
    let param = {};
    switch (insertType) {
      default:
        return;
      case "Create RawData":
      case "Create NodeData":
      case "Create 2mode Network":
        param.name = toName;
        param.desc = toDesc;
        return setParam(param);
      case "Create Network":
        param.name = toName;
        param.desc = toDesc;
        param.referenceNodeSet = referenceNodeSet;
        return setParam(param);
      case "Add RawAttribute":
      case "Add NodeAttribute":
        param.selectedField = selectedField;
        param.prefix = prefix;
        return setParam(param);
      // case "Add NetworkAttribute":
      //     param.selectedNetwork = selectedNetwork;
      //     param.attrName = attrName;
      //     return setParam(param);
    }
  }, [insertType, toName, toDesc, selectedField, prefix]);

  useEffect(() => {
    if (tableSelectedRows) {
      let selectTableField = [];
      let selectNewField = [];
      tableSelectedRows.map((v) => selectTableField.push(v.tableField));
      tableSelectedRows.map((v) => selectNewField.push(v.newFieldName));
      let selectedField = {};
      selectTableField.map((v, i) => (selectedField[v] = selectNewField[i]));
      // let newFieldList = {};
      // if(newFieldName) {
      //     newFieldList.push(newFieldName)
      // }
      // console.log("뉴필드 리스트", newFieldList)

      setSelectedField(selectedField);
      // if(!newFieldName) {
      // }else if(newFieldName) {
      //     setSelectedField(newFieldName)
      // }
    }
  }, [tableSelectedRows, newFieldName]);

  useEffect(() => {
    let insertParam = {};
    insertParam.outputType = outputType;
    insertParam.enableAdd = enableAdd;
    insertParam.insertType = insertType;
    insertParam.param = param;
    setInsertParam(insertParam);
  }, [param]);

  useEffect(() => {
    jsonData();
  }, [insertParam, newFieldName]);

  const onSelect = (record) => {
    setNewFieldName(record);
    jsonData();
  };

  useEffect(() => {
    let referenceNodeSet = {};
    if (outputType === "network_1") {
      referenceNodeSet.srcNodeSet = srcRefNodeSet;
      referenceNodeSet.srcAddNew = srcAddNewNodes;
      setReferenceNodeSet(referenceNodeSet);
    } else if (outputType === "network_2") {
      referenceNodeSet.srcNodeSet = srcRefNodeSet;
      referenceNodeSet.srcAddNew = srcAddNewNodes;
      referenceNodeSet.tgtNodeSet = tgtRefNodeSet;
      referenceNodeSet.tgtAddNew = tgtAddNewNodes;
      setReferenceNodeSet(referenceNodeSet);
    }
  }, [
    srcRefNodeSet,
    tgtRefNodeSet,
    srcAddNewNodes,
    tgtAddNewNodes,
    connectNodeSrcParam,
    connectNodeTgtParam,
  ]);

  useEffect(() => {
    if (connectNodeSrcParam || connectNodeTgtParam === "connect") {
      setSrcRefNodeset(chooseSrcNodeset);
    } else if (connectNodeSrcParam || connectNodeTgtParam === "create")
      setSrcRefNodeset(null);
    // TODO::
    // 1. dataset children dataitem(nodeset) list

    // if (treeData[0].children) {
    //     treeData[0].children.map((td) => {
    //       dataList.push(td)
    //     })

    // 2. nodeset list

    //     let nodeSetList = _.filter(dataList, (o) => {
    //       return o.vtype[0] === "nodeset";
    //     })

    // 3. if(radio connect && select box name)  ===  nodeset list title > ObjectID find

    //     if (toType === "network_1") {
    //       if (chooseSrcNodeset && connectNodeSrcParam === "connect") {
    //         let selectSrcNodeSet = _.filter(nodeSetList, (o) => {
    //           return o.title === chooseSrcNodeset;
    //         })
    //         let selectSrcNodeSetId = selectSrcNodeSet[0]._id;
    //         setSrcRefNodeset(`${selectSrcNodeSetId}`)

    // 4. if(radio create) > null

    //       } else if (connectNodeSrcParam === "create") {
    //         setSrcRefNodeset(null)
    //         // setSrcAddNewNodes(false)
    //       }
    //     } else if (toType === "network_2") {
    //       if (chooseSrcNodeset && connectNodeSrcParam === "connect") {
    //         let selectSrcNodeSet = _.filter(nodeSetList, (o) => {
    //           return o.title === chooseSrcNodeset;
    //         })
    //         let selectSrcNodeSetId = selectSrcNodeSet[0]._id;
    //         setSrcRefNodeset(`${selectSrcNodeSetId}`)
    //       } else if (connectNodeSrcParam === "create") {
    //         setSrcRefNodeset(null)
    //         // setSrcAddNewNodes(false)
    //       }
    //       if (chooseTgtNodeset && connectNodeTgtParam === "connect") {
    //         let selectTgtNodeSet = _.filter(nodeSetList, (o) => {
    //           return o.title === chooseTgtNodeset;
    //         })
    //         let selectTgtNodeSetId = selectTgtNodeSet[0]._id;
    //         setTgtRefNodeset(`${selectTgtNodeSetId}`)
    //       } else if (connectNodeTgtParam === "create") {
    //         setTgtRefNodeset(null)
    //         // setTgtAddNewNodes(false)
    //       }
    //     }
    //   }
  }, [
    chooseSrcNodeset,
    chooseTgtNodeset,
    connectNodeSrcParam,
    connectNodeTgtParam,
  ]);

  // const onRename = (e) => {
  //     setInputDisabled(false)
  // }
  // const onApply = (e) => {
  //     setInputDisabled(true)
  // }

  // const tableColumns = [
  //     {
  //         title: 'Table Field',
  //         dataIndex: 'tableField',
  //         width: 120
  //     },
  //     {
  //         title: "New Field Name",
  //         dataIndex: 'newFieldName',
  //         width: 180,
  //         render: (text, record, index) => (
  //             <div>
  //                 <Input key={index} style={{ width: 150 }}
  //                     defaultValue={record.tableField}
  //                     disabled={isInputDisabled && true}
  //                     // onClick={onDeActivateInput}
  //                     onChange={(e) => { onSelect(e, text, record, index) }} />
  //                 <Button style={{ marginLeft: "20px" }} icon={<GrEdit />} size={'small'} onClick={onRename} />
  //                 <Button icon={<GrCheckmark />} size={'small'} onClick={onApply} />
  //             </div>
  //         )
  //     }
  // ]

  const compoData = (selectedRows) => {
    setTableSelectedRows(selectedRows);
    jsonData();
  };

  const prefixStatus = (status) => {
    if (status === true) {
      setPrefix(null);
    }
    jsonData();
  };
  const onChangeToName = (e) => {
    setToName(e.target.value);
  };

  const onChangeToDesc = (e) => {
    setToDesc(e.target.value);
  };

  const onChangeToAttrName = (e) => {
    // setAttrName(e.target.value)
  };

  // const rowSelection = {
  //     onChange: (selectedRowKeys, selectedRows) => {
  //         console.log("선택된 행 ", selectedRows)
  //         setTableSelectedRows(selectedRows)
  //         jsonData()
  //     }
  // }

  const nodesetOption = [
    { label: "Add NodeAttribute", value: "Add NodeAttribute" },
    { label: "Create 2mode Network", value: "Create 2mode Network" },
  ];

  const networkOption = [
    { label: "Create Network", value: "Create Network" },
    { label: "Add NetworkAttribute", value: "Add NetworkAttribute" },
  ];

  const onChangeInsetType = (e) => {
    setInsertType(e.target.value);
  };

  const jsonData = () => {
    let addToData = {
      inputedData: {
        dataID: dataId,
        dataType: dataType,
      },
      insertParam: insertParam,
      outputData: outputData,
    };

    return props.addToDatasetData(addToData);
  };

  // function isPrefix(e) {
  //     console.log("prefix 체크", e.target.checked)
  //     setPreDisabled(!e.target.checked)
  // }

  function onChangePrefix(e) {
    setPrefix(e.target.value);
  }

  const onChangesrcRefNodeset = (e) => {
    setConnectNodeSrcParam(e.target.value);
  };

  const onChangetgtRefNodeset = (e) => {
    setConnectNodeTgtParam(e.target.value);
  };

  function handleChangeSrc(value) {
    setChooseSrcNodeset(value);
  }

  function handleChangeTgt(value) {
    setChooseTgtNodeset(value);
  }

  function onSrcAddNewNodes(checked) {
    setSrcAddNewNodes(checked);
  }

  function onTgtAddNewNodes(checked) {
    setTgtAddNewNodes(checked);
  }

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const dataSetName = ["one", "two", "three", "four", "five"];

  return (
    <>
      {(() => {
        switch (outputType) {
          case "raw":
            switch (enableAdd) {
              case false:
                return (
                  <Row>
                    <div
                      style={{
                        width: "100%",
                        marginLeft: "30px",
                        marginBottom: "15px",
                      }}
                    >
                      <Radio.Group
                        options={[
                          { label: "Create RawData", value: "Create RawData" },
                        ]}
                        onChange={onChangeInsetType}
                        value={insertType}
                      />
                    </div>
                    <CreateInterface
                      onChangeToName={onChangeToName}
                      onChangeToDesc={onChangeToDesc}
                    />
                  </Row>
                );
              case true:
                return (
                  <Row>
                    <div
                      style={{
                        width: "100%",
                        marginLeft: "30px",
                        marginBottom: "15px",
                      }}
                    >
                      <Radio.Group
                        options={[
                          {
                            label: "Add RawAttribute",
                            value: "Add RawAttribute",
                          },
                        ]}
                        onChange={onChangeInsetType}
                        value={insertType}
                      />
                    </div>
                    <AddAttributeInterface
                      data={data}
                      compoData={compoData}
                      onSelect={onSelect}
                      prefixStatus={prefixStatus}
                      onChangePrefix={onChangePrefix}
                    />
                    {/* <>
                                        <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}> Choose Column </div>
                                        <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}><Checkbox onChange={isPrefix}>Prefix</Checkbox>
                                            <Input style={{ width: 100 }} disabled={preDisabled && true} onChange={onChangePrefix} />
                                        </div>
                                        <Table rowSelection={{ type: "checkbox", ...rowSelection }}
                                            columns={tableColumns} dataSource={tableData} pagination={{ pageSize: 100 }} scroll={{ y: 240 }} /> </> */}
                  </Row>
                );
              default:
                return null;
            }
          case "nodeset":
            switch (enableAdd) {
              default:
                return;
              case false:
                return (
                  <Row>
                    <div
                      style={{
                        width: "100%",
                        marginLeft: "30px",
                        marginBottom: "15px",
                      }}
                    >
                      <Radio.Group
                        options={[
                          {
                            label: "Create NodeData",
                            value: "Create NodeData",
                          },
                        ]}
                        onChange={onChangeInsetType}
                        value={insertType}
                      />
                    </div>
                    <CreateInterface
                      onChangeToName={onChangeToName}
                      onChangeToDesc={onChangeToDesc}
                    />
                  </Row>
                );
              case true:
                return (
                  <Row>
                    <div
                      style={{
                        width: "100%",
                        marginLeft: "30px",
                        marginBottom: "15px",
                      }}
                    >
                      <Radio.Group
                        options={nodesetOption}
                        onChange={onChangeInsetType}
                        value={insertType}
                      />
                    </div>
                    {insertType === "Add NodeAttribute" ? (
                      <AddAttributeInterface
                        data={data}
                        compoData={compoData}
                        onSelect={onSelect}
                        prefixStatus={prefixStatus}
                        onChangePrefix={onChangePrefix}
                      />
                    ) : // <>
                    //     <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}> Choose Column </div>
                    //     <div style={{ width: "50%", marginTop: "30px", marginBottom: "10px" }}><Checkbox onChange={isPrefix}>Prefix</Checkbox>
                    //         <Input style={{ width: 100 }} disabled={preDisabled && true} onChange={onChangePrefix} />
                    //     </div>
                    //     <Table rowSelection={{ type: "checkbox", ...rowSelection }}
                    //         columns={tableColumns} dataSource={tableData} pagination={{ pageSize: 100 }} scroll={{ y: 240 }} /> </>
                    insertType === "Create 2mode Network" ? (
                      <>
                        <CreateInterface
                          onChangeToName={onChangeToName}
                          onChangeToDesc={onChangeToDesc}
                        />
                      </>
                    ) : null}
                  </Row>
                );
            }
          case "network_1":
          case "network_2":
            switch (enableAdd) {
              case false:
                return (
                  <>
                    <Row>
                      <div
                        style={{
                          width: "100%",
                          marginLeft: "30px",
                          marginBottom: "15px",
                        }}
                      >
                        <Radio.Group
                          options={[
                            {
                              label: "Create Network",
                              value: "Create Network",
                            },
                          ]}
                          onChange={onChangeInsetType}
                          value={insertType}
                        />
                      </div>
                      <CreateInterface
                        onChangeToName={onChangeToName}
                        onChangeToDesc={onChangeToDesc}
                      />
                    </Row>
                    <br />
                    <Row>
                      <Col span={12}>
                        <div>Reference Nodeset</div>
                        {outputType === "network_2" ? (
                          <div>Source Nodeset</div>
                        ) : null}
                        <Radio.Group
                          onChange={onChangesrcRefNodeset}
                          defaultValue="create"
                        >
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
                            <Switch
                              onChange={onSrcAddNewNodes}
                              value={srcAddNewNodes}
                            />
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
                    {outputType === "network_2" ? (
                      <Row style={{ marginTop: "30px" }}>
                        <Col span={12}>
                          <div>Target Nodeset</div>
                          <Radio.Group
                            onChange={onChangetgtRefNodeset}
                            defaultValue="create"
                          >
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
                              <Switch
                                onChange={onTgtAddNewNodes}
                                value={tgtAddNewNodes}
                              />
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
                    ) : null}
                  </>
                );
              case true:
                return (
                  <Row>
                    <Radio.Group
                      options={networkOption}
                      onChange={onChangeInsetType}
                      value={insertType}
                    >
                      {" "}
                    </Radio.Group>
                    {insertType === "Create Network" ? (
                      // TODO:: Reference Nodeset UI - network_1 & network_2
                      <>
                        {/* <div style={{ width: "100%", marginLeft: "30px" }}> <b style={{ fontSize: 15, color: "blue" }}>Create Network</b></div> */}
                        <CreateInterface
                          onChangeToName={onChangeToName}
                          onChangeToDesc={onChangeToDesc}
                        />
                      </>
                    ) : insertType === "Add NetworkAttribute" ? (
                      // TODO:: Table - Checkbox, column-networkName, Input - attr name
                      <>
                        {/* <Table rowSelection={{ type: "checkbox", ...rowSelection }}
                                                    columns={tableColumns} dataSource={tableData} pagination={{ pageSize: 100 }} scroll={{ y: 240 }} /> */}
                        <div style={{ width: "100%" }}>Attribute Name</div>
                        <Input width="300" onChange={onChangeToAttrName} />
                      </>
                    ) : null}
                  </Row>
                );
            }
            break;
          default:
            return null;
        }
      })()}
    </>
  );
};

const AddtoDataset = (props) => {
  console.log("Add컴포넌트 데이터", props.data);
  const [data, setData] = useState(props.data);

  let dataID = "6062f5076c7f695dd0dafb50";
  let dataType = "network";
  let outputType = "nodeset";
  let enableAdd = true;

  return (
    <>
      <CreateData
        data={data}
        dataID={dataID}
        dataType={dataType}
        outputType={outputType}
        enableAdd={enableAdd}
        addToDatasetData={props.addToDatasetData}
      />
    </>
  );
};

export default AddtoDataset;
