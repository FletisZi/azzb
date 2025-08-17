import jwt from "jsonwebtoken";
import pool from "/lib/db";

export default async function insertAluno(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    const {name, number, password, status, permission, altura_cm, email, data_nascimento, id_plano} = req.body;
    const data_matricula = new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" });




    if (!name || !email || !number || !password || typeof status === 'undefined' || typeof permission === 'undefined' || typeof altura_cm === 'undefined' || !data_nascimento || !id_plano) {
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
            INSERT INTO clients (name, number, password, status, permission, altura_cm, email, data_nascimento, id_plano, data_matricula)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, name, email, number, status
        `;
        

        const values = [name, number, password, status, permission, altura_cm, email, data_nascimento, id_plano, data_matricula];

        const result = await pool.query({ text: query, values });

        return res.status(201).json(result.rows[0]);
    }catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Número já cadastrado' });
        }
        console.error("Erro ao inserir aluno:", error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }

}