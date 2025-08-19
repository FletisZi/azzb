import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import styles from "./creditGauger.module.css";


export default function GraficHeader() {
  const [data, setData] = useState(null);

  // refs para cada gráfico
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  // instâncias dos gráficos
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);
  const chartInstance3 = useRef(null);

  // buscar dados da API


  // criar gráficos
  useEffect(() => {
    if (!data) return;

    // ----------------- Gráfico 1 -----------------
    if (chartInstance1.current) chartInstance1.current.destroy();
    if (chartRef1.current) {
      const ctx1 = chartRef1.current.getContext("2d");
      chartInstance1.current = new Chart(ctx1, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [30, 70], // exemplo
              backgroundColor: ["#0083FF", "#D9FC98"],
              borderWidth: 0,
              borderRadius: 30,
              cutout: "85%",
            },
          ],
        },
        options: {
          rotation: 220,
          circumference: 280,
          responsive: true,
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
        },
      });
    }

    // ----------------- Gráfico 2 -----------------
    if (chartInstance2.current) chartInstance2.current.destroy();
    if (chartRef2.current) {
      const ctx2 = chartRef2.current.getContext("2d");
      chartInstance2.current = new Chart(ctx2, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [70, 30], // exemplo
              backgroundColor: ["#0083FF", "#D9FC98"],
              borderWidth: 0,
              borderRadius: 30,
              cutout: "85%",
            },
          ],
        },
        options: {
          rotation: 220,
          circumference: 280,
          responsive: true,
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
        },
      });
    }

    if (chartInstance3.current) chartInstance3.current.destroy();
    if (chartRef3.current) {
      const ctx3 = chartRef3.current.getContext("2d");
      chartInstance3.current = new Chart(ctx3, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [70, 30], // exemplo
              backgroundColor: ["#0083FF", "#D9FC98"],
              borderWidth: 0,
              borderRadius: 30,
              cutout: "85%",
            },
          ],
        },
        options: {
          rotation: 220,
          circumference: 280,
          responsive: true,
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
        },
      });
    }
  }, [data]);

    
  console.log("Dados do gráfico:", data);

  if (!data) {
    return <div>Carregando gráfico...</div>;
  }
  console.log("Dados do gráfico:", data);
  const valueCredito = 300;
  const valueDebito = 700;

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        {console.log("Dados do gráfico:", data)}
        {/* Gráfico 1 */}
        <div className={styles.containerCenter}>
          <canvas ref={chartRef1} />
          <div className={styles.centerText}>
            <div className={styles.number}>R$ {valueCredito}
            </div>
            <div className={styles.label}>Crédito</div>
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className={styles.containerCenter}>
          <canvas ref={chartRef2} />
          <div className={styles.centerText}>
            <div className={styles.number}>R$ {valueDebito}
            </div>
            <div className={styles.label}>Débito</div>
          </div>
        </div>

        <div className={styles.containerCenter}>
          <canvas ref={chartRef3} />
          <div className={styles.centerText}>
            <div className={styles.number}>R$ {valueDebito}
            </div>
            <div className={styles.label}>Pix</div>
          </div>
        </div>

      </div>
    </div>
  );
}
