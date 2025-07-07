export default function ShortThumbnail() {
  return (
    <div
      style={{
        width: "300px",
        height: "auto",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        margin: "16px auto",
      }}
    >
      <img
        src="https://img.youtube.com/vi/BQUTDJgOnvw/hqdefault.jpg"
        alt="Capa do Short"
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
}
