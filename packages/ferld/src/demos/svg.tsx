import { css } from "@emotion/css";

const onCopy = (e: any) => {
  console.log("onCopy");
  e.clipboardData?.setData("text/plain", "emacs");
  e.preventDefault();
};

const onPaste = (e: any) => {
  console.log("onPaste");
  navigator.clipboard.readText().then(console.log);
};

export function SimpleSvg(props = { title: "Simple SVG" }) {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={css({
        "text, tspan": {
          fill: "black",
        },
        rect: {
          fill: "pink",
        },
      })}
    >
      <rect x="0" y="0" width="100" height="100" fill="blue"></rect>
      <text x="0" y="15">
        {props.title}
      </text>
      <text
        x="0"
        y="30"
        dy="0"
        fontSize="12"
        onClick={(e) => {
          console.log("click text");
        }}
      >
        <tspan x="0" dy="1.2em">
          tspan line 1
        </tspan>
        <tspan x="0" dy="1.2em">
          tspan line 2
        </tspan>
        <tspan x="0" dy="1.2em">
          tspan line 3
        </tspan>
      </text>
    </svg>
  );
}

export function WithDraggableWrapper() {
  return (
    <div
      tabIndex={-1}
      onDragStart={() => {
        console.log("dragStart");
      }}
      draggable
      onCopy={onCopy}
      onPaste={onPaste}
    >
      <SimpleSvg title="Draggable Wrapper" />
    </div>
  );
}

export function WithDraggableForeignObject() {
  return (
    <div
      className={css({
        svg: {
          backgroundColor: "#2222",
        },
        div: {
          width: "100%",
          height: "100%",
          backgroundColor: "pink",
        },
      })}
      onCopy={onCopy}
      onPaste={onPaste}
    >
      <svg
        viewBox="0 0 100 30"
        width="300"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="0" y="0" width="50" height="50">
          <div draggable>test</div>
        </foreignObject>
        <text fill="transparent">emacs</text>
      </svg>
    </div>
  );
}

export default function Overview() {
  return (
    <div
      className={css({
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-evenly",
      })}
    >
      <SimpleSvg title={""} />
      <WithDraggableWrapper />
      <WithDraggableForeignObject />
    </div>
  );
}
