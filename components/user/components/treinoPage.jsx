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

  // Carrega treinos ao iniciar
  useEffect(() => {
    if (!router.isReady || !router.query.id) return;

    async function fetchDadosIniciais() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado.");
        return;
      }

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

  // Quando o usuário seleciona um treino
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

      // Filtra resultados válidos e evita erro de acesso
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

  // Alternar entre feito/não feito
  const toggleExercicio = useCallback((nome) => {
    setExerciciosConcluidos((prev) => ({
      ...prev,
      [nome]: !prev[nome],
    }));
  }, []);

  // Finalizar treino
  async function finalizarTreino() {
    const concluido = Object.entries(exerciciosConcluidos)
      .filter(([_, feito]) => feito)
      .map(([nome]) => nome);

    const dataHoje = getDataHojeSaoPaulo(); // Ex: retorna "2025-07-09"
    console.log(dataHoje);

    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado.");
      return;
    }

    const id_client = router.query.id;

    if (!token || !treinoSelecionado || !id_client) {
      alert("Faltam dados necessários para finalizar o treino.");
      return;
    }

    const payload = {
      id_client: parseInt(id_client), // ou Number(id_client)
      id_rotina: treinoSelecionado.id,
      data: dataHoje,
      exercicios_concluidos: concluido,
      token,
    };

    try {
      const response = await fetch("/api/client/insert-treino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // Data atual no fuso de SP
  function getDataHojeSaoPaulo() {
    const agora = new Date();
    const dataBrasil = new Date(agora.getTime() - 3 * 60 * 60 * 1000); // UTC-3
    return dataBrasil.toISOString().split("T")[0]; // "YYYY-MM-DD"
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
            {/* Select de Treino */}
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

            {/* Lista de Exercícios */}
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
                        seriesTreino[index]?.descricao ||
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
                              aria-label={`Ver tutorial de ${nome}`}
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
    </>
  );
}
