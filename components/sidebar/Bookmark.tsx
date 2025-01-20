import React from "react"

const Bookmark = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-4">Bookmarks</h1>
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
        <BookmarkCard />
        <BookmarkCard />
        <BookmarkCard />
      </div>
    </>
  )
}

const BookmarkCard = () => {
  return (
    <div className="flex justify-between items-center w-full rounded-lg overflow-hidden shadow-md bg-zinc-900 p-4">
      <p className="font-semibold text-base text-blue-500 bg-blue-900/20 rounded-full px-3 py-1">
        3:65
      </p>
      <span className="text-lg text-gray-200 ml-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus facere
        itaque praesentium dolor.
      </span>
    </div>
  )
}

export default Bookmark
