import React from 'react';
import { Heatmap } from '@ant-design/charts';
import { data } from './MatrixDiagramData';

const MatrixDiagram = () => {
  const config = {
    data: data,
    xField: 'name',
    yField: 'name2',
    colorField: 'value',
    sizeField: 'value',
    shape: 'square',
    color: ['#dddddd', '#9ec8e0', '#5fa4cd', '#2e7ab6', '#114d90'],
    label: {
      offset: -2,
      style: {
        fill: '#fff',
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)',
      },
    },
  };
  return <Heatmap {...config} />;
};
export default MatrixDiagram;