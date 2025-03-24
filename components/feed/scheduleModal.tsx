import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  TimePicker
} from "antd"
import dayjs, { duration, type Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

interface ScheduleItem {
  id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  video: string
}

dayjs.extend(duration)
export const ScheduleModal: React.FC<{ state: boolean }> = ({ state }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(state)
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem>(null)
  const [pickedDate, setPickedDate] = useState<Dayjs>(dayjs())
  const [treeVideos, setTreeVideos] = useState([])
  const [form] = Form.useForm()
  useEffect(() => {
    const fetchtreeVideos = async () => {
      try {
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "FETCH_ALLCASPULEVIDEOS"
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })
        if (response.success) {
          console.log("Get tree videos from background", response.data)
          setTreeVideos(response.data)
        }
      } catch (error: any) {
        console.log(
          "error in fetching tree video from background process",
          error
        )
      }
    }
    const fetchScheduleData = async () => {
      try {
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "GET_SCHEDULES"
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })
        if (response.success) {
          console.log("Get schedule data from background")
          setScheduleItems(response.data)
        }
      } catch (error: any) {
        console.log("error:", error)
      }
    }
    // fetch function call
    fetchScheduleData()
    fetchtreeVideos()
  }, [])
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
  const handleInputKeyDown = (e) => {
    if (e.key === " " || e.keyCode === 32) {
      // Stop event propagation
      e.stopPropagation()
    }
    e.stopPropagation()
  }
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

  return (
    <Modal
      title={`Schedule Task for ${new Date().toLocaleDateString("en-US")}`}
      zIndex={9999999999999999999999999999999999999}
      getContainer={() =>
        document
          .getElementById("add-to-button-csui")
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
                .getElementById("add-to-button-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            onChange={(date) => date && setPickedDate(date)}
          />
        </Form.Item>
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: "Please enter a task title" }]}>
          <Input
            onKeyDown={handleInputKeyDown}
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
                .getElementById("add-to-button-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            className="outline-none"
            format="HH:mm"
          />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[{ required: true, message: "Please enter the duration" }]}>
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
                .getElementById("add-to-button-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            className="outline-none"
            placeholder="Select status">
            <Select.Option value="Upcoming">Upcoming</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="video"
          label="Tree Video"
          rules={[{ required: true, message: "Please select a tree video" }]}>
          <Select
            getPopupContainer={() =>
              document
                .getElementById("add-to-button-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            className="outline-none"
            placeholder="Select a tree video">
            {treeVideos.map((video) => (
              <Select.Option key={video.id} value={video.title}>
                <div className="flex items-center justify-between w-full">
                  <span>{video.title}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
