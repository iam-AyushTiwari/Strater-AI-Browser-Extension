import { Button, Divider, Tooltip } from "antd"
import { Expand, PanelTopClose, Save, X } from "lucide-react"
import React from "react"

const NotesArea = () => {
  return (
    <>
      <div className="flex justify-between p-4 border-b-2 border-b-zinc-800">
        <div className="flex gap-4">
          <Tooltip title="Expand">
            <Button icon={<Expand size={15} />} />
          </Tooltip>
          <Tooltip title="Save">
            <Button icon={<Save size={15} />} />
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Close">
            <Button icon={<X size={15} />} />
          </Tooltip>
        </div>
      </div>
      <div className="p-2 h-full text-xl font-semibold">
        main content will come here...
      </div>
    </>
  )
}

export default NotesArea
