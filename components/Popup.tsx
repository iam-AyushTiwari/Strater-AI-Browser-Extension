// import { useRootContext } from "contextAPI/RootState"
import React, { useEffect } from "react"

// @ts-ignore
import logo from "../assets/icon.png"

// Context Api for the Popup and the Content Script works seperately to communicate with them use message API or Storage

const Popup = () => {
  // const { isFocusMode } = useRootContext()
  let isFocusMode = true

  return (
    <div className="flex items-center justify-center p-4 bg-red-500/30">
      <div className="group relative w-96">
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:shadow-red-500/10">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
          <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-30 blur-sm transition-opacity duration-300 group-hover:opacity-40" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                    {/* Add your brand logo here */}
                    <img src={logo} alt="Brand Logo" className="h-8 w-8" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Your Strater Plan
                  </h3>
                  <p className="text-sm text-slate-400">
                    Today's focus hours: 3
                  </p>
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    InActive
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Feature: Plan Progress */}
              <div className="rounded-xl bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <svg
                      className="h-4 w-4 text-red-500"
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
                  <p className="text-sm text-slate-400">
                    Track your daily goals
                  </p>
                </div>
              </div>

              {/* Feature: YouTube Integration */}
              <div className="rounded-xl bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <svg
                      className="h-4 w-4 text-red-500"
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
                  <p className="text-sm text-slate-400">
                    Manage your capsules lessons
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="rounded-xl bg-slate-900/50 p-4 space-y-2">
                <h4 className="font-medium text-white">Your Stats</h4>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Notes Created:</span>
                  <span className="font-semibold text-red-500">12</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Folders Created:</span>
                  <span className="font-semibold text-red-500">5</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Total Hours Studied:</span>
                  <span className="font-semibold text-red-500">34h</span>
                </div>
              </div>

              {/* Download Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">
                    Module Completion
                  </span>
                  <span className="text-slate-400">76%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
                  <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                    <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button className="group/btn relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-px font-medium text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset]">
                  <div className="relative rounded-xl bg-slate-950/50 px-4 py-3 transition-colors group-hover/btn:bg-transparent">
                    <a
                      className="relative flex items-center justify-center gap-2"
                      href="https://strater.in/dashboard/admin"
                      target="_blank">
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
                <button className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
