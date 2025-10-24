import database from '/lib/db.js';
export default async function getParcelasvencidas(req, res) {
    try{
        const result = await database.query({
            text: `
            SELECT COUNT(*) FROM mensalidades WHERE id_cliente = $1 and status = 'atrasada';
            `,
            values: [2]
        });
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching overdue installments:', error);
        return res.status(500).json({ error: 'Internal Server Error' });    
    }
    
}