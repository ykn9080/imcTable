import React from "react";
import { useHistory } from "react-router-dom";
import { PageHeader, Row, Col } from "antd";
import AntBreadCrumb from "./BreadCrumb";

const PageHead = (props) => {
  const history = useHistory();
  // useEffect(() => {
  //   $(".ant-page-header>.ant-breadcrumb").remove();
  //   $(".ant-page-header").prepend($(".ant-breadcrumb"));
  // }, []);

  const onBack = () => {
    history.goBack();
  };
  let pageProps = {
    className: "site-page-header",
    title: props.title,
  };
  if (props.onBack) pageProps = { ...pageProps, onBack: onBack };
  if (typeof props.ghost != "undefined")
    pageProps = { ...pageProps, ghost: props.ghost };
  if (props.subTitle) pageProps = { ...pageProps, subTitle: props.subTitle };
  if (props.extra) pageProps = { ...pageProps, extra: props.extra };

  // const extraContent = (
  //   <img
  //     src="https://gw.alipayobjects.com/mdn/mpaas_user/afts/img/A*KsfVQbuLRlYAAAAAAAAAAABjAQAAAQ/original"
  //     alt="content"
  //   />
  // );
  const extraContent = props.extraContent ? props.extraContent : "";

  /* #region  children component example*/
  const Description = ({ term, children, span = props.span }) => (
    <Col span={span}>
      <div className="description">
        <div className="term">{term}</div>
        <div className="detail">{children}</div>
      </div>
    </Col>
  );
  const content = props.content ? (
    <Row>
      {props.content.map((k, i) => {
        return k.span ? (
          <Description term={k.term} span={k.span}>
            {k.detail}
          </Description>
        ) : (
          <Description term={k.term}>{k.detail}</Description>
        );
      })}
    </Row>
  ) : (
    ""
  );

  const child = (
    <div className="wrap">
      <div className="content padding">{content}</div>
      <div className="extraContent">{extraContent}</div>
    </div>
  );
  /* #endregion */
  return (
    <>
      <div style={{ paddingLeft: 25, paddingTop: 5 }}>
        <AntBreadCrumb />
      </div>
      <PageHeader {...pageProps}>
        {props.content ? <>{child}</> : props.children}
      </PageHeader>
    </>
  );
};

export default PageHead;
