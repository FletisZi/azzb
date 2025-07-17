// import { Montserrat } from "next/font/google";
// import styles from "./layout.module.css";
// import Header from "components/admin/header";
// import Toast from "components/admin/toast";
// import { useState } from "react";
// import { useRouter } from "next/router";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["400", "600", "700", "800", "900"],
//   variable: "--font-montserrat",
// });

// export default function EditarAluno() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [toast, setToast] = useState(null);

//   async function ConsultarRotinas() {

//     const token = getlocalStorage("token")

//     const res = await fetch("/api/admin/show-rotinas", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         id_client: id,
//         token: token,
//       }),
//     });

//     const data = await res.json();
//     console.log("Resposta da API:", data);
//   }

//   ConsultarRotinas();

//   return (
//     <>
//       <Header url="" />
//       <div className={`${montserrat.variable} ${styles.container}`}>
//         {toast && (
//           <Toast
//             mensagem={toast.mensagem}
//             tipo={toast.tipo}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <h1 className={styles.titulo}>link</h1>
//       </div>
//     </>
//   );
// }

import { Montserrat } from "next/font/google";
import styles from "./layout.module.css";
import Header from "components/admin/header";
import Toast from "components/admin/toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClipboardList, Dumbbell, Pencil } from "lucide-react";
import NewRotina from "components/admin/newRotina";
import ListRotina from "components/admin/listRotina";
import EditRotina from "components/admin/editRotina";
import RotinaSelectExercicios from "components/admin/rotinaSelectExercicios";
import ListaRotina from "components/admin/treinos/listRotinas";
import PageEditTreinos from "components/admin/treinos/pageEditTreinos";

// Fonte Montserrat do Google
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export default function LayoutAdmin() {
  const router = useRouter();
  const { id } = router.query;
  const [toast, setToast] = useState(null);
  const [listaRotina, setListaRotina] = useState([]);
  const [activeComponent, setActiveComponent] = useState("teste");
  const [idRotinaSelecionada, setIdRotinaSelecionada] = useState(null);

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
  ]);
  const [listaExercicios, setListaExercicios] = useState([]);

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

  const renderComponent = () => {
    if (activeComponent === "teste")
      return (
        <ListaRotina
          listaRotina={listaRotina}
          setActiveComponent={setActiveComponent}
          setIdRotinaSelecionada={setIdRotinaSelecionada}
        />
      );
    if (activeComponent === "")
      return (
        <ListRotina
          listaRotina={listaRotina}
          setActiveComponent={setActiveComponent}
          setIdRotinaSelecionada={setIdRotinaSelecionada}
        />
      );
    if (activeComponent === "nova-rotina")
      return <NewRotina setActiveComponent={setActiveComponent} />;
    if (activeComponent === "edit-rotina")
      return (
        <EditRotina
          listaRotina={listaRotina}
          setActiveComponent={setActiveComponent}
          idRotina={idRotinaSelecionada}
          setListaMeuExercicios={setListaMeuExercicios}
        />
      );
    // if (activeComponent === "edit-exercicies")
    //   return (
    //     <RotinaSelectExercicios
    //       listaRotina={listaRotina}
    //       setActiveComponent={setActiveComponent}
    //       idRotina={idRotinaSelecionada}
    //     />
    // );
    if (activeComponent === "edit-exercicies")
      return (
        <PageEditTreinos
          listaMeuExercicios={listaMeuExercicios}
          setListaMeuExercicios={setListaMeuExercicios}
          listaExercicios={listaExercicios}
          setListaExercicios={setListaExercicios}
          listaRotina={listaRotina}
          idRotina={idRotinaSelecionada}
          idClient={id}
        />
      );
    return null;
  };

  //RotinaSelectExercicios
  useEffect(() => {
    if (!id) return; // Aguarda o ID da rota

    async function consultarRotinas() {
      const token = localStorage.getItem("token");
      if (!token) {
        setToast({ mensagem: "Token não encontrado", tipo: "erro" });
        return;
      }

      try {
        const res = await fetch("/api/admin/show-rotinas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_client: id, token }),
        });

        const data = await res.json();
        setListaRotina(data);
        //console.log("Resposta da API:", data);
      } catch (error) {
        console.error("Erro ao consultar rotinas:", error);
        setToast({ mensagem: "Erro ao buscar rotinas", tipo: "erro" });
      }
    }

    consultarRotinas();
  }, [id]);

  return (
    <>
      <Header url="" />
      <div className={`${montserrat.variable} ${styles.container}`}>
        {toast && (
          <Toast
            mensagem={toast.mensagem}
            tipo={toast.tipo}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      {renderComponent()}
    </>
  );
}
