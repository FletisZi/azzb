import { text } from 'express';
import database from '/lib/db.js';

export default async function insertDespesas(req, res) {
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }

    const { name, value, type, data_lancamento } = req.body;

    console.log(name, value, type, data_lancamento);

    if (!name || !value || !data_lancamento) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await database.query(
            {
                text:`INSERT INTO lancamento_dispesa (name, value, type, data_lancamento)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, value, type, data_lancamento`,
                values: [name, value, type, data_lancamento]
            }
            
        );
        return res.status(201).json({ message: 'Despesa inserida com sucesso' });
    } catch (error) {
        console.error('Error inserting despesa:', error);
        return res.status(500).json({ error: 'Erro ao inserir despesa' });
    }
}