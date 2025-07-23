import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ListaAlunos from "/components/admin/listaalunos";
import { Montserrat } from "next/font/google";
import Header from "components/admin/header";
import styles from "./layout.module.css";
import Logo from "components/logo";
import Sidebar from "components/admin/sidebar";
import AreaMain from "components/admin/areaMain";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export default function HomeAdmin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [verificando, setVerificando] = useState(true); // estado para controlar loading

  const [activeComponent, setActiveComponent] = useState("");

  const renderComponent = () => {
    if (activeComponent === "")
      return <AreaMain setActiveComponent={setActiveComponent} />;
    if (activeComponent === "listaalunos")
      return <ListaAlunos setActiveComponent={setActiveComponent} />;

    return null;
  };

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
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo />

        <button className={styles.logoutButton}>SAIR</button>
      </div>

      <div className={styles.containerSection}>
        <Sidebar setActiveComponent={setActiveComponent} />

        {renderComponent()}
      </div>
    </div>
  );
}
