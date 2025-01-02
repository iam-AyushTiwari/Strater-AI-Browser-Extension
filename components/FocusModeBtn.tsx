import { Switch } from "antd"
import React, { useEffect } from "react"

import { useRootContext } from "../contextAPI/RootState"

// context is not working or what happening it is not showing in the console
// need to fix a bug here

const FocusModeBtn = () => {
  const { isFocusMode, toggleFocusMode } = useRootContext()
  console.log("IS FOCUS", isFocusMode)
  useEffect(() => {
    console.log("Toggled Focus Mode")
  }, [isFocusMode])
  return (
    <div className="flex justify-center items-center">
      <Switch
        checkedChildren="Focused"
        unCheckedChildren="Focus Mode"
        checked={isFocusMode}
        onChange={toggleFocusMode}
      />
    </div>
  )
}

export default FocusModeBtn
