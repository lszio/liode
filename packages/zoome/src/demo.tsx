import { useState, useEffect } from "react"
import Zoome, { SVGZoome } from "./index"
import styled from "styled-components"

export const SimpleDemo = (props: any) => {
  const [count, setCount] = useState(0)

  return (
    <div className="simple-demo" {...props} >
      <button onClick={() => setCount(c => c + 1)}>count + 1</button>
      <h2>{count}</h2>
    </div>)
}

export const SVGDemo = (props: any) => {
  const [count, setCount] = useState(0)

  return <svg className="svg-demo" width="200" height="200"  {...props}>
    <circle cx="100" cy="100" r="40" stroke="green" stroke-width="4" fill="yellow" />
    <text x="100" y="100" fill="red" >{count}</text>
    <rect width="200" height="200" onClick={() => setCount(c => c + 1)}
      style={{ fill: "rgba(0,0,0,0.1)", strokeWidth: 1, stroke: "black" }} />
  </svg>
}

const SimpleDemoContainer = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid blue;
  width: 200px;
  height: 200px;

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
    const zoome = new SVGZoome({
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
    <SimpleDemoContainer className="svg-demo-wrapper">
      <SVGDemo id="svg-demo" {...props} />
    </SimpleDemoContainer>
  )
}
