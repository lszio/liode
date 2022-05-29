import { useState } from "react"
import styled, { css, keyframes } from "styled-components";
import { Board } from "../../layout/index"

const Box = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: space-between;
  background-color: ${(props) => props.color || "#efefef"};
`;

const Container  = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #efefef;
`

const Prompt = () => {
  return (<div>Prompt</div>);
};

const Body = styled.div`
  flex-basis: 100%;
  flex-grow: 1
`

export function ReactionSpeed({
  mode = "simple",
}) {
  const colorMapper = {
    prepare: "white",
    ready: "yellow",
    react: "red",
    complete: "green"
  }
  const [ stage, setStage ] = useState("prepare");
  const [ history,  setHistory ] = useState([]);
  const [ time, setTime ] = useState(+new Date());
  const [ color, setColor ] = useState("white");

  const doTest = () => {
    setStage("ready")
    setColor("yellow")
    setTimeout(() => {
      setStage("react")
      setTime(+new Date())
      setColor("red")
    }, Math.random() * 1000 + 500)
  }

  const doReact = () => {
    if(stage === "react") {
      const spend = new Date() - time;
      setHistory([...history, spend])
      setStage("complete")
      setColor("green")
    }
  }

  const stopTest = () => {
    setStage("prepare")
    setColor("white")
  }

  return (
    <Container>
      <Box stage={stage} color={color} onClick={doReact}>
        <Body>{ history[history.length - 1] }, Average: { history.reduce((s, i) => s + i, 0) / history.length }</Body>
        {(() => {
          switch(stage) {
            case "prepare":
              return <button onClick={doTest}>start</button>
            case "complete":
              return (<div><button onClick={stopTest}>stop</button> <button onClick={doTest}>continue</button></div>)
            default:
              return null;
          }
        })()}
      </Box>
    </Container>
  );
}
