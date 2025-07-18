import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Teste() {
  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h1>Teste Player</h1>
      <div style={{ backgroundColor: "black" }}>
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Vídeo padrão de teste
          controls
          width="100%"
          height="360px"
        />
      </div>
    </div>
  );
}
