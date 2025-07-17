import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./newRotina.module.css";

export default function EditRotina({
  listaRotina,
  idRotina,
  setActiveComponent,
  setListaMeuExercicios,
}) {
  const router = useRouter();
  const { id } = router.query;

  const [dadosRotina, setDadosRotina] = useState({});

  async function carregarExerciciosDaRotina(idRotinaSelecionado) {
    console.log(listaRotina, idRotina);
    const rotina = await listaRotina.find((r) => r.id === idRotinaSelecionado);

    if (!rotina) {
      console.log("nem uma rotina encontrada..");
      return;
    }

    const exerciciosNormalizados = rotina.exercicios;

    if (!exerciciosNormalizados) {
      console.log("Zenrado");
      setListaMeuExercicios([]);
    } else {
      setListaMeuExercicios(exerciciosNormalizados.exercicios);
    }

    // Normaliza os exercícios com valores padrão (caso estejam ausentes)
    // const exerciciosNormalizados = rotina.exercicios.map((item) => ({
    //   ...item,
    //   series: item.series > 0 ? item.series : 3,
    //   repeticoes: item.repeticoes > 0 ? item.repeticoes : 12,
    //   observacao: item.observacao ?? "",
    // }));

    // setListaMeuExercicios(exerciciosNormalizados);
    // console.log(exerciciosNormalizados);
  }

  useEffect(() => {
    if (listaRotina && idRotina) {
      const rotinaEncontrada = listaRotina.find((item) => item.id === idRotina);
      setDadosRotina(rotinaEncontrada || null);
    }
  }, [listaRotina, idRotina]);

  const [formData, setFormData] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
    objetivo: "",
    id_cliente: "", // inclui no formData
  });

  useEffect(() => {
    if (id) {
      setFormData((prev) => ({ ...prev, id_cliente: id }));
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setFormData((prev) => ({ ...prev, token }));
    }
  }, []);

  const objetivos = ["Hipertrofia", "Ganho de massa", "Perda de peso", "Saúde"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nova rotina:", formData);

    // Enviar para API, por exemplo:
    /*
    fetch("/api/criar-rotina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then((data) => console.log("Rotina salva:", data));
    */
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.substring(0, 10) : "";
  };

  return !dadosRotina ? (
    <p>Carregando dados da rotina...</p>
  ) : (
    <div className={styles.container}>
      <h2 className={styles.title}>Editar Rotina</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Nome da Rotina:
          <input
            type="text"
            name="nome"
            value={dadosRotina.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Data de Início:
          <input
            type="date"
            name="dataInicio"
            value={formatDate(dadosRotina.data_inicio)}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Data de Fim:
          <input
            type="date"
            name="dataFim"
            value={formatDate(dadosRotina.data_final)}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Objetivo:
          <select
            name="objetivo"
            value={dadosRotina.objetivo_dieta}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Selecione um objetivo</option>
            {objetivos.map((obj, i) => (
              <option key={i} value={obj}>
                {obj}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className={styles.button}>
          Salvar Rotina
        </button>

        <button
          type="submit"
          className={styles.button}
          onClick={() => {
            setActiveComponent("edit-exercicies");
            carregarExerciciosDaRotina(idRotina);
          }}
        >
          Editar exercicios
        </button>
      </form>
    </div>
  );
}
