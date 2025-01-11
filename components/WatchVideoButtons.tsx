import { PlusOutlined, PushpinOutlined, ReadOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useEffect } from "react"

const WatchVideoButtons = () => {
  return (
    <div className="my-2 flex justify-between items-center bg-inherit rounded-xl text-6xl w-full">
      <div className="flex gap-4">
        <Button type="primary" className="flex gaap-4">
          <PushpinOutlined />
          Schedule
        </Button>
        <Button type="primary" className="flex gaap-4">
          <PlusOutlined />
          Add to Capsules
        </Button>
      </div>
      <div>
        <Button type="primary" className="flex gaap-4">
          <ReadOutlined />
          Take Note
        </Button>
      </div>
    </div>
  )
}

export default WatchVideoButtons
