import { SimpleDemoWrapper, SVGDemoWrapper } from "./demo"
import "./demo.css"

export default {
  title: "Zoome",
  component: { SimpleDemoWrapper, SVGDemoWrapper },
};

export const Simple = () => <SimpleDemoWrapper />;

export const DoubleSimple = () => <SimpleDemoWrapper matrix={{ scaleX: 2, scaleY: 2 }} />;

export const DoubleWithTransformSimple = () => <SimpleDemoWrapper style={{ transform: "translate(20px, 20px)" }} matrix={{ scaleX: 2, scaleY: 2 }} />;

export const HalfSimple = () =>
  <SimpleDemoWrapper
    style={{
      transform: "translate(20px, 20px) scale(2) ",
      transformOrigin: "left top"
    }}
    matrix={{ scaleX: 0.5, scaleY: 0.5 }}
    mode="zoomout"
  />;

export const Svg = () => <SVGDemoWrapper />;

export const DoubleSvg = () => <SVGDemoWrapper
  transform="translate(100, 100) scale(1)"
  style={{ transformOrigin: "0 0" }}
  matrix={{ scaleX: 2, scaleY: 2 }} />;

export const HalfSvg = () =>
  <SVGDemoWrapper
    style={{ transformOrigin: "0 0" }}
    transform="translate(0, 0) scale(2)"
    matrix={{ scaleX: 0.5, scaleY: 0.5 }}
    mode="zoomout"
  />;
