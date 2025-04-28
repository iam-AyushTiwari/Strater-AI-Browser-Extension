import React from "react"

import "~style.css"

import Providers from "../../components/Providers"
import { SettingPage } from "../../components/Setting_page/setting_page"

function DeltaFlyerPage() {
  return (
    <Providers>
      <div className="w-full min-h-screen flex justify-center items-center bg-[#0f0f10]">
        <SettingPage />
      </div>
    </Providers>
  )
}

export default DeltaFlyerPage
