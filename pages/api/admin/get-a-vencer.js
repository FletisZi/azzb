import jwt from "jsonwebtoken";
import pool from "/lib/db";

export default async function showDieta(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  const { id_client, mes, status} = req.body;

    console.log('id do clienteeee: ', token);
    if ( !mes || !status) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    // Aqui você pode validar o token se necessário

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }   


  try {
    const query = `
      SELECT COUNT(*) AS quantidade
      FROM mensalidades
      WHERE EXTRACT(MONTH FROM data_vencimento) = $1 AND status = $2
    `;

    const result = await pool.query({
      text: query,
      values: [mes, status],
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}