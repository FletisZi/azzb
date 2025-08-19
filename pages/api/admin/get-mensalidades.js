import jwt from "jsonwebtoken";
import pool from "/lib/db";

export default async function statusMensalidades(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  const { id_client, mes} = req.body;

    if ( !mes) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ error: 'Token inválido' });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }   
    
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM mensalidades WHERE EXTRACT(MONTH FROM data_vencimento) = $1 AND status = 'paga') AS mensalidades_pagas,
        (SELECT COUNT(*) FROM mensalidades WHERE EXTRACT(MONTH FROM data_vencimento) = $1 AND status = 'a vencer') AS mensalidades_a_vencer,
        (SELECT COUNT(*) FROM mensalidades WHERE EXTRACT(MONTH FROM data_vencimento) = $1 AND status = 'atrasada') AS mensalidades_atraso,
        (SELECT COUNT(*) FROM clients WHERE status = true) AS alunos_ativos
    `;

    const result = await pool.query({
      text: query,
      values: [mes],
    });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro na API showDieta:", error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}