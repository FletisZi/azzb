import database from "/lib/db.js";

export default async function showMensalidades(req, res) {
    try {
        const result = await database.query({
            text: `
                SELECT * FROM mensalidades
                WHERE id_cliente = $1
            `,
            values: [2],
        });
        res.status(200).json({ message: "Rota de mostrar mensalidades", data: result.rows });
    } catch (error) {
        console.error("Erro ao mostrar mensalidades:", error);
        res.status(500).json({ success: false, error: "Erro no servidor" });
    }
}