import Select, { Option } from "rc-select";
import { css } from "@emotion/css";
import { useState } from "react";

export function RcSelectIconOption() {
  const [value, setValue] = useState<string>("default");
  return (
    <Select
      className={css({
        backgroundColor: "rgba(255, 255, 255, 0.5)"
      })}
      dropdownClassName={css({
        display: "none"
      })}
      value={value}
    >
      <Option value="asdfg">sdg</Option>
    </Select>
  );
}

export function CustomDropdown() {
  return <div className={css({
    [".dropdown"]: {
      display: "none",
      position: "absolute"
    },
    ["&:hover .dropdown"]: {
      display: "block"
    }
  })}>
    <button>Click</button>
    <div className="dropdown">
      <ul>
        <li>first</li>
        <li>second</li>
        <li></li>
      </ul>
    </div>
  </div>;
}

export default function RcSelectArena() {
  return (
    <div>
      <CustomDropdown />
      <RcSelectIconOption />
    </div>
  );
}
