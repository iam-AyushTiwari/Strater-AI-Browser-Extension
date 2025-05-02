import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  PushpinOutlined,
  ReadOutlined,
  YoutubeOutlined
} from "@ant-design/icons"
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
// import { SiYoutube } from "react-icons/si"
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
  isCompleted: boolean
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
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)



  const videoTitleParentDiv = document.querySelector(
    ".style-scope ytd-watch-metadata"
  ).childNodes[3] as HTMLElement
  const videoTitle = (
    videoTitleParentDiv.children[0].children[1] as HTMLElement
  ).innerText
  const trunctedVideoTitle = videoTitle.length > 30 ? videoTitle.slice(0, 20) + "..." : videoTitle

  const getCurrentVideoId = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get("v")
    setVideoId(videoId)
  }
  // useEffect(() => {
  //   const fetchTreeVideos = async () => {
  //     try {
  //       const response = await sendToBackground({
  //         name: "schedule",
  //         body: {
  //           action: "GET_TREE_VIDEOS"
  //         },
  //         extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
  //       })
  //       if (response.success) {
  //         setTreeVideos(response.data)
  //       }
  //     } catch (error: any) {
  //       console.log("error:", error)
  //     }
  //   }
  //   fetchTreeVideos()
  // }, [])

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
        ...values,
        videoId: videoId,
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
        setIsModalLoading(true)
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "ADD_SCHEDULE",
            data: scheduleItems
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })
        if (response.success) {
          console.log(
            "schedule added successfully with scheduleItems",
            response.data,
            scheduleItems
          )
        } else {
          console.log(
            "schedule not added successfully with scheduleItems",
            scheduleItems
          )
        }
      } catch (error: any) {
        console.log("error:", error)
      } finally {
        setIsModalLoading(false)
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
          title={
            <div className="flex flex-col items-start px-2">
            <div className="flex items-center gap-2">
              <span className="text-[#ff0042] mr-2">
                <YoutubeOutlined style={{ fontSize: "20px" }} />
              </span>
              <span>Schedule for Later</span>
            </div>
              <div className="w-full border-t border-zinc-700 my-4"></div>
              </div>
          }
          closeIcon={<CloseOutlined />}
          zIndex={999999999999}
          open={isScheduleModalOpen}
          onOk={setSchedule}
          okText="Schedule"
          confirmLoading={isModalLoading}
          onCancel={() => setIsScheduleModalOpen(false)}
          className="text-white modern-modal"
          width={400}
          getContainer={() =>
            document
              .getElementById("take-note-csui")
              ?.shadowRoot?.querySelector("#plasmo-shadow-container")
          }>
          <Form form={form} layout="vertical" className="pt-4">
            <Form.Item name="title" label="Task title" className="mb-6" initialValue={trunctedVideoTitle}  rules={[
                { required: true, message: "Please enter a task title" }
              ]}>
              <Input
                onKeyDown={handleInputKeyDown}
                prefix={<YoutubeOutlined className="mr-2" style={{ color: "#ff0042" }} />}
                defaultValue={trunctedVideoTitle}
                className="rounded-lg"
                placeholder="Task title"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="date"
                label="Date"
                initialValue={dayjs()}
                className="mb-0" rules={[{ required: true, message: "Please select a date" }]}>
                <DatePicker
                  className="w-full rounded-lg"
                  format="DD-MM-YYYY"
                  getPopupContainer={() =>
                    document
                      .getElementById("take-note-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }
                  onChange={(date) => date && setPickedDate(date)}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>

              <Form.Item name="time" label="Time" className="mb-0" rules={[{ required: true, message: "Please select a time" }]}>
                <TimePicker
                  className="w-full rounded-lg"
                  getPopupContainer={() =>
                    document
                      .getElementById("take-note-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }
                  format="HH:mm"
                  suffixIcon={<ClockCircleOutlined />}
                />
              </Form.Item>
            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                { required: true, message: "Please enter the duration" }
              ]}>
              <InputNumber
               className="rounded-lg w-full"
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
              className="rounded-lg w-full"
                getPopupContainer={() =>
                  document
                    .getElementById("take-note-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                placeholder="Select status">
                <Select.Option value="Upcoming">Upcoming</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>

            </div>
            <Form.Item hidden
              name="video"
              label="Video Id">
             <Input className="rounded-lg w-full" defaultValue={videoId} disabled placeholder="Video Id"/>
            </Form.Item>

          </Form>
          <div className="flex items-center text-xl text-gray-400 mb-2">
            <ClockCircleOutlined className="mr-2 text-2xl text-[#ff0042]/90" />
            <span>You'll receive a notification when it's time to watch</span>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default WatchVideoButtons
