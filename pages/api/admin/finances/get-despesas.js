import database from '/lib/db.js';
export default async function insertDespesas(req, res) { 
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method não permitido' });
    }

    try {
        const result = await database.query(
            {
                text: `
                SELECT 
                SUM(valor) AS total_dispesa,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', id,
                        'descricao', descricao,
                        'valor', valor,
                        'data_lancamento', data_lancamento
                    )
                ) AS lista_despesa
                FROM lancamento_dispesa
                WHERE 
                    EXTRACT(MONTH FROM (data_lancamento AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')) = 
                        EXTRACT(MONTH FROM (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'))
                AND
                    EXTRACT(YEAR FROM (data_lancamento AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')) = 
                        EXTRACT(YEAR FROM (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'));
                `,
            }
        );
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching despesas:', error);
        return res.status(500).json({ error: 'Erro ao buscar despesas' });
    }
}