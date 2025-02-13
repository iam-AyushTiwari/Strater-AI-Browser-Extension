import { MainContextProvider } from "contextAPI/MainContext"

import { RootStateProvider } from "../contextAPI/RootState"
import { ThemeProvider } from "../src/contents/theme"

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <RootStateProvider>
        <MainContextProvider>{children}</MainContextProvider>
      </RootStateProvider>
    </ThemeProvider>
  )
}
