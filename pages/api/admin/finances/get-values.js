import database from '/lib/db.js';

export default async function getValuesPayments(req, res) {
  try {
    const total_receita = 10;
    const total_despesa = 10;
    const saldo = total_receita - total_despesa; // ou qualquer lógica sua

    const result = await database.query({
      text: `
        UPDATE finance_summary
        SET 
          total_receita = $1,
          total_despesa = $2,
          saldo = $3
        WHERE id = 1
        RETURNING *;
      `,
      values: [total_receita, total_despesa, saldo],
    });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return res.status(500).json({ error: 'Erro ao atualizar resumo financeiro' });
  }
}
