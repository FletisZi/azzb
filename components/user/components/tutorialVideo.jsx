import YouTube from "react-youtube";
import styles from "./MeuVideo.module.css";

export default function MeuVideo() {
  const videoId = "t6vkvYZtq58";

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      autoplay: 0,
    },
  };

  return (
    <div className={styles.videoContainerVertical}>
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
}
