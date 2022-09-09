import React from "react";
import { SimpleDemoWrapper, SVGDemoWrapper } from "./demo.tsx"
import "./demo.css"

export default {
  title: "Zoome",
  component: { SimpleDemoWrapper, SVGDemoWrapper },
};

export const Simple = () => <SimpleDemoWrapper />;

export const DoubleSimple = () => <SimpleDemoWrapper matrix={{ scaleX: 2, scaleY: 2 }} />;

export const HalfSimple = () =>
  <SimpleDemoWrapper
    style={{
      transform: "scale(2) translate(5px, 5px)",
      transformOrigin: "left top"
    }}
    matrix={{ scaleX: 0.5, scaleY: 0.5 }}
    mode="zoomout"
  />;

export const Svg = () => <SVGDemoWrapper />;

export const DoubleSvg = () => <SVGDemoWrapper matrix={{ scaleX: 2, scaleY: 2 }} />;

export const HalfSvg = () =>
  <SVGDemoWrapper
    style={{ transform: "scale(3) translate(10px, 10px)" }}
    matrix={{ scaleX: 0.5, scaleY: 0.5 }}
    mode="zoomout"
  />;
