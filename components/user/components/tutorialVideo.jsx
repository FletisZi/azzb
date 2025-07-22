import { CircleX } from "lucide-react";
import styles from "./tutorialVideo.module.css";

export default function MeuVideo({ idvideo, setVideoStatus }) {
  const url = `https://player.vimeo.com/video/${idvideo}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1`;

  const fechar = () => {
    setVideoStatus(false);
  };

  return (
    <div className={styles.containerTutorial}>
      <button className={styles.btnClose} onClick={fechar}>
        <CircleX color={"#ffffff"} />
      </button>

      <div className={styles.container}>
        <iframe
          src={url}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          title="Supino Reto na maquina"
        ></iframe>
      </div>
    </div>
  );
}
