console.log("HELLO WORLD FROM BGSCRIPTS")

const fetchData = async () => {
  try {
    const response = await fetch("https://strater-app.vercel.app/api/User/fetch_me", {
      method: "GET",
      credentials: "include"
    })
    const data = await response?.json()
    // Assuming setUser is defined elsewhere
    console.log("user ******", data)
  } catch (error) {
    console.error("Error fetching user data:", error)
  }
}
 
fetchData()

