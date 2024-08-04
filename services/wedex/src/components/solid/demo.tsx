import { useStore } from "@nanostores/solid";
import { createSignal, onCleanup } from "solid-js";
import { $count } from "../../store";

export default function SolidDemo() {
  const globalCount = useStore($count);
  const [getCount, setCount] = createSignal(0);
  const interval = setInterval(() => {
    setCount((count) => count + 1);
    $count.set(globalCount() + 1);
  }, 1000);

  onCleanup(() => clearInterval(interval));

  return (
    <div>
      Solid Demo: local count: {getCount()}; global count: {globalCount()}
    </div>
  );
}