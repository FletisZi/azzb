import { FaDollarSign, FaUser } from "react-icons/fa";
import styles from "./areaMain.module.css";
import { useRouter } from "next/router";

export default function AreaMain({ setActiveComponent }) {
  const router = useRouter();

  return (
    <div className={styles.mainArea}>
      <div
        className={styles.card}
        onClick={(e) => {
          e.preventDefault;
          setActiveComponent("listaalunos");
        }}
      >
        <FaUser className={styles.cardIcon} />
        Alunos
      </div>

      <div className={styles.card} onClick={()=>{router.push('/admin/financas')}}>
        <FaDollarSign className={styles.cardIcon} />
        Finanças
      </div>
    </div>
  );
}
