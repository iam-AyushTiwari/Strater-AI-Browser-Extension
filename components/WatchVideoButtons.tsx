import { PlusOutlined, PushpinOutlined, ReadOutlined } from "@ant-design/icons"
import {
  Badge,
  Button,
  Calendar,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  TimePicker
} from "antd"
import dayjs, { Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"
import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

dayjs.extend(duration)

interface ScheduleItem {
  id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  videoId: string
}

const dummyVideos = [
  { id: "1", title: "Tree Video 1" },
  { id: "2", title: "Tree Video 2" },
  { id: "3", title: "Tree Video 3" }
]

const WatchVideoButtons = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem>(null)
  const [pickedDate, setPickedDate] = useState<Dayjs>(dayjs())
  const [treeVideos, setTreeVideos] = useState([])
  const [videoId, setVideoId] = useState<string>("")
  const videoTitleParentDiv = document.querySelector(
    ".style-scope ytd-watch-metadata"
  ).childNodes[3] as HTMLElement
  const videoTitle = (
    videoTitleParentDiv.children[0].children[1] as HTMLElement
  ).innerText

  const getCurrentVideoId = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get("v")
    setVideoId(videoId)
  }
  useEffect(() => {
    const fetchTreeVideos = async () => {
      try {
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "GET_TREE_VIDEOS"
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })
        if (response.success) {
          setTreeVideos(response.data)
        }
      } catch (error: any) {
        console.log("error:", error)
      }
    }
    fetchTreeVideos()
  }, [])

  const handleInputKeyDown = (e) => {
    if (e.key === " " || e.keyCode === 32) {
      // Stop event propagation
      e.stopPropagation()
    }
    e.stopPropagation()
  }

  const [form] = Form.useForm()
  const setSchedule = () => {
    form.validateFields().then(async (values) => {
      if (!pickedDate) {
        message.error("Please select a valid date.")
        return
      }
      const newScheduleItem: ScheduleItem = {
        id: uuidv4(),
        ...values,
        time: values.time.format("HH:mm"),
        date: pickedDate.format("YYYY-MM-DD")
      }
      setScheduleItems(newScheduleItem)
      form.resetFields()
      setIsScheduleModalOpen(false)
    })
  }

  useEffect(() => {
    const addTask = async () => {
      if (!scheduleItems) return

      try {
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "ADD_SCHEDULE",
            data: scheduleItems
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })
        if (response.success) {
          console.log("schedule added successfully")
        }
      } catch (error: any) {
        console.log("error:", error)
      }
    }
    addTask()
  }, [scheduleItems])
  return (
    <>
      <div className="my-2 flex justify-between items-center bg-inherit rounded-xl text-6xl w-full">
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setIsScheduleModalOpen(true)
              getCurrentVideoId()
            }}
            type="primary"
            className="flex gaap-4">
            <PushpinOutlined />
            Schedule
          </Button>
          <Button type="primary" className="flex gaap-4">
            <PlusOutlined />
            Add to Capsules
          </Button>
        </div>
        <div>
          <Button type="primary" className="flex gaap-4">
            <ReadOutlined />
            Take Note
          </Button>
        </div>
        <Modal
          title={`Schedule Task for ${new Date().toLocaleDateString("en-US")}`}
          zIndex={9999999999999999999999999999999999999}
          getContainer={() =>
            document
              .getElementById("take-note-csui")
              ?.shadowRoot?.querySelector("#plasmo-shadow-container")
          }
          open={isScheduleModalOpen}
          onOk={setSchedule}
          onCancel={() => setIsScheduleModalOpen(false)}
          className="text-white modern-modal">
          <Form form={form} layout="vertical">
            <Form.Item
              name="date"
              initialValue={dayjs()}
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker
                getPopupContainer={() =>
                  document
                    .getElementById("take-note-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                onChange={(date) => date && setPickedDate(date)}
              />
            </Form.Item>
            <Form.Item
              name="title"
              label="Task Title"
              rules={[
                { required: true, message: "Please enter a task title" }
              ]}>
              <Input
                onKeyDown={handleInputKeyDown}
                defaultValue={videoTitle}
                className="outline-none"
                placeholder="Enter task title"
              />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select a time" }]}>
              <TimePicker
                getPopupContainer={() =>
                  document
                    .getElementById("take-note-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                className="outline-none"
                format="HH:mm"
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[
                { required: true, message: "Please enter the duration" }
              ]}>
              <InputNumber
                className="outline-none"
                min={15}
                max={240}
                placeholder="Enter duration in minutes"
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}>
              <Select
                getPopupContainer={() =>
                  document
                    .getElementById("take-note-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                className="outline-none"
                placeholder="Select status">
                <Select.Option value="Upcoming">Upcoming</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="video" label="Video Id">
              <Input defaultValue={videoId} disabled placeholder="Video Id" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default WatchVideoButtons
