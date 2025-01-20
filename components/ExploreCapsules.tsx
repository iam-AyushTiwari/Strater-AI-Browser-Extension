import { Button, Modal } from "antd"
import React from "react"
import { MdExplore } from "react-icons/md"

const ExploreCapsules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<MdExplore />}>
        Explore
      </Button>
      <Modal
        title={<p>Explore Capsules</p>}
        footer={null}
        open={isModalOpen}
        zIndex={999999999999}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer={() => document.body}
        style={{ position: "relative" }}>
        <div className="w-full p-40 text-white flex flex-col gap-4 justify-center items-center">
          <h1 className=" text-4xl font-extrabold">Coming Soon..</h1>
          <span className="text-zinc-700 text-2xl">
            We're working nonstop to bring you an amazing experience
          </span>
        </div>
      </Modal>
    </>
  )
}

export default ExploreCapsules
