import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import UserHome from "components/user/userHome";
import DietaGrafics from "components/user/dietaGrafics";
import DietaHome from "components/user/dietaHome";
import TreinoHome from "components/user/treinoHome";
import EvolucaoHome from "components/user/evolucaoHome";
import { jwtDecode } from "jwt-decode";
import GraficHeader from "components/user/graficDieta";
import DietaCadastro from "components/user/dietaCadastro";
import EditConsumoDiario from "components/user/components/editConsumoDiario";
import Toast from "components/admin/toast";
import ConfigureHome from "components/user/configureHome";
import TreinoPage from "components/user/components/treinoPage";
import MeuVideo from "components/user/components/tutorialVideo";

export default function Users() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [activeComponent, setActiveComponent] = useState("");
  const [dataIndex, setDataIndex] = useState("");
  const [toast, setToast] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [dadosModal, setDadosModal] = useState({ total: 0, concluido: 0 });
  const [continuarFinalizar, setContinuarFinalizar] = useState(false);

  const [dadosParaFinalizar, setDadosParaFinalizar] = useState(null);

  const [videoStatus, setVideoStatus] = useState(false);
  const [idVideo, setIdVideo] = useState("");

  const renderComponent = () => {
    if (activeComponent === "")
      return <UserHome setActiveComponent={setActiveComponent} />;
    if (activeComponent === "treino")
      return <TreinoHome setActiveComponent={setActiveComponent} />;
    if (activeComponent === "dieta")
      return <DietaHome setActiveComponent={setActiveComponent} />;
    if (activeComponent === "evolucao")
      return <EvolucaoHome setActiveComponent={setActiveComponent} />;
    if (activeComponent === "graficDieta")
      return (
        <GraficHeader
          setActiveComponent={setActiveComponent}
          setDataIndex={setDataIndex}
        />
      );
    if (activeComponent === "cadastroDieta")
      return <DietaCadastro setActiveComponent={setActiveComponent} />;
    if (activeComponent === "editDietas")
      return (
        <EditConsumoDiario
          setActiveComponent={setActiveComponent}
          index={dataIndex}
          setToast={setToast}
        />
      );
    if (activeComponent === "configuracao")
      return (
        <ConfigureHome
          setActiveComponent={setActiveComponent}
          setToast={setToast}
        />
      );

    if (activeComponent === "treinopage")
      return (
        <TreinoPage
          setActiveComponent={setActiveComponent}
          setToast={setToast}
          solicitarFinalizacao={prepararFinalizacao}
          continuarFinalizar={continuarFinalizar}
          setVideoStatus={setVideoStatus}
          setIdVideo={setIdVideo}
          idVideo={idVideo}
        />
      );

    return null;
  };

  const prepararFinalizacao = (dados) => {
    const { totalExercicios, totalConcluidos } = dados;

    if (totalConcluidos < totalExercicios && !continuarFinalizar) {
      setDadosModal({ total: totalExercicios, concluido: totalConcluidos });
      setMostrarModal(true);
      setDadosParaFinalizar(dados);
    } else {
      finalizarTreino(dados);
    }
  };

  const finalizarTreino = async (dados) => {
    setMostrarModal(false);
    setContinuarFinalizar(false);

    const { concluido, treinoSelecionado } = dados;

    const dataHoje = new Date(Date.now() - 3 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

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
  };

  useEffect(() => {
    if (typeof window === "undefined" || !router.isReady) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/users/login");
      return;
    }

    const { id } = router.query;
    if (!id) return;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/users/login");
      return;
    }

    const userIdFromToken = String(decoded.id);

    if (userIdFromToken !== id) {
      router.push("/users/login");
      return;
    }

    fetch("/api/client/auth/verify-token", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAuthorized(true);
        } else {
          localStorage.removeItem("token");
          router.push("/users/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/users/login");
      });
  }, [router.isReady, router.query.id]);

  if (!authorized) return null;

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

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
                  finalizarTreino(dadosParaFinalizar);
                }}
              >
                Finalizar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}

      {videoStatus && (
        <MeuVideo idvideo={idVideo} setVideoStatus={setVideoStatus} />
      )}

      <div className={styles.wrapper}>{renderComponent()}</div>
      <div className={styles.marginBot}></div>
    </div>
  );
}
