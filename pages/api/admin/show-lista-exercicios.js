export default async function handler(req, res) {
  const { id_grupo } = req.body;

  const resposta = await fetch(
    "https://academia-treinos.vercel.app/api/show-treinos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_grupo,
        segredo: process.env.SEGREDOTOKEN,
      }),
    }
  );

  const dados = await resposta.json();
  res.status(200).json(dados);
}
