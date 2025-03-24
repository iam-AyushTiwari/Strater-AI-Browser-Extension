import React from "react"

const AccountCard = () => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-8 w-[85%] mx-auto shadow-2xl shadow-black/40">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF0042] to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">NJ</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#FF0042] w-6 h-6 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M19 7.5h-2.25V5.25a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3v8.25a3 3 0 0 0 3 3H7.5V19a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-8.25a3 3 0 0 0-3-3z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-2">
          <h2 className="text-2xl font-bold text-white">Nikhil Joshi</h2>
          <p className="text-zinc-400 font-medium">@NikhilJoshi09</p>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
          <span className="text-zinc-400 text-xl">Email</span>
          <span className="text-zinc-100 font-medium">
            Nikhil5289@gmail.com
          </span>
        </div>
        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
          <span className="text-zinc-400 text-xl">Member since</span>
          <span className="text-zinc-100 font-medium">2022</span>
        </div>
      </div>

      <div className="flex gap-3 ">
        <button
          onClick={() => {
            window.location.href = "https://strater-app.vercel.app/signout_page"
          }}
          className="flex w-full gap-3 items-center justify-center flex-row bg-[#FF0042] hover:bg-[#FF0042]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all">
          LogOut
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AccountCard
