import Header from "components/admin/header";
import styles from "./layout.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EditMetas from "components/admin/editMetas";

export default function Dieta() {
  const [metaDiaria, setMetaDiaria] = useState("");
  const [metaCarboidratos, setMetaCarboidratos] = useState("");
  const [metaProteinas, setMetaProteinas] = useState("");
  const [metaGorduras, setMetaGorduras] = useState("");
  const [idClient, setIdClient] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (id) {
        setIdClient(id);
      }
    }
  }, [router.isReady, router.query]);

  async function insertRefeicao(e) {
    e.preventDefault();

    if (!idClient) {
      console.warn("ID do cliente ainda não carregado");
      return;
    }

    const res = await fetch("/api/client/insert-dieta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_client: idClient,
        meta_protein: metaProteinas,
        meta_carboidratos: metaCarboidratos,
        meta_gordura: metaGorduras,
        meta_calorias: metaDiaria,
        data_inicio: "2025-06-28T00:00:00.000Z",
        data_final: null,
        refeicoes: {
          cafe: 200,
          almoco: 800,
          lanche: 300,
          janta: 400,
        },
      }),
    });

    const data = await res.json();
    console.log("Resposta da API:", data);
  }

  return (
    <>
      <Header url="" />

      <EditMetas />

      {/* Exemplo de uso do insertRefeicao (botão de teste) */}
      <button onClick={insertRefeicao} disabled={!idClient}>
        Enviar dieta
      </button>
    </>
  );
}
