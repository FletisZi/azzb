import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import styles from "./treinoPage.module.css";
import Logo from "components/logo";
import BuscarListaExercicio from "controller/buscar-lista-exercicio";
import BuscarDadosExercicio from "controller/buscar-dados-exercicio";
import { Check } from "lucide-react";
import e from "express";

export default function TreinoPage({
  setActiveComponent,
  setToast,
  solicitarFinalizacao,
  continuarFinalizar,
  setVideoStatus,
  setIdVideo,
  idVideo,
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingExercicios, setLoadingExercicios] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [listaExercicio, setListaExercicio] = useState([]);
  const [seriesTreino, setSeriesTreino] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState({});

  useEffect(() => {
    if (!router.isReady || !router.query.id) return;

    async function fetchDadosIniciais() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const lista = await BuscarListaExercicio(router.query.id, token);
        setListaExercicio(lista || []);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDadosIniciais();
  }, [router.isReady, router.query.id]);

  async function handleSelect(idTreino) {
    const treino = listaExercicio.find((dado) => dado.id == idTreino);
    if (!treino) return;

    setLoadingExercicios(true);
    setTreinoSelecionado(treino);

    const listaExercicios = treino?.exercicios?.exercicios || [];
    setSeriesTreino(listaExercicios);

    try {
      const detalhes = await Promise.all(
        listaExercicios.map((item) => BuscarDadosExercicio(item.id))
      );

      const normalizado = detalhes.map((item) => item?.[0]).filter(Boolean);
      setExercicios(normalizado);

      const estadoInicial = {};
      normalizado.forEach((dado) => {
        if (dado?.name) estadoInicial[dado.name] = false;
      });
      setExerciciosConcluidos(estadoInicial);
    } catch (error) {
      console.error("Erro ao carregar detalhes dos exercícios:", error);
    } finally {
      setLoadingExercicios(false);
    }
  }

  const toggleExercicio = useCallback((nome) => {
    setExerciciosConcluidos((prev) => ({
      ...prev,
      [nome]: !prev[nome],
    }));
  }, []);

  function handleFinalizarTreino() {
    const concluido = Object.entries(exerciciosConcluidos)
      .filter(([_, feito]) => feito)
      .map(([nome]) => nome);

    const totalExercicios = Object.keys(exerciciosConcluidos).length;
    const totalConcluidos = concluido.length;

    solicitarFinalizacao({
      concluido,
      totalExercicios,
      totalConcluidos,
      treinoSelecionado,
    });
  }

  const abrirVideo = (idvideo) => {
    setIdVideo(idvideo);
    setVideoStatus(true);
  };

  return (
    <>
      <div className={styles.header}>
        <Logo />
        <button
          onClick={() => setActiveComponent("treino")}
          className={styles.btnVoltar}
        >
          Voltar
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        {isLoading ? (
          <p>Carregando treinos...</p>
        ) : (
          <>
            <select
              defaultValue=""
              onChange={(e) => handleSelect(e.target.value)}
              className={styles.selectTraining}
            >
              <option value="" disabled>
                Selecione um treino
              </option>
              {listaExercicio.map((treino) => (
                <option key={treino.id} value={treino.id}>
                  {treino.name || "Sem nome"}
                </option>
              ))}
            </select>

            {treinoSelecionado && (
              <div style={{ marginTop: "20px" }}>
                {loadingExercicios ? (
                  <p>Carregando exercícios...</p>
                ) : (
                  <div className={styles.tabelaTreino}>
                    {exercicios.map((data, index) => {
                      if (!data) return null;
                      const nome = data.name || `Exercício ${index + 1}`;
                      const grupo = data.grupo_muscular || "Grupo muscular";
                      const series = seriesTreino[index]?.series || "-";
                      const reps = seriesTreino[index]?.repeticoes || "-";
                      const descricao =
                        seriesTreino[index]?.observacao ||
                        "Descrição do exercício...";

                      return (
                        <div className={styles.linha} key={data.id || index}>
                          <div className={styles.titleCards}>
                            <div
                              className={`${styles.alingItems} ${styles.leftItems}`}
                            >
                              {nome}
                            </div>
                            <div className={styles.alingItems}>{series}</div>
                            <div className={styles.alingItems}>{reps}</div>
                          </div>

                          <div className={styles.subTitleCards}>
                            <div
                              className={`${styles.alingItems} ${styles.leftItems}`}
                            >
                              {grupo}
                            </div>
                            <div className={styles.alingItems}>Séries</div>
                            <div className={styles.alingItems}>Reps</div>
                          </div>

                          <div className={styles.wrapperButtons}>
                            <button
                              className={styles.btnPlay}
                              onClick={() => abrirVideo("1103451910")}
                            >
                              <img
                                className={styles.image}
                                src="/img/play.svg"
                                alt="Tutorial"
                              />
                              Tutorial
                            </button>
                            <span></span>
                            <div className={styles.alingItems}>
                              <span
                                className={styles.status}
                                onClick={() => toggleExercicio(nome)}
                              >
                                <Check
                                  size={14}
                                  color="#4AA7B0"
                                  strokeWidth={4}
                                  className={`${styles.naofeito} ${
                                    exerciciosConcluidos[nome]
                                      ? styles.feito
                                      : ""
                                  }`}
                                />
                              </span>
                            </div>
                          </div>

                          <p className={styles.textBottom}>{descricao}</p>
                        </div>
                      );
                    })}

                    <button
                      onClick={handleFinalizarTreino}
                      className={styles.btnFinalizar}
                    >
                      Finalizar Treino
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
