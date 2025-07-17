export default async function handler(req, res) {
  const resposta = await fetch(
    "https://academia-treinos.vercel.app/api/show-grup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        segredo: process.env.SEGREDOTOKEN,
      }),
    }
  );

  const dados = await resposta.json();
  res.status(200).json(dados);
}
