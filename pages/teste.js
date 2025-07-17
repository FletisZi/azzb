import ListaDeExercicios from "components/admin/treinos/listaExercicios";
import ListExerciciosMarcados from "components/admin/treinos/listExerciciosMarcados";
import { useState, useEffect } from "react";

export default function teste({}) {
  const [listaMeuExercicios, setListaMeuExercicios] = useState([
    {
      id: 2,
      name: "SUPINO RETO C/ BARRA",
      nivel: "DIFICL",
      series: 5,
      ur_video: "https://www.youtube.com/watch?v=M3z0R-GieHU",
      repeticoes: 10,
      id_grupomuscular: 7,
      observacao: "",
    },
    {
      id: 4,
      name: "SUPINO INCLINADO C/ HALTERES",
      nivel: "MODERADO",
      series: 4,
      ur_video: "https://www.youtube.com/watch?v=d9zIkUUyodo",
      repeticoes: 10,
      id_grupomuscular: 7,
      observacao: "",
    },
    {
      id: 7,
      name: "SUPINO INCLINADO NA MÁQUINA",
      nivel: "FACIL",
      series: 4,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 7,
      observacao: "",
    },
    {
      id: 10,
      name: "PECK DECK",
      nivel: "FACIL",
      series: 4,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 7,
      observacao: "",
    },
  ]);
  const [listaExercicios, setListaExercicios] = useState([
    {
      id: 2,
      name: "SUPINO RETO C/ BARRA",
      nivel: "DIFICL",
      series: 5,
      ur_video: "https://www.youtube.com/watch?v=M3z0R-GieHU",
      repeticoes: 10,
      id_grupomuscular: 7,
    },
    {
      id: 4,
      name: "SUPINO INCLINADO C/ HALTERES",
      nivel: "MODERADO",
      series: 4,
      ur_video: "https://www.youtube.com/watch?v=d9zIkUUyodo",
      repeticoes: 10,
      id_grupomuscular: 7,
    },
    {
      id: 7,
      name: "SUPINO INCLINADO NA MÁQUINA",
      nivel: "FACIL",
      series: 4,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 7,
    },
    {
      id: 10,
      name: "PECK DECK",
      nivel: "FACIL",
      series: 4,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 7,
    },
    {
      id: 86,
      name: "DESENVOLVIMENTO C/ BARRA ",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 1,
    },
    {
      id: 92,
      name: "ELEVAÇÃO LATERAL COM HALTERES",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 1,
    },
    {
      id: 87,
      name: "ELEVAÇÃO FRONTAL /C HALTER",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 10,
      id_grupomuscular: 1,
    },
    {
      id: 56,
      name: "BARRA RETA NA POLIA",
      nivel: "MODERADO",
      series: 4,
      ur_video: null,
      repeticoes: 12,
      id_grupomuscular: 2,
    },
    {
      id: 51,
      name: "TRÍCEPS C/ CORDA",
      nivel: "MODERADO",
      series: 4,
      ur_video: null,
      repeticoes: 12,
      id_grupomuscular: 2,
    },
    {
      id: 48,
      name: "TRÍCEPS INVERSO NA POLIA",
      nivel: "MODERADO",
      series: 4,
      ur_video: null,
      repeticoes: 8,
      id_grupomuscular: 2,
    },
    {
      id: 77,
      name: "PANTURRILHA SENTADO NA MÁQUINA",
      nivel: "MODERADO",
      series: 4,
      ur_video: null,
      repeticoes: 16,
      id_grupomuscular: 6,
    },
    {
      id: 103,
      name: "ABDOMINAL LIVRE",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 50,
      id_grupomuscular: 4,
    },
    {
      id: 107,
      name: "PRANCHA FRONTAL",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 20,
      id_grupomuscular: 4,
    },
    {
      id: 102,
      name: "ABDOMINAL INFRA",
      nivel: "MODERADO",
      series: 3,
      ur_video: null,
      repeticoes: 15,
      id_grupomuscular: 4,
    },
  ]);

  useEffect(() => {
    async function getExercicios() {
      try {
        const res = await fetch("/api/admin/show-all-exercicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setListaExercicios(data);
      } catch (error) {
        console.error("Erro ao consultar exercícios:", error);
      }
    }

    getExercicios();
  }, []);

  function salvarTreino() {
    if (listaMeuExercicios.length === 0) {
      alert(
        "Você precisa incluir ao menos um exercício antes de salvar o treino."
      );
      return;
    }

    // Aqui você continua com o salvamento, já que tem pelo menos um exercício
    console.log("Salvando treino com os exercícios:", listaMeuExercicios);
  }

  return (
    <>
      <ListExerciciosMarcados
        listaExercicios={listaMeuExercicios}
        setListaExercicios={setListaMeuExercicios}
      />

      <ListaDeExercicios
        listaExercicios={listaExercicios}
        setListaExercicios={setListaExercicios}
        listaMeuExercicios={listaMeuExercicios}
        setListaMeuExercicios={setListaMeuExercicios}
      />

      <botton onClick={salvarTreino}>Salvar</botton>
    </>
  );
}
