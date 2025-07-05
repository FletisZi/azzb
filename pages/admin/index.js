import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListaAlunos from "/components/admin/listaalunos";
import { Montserrat } from "next/font/google";
import Header from "components/admin/header";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

export default function HomeAdmin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [verificando, setVerificando] = useState(true); // estado para controlar loading

  useEffect(() => {
    // Impede execução no servidor durante build
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/client/auth/verify-token", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setAuthorized(true);
        } else {
          localStorage.removeItem("token");
          router.push("/admin/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/admin/login");
      })
      .finally(() => {
        setVerificando(false);
      });
  }, [router]);

  if (verificando) return <p>Verificando autenticação...</p>;
  if (!authorized) return null;

  return (
    <div className={montserrat.variable}>
      <Header url="admin/login" />
      <ListaAlunos />
    </div>
  );
}
