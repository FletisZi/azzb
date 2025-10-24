import { useState } from "react";

export default function newDespesa(){
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [type, setType] = useState("fixa");
    const [data_lancamento, setDataLancamento] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/admin/finances/insert-despesas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, value, type, data_lancamento }),
        });

        const data = await res.json();

        console.log(data);
    }
    return (
        <div>
            <h1>Nova Despesa</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input type="text" name="name" value={name}
          onChange={(e) => setName(e.target.value)}/>
                </label>
                <label>
                    Valor:
                    <input type="number" name="value" value={value}
          onChange={(e) => setValue(e.target.value)}/>
                </label>
                <label>
                    Tipo:
                    <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="fixa">Fixa</option>
                        <option value="variavel">Variável</option>
                    </select>
                </label>
                <label>
                    Data:
                    <input type="date" name="data_lancamento" value={data_lancamento}
          onChange={(e) => setDataLancamento(e.target.value)}/>
                </label>
                <button type="submit">Adicionar Despesa</button>
            </form>
        </div>
    );
}