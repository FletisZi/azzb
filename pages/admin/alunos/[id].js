import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import Toast from "/components/admin/toast";
import { Montserrat } from "next/font/google";
import Header from "components/admin/header";
import { BookPlus, FolderSymlink } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

export default function EditarAluno() {
  const router = useRouter();
  const { id } = router.query;

  const [aluno, setAluno] = useState(null);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchAluno() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        const encontrado = data.find((aluno) => aluno.id === parseInt(id));

        if (encontrado) {
          setAluno(encontrado);
          setNome(encontrado.name);
        }

        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        setCarregando(false);
      }
    }

    fetchAluno();
  }, [id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function atualizarCliente(event) {
    event.preventDefault();

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nome,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(`Erro: ${data.error || "Erro desconhecido"}`);
        setToast({
          mensagem: `Erro: ${data.error || "Erro desconhecido"}`,
          tipo: "erro",
        });
        return;
      }

      setMensagem("Cliente atualizado com sucesso!");
      setToast({
        mensagem: "Cliente atualizado com sucesso!",
        tipo: "sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMensagem("Erro de rede. Tente novamente mais tarde.");
      setToast({
        mensagem: "Erro de rede. Tente novamente mais tarde.",
        tipo: "erro",
      });
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (!aluno) return <p>Aluno não encontrado.</p>;

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

        <h1 className={styles.titulo}>Editar Perfil de {aluno.name}</h1>

        <form className={styles.form} onSubmit={atualizarCliente}>
          {mensagem && <p>{mensagem}</p>}

          <div className={styles.campo}>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className={styles.campo}>
            <label>Nova Senha</label>
            <input
              type="password"
              placeholder="Digite a nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className={styles.wrapersLinksEdits}>
            <div className={styles.conteinerButtons}>
              <label className={styles.label}>Dieta</label>
              <button
                type="button"
                onClick={() => router.push(`/admin/alunos/dieta/${id}`)}
                className={styles.btnLinks}
              >
                <BookPlus strokeWidth={2} size={22} color="#FFF" />
              </button>
            </div>

            <div className={styles.conteinerButtons}>
              <label className={styles.label}>Treinos</label>
              <button
                type="button"
                onClick={() => router.push(`/admin/alunos/treino/${id}`)}
                className={styles.btnLinks}
              >
                <FolderSymlink strokeWidth={2} size={22} color="#FFF" />
              </button>
            </div>
          </div>

          <button type="submit" className={styles.botao}>
            Salvar Alterações
          </button>
        </form>
      </div>
    </>
  );
}
