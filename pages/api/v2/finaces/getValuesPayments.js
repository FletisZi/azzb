import database from '/lib/db.js';
export default async function getValuesPayments(req, res) {

    if (req.method !== "POST") return res.status(405).end("Método não permitido");

    const { dataInicio, dataFim } = req.body;

    // if (!SEGREDOTOKEN || SEGREDOTOKEN !== process.env.SEGREDOTOKEN) {
    //     console.log(SEGREDOTOKEN, process.env.SEGREDOTOKEN);
    //     console.log(req.body)
    // return res.status(400).json({ error: "Você não tem permissão para acessar este recurso" });
    // }

    if (!dataInicio || !dataFim) {
        return res.status(400).json({ error: "Parâmetros dataInicio e dataFim são obrigatórios" });
    }


    // const dataInicio = '2023-12-31';
    // const dataFim = '2025-12-31';
  try {
    const result = await database.query({
        text: `
            SELECT 
            forma_pagamento, 
            SUM(valor) AS total_pago
            FROM pagamentos
            WHERE data_pagamento BETWEEN $1 AND $2
            GROUP BY forma_pagamento
        `,
        values: [dataInicio, dataFim]
    });

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching payment values:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
