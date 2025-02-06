import { message, Tooltip } from "antd"
import { Bookmark } from "lucide-react"
import React from "react"

const AddToBookmark = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message"
    })
    console.log("click to add to bookmark")
  }
  return (
    <>
      {contextHolder}
      <div className="p-2 text-white flex justify-center items-center h-full">
        <button onClick={success}>
          <Tooltip
            placement="top"
            title="Add to bookmark"
            className="cursor-pointer flex justify-center items-center mt-3 mx-2">
            <Bookmark size={24} />
          </Tooltip>
        </button>
      </div>
    </>
  )
}

export default AddToBookmark
