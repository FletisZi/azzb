export default async function BuscarListaExercicio(id, token) {
  try {
    const payload = {
      id_client: parseInt(id),
      token,
    };

    const res = await fetch("/api/client/show-rotina", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      console.error("Erro ao buscar rotina:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Erro ao conectar com API:", error);
    alert("Erro ao conectar com API");
    return [];
  }
}
