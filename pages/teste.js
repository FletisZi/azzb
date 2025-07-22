import MeuVideo from "components/user/components/tutorialVideo";
import { CircleX } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [videoStatus, setVideoStatus] = useState(false);
  const [idVideo, setIdVideo] = useState('1103451910');
  const abrirVideo = () => {
    setVideoStatus(true);
  };

  return (
    <div>
      {" "}
      {videoStatus && (
        <MeuVideo idvideo={idVideo} setVideoStatus={setVideoStatus} />
      )}{" "}
      <button onClick={abrirVideo}>
        <CircleX color={"#ffffff"} />
      </button>
    </div>
  );
}
