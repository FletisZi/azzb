import { jwtDecode } from "jwt-decode";
import pool from "/lib/db";

export default async function updateExercicios(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id_client, token, exercicios, id_rotina } = req.body;

  if (!id_client || !Array.isArray(exercicios)) {
    return res.status(400).json({ error: "Dados incompletos ou inválidos" });
  }

  try {
    const { permission } = jwtDecode(token);

    if (String(permission) !== "admin") {
      return res.status(403).json({ error: "Usuário não autorizado" });
    }

    // Montar o objeto conforme o padrão exigido
    const exerciciosObjeto = { exercicios: exercicios };

    // Atualizar a coluna exercicios com o JSON.stringify
    const query = `
      UPDATE rotina 
      SET exercicios = $1
      WHERE id = $2
    `;

    const result = await pool.query({
      text: query,
      values: [JSON.stringify(exerciciosObjeto), id_rotina],
    });

    return res
      .status(200)
      .json({ success: true, message: "Exercícios atualizados com sucesso" });
  } catch (error) {
    console.error("Erro na API updateExercicios:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
