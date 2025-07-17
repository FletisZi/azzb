import { ClipboardList, Pencil } from "lucide-react";
import styles from "./listRotina.module.css";

export default function ListaRotina({
  listaRotina,
  setActiveComponent,
  setIdRotinaSelecionada,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.containerList}>
        <button
          className={styles.btnNewRoteiro}
          onClick={() => setActiveComponent("nova-rotina")}
        >
          + Nova Rotina
        </button>
        <ul className={styles.tagUL}>
          {!listaRotina ? (
            <></>
          ) : (
            listaRotina.map((item) => (
              <li className={styles.tagLI} key={item.id}>
                <div className={styles.wrapperTitle}>
                  <div className={styles.btnEditTow}>
                    <ClipboardList strokeWidth={2} size={16} color="#FFF" />
                  </div>
                  {item.name}
                </div>
                <div
                  className={styles.btnEdit}
                  onClick={() => {
                    setIdRotinaSelecionada(item.id); // Define o ID selecionado
                    setActiveComponent("edit-rotina"); // Ativa o componente de edição
                  }}
                >
                  <Pencil strokeWidth={2} size={15} color="#FFF" />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
