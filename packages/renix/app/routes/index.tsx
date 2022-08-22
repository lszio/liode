import { useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai"


export default function Index() {
  const [fullScreen, setFullScreen] = useState(true);

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  }

  return (
    <div className={"h-full w-full bg-stone-900 " + (fullScreen ? "fixed top-0 left-0" : " ")}>
      <div className="text-slate-50 text-2xl float-right">
        {
          fullScreen ?
            <AiOutlineFullscreenExit onClick={toggleFullScreen} /> :
            <AiOutlineFullscreen onClick={toggleFullScreen} />
        }
      </div>
    </div>
  );
}
