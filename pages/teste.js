import HomeFinancas from "components/admin/financa/home";
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
      <HomeFinancas />
    </div>
  );
}
