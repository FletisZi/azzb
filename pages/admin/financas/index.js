import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "components/admin/sidebar";
import styles from "../layout.module.css"
import ListaAlunos from "components/admin/listaalunos";
import AreaMain from "components/admin/areaMain";
import Logo from "components/logo";
import HomeFinancas from "components/admin/financa/home";
import GraficHeader from "components/admin/financa/CreditGauge";
import BtnBackLink from "components/admin/btnBackForLink";

export default function (){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [verificando, setVerificando] = useState(true); // estado para controlar loading

    const [activeComponent, setActiveComponent] = useState("");
    
  
    const [values, setValues] = useState(null);
    const [data, setData] = useState({credito:300,debito:700,pix:100});



    useEffect(() => {
        const fetchData = async () => {
        const token = localStorage.getItem("token");
        const mes = 8; // ou use new Date().getMonth() + 1
        const status = "a vencer";

        console.log("Token:", token);

        const response = await fetch("/api/admin/get-mensalidades", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mes }),
        });

        const data = await response.json();
        setValues(data);
        };

        fetchData();
    }, []);


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

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <Logo />

                <button className={styles.logoutButton}>SAIR</button>
            </div>

            <div className={styles.containerSection}>
                <Sidebar setActiveComponent={setActiveComponent} />
                <div className={styles.containerCard}>
                    <BtnBackLink />
                    {values && <HomeFinancas totalAtivos={values.alunos_ativos} aVencer={values.mensalidades_a_vencer} atrasados={values.mensalidades_atraso}/>}
                    <GraficHeader data={data}/>
                </div>
            </div>
        </div>
    )
}


