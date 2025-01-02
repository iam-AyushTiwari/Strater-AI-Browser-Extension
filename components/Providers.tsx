import { RootStateProvider } from "../contextAPI/RootState"
import { ThemeProvider } from "../src/contents/theme"

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <RootStateProvider>{children}</RootStateProvider>
    </ThemeProvider>
  )
}
