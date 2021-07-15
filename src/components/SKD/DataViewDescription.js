import { globalVariable } from "actions";
import { Button, Col, Descriptions, Modal, Row, Tooltip } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import MoreMenu from "components/SKD/MoreMenu";
import SelectDataEdit from "Data/SelectDataEdit";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import ReactExport from "react-export-excel";
import {
  GrCopy,
  GrDocumentConfig,
  GrDocumentCsv,
  GrDocumentExcel,
  GrEdit,
  GrTrash,
} from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import ConvertDataType1 from "./ConvertDataType1";
import ConvertDataType2 from "./ConvertDataType2";
import { currentsetting } from "config/index.js";
import { useConfirm } from "material-ui-confirm";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const DescRow = ({ data, title, format, colspan, extra }) => {
  if (!format) format = -1;

  return (
    <>
      <Descriptions
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        title={title}
        size={"small"}
        extra={extra}
      >
        {Object.keys(data).map((a, b) => {
          let txt = data[a];
          let colspan1 = 1;

          const upperKey = a[0].toUpperCase() + a.slice(1);
          if (colspan && colspan[a]) {
            colspan1 = parseInt(colspan[a]);
          }

          return (
            <Descriptions.Item label={upperKey} key={a + b} span={colspan1}>
              {txt}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
};

const DataViewDescription = ({
  data,
  title,
  format,
  colspan,
  extra,
  dataTitle,
  columnHead,
  dataItem,
  treeval,
  treedt,
  onEditSummary,
  onDeleteSummary,
  treeUpdate,
}) => {
  const [columnSelected, setColumnSelected] = useState();
  const [dataSelected, setDataSelected] = useState();
  const [dataItemTitle, setDataItemTitle] = useState(dataTitle);
  const [allData, setAllData] = useState(treeval);
  const [treeData, setTreeData] = useState(treedt);
  const [firstModalData, setFirstModalData] = useState();
  const [convertData, setConvertData] = useState();
  const [confirmLoading, setConfirmLoading] = useState();
  const [isNextDisabled, setNextDisabled] = useState(true);
  const csvDownload = useRef(null);
  const xlsxDownload = useRef(null);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  let openConvert = useSelector((state) => state.global.openConvert);
  let visibleEdit = useSelector((state) => state.global.visibleEdit);
  let modalStep = useSelector((state) => state.global.modalStep);

  useEffect(() => {
    dispatch(globalVariable({ modalStep: 0 }));
    if (columnHead && dataItem && dataTitle && treeval) {
      setColumnSelected(columnHead);
      setDataSelected(dataItem);
      setDataItemTitle(dataTitle);
      setAllData(treeval);
    }
  }, [columnHead, dataItem, treeval]);

  let columnName = [];
  let exportData = [];
  if (columnSelected && dataSelected) {
    columnSelected.map((v) => columnName.push(v.title));
    exportData = dataSelected;
  }

  const csvReport = {
    headers: columnName.map((v) => ({ label: `${v}`, key: v })),
    data: exportData,
    filename: `${dataItemTitle}.csv`,
    ref: csvDownload,
    target: "_blank",
  };

  const editHandler = (data) => {
    dispatch(globalVariable({ visibleEdit: true }));
    dispatch(globalVariable({ selecedLoad: true }));
  };

  const editSummary = (editData) => {
    if (onEditSummary) onEditSummary(editData);
  };

  const deleteHandler = (data) => {
    let config = {
      method: "post",
      url: `${currentsetting.webserviceprefix}deletebundle/`,
      data: {
        rootid: data.ID,
        collname: data.Type,
      },
    };
    confirm({
      description:
        "Are you sure you want to delete this item?\n This cannot bet undone.",
    }).then(() => {
      axios(config).then((r) => {
        if (r.status === 200) {
          if (onDeleteSummary) onDeleteSummary(data.ID);
        }
      });
    });
  };

  const menu = [
    {
      title: (
        <Tooltip title="Edit" placement="left">
          <GrEdit /> <span style={{ fontSize: 12 }}>Edit</span>
        </Tooltip>
      ),
      onClick: () => {
        editHandler(data);
      },
    },
    // {
    //     title: (
    //         <Tooltip title="Copy" placement="left">
    //             <GrCopy />
    //         </Tooltip>
    //     ),
    //     onClick: () => {

    //     }
    // },
    {
      title: (
        <Tooltip title="Convert Data Type" placement="left">
          <GrDocumentConfig />{" "}
          <span style={{ fontSize: 12 }}>Convert Data Type</span>
        </Tooltip>
      ),
      onClick: () => {
        dispatch(globalVariable({ openConvert: true }));
        dispatch(globalVariable({ modalStep: 1 }));
      },
    },
    {
      title: (
        <Tooltip title="Export .csv File" placement="left">
          <GrDocumentCsv /> <span style={{ fontSize: 12 }}>Export .csv</span>
        </Tooltip>
      ),
      onClick: () => {
        csvDownload.current.link.click();
      },
    },
    {
      title: (
        <Tooltip title="Export .xlsx File" placement="left">
          <GrDocumentExcel /> <span style={{ fontSize: 12 }}>Export .xlsx</span>
        </Tooltip>
      ),
      onClick: () => {
        xlsxDownload.current.handleDownload();
      },
    },
    {
      title: (
        <Tooltip title="Delete" placement="left">
          <GrTrash /> <span style={{ fontSize: 12 }}>Delete</span>
        </Tooltip>
      ),
      onClick: () => {
        deleteHandler(data);
      },
    },
  ];

  const onModalNextStep = () => {
    dispatch(globalVariable({ modalStep: modalStep + 1 }));
  };

  const onModalPrevStep = () => {
    dispatch(globalVariable({ modalStep: modalStep - 1 }));
  };

  const onModalData = (modal1data) => {
    setFirstModalData(modal1data);
  };

  const onConvertData = (convertdata) => {
    setConvertData(convertdata);
  };

  const transportConvertData = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      dispatch(globalVariable({ openConvert: false }));
    }, 2000);

    let config = {
      method: "post",
      // url: `http://src.netminer.com:9403/convertDataItem`,
      url: `http://192.168.3.58:8011/convertDataItem`,
      data: convertData,
    };
    axios(config).then((r) => {
      console.log(r);
      if (r.status === 200) {
        if (treeUpdate) treeUpdate(treedt[0]._id);
      }
    });
  };

  const deactivateNext = (nextDisabled) => {
    setNextDisabled(nextDisabled);
  };

  return (
    <>
      <Row>
        <Col span={23}>
          <div style={{ width: "99%", padding: 5 }}>
            {data && (
              <DescRow
                data={data}
                title={title}
                format={format}
                colspan={colspan}
                extra={extra}
              />
            )}
          </div>
        </Col>
        <Col span={1}>
          <div style={{ width: "99%", padding: 5 }}>
            {data.Title && <MoreMenu menu={menu} button />}
            <CSVLink {...csvReport}></CSVLink>
            <ExcelFile
              ref={xlsxDownload}
              element={<button style={{ display: "none" }}></button>}
              filename={dataItemTitle}
            >
              <ExcelSheet data={exportData} name={`${dataItemTitle}`}>
                {columnName.map((v, i) => {
                  return (
                    <ExcelColumn
                      label={columnName[i]}
                      value={columnName[i]}
                      key={columnName[i]}
                    />
                  );
                })}
              </ExcelSheet>
            </ExcelFile>
          </div>
        </Col>
      </Row>

      <Modal
        title="Convert Data Type"
        visible={openConvert}
        confirmLoading={confirmLoading}
        distroyOnClose={true}
        onCancel={() => {
          dispatch(globalVariable({ openConvert: false }));
        }}
        okText="Next"
        footer={[
          modalStep === 2 ? (
            <Button onClick={onModalPrevStep}>Prev</Button>
          ) : null,
          <Button
            key="cancel"
            onClick={() => {
              // cleanUpBuilder();
              // onModalClear()
              dispatch(globalVariable({ modalStep: 0 }));
              dispatch(globalVariable({ openConvert: false }));
              // dispatch(globalVariable({ modalStep}))
            }}
          >
            Cancel
          </Button>,
          modalStep === 1 ? (
            <Button
              key="next"
              type="primary"
              onClick={onModalNextStep}
              disabled={isNextDisabled && true}
            >
              Next
            </Button>
          ) : (
            <Button
              key="save"
              type="primary"
              onClick={transportConvertData}
              disabled={isNextDisabled && true}
            >
              Save as a New
            </Button>
          ),
        ]}
        width={600}
      >
        {(() => {
          switch (modalStep) {
            default:
              return null;
            case 1:
              return (
                <ConvertDataType1
                  treeval={allData}
                  onModalData={onModalData}
                  deactivateNext={deactivateNext}
                />
              );
            case 2:
              return (
                <ConvertDataType2
                  treeval={allData}
                  dataSelected={dataSelected}
                  columnName={columnName}
                  firstModalData={firstModalData}
                  treedt={treeData}
                  cd={onConvertData}
                  deactivateNext={deactivateNext}
                />
              );
          }
        })()}
      </Modal>
      <Modal
        title="Rename Data Item"
        visible={visibleEdit}
        onCancel={() => {
          dispatch(globalVariable({ visibleEdit: false }));
        }}
        footer={null}
        width={600}
      >
        <SelectDataEdit data={data} editSummary={editSummary} />
      </Modal>
    </>
  );
};
export default DataViewDescription;
