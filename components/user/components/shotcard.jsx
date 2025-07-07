export default function ShortCard() {
  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        margin: "16px auto",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/BQUTDJgOnvw"
        title="Exercício Peitoral"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
