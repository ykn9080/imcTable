import React, { useState, useEffect, useRef } from 'react';
import { Column } from '@ant-design/charts';
import { Row, Col } from "antd";
import 'antd/dist/antd.css';
// import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
// import { GrDocumentImage } from "react-icons/gr"
let data = [
    { title: '테스트1', value: 38 },
    { title: '테스트2', value: 52 },
    { title: '테스트3', value: 61 },
    { title: '테스트4', value: 145 },
    { title: '테스트5', value: 48 },
    { title: '테스트6', value: 38 },
    { title: '테스트7', value: 38 },
    { title: '테스트8', value: 38 }
];


const BarChart = (props) => {
    const chartRef = useRef(null);
    if (props.data) data = props.data;
    let label = [];
    if (props.label) label = props.label;
    const config = {
        height: 400,
        data: data,
        xField: 'title',
        yField: 'value',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6
            }
        },
        meta: {
            title: { alias: 'title' },
            value: { alias: 'value' }
        }
    };
    // let exportReport = {
    //     fileName: "test"
    // }
    return (
        <>
            {/* <Row>
                <Col span={24}>
                    <div style={{ textAlign: "right" }}>
                        <button onClick={() => exportComponentAsPNG(chartRef, exportReport)}>export</button>
                    </div>
                </Col>
            </Row> */}
            <Row>
                <Col span={24}>
                    <div>
                        <Column {...config} />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div style={{ textAlign: "center" }}>
                        {label[2]}
                    </div>
                </Col>
            </Row>
        </>
    )
};
export default BarChart;