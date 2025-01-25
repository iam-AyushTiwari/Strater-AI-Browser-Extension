import { Dropdown, Menu } from "antd"
import React from "react"
import { FaRegEye } from "react-icons/fa"
import { MdDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md"

const sampleBookmarks = [
  {
    id: 1,
    time: "3:65",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    link: "https://www.youtube.com/watch?v=example1"
  },
  {
    id: 2,
    time: "1:45",
    note: "Ducimus facere itaque praesentium dolor.",
    link: "https://www.youtube.com/watch?v=example2"
  },
  {
    id: 3,
    time: "2:15",
    note: "Expedita quibusdam doloremque, eveniet quae.",
    link: "https://www.youtube.com/watch?v=example3"
  }
]

const Bookmark = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-4">Bookmarks</h1>
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
        {sampleBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} {...bookmark} />
        ))}
      </div>
    </>
  )
}

const BookmarkCard = ({ time, note, link }) => {
  const menu = (
    <Menu>
      <Menu.Item key="3" icon={<MdDriveFileRenameOutline />}>
        Edit
      </Menu.Item>
      <Menu.Item key="4" icon={<FaRegEye />}>
        View
      </Menu.Item>
      <Menu.Item key="5" icon={<MdDeleteOutline />}>
        Remove
      </Menu.Item>
    </Menu>
  )

  const onContextMenu = (info) => {
    console.log("Trigger ContextMenu", info)
  }

  const openVideo = () => {
    window.open(link, "_blank")
  }

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div
        className="flex items-center w-full rounded-lg overflow-hidden shadow-md bg-zinc-900 p-4 cursor-pointer"
        onClick={openVideo}>
        <p className="font-semibold text-base text-blue-500 bg-blue-900/20 rounded-full px-3 py-1">
          {time}
        </p>
        <span className="text-xl text-gray-200 ml-4">{note}</span>
      </div>
    </Dropdown>
  )
}

export default Bookmark
