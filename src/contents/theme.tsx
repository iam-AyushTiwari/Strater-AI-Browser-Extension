import ConfigProvider from "antd/es/config-provider"
import type { ReactNode } from "react"

export const ThemeProvider = ({ children = null as ReactNode }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#ff0042",
        borderRadius: 12,
        colorBgBase: "#0f0f0f",
        colorTextBase: "#ffffff"
      },
      components: {
        Button: {
          defaultShadow: "0 0px 0 rgba(0,0,0,0.0)",
          dangerShadow: "0 0px 0 rgba(0)",
          primaryShadow: "0 2px 0 rgba(0)"
        },
        Tooltip: {
          colorBgSpotlight: "rgba(48,48,48,0.85)"
        }
      }
    }}>
    {children}
  </ConfigProvider>
)
