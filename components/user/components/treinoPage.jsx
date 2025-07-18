import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import styles from "./treinoPage.module.css";
import Logo from "components/logo";
import BuscarListaExercicio from "controller/buscar-lista-exercicio";
import BuscarDadosExercicio from "controller/buscar-dados-exercicio";
import { Check } from "lucide-react";

export default function TreinoPage({ setActiveComponent, setToast }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingExercicios, setLoadingExercicios] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [listaExercicio, setListaExercicio] = useState([]);
  const [seriesTreino, setSeriesTreino] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dadosModal, setDadosModal] = useState({ total: 0, concluido: 0 });
  const [continuarFinalizar, setContinuarFinalizar] = useState(false);

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

  async function finalizarTreino() {
    const concluido = Object.entries(exerciciosConcluidos)
      .filter(([_, feito]) => feito)
      .map(([nome]) => nome);

    const totalExercicios = Object.keys(exerciciosConcluidos).length;
    const totalConcluidos = concluido.length;

    if (totalConcluidos < totalExercicios && !continuarFinalizar) {
      setDadosModal({ total: totalExercicios, concluido: totalConcluidos });
      setMostrarModal(true);
      return;
    }

    setContinuarFinalizar(false);

    const dataHoje = getDataHojeSaoPaulo();
    const token = localStorage.getItem("token");
    const id_client = router.query.id;

    if (!token || !treinoSelecionado || !id_client) {
      alert("Faltam dados necessários para finalizar o treino.");
      return;
    }

    const payload = {
      id_client: parseInt(id_client),
      id_rotina: treinoSelecionado.id,
      data: dataHoje,
      exercicios_concluidos: concluido,
      token,
    };

    try {
      const response = await fetch("/api/client/insert-treino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.error("Erro ao salvar treino:", erro);
        alert("Erro ao finalizar treino.");
        return;
      }

      setToast({
        mensagem: "✅ Treino finalizado com sucesso!",
        tipo: "sucesso",
      });

      setActiveComponent("treino");
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na conexão com o servidor.");
    }
  }

  function getDataHojeSaoPaulo() {
    const agora = new Date();
    const dataBrasil = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
    return dataBrasil.toISOString().split("T")[0];
  }

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
                            <button className={styles.btnPlay}>
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
                      onClick={finalizarTreino}
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

      {mostrarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Finalizar treino?</h3>
            <p>
              Você concluiu {dadosModal.concluido} de {dadosModal.total}{" "}
              exercícios.
              <br />
              Deseja realmente finalizar o treino?
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.btnCancelar}
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnConfirmar}
                onClick={() => {
                  setMostrarModal(false);
                  setContinuarFinalizar(true);
                  finalizarTreino(); // chama novamente, agora confirmando
                }}
              >
                Finalizar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
