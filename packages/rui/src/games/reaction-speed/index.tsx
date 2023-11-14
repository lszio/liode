import { useState, useEffect, useRef } from "react";
import { Container, Box } from "./styles.css";

enum Phase {
  WAIT,
  PEND,
  REACT,
  DONE
}

export function ReactionSpeed({ style }: { style: React.CSSProperties }) {
  const [phase, setPhase] = useState(Phase.WAIT);
  const [time, setTime] = useState(+new Date());
  const [records, setRecords] = useState<Record<string, number>[]>([]);
  const [content, setContent] = useState("Click to Start");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const classMapper = {
    [Phase.WAIT]: "wait",
    [Phase.PEND]: "pend",
    [Phase.REACT]: "react",
    [Phase.DONE]: "done"
  };

  useEffect(() => {
    setContent(() => {
      switch (phase) {
        case Phase.WAIT:
          return "Click to start";
        case Phase.PEND:
          return "Please wait";
        case Phase.REACT:
          return "Click now!";
        case Phase.DONE:
          return "Continue?";
      }
    });
  });

  const doTest = () => {
    if (phaseRef.current === Phase.PEND) {
      setTime(+new Date());
      setPhase(Phase.REACT);
    } else {
      console.log("Abort");
    }
  };

  const doContinue = () => {
    if (phaseRef.current === Phase.DONE) {
      setPhase(Phase.PEND);
      setTimeout(doTest, Math.random() * 1000 + 500);
    } else {
      console.log("Abort");
    }
  };

  const handleClickPadding = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setPhase(Phase.WAIT);
  };

  const handleClickBox = (e: React.MouseEvent) => {
    e.stopPropagation();

    switch (phase) {
      case Phase.WAIT:
        setPhase(Phase.PEND);
        setTimeout(doTest, Math.random() * 1000 + 500);
        return;
      case Phase.PEND:
        setPhase(Phase.WAIT);
        return;
      case Phase.REACT:
        setPhase(Phase.DONE);
        console.log(+new Date() - time);
        setRecords([{ start: time, end: +new Date() }, ...records]);
        setTimeout(doContinue, 1500);
        return;
      case Phase.DONE:
        setPhase(Phase.WAIT);
        return;
    }
  };

  return (
    <section className={Container} onClick={handleClickPadding} style={style}>
      <div className={Box + " " + classMapper[phase]} onClick={handleClickBox}>
        <span>
          {content}
        </span>
        <div>
          {records.map(({ start, end }: Record<string, number>) => end - start + " ")}
        </div>
      </div>
    </section>
  );
}

export default ReactionSpeed;
