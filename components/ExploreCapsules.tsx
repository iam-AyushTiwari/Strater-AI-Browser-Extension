import { Button, Modal } from "antd"
import React from "react"

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
      <Button type="primary" onClick={showModal}>
        Explore Capsules
      </Button>
      <Modal
        title={<p>Explore Capsules</p>}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ position: "relative" }}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  )
}

export default ExploreCapsules
