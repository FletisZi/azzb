import { useState } from "react";
import styles from "./listaExercicios.module.css";

export default function ListaDeExercicios({
  listaExercicios,
  setListaExercicios,
  listaMeuExercicios,
  setListaMeuExercicios,
}) {
  const [filtro, setFiltro] = useState(""); // <- campo de busca

  const adicionarExercicio = (item) => {
    const jaExiste = listaMeuExercicios.some((ex) => ex.id === item.id);
    if (jaExiste) return;

    const itemPadronizado = {
      ...item,
      series: item.series > 0 ? item.series : 3,
      repeticoes: item.repeticoes > 0 ? item.repeticoes : 12,
      observacao: item.observacao ?? "", // se você quiser garantir isso também
    };

    setListaMeuExercicios([...listaMeuExercicios, itemPadronizado]);
  };

  const listaFiltrada = listaExercicios.filter((item) =>
    item.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Pesquisar exercício..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={styles.buscarExercicios}
      />

      {/* Lista filtrada */}
      <div className={styles.container}>
        {listaFiltrada.length === 0 && (
          <p style={{ fontStyle: "italic" }}>Nenhum exercício encontrado.</p>
        )}

        {listaFiltrada.map((item) => (
          <div key={item.id} className={styles.itens}>
            {item.name}
            <button
              onClick={() => adicionarExercicio(item)}
              className={styles.btnSalvar}
            >
              Incluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
