import React, { useEffect, useState } from "react";
import jexcel from "jexcel";

// import "./styles.css";
import "../../../node_modules/jexcel/dist/jexcel.css";

const JExcel = () => {

  const options = {
    tableOverflow: true,
    //lazyLoading: true,
    loadingSpin: true,
    freezeColumns: 2,
    search: true,
    pagination: 100,
    data: [
      ["Jazz", "Audi", "2019-02-12", "", true, "$ 2.000,00", "#777700"],
      ["Civic", "Audi", "2018-07-11", "", true, "$ 4.000,01", "#007777"],
    ],
    columns: [
      {
        type: "text",
        title: "Car",
        width: 90,
      },
      {
        type: "dropdown",
        title: "Make",
        width: 120,
        source: [
          "Alfa Romeo",
          "Audi",
          "Bmw",
          "Chevrolet",
          "Chrystler",
          // (...)
        ],
      },
      {
        type: "calendar",
        title: "Available",
        width: 120,
      },
      {
        type: "image",
        title: "Photo",
        width: 120,
      },
      {
        type: "checkbox",
        title: "Stock",
        width: 80,
      },
      {
        type: "numeric",
        title: "Price",
        mask: "$ #.##,00",
        width: 80,
        decimal: ",",
      },
      {
        type: "color",
        width: 80,
        render: "square",
      },
    ],
    minDimensions: [8, 100000],
  };
  const [el, setEl] = useState("");
  useEffect(() => {
    //$(".spreadsheet").jexcel(options);
    const el1 = jexcel(document.getElementById("spreadsheet"), options);
    setEl(el1);
  }, [options]);

  const addRow = () => {
    el.insertRow();
  };
  const getJson = () => {
    console.log(el.getJson());
  };
  console.log(el);
  return (
    <div>
      <div id="spreadsheet" />
      <br />
      <input type="button" value="Add new row" onClick={() => addRow()} />
      <input type="button" value="get json" onClick={() => getJson()} />
    </div>
  );
};

export default JExcel;
