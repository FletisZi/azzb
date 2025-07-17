import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./newRotina.module.css";

export default function NewRotina() {
  const router = useRouter();
  const { id } = router.query;

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

    const playlod = {
      name: formData.nome,
      data_inicio: formData.dataInicio,
      data_final: formData.dataFim,
      objetivo_dieta: formData.objetivo,
      id_client: formData.id_cliente,
      token: formData.token,
    };
    // console.log("Nova rotina:", formData);
    console.log("Nova rotina:", playlod);

    // Enviar para API, por exemplo:
    
    fetch("/api/admin/new-rotina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlod),
    })
    .then((res) => res.json())
    .then((data) => console.log("Rotina salva:", data));
  
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Criar Nova Rotina</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Nome da Rotina:
          <input
            type="text"
            name="nome"
            value={formData.nome}
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
            value={formData.dataInicio}
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
            value={formData.dataFim}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Objetivo:
          <select
            name="objetivo"
            value={formData.objetivo}
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
      </form>
    </div>
  );
}
