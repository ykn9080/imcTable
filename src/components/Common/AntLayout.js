import React from "react";
import { Layout, Steps } from "antd";
import "antd/dist/antd.css";
import "./Antd.css";

const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

const AntLayout = () => {
  return (
    <div>
      <Steps size="small" current={1}>
        <Step title="Layout" />
        <Step title="Contents" />
        <Step title="Waiting" />
      </Steps>

      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider>Sider</Sider>
          <Content>Content</Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Content>Content</Content>
          <Sider>Sider</Sider>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
      <Layout>
        <Sider>Sider</Sider>
        <Layout>
          <Header>Header</Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AntLayout;
