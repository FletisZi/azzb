import { useState, useEffect } from "react";
import Logo from "components/logo";
import styles from "./configureHome.module.css";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

export default function ConfigureHome({ setActiveComponent, setToast }) {
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [id, setId] = useState(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  // Pega o token do localStorage e decodifica

  useEffect(() => {

    
    const { id } = router.query;
    setId(id)

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setToken(storedToken);
    }
  }, []);

  // Atualiza a senha do usuário
  async function salvarSenha(e) {
    e.preventDefault(); // impede o refresh da página

    if (!senha) {
      setToast({ mensagem: "Digite uma nova senha.", tipo: "erro" });
      // alert("Digite uma nova senha.");
      return;
    }

    try {
      const response = await fetch(`/api/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: senha,
        }),
      });

      if (response.ok) {
        setToast({ mensagem: "Senha atualizada com sucesso!", tipo: "sucesso" });
        setSenha(""); // limpa o campo
      } else {
        const data = await response.json();
        
        setToast({ mensagem: "Erro ao atualizar senha:" + data.error, tipo: "erro" });
        //alert("Erro ao atualizar senha: " + data.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      alert("Erro ao atualizar senha.");
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <Logo />
        <button
          onClick={() => setActiveComponent("")}
          className={styles.btnVoltar}
        >
          Voltar
        </button>
      </div>

      <div className={styles.container}>
        <form onSubmit={salvarSenha} className={styles.form}>
          <h1 className={styles.title}>Menu de Configuração</h1>
          
          <input
            type="password"
            className={`${styles.input} ${styles.inputNumber}`}
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit" className={styles.btnSalvar}>Salvar</button>
        </form>
      </div>
    </div>
  );
}
