export default async function handler(req, res) {
  const { id_exercicio } = req.body;

  const resposta = await fetch(
    "https://academia-treinos.vercel.app/api/show-treino",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_exercicio,
        segredo: process.env.SEGREDOTOKEN, // só visível no servidor
      }),
    }
  );

  const dados = await resposta.json();
  res.status(200).json(dados);
}
