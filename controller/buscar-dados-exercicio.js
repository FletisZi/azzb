export default async function BuscarDadosExercicio(id_exercicio) {
  try {
    if (!id_exercicio) {
      throw new Error("ID do exercício não fornecido.");
    }

    const resultadoExercicios = await fetch("/api/client/proxy-show-treino", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_exercicio }),
    });

    const dados = await resultadoExercicios.json();

    if (resultadoExercicios.ok) {
      return dados;
    } else {
      console.error("Erro ao buscar exercício:", dados);
      return null;
    }
  } catch (error) {
    console.error("Erro ao conectar com API:", error);
    alert("Erro ao conectar com API: " + error.message);
    return null;
  }
}
