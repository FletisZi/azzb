import pool from "/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, quantidadeMeses, valorMensalidade } = req.body;

  if (!userId || !quantidadeMeses || !valorMensalidade) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const mensalidades = [];
    const hoje = new Date();

    for (let i = 0; i < quantidadeMeses; i++) {
      let vencimento;
      if (i === 0) {
        vencimento = new Date(hoje);
      } else {
        vencimento = new Date(hoje);
        vencimento.setMonth(hoje.getMonth() + i);
        vencimento.setDate(17);
      }

      mensalidades.push({
        userId,
        valor: valorMensalidade,
        vencimento,
        status: 'pendente',
      });
    }

    // Montar placeholders ($1, $2, $3, ...) para query
    const values = [];
    const placeholders = mensalidades
      .map((m, idx) => {
        const base = idx * 4;
        values.push(m.userId, m.valor, m.vencimento, m.status);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
      })
      .join(", ");

    const query = `
      INSERT INTO mensalidades (id_cliente, valor, data_vencimento, status)
      VALUES ${placeholders}
      RETURNING id, id_cliente, valor, data_vencimento, status
    `;

    const result = await pool.query({ text: query, values });

    res.status(201).json({ success: true, created: result.rows });
  } catch (error) {
    console.error("Erro ao inserir mensalidades:", error);
    res.status(500).json({ error: error.message });
  }
}
