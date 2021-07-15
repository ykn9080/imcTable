import React from "react";
import { useSelector,  } from "react-redux";
import BootTable from "components/Controls/Table/BootStrapTable2";
import { textFilter } from "react-bootstrap-table2-filter"
import  { Type } from "react-bootstrap-table2-editor";
import SearchInput from "./ApiUrlSearch";

const DataSrc = () => {
  const apiUrl = useSelector(state => state.global.apiUrl);

  const dt = {
    dataList: [],
    columns: [
      {
        dataField: "id",
        text: "Product ID",
        sort: true
      },
      {
        dataField: "name",
        text: "Product Name",
        sort: true,
        filter: textFilter()
      },
      {
        dataField: "price",
        text: "Product Price",
        sort: true
      },
      {
        dataField: "quality",
        text: "Product Quality",
        sort: true,
        editor: {
          type: Type.SELECT,
          options: [
            {
              value: "A",
              label: "A"
            },
            {
              value: "B",
              label: "B"
            },
            {
              value: "C",
              label: "C"
            },
            {
              value: "D",
              label: "D"
            },
            {
              value: "E",
              label: "E"
            }
          ]
        }
      },
      {
        dataField: "done",
        text: "Done",
        editor: {
          type: Type.CHECKBOX,
          value: "Y:N"
        }
      },
      {
        dataField: "date",
        text: "Date",
        formatter: cell => {
          let dateObj = cell;
          if (typeof cell !== "object") {
            dateObj = new Date(cell);
          }
          return `${("0" + dateObj.getUTCDate()).slice(-2)}/${(
            "0" +
            (dateObj.getUTCMonth() + 1)
          ).slice(-2)}/${dateObj.getUTCFullYear()}`;
        },
        editor: {
          type: Type.DATE
        }
      },
      {
        dataField: "desc",
        text: "desc",
        editor: {
          type: Type.TEXTAREA
        }
      }
    ]
  };
  //const url = apiUrl; //"http://localhost:3001/results";

  return (
    <>
      <SearchInput />
      <BootTable dt={dt} apiUrl={apiUrl} />
    </>
  );
};

export default DataSrc;
