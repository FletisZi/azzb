import database from "/lib/db.js"; 

export default async function verifyPaymentsUpdate(req, res) {
  try {
    const result = await database.query({
      text: `
        SELECT EXISTS (
          SELECT 1 
          FROM atlz_pagamento 
          WHERE data_atualizacao::date = CURRENT_DATE
        ) AS updated
      `,
    });

    if (result.rows[0].updated) {
      return res.status(200).json({ success: true });
    } else {
        // Chamar a API de sincronização de pagamentos
        const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

        const resSync = await fetch(`${baseUrl}/api/v2/system/syncPayments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                SEGREDOTOKEN: process.env.SEGREDOTOKEN
            }),
        });

        return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Erro ao verificar pagamentos:", error);
    return res.status(500).json({ success: false, error: "Erro no servidor" });
  }
}
