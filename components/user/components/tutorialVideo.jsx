import ReactPlayer from "react-player";

export default function MeuVideo() {
  return (
    <div style={{ maxWidth: "100%", aspectRatio: "16/9", margin: "0 auto" }}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=qF__8SOn6q4"
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
}
