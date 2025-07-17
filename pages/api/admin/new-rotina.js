import { jwtDecode } from "jwt-decode";
import pool from "/lib/db";

export default async function newRotina(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, data_inicio, data_final, objetivo_dieta, id_client, token } =
    req.body;

  if (!id_client || !token || !data_inicio || !data_final || !objetivo_dieta) {
    return res.status(400).json({ error: "Dados incompletos ou inválidos" });
  }

  try {
    const { permission } = jwtDecode(token);

    if (String(permission) !== "admin") {
      return res.status(403).json({ error: "Usuário não autorizado" });
    }

    const query = `
      INSERT INTO rotina (
  
            name,
            data_inicio,
            data_final,
            objetivo_dieta,
            id_client
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
    `;

    const result = await pool.query({
      text: query,
      values: [name, data_inicio, data_final, objetivo_dieta, id_client],
    });

    return res
      .status(200)
      .json({ success: true, message: "Rotina salva com sucesso" });
  } catch (error) {
    console.error("Erro na API updateExercicios:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
