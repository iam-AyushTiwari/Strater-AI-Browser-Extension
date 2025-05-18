import { Button, Divider, Modal, Skeleton, Tooltip } from "antd"
import SummarySkeleton from "components/ui/summary-skeleton"
import {
  Expand,
  OctagonAlert,
  PanelTopClose,
  RefreshCw,
  Save,
  X
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Markdown from "utils/markdown"

import { sendToBackground } from "@plasmohq/messaging"

const NotesArea = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [videoID, setVideoID] = useState("")

  useEffect(() => {
    const getVideoId = () => {
      return new URLSearchParams(window.location.search).get("v")
    }
    const fetchVideoData = async () => {
      const id = getVideoId()
      if (id && id != videoID) {
        setVideoID(id)
        await fetchSummary(id)
      }
    }
    fetchVideoData()

    const intervalId = setInterval(fetchVideoData, 2000)

    return () => clearInterval(intervalId)
  }, [videoID])

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
      <div className="w-full bg-[#161616] border-2 border-zinc-900 rounded-xl text-white min-h-24 max-h-[650px] mb-2">
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
                onClick={() => fetchSummary(videoID)}
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
          <div className="text-3xl font-bold p-4 text-center my-6 text-red-500">
            {error}
          </div>
        ) : (
          <div className={`wipe-in-wrapper`}>
            <div className={`wipe-in-content overflow-hidden p-4`}>
              <Markdown markdown={summary} />
            </div>
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
        bodyStyle={{ maxHeight: "calc(100vh - 170px)", overflowY: "auto" }}>
        <div className="p-4">
          <Markdown markdown={summary} />
        </div>
      </Modal>
    </>
  )
}

export default NotesArea
