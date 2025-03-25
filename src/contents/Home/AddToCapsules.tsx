import { get } from "http"
import { StyleProvider } from "@ant-design/cssinjs"
import { PlusOutlined } from "@ant-design/icons"
import {
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
  id: string
  title: string
  time: string
  duration: number
  status: string
  date: string
  videoId: string
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
  const consoleFunc = () => {
    console.log("plus icon clicked!")
  }
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
        videoId: videoId,
        time: values.time.format("HH:mm"),
        date: pickedDate.format("YYYY-MM-DD")
      }
      setScheduleItems(newScheduleItem)
      form.resetFields()
      setIsScheduleModalOpen(false)
    })
  }

  const menuItems: MenuProps["items"] = [
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
          <span onClick={() => setIsScheduleModalOpen(true)}>
            Schedule Later
          </span>
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
  const menu = <Menu items={menuItems} className="text-white bg-slate-900" />

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
            title={`Schedule Task for ${videoTitle}`}
            zIndex={9999999999999999999}
            getContainer={() =>
              document
                .getElementById("add-to-button-csui")
                ?.shadowRoot.querySelector("#plasmo-shadow-container")
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
                rules={[
                  { required: true, message: "Please enter a task title" }
                ]}>
                <Input
                  onKeyDown={handleInputKeyDown}
                  className="outline-none"
                  placeholder="Enter task title"
                  defaultValue={videoTitle}
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

              <Form.Item name="video" label="Video Id">
                <Input placeholder="Video Id" disabled defaultValue={videoId} />
              </Form.Item>
            </Form>
          </Modal>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main
