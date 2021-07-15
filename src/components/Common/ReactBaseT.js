
import "react-base-table/styles.css";

const ReactBaseT = () => {
  const columns = generateColumns(10);
  const data = generateData(columns, 200);
  return (
    <Table
      fixed
      columns={fixedColumns}
      data={treeData}
      frozenData={frozenData}
      expandColumnKey={expandColumnKey}
    />
    // <BaseTable data={data} width={600} height={400}>
    //   <Column key="col0" dataKey="col0" width={100} />
    //   <Column key="col1" dataKey="col1" width={100} />
    // </BaseTable>
  );
};

export default ReactBaseT;
