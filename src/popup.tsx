import { Input, Layout, Typography } from "antd"
import { useState } from "react"

import "./style.css"

const { Header, Footer, Content } = Layout
const { Title } = Typography

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <Layout
      style={{
        width: 400,
        padding: 16,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}>
      <Header
        className="text-center flex justify-center items-center rounded-full"
        style={{
          background: "#ff0042",
          paddingBottom: 16
        }}>
        <Title level={2} style={{ color: "white", margin: 0, marginTop: 8 }}>
          Strater Extension
        </Title>
      </Header>
      <Content style={{ padding: "16px 24px", background: "#f0f2f5" }}>
        <Input
          onChange={(e) => setData(e.target.value)}
          value={data}
          placeholder="Enter your task"
          style={{ marginBottom: 16 }}
        />
      </Content>
      <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
        ©2024 ProductivityApp
      </Footer>
    </Layout>
  )
}

export default IndexPopup
