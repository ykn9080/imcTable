import React from "react";
import ReactDataGrid from "react-data-grid";

const formatter = ({ value }) => {
  return <span class="label label-info">{value}</span>;
};

function createColumns(count) {
  return [...Array(count).keys()].map((i) => ({
    key: `col${i}`,
    name: `Column ${i}`,
    width: 160,
    editable: true,
    formatter,
  }));
}

function createSingleRow(columns, rowIdx) {
  return columns.reduce(
    (row, c, cidx) => ({ ...row, [c.key]: `Row ${rowIdx} - Col ${cidx}` }),
    {}
  );
}

function createRows(count, columns) {
  return [...Array(count).keys()].map((rowIdx) =>
    createSingleRow(columns, rowIdx)
  );
}

const columns = createColumns(50);

class DataGrid1 extends React.Component {
  state = { rows: createRows(1000, columns) };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };
  render() {
    return (
      <div>
        <ReactDataGrid
          columns={columns}
          rowGetter={(i) => this.state.rows[i]}
          rowsCount={this.state.rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          enableCellAutoFocus={false}
          minHeight={650}
        />
      </div>
    );
  }
}

export default DataGrid1;
