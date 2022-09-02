import { useState } from "react"

export default function TestReact() {
  const [now, setNow] = useState(new Date())
  const handleClick = (e) => {
    console.log("click")
  }
  return (<div className="test-react" onClick={handleClick}>TestReact{now.toLocaleTimeString()}</div>)
}
