import { useState, useEffect } from "react"
import Zoome from "./index"
import styled from "styled-components"

export const SimpleDemo = (props: any) => {
  const [count, setCount] = useState(0)

  return (
    <div className="simple-demo" {...props} >
      {/* <h1>SimpleDemo</h1> */}
      <button onClick={() => setCount(c => c + 1)}>count + 1</button>
      <h2>{count}</h2>
      {/* <ol>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ol> */}
    </div>)
}

export const SVGDemo = (props: any) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(timeInterval);
    }
  })
  return <svg className="svg-demo" width="300" height="300" {...props}>
    <text x="50" y="50" fill="red">{time.toLocaleTimeString()}</text>
    <circle cx="100" cy="100" r="40" stroke="green" stroke-width="4" fill="yellow" />
    <rect width="300" height="300" style={{ fill: "rgba(0,0,0,0.1)", strokeWidth: 1, stroke: "black" }} />
  </svg>
}

const SimpleDemoContainer = styled.div`
  overflow: hidden;
  box-sizing: border-box;

  .simple-demo {
    background-color: rgba(0,0,0,0.1);
    border: 1px solid;
    transform-origin: left top;
    box-sizing: border-box;

    width: 200px;
    height: 200px;
  }
`

export const SimpleDemoWrapper = (props: any) => {
  useEffect(() => {
    const source = document.getElementById(props.id || "simple-demo")
    const zoome = new Zoome({
      name: "simple-demo",
      source,
      container: document.getElementById("simple-demo-wrapper"),
      ...props
    })

    return () => {
      zoome.destory()
    }
  })

  return (
    <SimpleDemoContainer id="simple-demo-wrapper">
      <SimpleDemo id="simple-demo" {...props} />
    </SimpleDemoContainer >)
}

export const SVGDemoWrapper = (props: any) => {
  useEffect(() => {
    const source = document.getElementById(props.id || "svg-demo")
    const zoome = new Zoome({
      name: "simple-demo",
      source,
      container: document.getElementById("simple-demo-wrapper"),
      ...props
    })
    return () => {
      zoome.destory()
    }
  })
  return (
    <div className="svg-demo-wrapper">
      <SVGDemo id="svg-demo" {...props} />
    </div>
  )
}
