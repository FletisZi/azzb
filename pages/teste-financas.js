import React, { useEffect, useState } from "react";
import styles from "./FiltroPagamentos.module.css";
import CardValuesShows from "components/admin/financa/cardValuesShows";
import { Landmark } from "lucide-react";

export default function FiltroPagamentos() {
  const [periodo, setPeriodo] = useState("mesAtual");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Função para calcular datas padrão conforme o filtro
  const calcularDatas = (tipo) => {
    const hoje = new Date();
    let inicio;

    switch (tipo) {
      case "15dias":
        inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 15);
        break;
      case "30dias":
        inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 30);
        break;
      case "45dias":
        inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 45);
        break;
      case "60dias":
        inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 60);
        break;
      case "personalizado":
        // deixa as datas escolhidas pelo usuário
        return;
      default: // "mesAtual"
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
    }

    setDataInicio(inicio.toISOString().split("T")[0]);
    setDataFim(hoje.toISOString().split("T")[0]);
  };

  // 🔹 Atualiza automaticamente as datas ao mudar o tipo de período
  useEffect(() => {
    if (periodo !== "personalizado") calcularDatas(periodo);
  }, [periodo]);

  // 🔹 Busca os dados da API
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/v2/finaces/getValuesPayments", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ dataInicio, dataFim }), });

      const data = await response.json();

    // Converter o array da API em um objeto mais fácil de usar
    const totals = {
      credito: 0,
      debito: 0,
      pix: 0,
      dinheiro: 0,
    };

    data.forEach(item => {
      const tipo = item.forma_pagamento?.toLowerCase();
      if (totals.hasOwnProperty(tipo)) {
        totals[tipo] = parseFloat(item.total_pago);
      }
    });

    setValues(totals);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Busca automática ao iniciar (mês atual)
  useEffect(() => {
    if (dataInicio && dataFim) fetchData();
  }, [dataInicio, dataFim]);

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Filtrar Pagamentos</h2>

      <div className={styles.filtros}>
        <label>Período:</label>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className={styles.select}
        >
          <option value="mesAtual">Mês atual</option>
          <option value="15dias">Últimos 15 dias</option>
          <option value="30dias">Últimos 30 dias</option>
          <option value="45dias">Últimos 45 dias</option>
          <option value="60dias">Últimos 60 dias</option>
          <option value="personalizado">Personalizado</option>
        </select>

        {periodo === "personalizado" && (
          <div className={styles.datas}>
            <div>
              <label>Data início:</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div>
              <label>Data fim:</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <button onClick={fetchData} className={styles.botao}>
              Buscar
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : values ? (
        <div className={styles.resultados}>
          <div className={styles.card}>
            <h3>💳 Crédito</h3>
            <p>R$ {values.credito?.toFixed(2) || "0.00"}</p>
          </div>
          {console.log(values)}
          <div className={styles.card}>
            <h3>🏧 Débito</h3>
            <p>R$ {values.debito?.toFixed(2) || "0.00"}</p>
          </div>
          <div className={styles.card}>
            <h3>⚡ PIX</h3>
            <p>R$ {values.pix?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      ) : (
        <p className={styles.info}>Nenhum dado encontrado.</p>
      )}
      <CardValuesShows text={'Despesas'} value={0} colorBK="#000" urlLink={'/teste'}>
        <Landmark size={24} color="#FFF" strokeWidth={2}/>
      </CardValuesShows>
      
    </div>

    
  );
}
