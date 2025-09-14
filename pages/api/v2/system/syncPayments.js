import database from "/lib/db.js"; 

export default async function syncPayments(req, res) {
  if (req.method !== "POST") return res.status(405).end("Método não permitido");

  const { SEGREDOTOKEN } = req.body;

  if (!SEGREDOTOKEN || SEGREDOTOKEN !== process.env.SEGREDOTOKEN) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    // Atualiza mensalidades
    const result = await database.query({
      text: `
        UPDATE mensalidades m
        SET status = 'paga'
        FROM pagamentos p
        WHERE m.id = p.id_mensalidade
          AND m.status <> 'paga'
          AND p.data_pagamento >= CURRENT_DATE - INTERVAL '7 days'
        RETURNING m.id;
      `,
    });

    let atlzRegistro = null;

    await updateNow();
    await updateStatusMensalidades();

    console.log(`Sincronização concluída. ${result.rowCount} mensalidades atualizadas.`);

    return res.status(200).json({
      success: true,
      updated: result.rowCount,
      ids: result.rows.map(r => r.id),
      atlz: atlzRegistro,
    });

  } catch (error) {
    console.error("Erro ao sincronizar pagamentos:", error);
    return res.status(500).json({ success: false, error: "Erro no servidor" });
  }
}

async function updateStatusMensalidades() {
  try {
    // Atualiza mensalidades pendentes para vencidas quando a data de vencimento já passou
    const result = await database.query({
      text: `
        UPDATE mensalidades
        SET status = 'atrasada'
        WHERE status = 'pendente'
          AND data_vencimento <= CURRENT_DATE
        RETURNING id, status, data_vencimento;
      `,
    });

    console.log(`${result.rowCount} mensalidades atualizadas para vencida.`);
    return {
      success: true,
      updatedCount: result.rowCount,
      updatedRows: result.rows,
    };

  } catch (error) {
    console.error("Erro ao atualizar status das mensalidades:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function updateNow() {
    // Gera a data no timezone São Paulo
    const formatter = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "America/Sao_Paulo",
    });
    const hojeSP = formatter.format(new Date()); // formato YYYY-MM-DD

    // Insere registro na atlz_pagamento
    const atlz = await database.query({
        text: `
        INSERT INTO atlz_pagamento (data_atualizacao)
        VALUES ($1)
        RETURNING id, data_atualizacao;
        `,
        values: [hojeSP],
    });

    const atlzRegistro = atlz.rows[0];
}