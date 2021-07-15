import React from "react";

const subfilter = menuid => {
  return submenulist.filter((item, itemIndex) => menuid === item.menuid);
};

const Topmenu = () => {
  function handleSelect(selectedKey) {
    console.log("selected123 " + selectedKey);
  }
  return (
    <Nav className="mr-auto" onSelect={handleSelect}>
      {menulist.map((dt, i) => {
        return subfilter(dt.menuid).length === 0 ? (
          <Nav.Link key={i}>{dt.title}</Nav.Link>
        ) : (
          <NavDropdown title={dt.title} id={dt.menuid} key={dt.menuid}>
            {subfilter(dt.menuid).map(dtt => {
              return (
                <NavDropdown.Item eventKey={dtt.subid} key={dtt.subid}>
                  {dtt.text}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
        );
      })}
    </Nav>
  );
};
export const Menu = ({ data }) => {
  return (
    <ul>
      {data.map(m => {
        return (
          <li>
            {m.title}
            {m.children && <Menu data={m.children} />}
          </li>
        );
      })}
    </ul>
  );
};

const Recur = () => {
  return <Menu data={data} />;
};

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

let data = [
  {
    title: "Top level 1",
    slug: "top-level-1",
    children: [
      {
        title: "Sub level 1",
        slug: "sub-level-1",
        children: [
          {
            title: "Sub Sub Level 1",
            slug: "sub-sub-level-1",
            children: [
              {
                title: "Sub Sub Level 2",
                slug: "sub-sub-level-2",
                children: [
                  {
                    title: "Sub Sub Level 23",
                    slug: "sub-sub-level-23"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Sub level 2",
        slug: "sub-level-2"
      }
    ]
  },
  {
    title: "Top level 2",
    slug: "top-level 2"
  }
];
export default Recur;
