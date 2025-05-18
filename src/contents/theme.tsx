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
        },
        Message: {
          zIndexPopup: 100000000000000020000,
          contentBg: "#282828",
          colorText: "#ffffff",
          fontSizeLG: 18,
          colorSuccess: "rgb(255,0,66)",
          contentPadding: "12px 16px",
          fontSize: 14
        },
        Calendar: {
          // itemActiveBg: "#e6f4ff"
          itemActiveBg: "#f9eaee"
        },
        Input: {
          // activeBg	: "#FF4071"
          // activeBorderColor : "#000000"
          activeShadow: "#282828"
        },
        InputNumber: {
          // activeBg	: "#FF4071"
          activeShadow: "#282828"
        },
        DatePicker: {
          // activeBg	: "#FF4071"
          activeShadow: "#282828"
        },
        Select: {
          activeOutlineColor: "#282828",
          optionSelectedBg: "rgba(0,0,0,0.06)",
          optionActiveBg: "rgba(0,0,0,0.06)",
          multipleItemBg: "#282828",
          borderRadius: 4
        },
        Form: {
          labelRequiredMarkColor: "#ff0042"
        },
        // @ts-ignore
        Tooltip: {
          colorBgSpotlight: "rgba(2,2,2,0.95)"
        }
      }
    }}>
    {children}
  </ConfigProvider>
)
