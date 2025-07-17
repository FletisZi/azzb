import { ClipboardList, Pencil } from "lucide-react";
import styles from "./listRotina.module.css";

export default function ListRotina({
  listaRotina,
  setActiveComponent,
  setIdRotinaSelecionada,
}) {
  return (
    <div className={styles.containerList}>
      <button
        className={styles.btnNewRoteiro}
        onClick={() => setActiveComponent("nova-rotina")}
      >
        + Adicionar
      </button>
      <ul className={styles.tagUL}>
        {!listaRotina ? (
          <></>
        ) : (
          listaRotina.map((item) => (
            <li className={styles.tagLI} key={item.id}>
              <div className={styles.iconList}>
                <ClipboardList size={16} />
              </div>
              {item.name}
              <div
                className={styles.iconList}
                onClick={() => {
                  setIdRotinaSelecionada(item.id); // Define o ID selecionado
                  setActiveComponent("edit-rotina"); // Ativa o componente de edição
                }}
              >
                <Pencil size={12} />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
