import { useState, useEffect, useRef } from "react";
// import { Container, Box } from "./styles.css";

enum Phase {
  WAIT,
  PEND,
  REACT,
  DONE,
}

export function ReactionSpeed() {
  const [phase, setPhase] = useState(Phase.WAIT);
  const [time, setTime] = useState(+new Date());
  const [records, setRecords] = useState<Record<string, number>[]>([]);
  const [content, setContent] = useState("Click to Start");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // const classMapper = {
  //   [Phase.WAIT]: "wait bg-blue",
  //   [Phase.PEND]: "pend bg-red",
  //   [Phase.REACT]: "react bg-yellow",
  //   [Phase.DONE]: "done bg-green",
  // };

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
  }, [phase]);

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
    <section
      className={
        "flex text-center flex-col w-full h-full cursor-pointer justify-around"
      }
      onClick={handleClickPadding}
    >
      <div
        className={
          "mx-4 my-10% w-80% flex-1 bg-white rd-4 flex flex-col justify-around " +
          // classMapper[phase]
          (phase === Phase.REACT
            ? "react bg-green"
            : phase === Phase.PEND
            ? "pend bg-yellow"
            : phase === Phase.DONE
            ? "done bg-red"
            : "")
        }
        onClick={handleClickBox}
      >
        <span>{content}</span>
        <div>
          {records.map(
            ({ start, end }: Record<string, number>) => end - start + " "
          )}
        </div>
      </div>
    </section>
  );
}

export default ReactionSpeed;
