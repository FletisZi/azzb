import { jwtDecode } from "jwt-decode";
import pool from "/lib/db";

export default async function showRotinaUnit(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id_client, token, id_rotina } = req.body;

  console.log(id_client);

  if (!id_client) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const { permission } = jwtDecode(token);

    if (String(permission) !== "admin") {
      return res.status(403).json({ error: "Usuário não autorizado" });
    }
    const query = `SELECT * FROM rotina WHERE id = $1`;

    const result = await pool.query({
      text: query,
      values: [id_rotina],
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
