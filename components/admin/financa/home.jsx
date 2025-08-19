import { useRef } from "react";
import styles from "./home.module.css"

export default function HomeFinancas({totalAtivos, aVencer, atrasados}){
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    

    return(
        <div className={styles.Container}>
            <div className={styles.Header}>
                <h1 className={styles.Title}>Minhas Finanças</h1>
            </div>

            <div className={styles.WrapperCardsInformation}>

                <div className={`${styles.CardsInformation } ${styles.Azul}`}>
                    <div className={styles.CardsWapperNumber}>
                        <div className={styles.CardsNumber}>{totalAtivos}</div>
                        <div className={styles.CardsNumberInformation}>(Alunos)</div>
                    </div>
                    <div className={styles.CardsSobre}>Total Ativos</div>
                </div>

                <div className={`${styles.CardsInformation } ${styles.Verde}`}>
                    <div className={styles.CardsWapperNumber}>
                        <div className={styles.CardsNumber}>{aVencer}</div>
                        <div className={styles.CardsNumberInformation}>(Alunos)</div>
                    </div>
                    <div className={styles.CardsSobre}>A vencer</div>
                </div>

                <div className={`${styles.CardsInformation } ${styles.Vermelho}`}>
                    <div className={styles.CardsWapperNumber}>
                        <div className={styles.CardsNumber}>{atrasados}</div>
                        <div className={styles.CardsNumberInformation}>(Alunos)</div>
                    </div>
                    <div className={styles.CardsSobre}>Atrasados</div>
                </div>
            </div>

        </div>
    )
}