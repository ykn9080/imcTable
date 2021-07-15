import React, { useMemo } from "react";
//import styled from "styled-components";
import { useTable } from "react-table";
import "./ReactTable.css";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.2rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `;

const ReactTable = () => {
  const data = useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );
  const columns = useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
    ],
    []
  );
  return (
    // <Styles>
    //   <Table columns={columns} data={data} />
    // </Styles>
    <Table columns={columns} data={data} />
  );
};

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  return (
    <MaUTable
      {...getTableProps()}
      // className="-striped -highlight"
      size="small"
      noDataText="No Data Available"
      filterable
      defaultPageSize={2}
      // style={{ border: "solid 1px blue" }}
    >
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 1px #D0D0D0",
                  background: "#001529",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell
                    {...cell.getCellProps()}
                    // style={{
                    //   padding: "10px",
                    //   border: "solid 1px gray",
                    //   background: "papayawhip",
                    // }}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
};

export default ReactTable;
