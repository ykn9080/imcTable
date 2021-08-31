<h1 align="center">IMC EasyTable</h1>

Create and manage table with ease.

[![](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*Yl83RJhUE7kAAAAAAAAAAABkARQnAQ)](https://ant.design)

English | [Korean](./README-kr_KR.md)

## ✨ Features

- 🌈 Editable .
- 📦 Add new calculated columes.
- 🛡 Delete or rearrange columes.
- ⚙️ Group by a column and make sum,avg.
  |

## 📦 Install

```bash
npm install imceasytable
```

```bash
yarn add imceasytable
```

## 🔨 Usage

```jsx
import React from "react";
import "./App.css";

import EasyTable from "imceasytable";

const App = (props) => {
  return (
    <div>
      <EasyTable edit={false} authObj={sampledata} />
    </div>
  );
};

export default App;
```

change edit mode if you change edit={true}

sampledata example:

```jsx
const sampledata = {
  setting: {
    column: [
      {
        title: "name",
        titletext: "name",
        origin: "name",
        dataIndex: "name",
        key: "name",
        datatype: "string",
      },
      {
        title: "math",
        titletext: "math",
        origin: "math",
        dataIndex: "math",
        key: "math",
        datatype: "int",
      },
      {
        title: "english",
        titletext: "english",
        origin: "english",
        dataIndex: "english",
        key: "english",
        datatype: "int",
      },
    ],
    reset: false,
    title: "Score",
    size: "small",
  },
  dtlist: [
    {
      key: "1",
      name: "John Brown",
      math: 60,
      english: 70,
    },
    {
      key: "2",
      name: "Jim Green",
      math: 66,
      english: 89,
    },
  ],
};
```

## ⌨️ Development

https://github.com/ykn9080/imcTable

Or clone locally:

```bash
$ git clone git@github.com:ykn9080/imctable.git
$ cd imctable
$ npm install
$ npm start
```

Open your browser and visit http://127.0.0.1:3009
