import React from "react";
import styles from "../../listRefeicoes.module.css"; // ajuste o nome do CSS se necessário

export default function ImagemDaRefeicao({ nome, imagemRefeicoes }) {
  // Busca a imagem correspondente ao nome
  const imagemSelecionada = imagemRefeicoes.find((i) => i.name === nome);

  return (
    <img
      src={
        imagemSelecionada
          ? imagemSelecionada.url
          : "https://thumbs.dreamstime.com/b/sandu%C3%ADche-triangular-isolado-em-fundo-branco-fast-food-no-estilo-de-desenho-animado-195712171.jpg"
      }
      alt={`imagem ${nome}`}
      className={styles.iconeRefeicao}
    />
  );
}
