import React from "react"

const Button = () => {
  return (
    <div
      onClick={() => {
        alert("Hello World!")
      }}
      style={{
        color: "white",
        backgroundColor: "#ff0042",
        paddingInline: "20px",
        marginLeft: "20px",
        borderRadius: "18px",
        cursor: "pointer"
      }}>
      <p style={{ font: "bold", fontSize: "13px" }}>Explore Capsules</p>
    </div>
  )
}

export default Button
