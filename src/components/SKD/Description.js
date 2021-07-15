import React from "react";
import _ from "lodash";
import { Descriptions, Button } from "antd";

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
          if (!a) return;
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
const titlestyle = { marginTop: 10, marginLeft: 20, marginBottom: 10 };
const Description = ({ data, title, format, colspan, extra }) => {
  return (
    <>
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
    </>
  );
};
export default Description;
