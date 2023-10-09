import { css } from "@emotion/css";

export function SimpleSvg() {
  return (
    <svg width="100" height="100">
      <rect x="0" y="0" width="10" height="10" fill="blue"></rect>
    </svg>
  );
}

export function MultipleLineText() {
  return (
    <svg
      width={200}
      height={200}
      className={css({
        backgroundColor: "red",
        "text, tspan": {
          fill: "black",
        },
      })}
    >
      <text x="0" y="0" fontSize="15" dy="0" onClick={e => {
        console.log("click text")
      }}>
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

export default function SvgMisc() {
  return (
    <div>
      <SimpleSvg />
      <MultipleLineText />
    </div>
  );
}
