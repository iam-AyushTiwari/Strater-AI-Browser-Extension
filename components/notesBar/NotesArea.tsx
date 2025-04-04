import { Button, Divider, Modal, Skeleton, Tooltip } from "antd"
import SummarySkeleton from "components/ui/summary-skeleton"
import { Expand, PanelTopClose, RefreshCw, Save, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import Markdown from "utils/markdown"

import { sendToBackground } from "@plasmohq/messaging"

const NotesArea = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const videoUrl = window.location.href
    const videoID = extractVideoID(videoUrl)
    fetchSummary(videoID)
  }, [window.location.href])

  const extractVideoID = (url: string): string => {
    const urlParams = new URLSearchParams(new URL(url).search)
    return urlParams.get("v") || url.split("/").pop() || ""
  }

  const fetchSummary = async (videoID: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await sendToBackground({
        name: "notesSection",
        body: {
          action: "GET_SUMMARY",
          videoID: videoID
        }
      })

      if (response.success) {
        setSummary(response.data.data)
      } else {
        setError(
          response.error || "An error occurred while fetching the summary."
        )
      }
    } catch (error) {
      setError("An error occurred while fetching the summary.")
    } finally {
      setLoading(false)
    }
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const handleOk = () => {
    setModalVisible(false)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  return (
    <>
      <div className="w-full bg-[#161616] border-2 border-zinc-900 rounded-xl text-white h-[650px] mb-2 overflow-y-auto">
        <div className="flex justify-between px-4 py-2 border-b-2 bg-inherit border-b-zinc-700 dark:bg-zinc-900 sticky top-0 z-10">
          <div className="flex gap-2">
            <Tooltip title="Expand">
              <Button
                type="text"
                icon={<Expand size={15} color="white" />}
                className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
                onClick={showModal}
              />
            </Tooltip>
            <Tooltip title="Save">
              <Button
                type="text"
                icon={<Save size={15} color="white" />}
                className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
              />
            </Tooltip>
            <Tooltip title="Generate Summary">
              <Button
                type="text"
                icon={<RefreshCw size={15} color="white" />}
                className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
                onClick={() =>
                  fetchSummary(extractVideoID(window.location.href))
                }
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Close">
              <Button
                type="text"
                icon={<X size={15} color="white" />}
                className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
              />
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <SummarySkeleton />
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <div className="p-4 h-[calc(100%-48px)] overflow-y-auto">
            <Markdown markdown={summary} />
          </div>
        )}
      </div>

      <Modal
        title="Summary"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        getContainer={() => document.body}
        centered
        footer={null}
        bodyStyle={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        <div className="p-4">
          <Markdown markdown={summary} />
        </div>
      </Modal>
    </>
  )
}

export default NotesArea
