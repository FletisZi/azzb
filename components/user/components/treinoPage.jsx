import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./treinoPage.module.css";
import Logo from "components/logo";
import ShortCard from "./shotcard";
import ShortThumbnail from "./imgshortcard";

export default function TreinoPage({ setActiveComponent }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [treinos, setTreinos] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState({});

  useEffect(() => {
    if (!router.isReady || !router.query.id) return;

    async function fetchTreinos() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }

      try {
        const response = await fetch("/api/client/show-training-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            id_client: router.query.id,
          }),
        });

        const result = await response.json();
        setTreinos(result);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTreinos();
  }, [router.isReady, router.query.id]);

  function handleSelecionarTreino(idTreino) {
    const treino = treinos.find((t) => t.id === Number(idTreino));
    setTreinoSelecionado(treino);

    // Inicializa os exercícios como não concluídos
    const estadoInicial = {};

    Object.keys(treino.exercicio).forEach((nome) => {
      estadoInicial[nome] = false;
    });
    setExerciciosConcluidos(estadoInicial);
  }

  function toggleExercicio(nome) {
    setExerciciosConcluidos((prev) => ({
      ...prev,
      [nome]: !prev[nome],
    }));
  }
  function finalizarTreino() {
    const concluido = Object.entries(exerciciosConcluidos)
      .filter(([_, feito]) => feito)
      .map(([nome]) => nome);

    const dataHoje = getDataHojeSaoPaulo(); // <<< AQUI pega a data certa

    const resultadoFinal = {
      id_treino: treinoSelecionado.id,
      nome_treino: treinoSelecionado.name,
      data: dataHoje,
      exercicios_concluidos: concluido,
    };

    console.log("Treino finalizado:", resultadoFinal);
    alert("Treino finalizado! Veja o console.");
  }

  // Coloca essa função fora do componente, mas no mesmo arquivo:
  function getDataHojeSaoPaulo() {
    const hoje = new Date();

    const formatador = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatador.format(hoje);
  }

  return (
    <>
      <div className={styles.header}>
        <Logo />
        <button
          onClick={() => setActiveComponent("")}
          className={styles.btnVoltar}
        >
          Voltar
        </button>
      </div>
      <div style={{ padding: "20px" }}>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {/* Select de treino */}
            <select
              defaultValue=""
              onChange={(e) => handleSelecionarTreino(e.target.value)}
              className={styles.selectTraining}
            >
              <option value="" disabled>
                Selecione um treino
              </option>
              {treinos.map((treino) => (
                <option key={treino.id} value={treino.id}>
                  {treino.name}
                </option>
              ))}
            </select>

            {/* Lista de exercícios */}
            {treinoSelecionado && (
              <div style={{ marginTop: "20px" }}>
                <div className={styles.tabelaTreino}>
                  <div className={styles.cabecalho}>
                    <span>Exercício</span>
                    <span>Séries</span>
                    <span>Repetições</span>
                    <span></span>
                  </div>

                  {Object.entries(treinoSelecionado.exercicio).map(
                    ([nome, dados]) => (
                      <div className={styles.linha} key={nome}>
                        <div className={styles.iconeNome}>
                          <div className={styles.icone}></div>
                          <div>
                            <strong>{nome}</strong>
                            <div className={styles.musculo}>
                              {dados.musculo}
                            </div>
                          </div>
                        </div>
                        <div className={styles.alingItems}>{dados.series}</div>
                        <div className={styles.alingItems}>
                          {dados.repeticao}
                        </div>
                        <div className={styles.alingItems}>
                          <span
                            className={`${styles.status} ${
                              exerciciosConcluidos[nome] ? styles.feito : ""
                            }`}
                            onClick={() => toggleExercicio(nome)}
                          ></span>
                        </div>
                      </div>
                    )
                  )}

                  <button
                    onClick={finalizarTreino}
                    className={styles.btnFinalizar}
                  >
                    Finalizar Treino
                  </button>
                </div>
                <ShortThumbnail />
                <ShortCard />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
