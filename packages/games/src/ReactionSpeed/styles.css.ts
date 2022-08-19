import { style, globalStyle } from "@vanilla-extract/css";

export const Container = style({
  display: "flex",
  flexFlow: "column",
  justifyContent: "space-around",
  textAlign: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "#efefef",
  cursor: "pointer"
});

export const Box = style({
  margin: "1rem 10%",
  width: "80%",
  flex: 1,
  backgroundColor: "white",
  borderRadius: "1rem",
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "space-around",
  selectors: {
    "&.pend": {
      backgroundColor: "#b9dec9"
    },
    "&.react": {
      backgroundColor: "#f0c9cf"
    },
    "&.done": {
      backgroundColor: "#b0d5df"
    }
  }
});

globalStyle(`${Container} > ${Box}`, {
  color: "blue"
});
