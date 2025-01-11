import { ScheduleOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

import { Card } from "./Card"

interface ScheduleItem {
  id: string
  title: string
  time: string
  duration: number // in minutes
  status: string
}

const mockSchedule: ScheduleItem[] = [
  {
    id: "1",
    title: "React Hooks Tutorial",
    time: "09:00",
    duration: 45,
    status: "Upcoming"
  },
  {
    id: "2",
    title: "Next.js 13 Overview",
    time: "11:30",
    duration: 60,
    status: "Upcoming"
  },
  {
    id: "3",
    title: "Tailwind CSS Tips",
    time: "14:00",
    duration: 30,
    status: "Upcoming"
  },
  {
    id: "4",
    title: "TypeScript Best Practices",
    time: "16:30",
    duration: 45,
    status: "Upcoming"
  }
]

export function TodaySchedule() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState("Content of the modal")

  const goToPreviousDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 1)
      return newDate
    })
  }

  const goToNextDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 1)
      return newDate
    })
  }

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds")
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log("Clicked cancel button")
    setOpen(false)
  }

  return (
    <Card title="Today Schedule">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="p-1 rounded-full hover:bg-[#ffffff1a] transition-colors"
            aria-label="Previous day">
            <ChevronLeft size={20} className="text-[#aaa]" />
          </button>
          <h3 className="text-2xl font-semibold text-white">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
          </h3>
          <button
            onClick={goToNextDay}
            className="p-1 rounded-full hover:bg-[#ffffff1a] transition-colors"
            aria-label="Next day">
            <ChevronRight size={20} className="text-[#aaa]" />
          </button>
        </div>
        <div className="space-y-2">
          {mockSchedule.map((item) => (
            <ScheduleItem key={item.id} item={item} />
          ))}
        </div>
        <button
          onClick={showModal}
          className="w-full py-4 px-4 bg-[#dc3545] hover:bg-[#dc3545] text-white rounded-md flex items-center justify-center space-x-2 transition-colors"
          aria-label="Add new schedule item">
          <ScheduleOutlined className="text-3xl" />
          <span className="text-2xl">View Schedule</span>
        </button>
        <Modal
          title="Today Schedule"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          className="bg-[#0f0f0f] text-white"
          onCancel={handleCancel}>
          <p>{modalText}</p>
        </Modal>
      </div>
    </Card>
  )
}

function ScheduleItem({ item }: { item: ScheduleItem }) {
  return (
    <div className="flex items-center space-x-3 p-2 bg-[#282828] rounded-md">
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-2xl font-medium text-[#aaa]">{item.time}</span>
      </div>
      <div className="flex-grow">
        <h4 className="text-2xl font-medium text-white truncate">
          {item.title}
        </h4>
        <p className="text-xl text-[#aaa]">{item.duration} min</p>
      </div>
      <div className="bg-[#232323] text-white p-2 px-4 rounded-full">
        <span>{item.status}</span>
      </div>
    </div>
  )
}
