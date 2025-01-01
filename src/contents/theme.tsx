import ConfigProvider from "antd/es/config-provider"
import type { ReactNode } from "react"

export const ThemeProvider = ({ children = null as ReactNode }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#dc3545",
        borderRadius: 12
      }
    }}>
    {children}
  </ConfigProvider>
)
