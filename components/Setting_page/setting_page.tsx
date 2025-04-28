import { SettingOutlined } from "@ant-design/icons"
import { Button, message, Switch } from "antd"
import {
  Bell,
  Eye,
  Focus,
  Link as LinkIcon,
  Lock,
  MessageCircleOff,
  SunMoon
} from "lucide-react"
import React from "react"

import { useRootContext } from "../../contextAPI/RootState.js"

export const SettingPage = () => {
  const {
    isFocusMode,
    toggleFocusMode,
    isShortsDisabled,
    isVideoRecommendationsDisabled,
    isCommentDisabled,
    toggleShortsDisabled,
    toggleVideoRecommendationsDisabled,
    toggleCommentDisabled
  } = useRootContext()

  const [isFocused, setIsFocused] = React.useState(isFocusMode)
  const [isShorts, setIsShorts] = React.useState(isShortsDisabled)
  const [isVideoRecommendations, setIsVideoRecommendations] = React.useState(
    isVideoRecommendationsDisabled
  )
  const [isComment, setIsComment] = React.useState(isCommentDisabled)
  const [messageApi, contextHolder] = message.useMessage()

  React.useEffect(() => {
    setIsFocused(isFocusMode)
    setIsShorts(isShortsDisabled)
    setIsVideoRecommendations(isVideoRecommendationsDisabled)
    setIsComment(isCommentDisabled)
  }, [
    isFocusMode,
    isShortsDisabled,
    isVideoRecommendationsDisabled,
    isCommentDisabled
  ])
  const handleSave = () => {
    // Save the settings to storage or perform any other action
    console.log("Settings saved:", {
      isFocused,
      isShorts,
      isVideoRecommendations,
      isComment
    })
    if (isFocused !== isFocusMode) {
      toggleFocusMode()
    }
    if (isShorts !== isShortsDisabled) {
      toggleShortsDisabled()
    }
    if (isVideoRecommendations !== isVideoRecommendationsDisabled) {
      toggleVideoRecommendationsDisabled()
    }
    if (isComment !== isCommentDisabled) {
      toggleCommentDisabled()
    }
  }
  const setConsole = () => {
    console.log("Settings saved:", {
      isFocusMode,
      isShortsDisabled,
      isVideoRecommendationsDisabled,
      isCommentDisabled
    })
  }

  const success = () => {
    messageApi.open({
      type: "success",
      content: "setting saved successfully"
    })
  }
  return (
    <>
      {contextHolder}
      <div className="h-full flex items-center text-white dark:text-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff0042] flex items-center justify-center backdrop-blur-sm shadow-lg">
                <SettingOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Strater</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Extension Settings
                </p>
              </div>
            </div>
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-pointer">
              <SunMoon className="w-5 h-5" />
            </div>
          </header>

          <main className="rounded-xl shadow-lg backdrop-blur-md border border-[#27272a] dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-[#27272a] backdrop-blur-sm">
              <h2 className="text-lg font-medium">General Settings</h2>
              <p className="text-gray-500 text-sm">
                Configure how the extension works
              </p>
            </div>

            <div className="divide-y divide-white/10 dark:divide-gray-700/30">
              <SettingItem
                icon={<Focus className="w-5 h-5 text-blue-500" />}
                title="Focus Mode"
                description="Disable the whole youtube feed"
                checked={isFocused}
                onToggle={() => {
                  setIsFocused(!isFocused)
                }}
              />

              <SettingItem
                icon={<Lock className="w-5 h-5 text-red-500" />}
                title="Disable Youtube Shorts"
                description="Disable youtube shorts on the homepage"
                checked={isShorts}
                onToggle={() => {
                  setIsShorts(!isShorts)
                }}
              />
              <SettingItem
                icon={<Eye className="w-5 h-5 text-purple-500" />}
                title="Disable Video Recommendations"
                description="Disable youtube video recommendations"
                checked={isVideoRecommendations}
                onToggle={() => {
                  setIsVideoRecommendations(!isVideoRecommendations)
                }}
              />
              <SettingItem
                icon={<MessageCircleOff className="w-5 h-5 text-red-500" />}
                title="Disable Video Comments"
                description="Disable youtube video comments"
                checked={isComment}
                onToggle={() => {
                  setIsComment(!isComment)
                }}
              />
              <SettingItem
                icon={<Bell className="w-5 h-5 text-green-500" />}
                title="Enable Browser Notifications"
                description="Enable browser notifications for schedule pings"
                checked={false}
                onToggle={() => {}}
              />
            </div>

            <div className="p-6 border-t border-[#27272a] backdrop-blur-sm flex justify-end">
              <Button
                onClick={() => {
                  handleSave()
                  success()
                }}
                className="bg-white/90 backdrop-blur-md text-black border border-[#27272a] shadow-md hover:bg-white">
                Save Settings
              </Button>
            </div>
          </main>
          <div
            className="w-full max-w-md mx-auto mt-4  border border-[#27272a] rounded-lg shadow-lg backdrop-blur-md p-4 flex justify-between items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #ff0042 0%, #ff628b 100%)"
            }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br  flex items-center justify-center shadow">
                {/* You can use a crown, star, or similar icon for premium */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01L12 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold text-white">
                  Upgrade to Pro
                </span>
                <span className="text-white/95 text-sm">
                  Unlock all premium features and boost your productivity with
                  Strater
                </span>
              </div>
            </div>
            <a
              href="https://your-upgrade-link.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black font-semibold shadow border border-white/60 hover:bg-white/90 transition">
              Upgrade
              <LinkIcon className="w-4 h-4" />
            </a>
          </div>
          <footer className="mt-6 text-center text-sm text-gray-400 dark:text-gray-400">
            <p>Strater v1.0.0</p>
            <p className="mt-1">© 2025 Strater. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  )
}

interface SettingItemProps {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onToggle: () => void
}

function SettingItem({
  icon,
  title,
  description,
  checked,
  onToggle
}: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-6 transition-all duration-200 gap-2">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 p-2 rounded-lg  backdrop-blur-sm border border-[#27272a] shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
      <Switch
        className="border border-white shadow-sm ml-3"
        checked={checked}
        onChange={onToggle}
      />
    </div>
  )
}
