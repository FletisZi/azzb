import { useEffect, useState } from "react";
import styles from "./rotinaSelectExercicios.module.css";

export default function RotinaSelectExercicios({ listaRotina, idRotina }) {
  const [grupos, setGrupos] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [treinoSelecionado, setTreinoSelecionado] = useState([]);

  // Buscar grupos
  async function getGrupos() {
    try {
      const res = await fetch("/api/admin/show-grups");
      const data = await res.json();
      setGrupos(data);
    } catch (error) {
      console.error("Erro ao consultar grupos:", error);
    }
  }

  // Carregar exercícios já salvos da rotina
  useEffect(() => {
    if (listaRotina && idRotina) {
      const rotinaEncontrada = listaRotina.find((item) => item.id === idRotina);

      if (rotinaEncontrada) {
        console.log("Exercícios salvos:", rotinaEncontrada.exercicios);

        if (
          rotinaEncontrada.exercicios &&
          rotinaEncontrada.exercicios.length > 0
        ) {
          setTreinoSelecionado(
            rotinaEncontrada.exercicios.map((ex) => ({
              ...ex,
              series: ex.series || 3,
              repeticoes: ex.repeticoes || 12,
            }))
          );
        }
      }
    }
  }, [listaRotina, idRotina]);

  // Buscar exercícios por grupo
  async function getExercicios(idGrupo) {
    try {
      const res = await fetch("/api/admin/show-lista-exercicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_grupo: idGrupo }),
      });
      const data = await res.json();
      setExercicios(data);
    } catch (error) {
      console.error("Erro ao consultar exercícios:", error);
    }
  }

  // Selecionar ou remover exercício
  function selecionarExercicio(exercicio) {
    const existe = treinoSelecionado.find((e) => e.id === exercicio.id);

    if (existe) {
      setTreinoSelecionado(
        treinoSelecionado.filter((e) => e.id !== exercicio.id)
      );
    } else {
      setTreinoSelecionado([
        ...treinoSelecionado,
        { ...exercicio, series: 3, repeticoes: 12 },
      ]);
    }
  }

  // Atualizar séries/repetições de exercício
  function atualizarCampo(idExercicio, campo, valor) {
    setTreinoSelecionado((prev) =>
      prev.map((ex) => (ex.id === idExercicio ? { ...ex, [campo]: valor } : ex))
    );
  }

  // Salvar treino no backend
  function salvarTreino() {
    const token = localStorage.getItem("token");
    const id_client = 2; // Defina conforme necessário

    if (!token || !id_client) {
      console.error("Token ou ID do cliente não encontrado.");
      return;
    }

    fetch("/api/admin/update-rotina-exercies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_client: parseInt(id_client),
        token,
        exercicios: treinoSelecionado,
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
  }

  // Buscar grupos na montagem inicial
  useEffect(() => {
    getGrupos();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Selecione um Grupo Muscular</h2>
      <div className={styles.grupos}>
        {grupos.map((grupo) => (
          <button
            key={grupo.id}
            onClick={() => {
              setGrupoSelecionado(grupo.id);
              getExercicios(grupo.id);
            }}
            className={`${styles.botaoGrupo} ${
              grupoSelecionado === grupo.id ? styles.botaoGrupoSelecionado : ""
            }`}
          >
            {grupo.name}
          </button>
        ))}
      </div>

      {exercicios.length > 0 && (
        <div className={styles.exercicios}>
          <h3>Exercícios Disponíveis</h3>
          {exercicios.map((exercicio) => (
            <div key={exercicio.id} className={styles.exercicioItem}>
              <label>
                <input
                  type="checkbox"
                  checked={treinoSelecionado.some((e) => e.id === exercicio.id)}
                  onChange={() => selecionarExercicio(exercicio)}
                />
                {` ${exercicio.name} (${exercicio.nivel})`}
              </label>

              {treinoSelecionado.some((e) => e.id === exercicio.id) && (
                <div className={styles.inputGrupo}>
                  <label className={styles.labelGrupo}>
                    Séries
                    <input
                      type="number"
                      min="1"
                      value={
                        treinoSelecionado.find((e) => e.id === exercicio.id)
                          ?.series || 3
                      }
                      onChange={(e) =>
                        atualizarCampo(
                          exercicio.id,
                          "series",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </label>
                  <label className={styles.labelGrupo}>
                    Repetições
                    <input
                      type="number"
                      min="1"
                      value={
                        treinoSelecionado.find((e) => e.id === exercicio.id)
                          ?.repeticoes || 12
                      }
                      onChange={(e) =>
                        atualizarCampo(
                          exercicio.id,
                          "repeticoes",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          ))}

          <button onClick={salvarTreino} className={styles.botaoSalvar}>
            Salvar Treino
          </button>
        </div>
      )}
    </div>
  );
}
