import ListaDeExercicios from "components/admin/treinos/listaExercicios";
import ListExerciciosMarcados from "components/admin/treinos/listExerciciosMarcados";
import { useState, useEffect } from "react";
import styles from "./pageEditTreinos.module.css";

export default function PageEditTreinos({
  listaMeuExercicios,
  setListaMeuExercicios,
  listaExercicios,
  setListaExercicios,
  listaRotina,
  idRotina,
  idClient,
}) {
  function salvarTreino() {
    if (listaMeuExercicios.length === 0) {
      alert(
        "Você precisa incluir ao menos um exercício antes de salvar o treino."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token || !idClient) {
      console.error("Token ou ID do cliente não encontrado.");
      return;
    }

    fetch("/api/admin/update-rotina-exercies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_client: parseInt(idClient),
        token,
        exercicios: listaMeuExercicios,
        id_rotina: idRotina,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Resposta da API:", data);
        alert("Treino salvo com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar treino:", error);
        alert("Erro ao salvar treino.");
      });

    // Aqui você continua com o salvamento, já que tem pelo menos um exercício
    //console.log("Salvando treino com os exercícios:", listaMeuExercicios);
  }

  return (
    <div className={styles.container}>
      {listaRotina.map((item) => {
        if (item.id == idRotina)
          return (
            <h1 className={styles.titles} key={item.id}>
              Editar {item.name}
            </h1>
          );
      })}
      <ListExerciciosMarcados
        listaExercicios={listaMeuExercicios}
        setListaExercicios={setListaMeuExercicios}
      />

      <ListaDeExercicios
        listaExercicios={listaExercicios}
        setListaExercicios={setListaExercicios}
        listaMeuExercicios={listaMeuExercicios}
        setListaMeuExercicios={setListaMeuExercicios}
      />

      <botton className={styles.btnSalvar} onClick={salvarTreino}>
        Salvar
      </botton>
    </div>
  );
}
