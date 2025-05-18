"use client"

import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { API_ENDPOINT, EXTENSION_ID, HOST_LINK } from "~constants"

// @ts-ignore
import logo from "../assets/icon.png"

const Popup = () => {
  const storage = new Storage()

  const [isFocusMode, setIsFocusMode] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const isUser = (await storage.get("user")) as any | undefined
      if (isUser !== undefined) {
        setUser(isUser)
        console.log("user in the storage: ", isUser)
      } else {
        setUser(null)
      }
    }
    fetchUser()
  }, [storage.get])

  useEffect(() => {
    const fetchFocusMode = async () => {
      const storedFocusMode = (await storage.get("isFocusMode")) as
        | boolean
        | undefined
      if (storedFocusMode !== undefined) {
        setIsFocusMode(storedFocusMode)
      } else {
        setIsFocusMode(false)
      }
      console.log("storage: ", storedFocusMode)
    }
    fetchFocusMode()
  }, [storage.get])

  return (
    <div className="flex items-center justify-center p-4 bg-[#FF0042]/10">
      <div className="group relative w-96">
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:shadow-[#FF0042]/10">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF0042]/20 to-[#FF0042]/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
          <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF0042]/20 to-[#FF0042]/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
          <div className="relative p-6">
            {user ? (
              <LoggedInContent user={user} isFocusMode={isFocusMode} />
            ) : (
              <LoggedOutContent />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const LoggedInContent = ({ user, isFocusMode }) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF0042] to-[#FF0042] opacity-30 blur-sm transition-opacity duration-300 group-hover:opacity-40" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
            <img
              src={logo || "/placeholder.svg"}
              alt="Brand Logo"
              className="h-8 w-8"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">Hey {user?.fullName},</h3>
          <p className="text-sm text-slate-400">Today's focus hours: 3</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-slate-400">Today</span>
        {isFocusMode ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
            <span className="h-1 w-1 rounded-full bg-green-500" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FF0042]/10 px-2 py-1 text-xs font-medium text-[#FF0042]">
            <span className="h-1 w-1 rounded-full bg-[#FF0042]" />
            Inactive
          </span>
        )}
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {/* Feature: Plan Progress */}
      <div className="rounded-xl bg-slate-900/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF0042]/10">
            <svg
              className="h-4 w-4 text-[#FF0042]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">Track your daily goals</p>
        </div>
      </div>
      {/* Feature: YouTube Integration */}
      <div className="rounded-xl bg-slate-900/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF0042]/10">
            <svg
              className="h-4 w-4 text-[#FF0042]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276a1 1 0 010 1.552L15 12"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">Manage your capsules lessons</p>
        </div>
      </div>
      {/* Statistics */}
      <div className="rounded-xl bg-slate-900/50 p-4 space-y-2">
        <h4 className="font-medium text-white">Your Stats</h4>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Notes Created:</span>
          <span className="font-semibold text-[#FF0042]">12</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Folders Created:</span>
          <span className="font-semibold text-[#FF0042]">5</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Total Hours Studied:</span>
          <span className="font-semibold text-[#FF0042]">34h</span>
        </div>
      </div>
      {/* Download Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-white">Module Completion</span>
          <span className="text-slate-400">76%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
          <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#FF0042] to-[#FF0042]">
            <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-3">
        <button className="group/btn relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-[#FF0042] to-[#FF0042] p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset]">
          <div className="relative rounded-xl bg-slate-950/50 px-4 py-3 transition-colors group-hover/btn:bg-transparent">
            <a
              className="relative flex items-center justify-center gap-2"
              href="https://strater.in/dashboard/admin"
              target="_blank"
              rel="noreferrer">
              Open Dashboard
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </button>
        <button
          className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800"
          onClick={() =>
            chrome.tabs.create({
              url: `chrome-extension://${EXTENSION_ID}/tabs/setting.html`
            })
          }>
          Settings
        </button>
      </div>
    </div>
  </>
)

const LoggedOutContent = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF0042] to-[#FF0042] opacity-30 blur-sm transition-opacity duration-300 group-hover:opacity-40" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900">
          <img
            src={logo || "/placeholder.svg"}
            alt="Brand Logo"
            className="h-10 w-10"
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <h2 className="text-xl font-bold text-white">Welcome to Strater AI</h2>
      <p className="mt-1 text-sm text-slate-400">
        Boost your productivity with our browser extension
      </p>
    </div>
    <div className="space-y-2">
      <div className="rounded-xl bg-slate-900/50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF0042]/10">
            <svg
              className="h-3 w-3 text-[#FF0042]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-xs text-slate-400">Track your daily goals</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-900/50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF0042]/10">
            <svg
              className="h-3 w-3 text-[#FF0042]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-slate-400">Manage your capsules lessons</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-900/50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF0042]/10">
            <svg
              className="h-3 w-3 text-[#FF0042]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-xs text-slate-400">Boost your productivity</p>
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <button
        className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF0042] to-[#FF0042] p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset]"
        onClick={() =>
          window.open(
            `${HOST_LINK}/sign-in?redirect_url=https%3A%2F%2Fwww.youtube.com`,
            "_blank"
          )
        }>
        <div className="relative rounded-xl bg-slate-950/50 px-3 py-2 transition-colors group-hover/btn:bg-transparent">
          <span className="relative flex items-center justify-center gap-2 text-sm">
            Get Started
            <svg
              className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </button>
      <button
        className="w-full flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 font-medium text-white transition-colors hover:bg-slate-800 text-sm"
        onClick={() =>
          window.open(
            `${HOST_LINK}/sign-in?redirect_url=https%3A%2F%2Fwww.youtube.com`,
            "_blank"
          )
        }>
        Log In
      </button>
    </div>
  </div>
)

export default Popup
