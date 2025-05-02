import { get } from "http"
import { StyleProvider } from "@ant-design/cssinjs"
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  YoutubeOutlined
} from "@ant-design/icons"
import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  TimePicker,
  type MenuProps
} from "antd"
import { ScheduleModal } from "components/feed/scheduleModal"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import dayjs, { duration, type Dayjs } from "dayjs"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect, useState } from "react"
import { BsClock, BsEye } from "react-icons/bs"
import { FaRegFolderOpen } from "react-icons/fa"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

interface ScheduleItem {
  _id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  videoId: string
  isCompleted: boolean
}

// dayjs.extend(duration)

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll("#dismissible #details")
  return Array.from(anchors).map((element, index) => ({
    id: index,
    element,
    insertPosition: "afterend"
  }))
}

export const getStyle = (shadowHostId: string) => {
  const updatedCssText = tailwindcss.replaceAll(
    ":root",
    `:host(${shadowHostId})`
  )
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "add-to-button-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false)
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem>(null)
  const [pickedDate, setPickedDate] = useState<Dayjs>(dayjs())
  const [treeVideos, setTreeVideos] = useState([])
  const [form] = Form.useForm()
  const [videoTitle, setVideoTitle] = useState<string>("")
  const [videoId, setVideoId] = useState<string>("")
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  const handlePlusClick = (event: React.MouseEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLElement
    const shadowRoot = targetElement.getRootNode() as ShadowRoot
    const parentElement = shadowRoot.host as HTMLElement
    const parentNode = parentElement.parentNode as HTMLElement
    const childElements = parentNode.children as HTMLCollection
    const selectedElement = (
      childElements[2].childNodes[1].childNodes[0].childNodes[0] as HTMLElement
    ).nextElementSibling as HTMLElement
    const target = selectedElement.ariaLabel
    const VideoTitle = (childElements[2].childNodes[1] as HTMLElement)
      .children[0].childNodes[1] as HTMLElement
    const finalVideoTitle = VideoTitle.attributes[4].nodeValue

    console.log(
      "Parent Element & parent node & childE & selected target & final vi with ID add-to-button-csui:",
      parentElement,
      parentNode,
      childElements,
      target,
      finalVideoTitle
    )
    setVideoTitle(target.length > 30 ? `${target.substring(0, 30)}...` : target)
    const videoId = finalVideoTitle.split("v=")[1]
    setVideoId(videoId)
  }

  useEffect(() => {
    const plusIcons = document.querySelectorAll("#add-to-button-csui")

    if (plusIcons.length > 0) {
      plusIcons.forEach((plusIcon) => {
        const shadowContainer = plusIcon.shadowRoot?.querySelector(
          "#plasmo-shadow-container"
        ) as HTMLElement

        if (shadowContainer) {
          shadowContainer.style.zIndex = "inherit"
        }
      })
    }
    // const shadowContainer = document
    //   .getElementById(HOST_ID)
    //   .shadowRoot?.querySelector("#plasmo-shadow-container") as HTMLElement
    // if (shadowContainer != undefined) {
    //   shadowContainer.style.zIndex = "9999999"
    //   shadowContainer.style.position = "fixed"
    //   shadowContainer.style.left = "40%"
    //   shadowContainer.style.top = "40%"
    // }
  }, [])
  useEffect(() => {
    const consoleFunc = async () => {
      console.log("plus icon clicked!", isScheduleModalOpen)
    }
    consoleFunc()
  }, [isScheduleModalOpen])
  // useEffect(() => {
  //   const fetchtreeVideos = async () => {
  //     try {
  //       const response = await sendToBackground({
  //         name: "schedule",
  //         body: {
  //           action: "FETCH_ALLCASPULEVIDEOS"
  //         },
  //         extensionId: "aodjmfiabicdmbnaaeljcldpamjimmff"
  //       })
  //       if (response.success) {
  //         console.log("Get tree videos from background", response.data)
  //         setTreeVideos(response.data)
  //       }
  //     } catch (error: any) {
  //       console.log(
  //         "error in fetching tree video from background process",
  //         error
  //       )
  //     }
  //   }
  //   fetchtreeVideos()
  // }, [])
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
  //set clicked context menu item
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("clicked context menu key", e.key)
    if (e.key === "2") {
      setIsScheduleModalOpen(true)
    }
  }

  const menuItems: MenuProps["items"] = [
    {
      label: (
        <div
          className="flex w-full items-center justify-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}>
          <span>Add to Capsules</span>
        </div>
      ),
      key: "1",
      icon: <FaRegFolderOpen className="text-xl mr-2" />
    },
    {
      label: (
        <div
          className="flex items-center justify-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}>
          <span>Schedule Later</span>
        </div>
      ),
      key: "2",
      icon: <BsClock className="text-xl mr-2" />
    },
    {
      label: (
        <div
          className="flex items-center justify-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}>
          <span>Show Flash Card</span>
        </div>
      ),
      key: "3",
      icon: <BsEye className="text-xl mr-2" />
    }
  ]
  const menu = (
    <Menu
      onClick={onClick}
      items={menuItems}
      className="text-white bg-slate-900"
    />
  )

  return (
    <>
      <Providers>
        <Dropdown overlay={menu} trigger={["click"]}>
          <FloatButton
            shape="circle"
            className="text-white absolute bottom-2 right-2 bg-red-900 rounded-full p-2 cursor-pointer flex items-center justify-center"
            tooltip={"Strater Action"}
            onClick={(e) => handlePlusClick(e)}
            icon={<PlusOutlined className="text-white text-2xl" />}
          />
        </Dropdown>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <Modal
            title={
              <div className="flex flex-col items-start px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#ff0042] mr-2">
                    <YoutubeOutlined style={{ fontSize: "20px" }} />
                  </span>
                  <span>Schedule for Later</span>
                </div>
                <div className="w-full border-t border-zinc-700 my-2"></div>
              </div>
            }
            closeIcon={<CloseOutlined />}
            zIndex={999999}
            confirmLoading={isModalLoading}
            getContainer={() =>
              document
                .getElementById("add-to-button-csui")
                ?.shadowRoot?.querySelector("#plasmo-shadow-container")
            }
            open={isScheduleModalOpen}
            onOk={setSchedule}
            okText="Schedule"
            onCancel={() => setIsScheduleModalOpen(false)}
            className="text-white modern-modal"
            width={400}>
            <Form form={form} layout="vertical" className="pt-4">
              <Form.Item
                name="title"
                label="Task title"
                className="mb-6"
                rules={[
                  { required: true, message: "Please enter a task title" }
                ]}>
                <Input
                  onKeyDown={handleInputKeyDown}
                  prefix={
                    <YoutubeOutlined
                      className="mr-2"
                      style={{ color: "#ff0042" }}
                    />
                  }
                  defaultValue={videoTitle}
                  className="rounded-lg"
                  placeholder="Task title"
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="date"
                  label="Date"
                  initialValue={dayjs()}
                  className="mb-0"
                  rules={[{ required: true, message: "Please select a date" }]}>
                  <DatePicker
                    className="w-full rounded-lg"
                    format="DD-MM-YYYY"
                    getPopupContainer={() =>
                      document
                        .getElementById("add-to-button-csui")
                        ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                    }
                    onChange={(date) => date && setPickedDate(date)}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="time"
                  label="Time"
                  className="mb-0"
                  rules={[{ required: true, message: "Please select a time" }]}>
                  <TimePicker
                    className="w-full rounded-lg"
                    getPopupContainer={() =>
                      document
                        .getElementById("add-to-button-csui")
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
                  rules={[
                    { required: true, message: "Please select a status" }
                  ]}>
                  <Select
                    className="rounded-lg w-full"
                    getPopupContainer={() =>
                      document
                        .getElementById("add-to-button-csui")
                        ?.shadowRoot?.querySelector("#plasmo-shadow-container")
                    }
                    placeholder="Select status">
                    <Select.Option value="Upcoming">Upcoming</Select.Option>
                    <Select.Option value="In Progress">
                      In Progress
                    </Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <Form.Item hidden name="video" label="Video Id">
                <Input
                  className="rounded-lg w-full"
                  defaultValue={videoId}
                  disabled
                  placeholder="Video Id"
                />
              </Form.Item>
            </Form>
            <div className="flex items-center text-xl text-gray-400 mb-1">
              <ClockCircleOutlined className="mr-2 text-2xl text-[#ff0042]/90" />
              <span>You'll receive a notification when it's time to watch</span>
            </div>
          </Modal>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main
