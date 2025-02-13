import { Button, Input, message, Popover, Tooltip } from "antd"
import { Bookmark } from "lucide-react"
import React from "react"

const BookmarkPopover = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="font-semibold">Add to Bookmark</h1>
      <input
        className="bg-zinc-950 text-xl text-white px-4 py-4 rounded-xl focus:outline-none"
        type="text"
        placeholder="Your Bookmark Name"
      />
      <Button type="primary" block>
        Add to Bookmark
      </Button>
    </div>
  )
}

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
            title={BookmarkPopover}
            trigger={"click"}
            placement="top"
            getTooltipContainer={() =>
              // @ts-ignore
              document.getElementById("take-bookmark-csui")?.shadowRoot
            }
            color="#282828">
            <Tooltip
              placement="top"
              title="Add to bookmark"
              className="cursor-pointer flex justify-center items-center mt-3 mx-2">
              <Bookmark size={24} />
            </Tooltip>
          </Tooltip>
        </button>
      </div>
    </>
  )
}

export default AddToBookmark
