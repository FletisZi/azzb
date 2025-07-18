import YouTube from "react-youtube";

export default function MeuVideo() {
  // O ID do vídeo é a parte depois do "v=" na URL
  const videoId = "t6vkvYZtq58";

  // Opções do player (tamanho, autoplay, etc)
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      controls: 0, // remove barra de controles
      modestbranding: 1, // tira logo grande do YouTube
      rel: 0, // vídeos relacionados só do mesmo canal
      autoplay: 0,
    },
  };

  // Evento que ocorre quando o player está pronto
  const onReady = (event) => {
    // event.target é o player do YouTube
    console.log("Player pronto!");
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
}
