import { useEffect, useRef, useState } from "react";
import styles from "./listRefeicoes.module.css";
import axios from "axios";
import ImagemDaRefeicao from "./user/components/imagemRefeicao";

export default function ListRefeicoes({
  dados,
  setActiveComponent,
  setDataIndex,
}) {
  const totalRefeicao = dados.total_refeicao;
  const consumerRefeicao = dados.consumer_refeicao;

  const listaDeImagens = [
    {
      name: "Café da manhã",
      url: "https://media.istockphoto.com/id/825154518/pt/vetorial/red-coffee-mug-with-steam-in-flat-design-style-vector-illustration.jpg?s=612x612&w=0&k=20&c=i3u79H1iNnVqWJ1aMOTAX-iEemzoyQDKfjd2FHE4vFM=",
    },
    {
      name: "Janta",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScTRD9jo-maQtOf27bfyLlJWfs6-TXBBr8pA&s",
    },
    {
      name: "Almoço",
      url: "data:image/jpeg;base64,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",
    },
    {
      name: "outro",
      url: "https://thumbs.dreamstime.com/b/sandu%C3%ADche-triangular-isolado-em-fundo-branco-fast-food-no-estilo-de-desenho-animado-195712171.jpg",
    },
  ];

  if (totalRefeicao && typeof totalRefeicao === "object") {
    return (
      <div className={styles.container}>
        {Object.entries(totalRefeicao).map(([nome, valor], index) => {
          // Extrai calorias de total e do consumo
          const totalCalorias = valor ?? 0;
          const consumidoCalorias =
            consumerRefeicao?.[nome]?.consumototal?.calorias ?? 0;

          return (
            <ul key={nome} className={styles.ulRefeicoes}>
              <li className={styles.liRefeicoes}>
                <ImagemDaRefeicao
                  nome={nome}
                  imagemRefeicoes={listaDeImagens}
                />
                <div className={styles.wrapperText}>
                  <h2 className={styles.title}>{nome}</h2>
                  <div className={styles.values}>
                    {Number(consumidoCalorias.toFixed(2))} / {totalCalorias}{" "}
                    kcal
                  </div>
                </div>
                <a
                  className={styles.btnAddRefeicao}
                  onClick={() => {
                    setActiveComponent("editDietas");
                    setDataIndex(index);
                  }}
                >
                  +
                </a>
              </li>
            </ul>
          );
        })}
        <a
          className={styles.btnNewRefeicao}
          onClick={() => setActiveComponent("cadastroDieta")}
        >
          +
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <a
        className={styles.btnNewRefeicao}
        onClick={() => setActiveComponent("cadastroDieta")}
      >
        +
      </a>
    </div>
  );
}
