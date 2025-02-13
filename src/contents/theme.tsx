import ConfigProvider from "antd/es/config-provider"
import type { ReactNode } from "react"

export const ThemeProvider = ({ children = null as ReactNode }) => (
  <ConfigProvider
  getPopupContainer={() => document.getElementById("custom-sidebar-injected")?.shadowRoot as any}
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
        },
        Modal: {
          contentBg: "#282828",
          headerBg: "#282828"
        },
        Drawer: {
          colorBgElevated: "#282828"
        },
        Tree: {
          directoryNodeSelectedBg: "inherit",
          nodeSelectedBg: "inherit",
          indentSize: 12,
          paddingXS: 0,
          colorBgContainer: "inherit"
        },
        Dropdown: {
          zIndexPopup: 9999999999999,
          colorBgElevated: "#282828",
          colorSplit: "rgba(39,39,39,0.54)"
        },
        Tabs: {
          lineType: "none"
        }
      }
    }}>
    {children}
  </ConfigProvider>
)
