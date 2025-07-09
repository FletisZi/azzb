import pool from "/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id_client, id_rotina, data, exercicios_concluidos, token } = req.body;

  if (!id_client || !id_rotina || !data || !exercicios_concluidos || !token) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const result = await pool.query({
      text: `INSERT INTO historicotreino (
                id_client, id_rotina, data, exercicios_concluidos) VALUES ($1, $2, $3, $4)
              RETURNING *`,
      values: [
        id_client,
        id_rotina,
        data,
        JSON.stringify(exercicios_concluidos),
      ],
    });

    return res
      .status(201)
      .json({ dieta: result.rows, message: "Treino finalizado  com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar dieta:", error);
    return res.status(500).json({ error: "Erro interno ao salvar dieta" });
  }
}
