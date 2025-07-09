import { useEffect, useState } from "react";
import styles from "./listDiaTreino.module.css";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz"; // Corrige o fuso
import { Check, X } from "lucide-react";

export default function ListDiaTreino() {
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchTreinos() {
      const token = localStorage.getItem("token");
      const { id } = router.query;
      const id_client = id;

      if (!token || !id_client) return;

      const response = await fetch("/api/client/show-history-treino", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id_client }),
      });

      const result = await response.json();

      // Corrigindo a formatação com UTC
      const treinosFormatados = result.map((treino) => ({
        ...treino,
        dataFormatada: formatInTimeZone(treino.data, "UTC", "yyyy-MM-dd"),
      }));

      const hoje = new Date();

      // Monta os últimos 7 dias + hoje
      const diasComTreino = Array.from({ length: 8 }, (_, i) => {
        const data = new Date();
        data.setDate(hoje.getDate() - (7 - i));
        const dataFormatada = format(data, "yyyy-MM-dd");

        const treinoDoDia = treinosFormatados.find(
          (t) => t.dataFormatada === dataFormatada
        );

        return {
          dia: data.getDate(),
          sigla: i === 7 ? "Hoje" : diasSemana[data.getDay()],
          isHoje: i === 7,
          treino: treinoDoDia?.name || null,
        };
      });

      setData(diasComTreino);
    }

    fetchTreinos();
  }, [router.query]);

  if (!data) {
    return <div>Carregando gráfico...</div>;
  }

  return (
    <div>
      <div className={styles.container}>
        {data.map((d, i) => (
          <div key={i} className={styles.wrapperDia}>
            <div className={styles.dianumber}>{d.dia}</div>
            <div className={`${styles.dia} ${d.isHoje ? styles.inativo : ""}`}>
              <div className={styles.iconLinks}>
                {d.treino ? (
                  <Check color="white" size={16} strokeWidth={3} />
                ) : (
                  <X color="white" size={16} strokeWidth={3} />
                )}
              </div>
            </div>
            <div className={styles.sigla}>{d.sigla}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
