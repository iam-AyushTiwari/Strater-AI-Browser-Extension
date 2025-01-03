import React from "react"

import "~style.css"

import Providers from "components/Providers"

import Popup from "../components/Popup"

const IndexPopup = () => {
  return (
    <Providers>
      <div className="w-50">
        <Popup />
      </div>
    </Providers>
  )
}

export default IndexPopup
