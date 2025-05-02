import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  MoreOutlined,
  ScheduleOutlined,
  YoutubeOutlined
} from "@ant-design/icons"
import {
  Badge,
  Button,
  Calendar,
  Checkbox,
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
import type {
  BadgeProps,
  CalendarProps,
  CheckboxProps,
  DatePickerProps,
  MenuProps
} from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import duration from "dayjs/plugin/duration"
import isBetween from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { CiMenuKebab } from "react-icons/ci"
import { FaRegEye } from "react-icons/fa6"
import { MdDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md"
import { RiLoader3Line } from "react-icons/ri"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

import { Card } from "./Card"

dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)
dayjs.extend(advancedFormat)

interface ScheduleItem {
  _id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  video: string
  videoId: string
  isCompleted: boolean
}

// const mockSchedule: ScheduleItem[] = [
//   {
//     id: "1",
//     title: "React Hooks Tutorials",
//     time: "09:00",
//     duration: 45,
//     status: "Upcoming",
//     date: "2025-02-17"
//   },
//   {
//     id: "2",
//     title: "Next.js 13 Overview",
//     time: "11:30",
//     duration: 60,
//     status: "In Progress",
//     date: "2025-02-17"
//   },
//   {
//     id: "3",
//     title: "Tailwind CSS Tips",
//     time: "14:00",
//     duration: 30,
//     status: "Completed",
//     date: "2025-02-17"
//   }
// ]

const dummyVideos = [
  { id: "1", title: "Tree Video 1" },
  { id: "2", title: "Tree Video 2" },
  { id: "3", title: "Tree Video 3" }
]

export function TodaySchedule() {
  // const [messageApi, contextHolder] = message.useMessage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [filteredScheduleItems, setFilteredScheduleItems] = useState<
    ScheduleItem[]
  >([])
  const [form] = Form.useForm()
  const [clikedOnDate, setClickedOnDate] = useState(false)
  const [treeVideos, setTreeVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalLoading, setIsModalLoading] = useState(false)

  // fetch schedule data
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
          setLoading(false)
        }
      } catch (error: any) {
        setLoading(false)
        console.log("error:", error)
      } finally {
        setLoading(false)
      }
    }
    // fetch function call
    fetchScheduleData()
    fetchtreeVideos()
  }, [])

  // update schedule state from scheduleItem component using callback
  const handleScheduleUpdate = ({
    Item,
    action
  }: {
    Item: ScheduleItem
    action: string
  }) => {
    console.log("Updated schedule items", Item, "Action:", action)
    if (action == "Update") {
      setScheduleItems((prev) =>
        prev.map((item) => (item._id === Item._id ? Item : item))
      )
    }
    if (action == "Delete") {
      setScheduleItems((prev) => prev.filter((item) => item._id !== Item._id))
    }
  }

  // Date navigation
  const goToPreviousDay = () =>
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)))
  const goToNextDay = () =>
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)))

  //handle date change in modal
  // const handleDateChange = () => {
  //   onChange([dayjs(currentDate)], [dayjs(currentDate).format("YYYY-MM-DD")])
  // }

  // Function to update the status of schedule items in real time
  const updateScheduleStatuses = () => {
    const now = dayjs() // Current time
    setScheduleItems((prevItems) =>
      prevItems.map((item) => {
        const startTime = dayjs(
          `${item.date.split("T")[0]} ${item.time}`,
          "YYYY-MM-DD HH:mm"
        ).utc()
        const endTime = startTime.add(item.duration, "minutes")

        if (!item.isCompleted) {
          if (now.isAfter(endTime)) {
            // If the current time is after the end time and the task is not completed
            return { ...item, status: "Missed" }
          }
        }

        return item // Keep the existing status if none of the conditions are met
      })
    )
  }

  // // Periodically update statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateScheduleStatuses()
    }, 10000) // Update every 10 seconds

    // Run the update immediately on component mount
    updateScheduleStatuses()

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [])
  // Schedule management
  const handleAddTask = () => {
    form.validateFields().then(async (values) => {
      const newTask: ScheduleItem = {
        ...values,
        video: values.video,
        videoId: values.videoId,
        time: values.time.format("HH:mm"), // Ensure this matches the API's expected format
        date: dayjs(currentDate).format("YYYY-MM-DD")
      }
      try {
        console.log("New task to be added", newTask)
        setIsModalLoading(true)
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "ADD_SCHEDULE",
            data: newTask
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })

        if (response.success) {
          // messageApi.success("Schedule added successfully")
          console.log("schedule added --- successfully ", response.data)
          setScheduleItems((prev) => [...prev, response.data])
        } else {
          // messageApi.error("Failed to add schedule")
          console.log("Failed to add schedule --->", response)
          throw new Error("Failed to add schedule")
        }
      } catch (error: any) {
        // messageApi.error("Failed to add schedule")
        console.log("Failed to add schedule", error)
      } finally {
        setIsModalLoading(false)
      }

      form.resetFields()
      setIsScheduleModalOpen(false)
    })
  }

  useEffect(() => {
    const filtered = scheduleItems.filter(
      (item) =>
        dayjs(item.date).utc().format("YYYY-MM-DD") ===
        dayjs(currentDate).format("YYYY-MM-DD")
    )
    console.log(
      "Filtered schedule items and date",
      filtered,
      scheduleItems.length > 0
        ? dayjs(scheduleItems[0].date).utc().format("YYYY-MM-DD")
        : "No date available"
    )

    //filter based on time in chronological order.

    filtered.sort((a, b) => {
      const timeA = dayjs(`${a.time}`, "HH:mm").utc()
      const timeB = dayjs(`${b.time}`, "HH:mm").utc()
      return timeA.isBefore(timeB) ? -1 : 1 // Sort in ascending order
    })
    setFilteredScheduleItems(filtered)
  }, [currentDate, scheduleItems])

  // Calendar cell renderer
  const dateCellRender = (date: Dayjs) => {
    const currentDate = date.format("YYYY-MM-DD")
    const dailyTasks = scheduleItems.filter(
      (item) => dayjs(item.date).utc().format("YYYY-MM-DD") === currentDate
    )
    const statusColorMap: Record<string, BadgeProps["status"]> = {
      Completed: "success",
      "In Progress": "warning",
      Upcoming: "error"
    }
    return (
      <div className="space-y-1 p-1">
        {dailyTasks.map((task) => (
          <Badge
            key={task._id}
            status={statusColorMap[task.status]}
            text={
              <span className="text-zinc-900 text-lg font-normal">
                {task.time} - {task.title}
              </span>
            }
            className="block"
          />
        ))}
        {/* {dailyTasks.length > 3 && (
          <div className="text-xs text-white/80">
            +{dailyTasks.length - 3} more
          </div>
        )} */}
      </div>
    )
  }

  return (
    <Card title="Today Schedule">
      <div className="space-y-6 p-4 backdrop-blur-lg bg-gradient-to-br rounded-xl from-[#1a1a1a] to-[#2d2d2d]">
        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} className="text-white/80" />
          </button>
          <button
            onClick={() => setClickedOnDate(true)}
            className="text-2xl font-semibold text-white/90 bg-transparent hover:cursor-pointer">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
          </button>
          <button
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ChevronRight size={24} className="text-white/80" />
          </button>
        </div>

        {/* Schedule Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
          {loading ? ( // Conditionally render loader
            <div className="flex w-full h-20 items-center justify-center p-4">
              <RiLoader3Line className="text-4xl animate-spin" />
            </div>
          ) : scheduleItems.length === 0 ||
            filteredScheduleItems.length === 0 ? (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
              <p className="text-xl font-light text-white/60">
                No schedule found
              </p>
            </div>
          ) : (
            filteredScheduleItems.map((item) => (
              <ScheduleItem
                key={item._id}
                item={item}
                treeVideos={treeVideos}
                onScheduleUpdate={handleScheduleUpdate}
              />
            ))
          )}
          {/* {scheduleItems.length === 0 || filteredScheduleItems.length === 0 ? (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-20 h-20 bg-white/5  rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
              <p className="text-xl font-light text-white/60">
                No schedule found
              </p>
            </div>
          ) : (
            filteredScheduleItems.map((item) => (
              <ScheduleItem
                key={item.id}
                item={item}
                treeVideos={treeVideos}
                onScheduleUpdate={handleScheduleUpdate}
              />
            ))
          )} */}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-[#ff0042]/95 to-[#ff0042]/90 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl transition-all shadow-lg text-2xl">
            Create Schedule
          </button>
          <button
            onClick={() => setCalendarModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all shadow-lg text-2xl">
            View Calendar
          </button>
        </div>

        {/* Schedule Creation Modal */}
        <Modal
          title={
            <div className="flex flex-col items-start px-2">
              <div className="flex items-center gap-2">
                <span className="text-[#ff0042] mr-2">
                  <YoutubeOutlined style={{ fontSize: "20px" }} />
                </span>
                <span>
                  {`Schedule Task for ${currentDate.toLocaleDateString("en-US")}`}
                </span>
              </div>
              <div className="w-full border-t border-zinc-700 my-2"></div>
            </div>
          }
          closeIcon={<CloseOutlined />}
          mask={true}
          zIndex={999999}
          open={isScheduleModalOpen}
          onOk={handleAddTask}
          okText="Schedule"
          confirmLoading={isModalLoading}
          onCancel={() => setIsScheduleModalOpen(false)}
          className="text-white modern-modal"
          width={400}
          getContainer={() =>
            document
              .getElementById("feed-strater-csui")
              ?.shadowRoot?.querySelector("#plasmo-shadow-container")
          }>
          <Form form={form} layout="vertical" className="pt-4">
            <Form.Item
              name="title"
              label="Task title"
              className="mb-6"
              rules={[
                { required: true, message: "Please enter a task title" }
              ]}>
              <Input
                prefix={
                  <YoutubeOutlined
                    className="mr-2"
                    style={{ color: "#ff0042" }}
                  />
                }
                className="rounded-lg"
                placeholder="Enter task title"
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: "Please select a time" }]}>
                <TimePicker
                  getPopupContainer={() =>
                    document
                      .getElementById("feed-strater-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }
                  className="w-full rounded-lg"
                  format="HH:mm"
                  suffixIcon={<ClockCircleOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
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
                  placeholder="Select status"
                  getPopupContainer={() =>
                    document
                      .getElementById("feed-strater-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }>
                  <Select.Option value="Upcoming">Upcoming</Select.Option>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
              {/* New Form.Item for selecting a Tree Video */}
              <Form.Item
                name="video"
                label="Tree Video"
                rules={[
                  { required: true, message: "Please select a tree video" }
                ]}>
                <Select
                  getPopupContainer={() =>
                    document
                      .getElementById("feed-strater-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }
                  className="w-full rounded-lg"
                  placeholder="Select a tree video">
                  {treeVideos.map((video: any) => (
                    <Select.Option key={video._id} value={video.title}>
                      <div className="flex items-center justify-between w-full">
                        <span>{video.title}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
          <div className="flex items-center text-xl text-gray-400 mb-1">
            <ClockCircleOutlined className="mr-2 text-2xl text-[#ff0042]/90" />
            <span>You'll receive a notification when it's time to watch</span>
          </div>
        </Modal>

        {/* Calendar View Modal */}
        <Modal
          title="Schedule Calendar"
          zIndex={999999}
          open={calendarModalOpen}
          onCancel={() => setCalendarModalOpen(false)}
          footer={null}
          width="60%"
          getContainer={() =>
            document
              .getElementById("feed-strater-csui")
              ?.shadowRoot?.querySelector("#plasmo-shadow-container")
          }>
          <Calendar
            fullscreen={true}
            cellRender={(current: Dayjs, info) => {
              if (info.type === "date") {
                return dateCellRender(current)
              }
              return info.originNode
            }}
          />
        </Modal>
        <Modal
          title="Select Date"
          open={clikedOnDate}
          zIndex={999999}
          className="text-white modern-modal"
          onCancel={() => setClickedOnDate(false)}
          footer={null}
          getContainer={() =>
            document
              .getElementById("feed-strater-csui")
              ?.shadowRoot?.querySelector("#plasmo-shadow-container")
          }>
          <DatePicker
            className="w-full rounded-lg"
            getPopupContainer={() =>
              document
                .getElementById("feed-strater-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            onChange={(date) => {
              if (date) {
                setCurrentDate(date.toDate()) // Update current date state
                setClickedOnDate(false) // Close modal after selection
              }
            }}
            suffixIcon={<CalendarOutlined />}
            needConfirm
          />
        </Modal>
      </div>
    </Card>
  )
}

function ScheduleItem({
  item,
  treeVideos,
  onScheduleUpdate
}: {
  item: ScheduleItem
  treeVideos: any
  onScheduleUpdate: ({
    Item,
    action
  }: {
    Item: ScheduleItem
    action: string
  }) => void
}) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [updatedItem, setUpdatedItem] = useState<ScheduleItem>(null)
  const [form] = Form.useForm()
  const [isModalLoading, setIsModalLoading] = useState(false)

  const openVideo = () => {
    if (item.videoId) {
      const url = `https://www.youtube.com/watch?v=${item.videoId}`
      history.pushState({}, "", url)
      window.dispatchEvent(new Event("popstate"))
    }
  }

  // Update form values when the modal is opened or the item changes
  useEffect(() => {
    if (isEditModalVisible) {
      form.setFieldsValue({
        title: item.title,
        date: dayjs(item.date),
        time: dayjs(item.time, "HH:mm"),
        duration: item.duration.toString(),
        status: item.status,
        videoId: item.videoId,
        video: item.video
      })
    }
    //changet dependacy array because of frequent time status change
  }, [isEditModalVisible])

  //checkbox function handler
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }

  const handleUpdateTask = () => {
    form.validateFields().then(async (values) => {
      const updatedTask: ScheduleItem = {
        _id: item._id,
        ...values,
        video: values.video,
        videoId: values.videoId,
        time: values.time.format("HH:mm"),
        date: values.date.format("YYYY-MM-DD")
      }
      try {
        setIsModalLoading(true)
        const response = await sendToBackground({
          name: "schedule",
          body: {
            action: "UPDATE_SCHEDULE",
            data: updatedTask
          },
          extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
        })

        if (response.success) {
          console.log("Schedule updated successfully")
          onScheduleUpdate({ Item: response.data, action: "Update" })
        } else {
          console.log("Failed to update schedule", response.error)
          console.log("Updated item & id", updatedTask, item._id)
        }
      } catch (error: any) {
        console.log("Failed to update schedule", error)
      } finally {
        form.resetFields()
        setIsEditModalVisible(false)
        setIsModalLoading(false)
      }
    })
  }

  // useEffect(() => {
  //   if (!updatedItem) return // Only run if updatedItem is set

  //   const updateSchedule = async () => {

  //   }

  //   updateSchedule();
  // }, [updatedItem])

  //handel delete
  const handleDelete = async () => {
    try {
      setIsModalLoading(true)
      const response = await sendToBackground({
        name: "schedule",
        body: {
          action: "DELETE_SCHEDULE",
          data: item
        },
        extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
      })

      if (response.success) {
        console.log("Schedule deleted successfully in Td", response.data)
        onScheduleUpdate({ Item: response.data, action: "Delete" })
      }
    } catch (error: any) {
      console.log("Failed to delete schedule", error?.message)
    } finally {
      setIsModalLoading(false)
    }
  }

  const handelCheckbox = async (checked: boolean, id: string) => {
    try {
      console.log("checkd: status", checked)
      const response = await sendToBackground({
        name: "schedule",
        body: {
          action: "UPDATE_SCHEDULE",
          data: { _id: id, isCompleted: checked }
        },
        extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
      })
      if (response.success) {
        console.log("Schedule updated successfully in Td", response.data)
        onScheduleUpdate({ Item: response.data, action: "Update" })
      } else {
        console.log("Failed to update schedule", response.error)
      }
    } catch (error: any) {
      console.log("Error:", error.message)
    }
  }

  const statusColors = {
    Upcoming: "bg-purple-500/20 text-purple-400",
    "In Progress": "bg-blue-500/20 text-blue-400",
    Completed: "bg-emerald-500/20 text-emerald-400",
    Missed: "bg-red-500/20 text-red-400"
  }

  const handleMenuButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("menu icon clicked")
  }

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1" icon={<FaRegEye />} onClick={openVideo}>
  //       View
  //     </Menu.Item>
  //     <Menu.Item
  //       key="2"
  //       icon={<MdDriveFileRenameOutline />}
  //       onClick={() => {
  //         setIsEditModalVisible(true)
  //       }}>
  //       Edit
  //     </Menu.Item>
  //     <Menu.Item
  //       key="3"
  //       icon={<MdDeleteOutline />}
  //       onClick={() => setIsDeleteModalVisible(true)}>
  //       Remove
  //     </Menu.Item>
  //   </Menu>
  // )

  const menuItems: MenuProps["items"] = [
    {
      key: "view",
      icon: <FaRegEye />,
      label: "View",
      onClick: openVideo
    },
    {
      key: "edit",
      icon: <MdDriveFileRenameOutline />,
      label: "Edit",
      onClick: () => setIsEditModalVisible(true)
    },
    {
      key: "delete",
      icon: <MdDeleteOutline />,
      label: "Remove",
      onClick: () => setIsDeleteModalVisible(true)
    }
  ]

  return (
    <>
      <div className="group flex items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
        <Checkbox
          key={String(item.isCompleted)}
          defaultChecked={item.isCompleted}
          onChange={(e) => {
            handelCheckbox(e.target.checked, item._id)
          }}
          className="text-white/90 text-2xl mr-2 flex-shrink-0"
        />
        <div className="w-20 flex-shrink-0">
          <span className="text-xl font-medium text-white/60">{item.time}</span>
        </div>
        <div className="flex-grow space-y-1">
          <h4 className="text-xl font-semibold text-white truncate">
            {item.title}
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-white text-xl">{item.duration} min</span>
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-xl ${statusColors[item.status as keyof typeof statusColors]}`}>
          {item.status}
        </div>
        <div className="text-3xl text-white/90 px-2">
          <Dropdown
            getPopupContainer={() =>
              document
                .getElementById("feed-strater-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            menu={{ items: menuItems }}
            trigger={["hover"]}>
            <CiMenuKebab className="cursor-pointer" />
          </Dropdown>
        </div>
      </div>
      <Modal
        title={
          <div className="flex flex-col items-start px-2">
            <div className="flex items-center gap-2">
              <span className="text-[#ff0042] mr-2">
                <YoutubeOutlined style={{ fontSize: "20px" }} />
              </span>
              <span>
                {`Schedule Task for ${new Date(item.date).toLocaleDateString("en-US")}`}
              </span>
            </div>
            <div className="w-full border-t border-zinc-700 my-2"></div>
          </div>
        }
        closeIcon={<CloseOutlined />}
        zIndex={999999}
        open={isEditModalVisible}
        onOk={handleUpdateTask}
        okText="Update"
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={isModalLoading}
        className="text-white modern-modal"
        width={400}
        getContainer={() =>
          document
            .getElementById("feed-strater-csui")
            ?.shadowRoot?.querySelector("#plasmo-shadow-container")
        }>
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: "Please enter a task title" }]}>
            <Input
              className="rounded-lg"
              prefix={
                <YoutubeOutlined
                  className="mr-2"
                  style={{ color: "#ff0042" }}
                />
              }
              placeholder="Enter task title"
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}>
              <DatePicker
                getPopupContainer={() =>
                  document
                    .getElementById("feed-strater-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                onChange={(date) => {
                  if (date) {
                    item.date = date.format("YYYY-MM-DD") // Update current date state
                  }
                }}
                suffixIcon={<CalendarOutlined />}
                className="w-full rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select a time" }]}>
              <TimePicker
                getPopupContainer={() =>
                  document
                    .getElementById("feed-strater-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }
                className="w-full rounded-lg"
                format="HH:mm"
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[
                { required: true, message: "Please enter the duration" }
              ]}>
              <InputNumber
                className="w-full rounded-lg"
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
                placeholder="Select status"
                getPopupContainer={() =>
                  document
                    .getElementById("feed-strater-csui")
                    ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                }>
                <Select.Option value="Upcoming">Upcoming</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>

            {/* New Form.Item for selecting a Tree Video */}
            {!item.videoId && (
              <Form.Item
                name="video"
                label="Tree Video"
                rules={[
                  { required: true, message: "Please select a tree video" }
                ]}>
                <Select
                  getPopupContainer={() =>
                    document
                      .getElementById("feed-strater-csui")
                      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                  }
                  className="w-full rounded-lg"
                  placeholder="Select a tree video">
                  {treeVideos.map((video) => (
                    <Select.Option key={video._id} value={video.title}>
                      <div className="flex items-center justify-between w-full">
                        <span>{video.title}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </div>
        </Form>
        <div className="flex items-center text-xl text-gray-400 mb-1">
          <ClockCircleOutlined className="mr-2 text-2xl text-[#ff0042]/90" />
          <span>You'll receive a notification when it's time to watch</span>
        </div>
      </Modal>
      <Modal
        title="Delete Bookmark"
        zIndex={999999}
        open={isDeleteModalVisible}
        onOk={handleDelete}
        okText="Delete"
        onCancel={() => setIsDeleteModalVisible(false)}
        confirmLoading={isModalLoading}
        getContainer={() =>
          document
            .getElementById("feed-strater-csui")
            ?.shadowRoot?.querySelector("#plasmo-shadow-container")
        }>
        <p>Are you sure you want to delete this Schedule?</p>
      </Modal>
    </>
  )
}
