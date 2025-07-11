import { jwtDecode } from "jwt-decode";
import pool from "/lib/db";

export default async function showHistoryTreino(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id_client, token } = req.body;

  try {
    const decoded = jwtDecode(token);
    const userIdFromToken = String(decoded.id);

    if (userIdFromToken !== String(id_client)) {
      return res.status(403).json({ error: "Usuário não autorizado" });
    }

    const query = `
        SELECT *
        FROM tabelatreino
        WHERE id_client = $1
        
    `;

    const result = await pool.query({
      text: query,
      values: [id_client],
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
