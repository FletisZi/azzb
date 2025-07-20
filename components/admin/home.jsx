import styles from "./home.modules.css";
export default function HomeAdmin() {
  return (
    <div className={styles.containerOptions}>
      <div className={styles.headerOptions}>
        <img />
        <div className={styles.titleOptions}>Área Administrativa</div>
      </div>

      <div className={styles.wrapperOptionsLinks}>
        <div className={styles.optionsButtons}>
          icon <button className={styles.btnLinks}>Alunos</button>
        </div>
        <div className={styles.optionsButtons}>
          icon <button className={styles.btnLinks}>Finanças</button>
        </div>
      </div>
    </div>
  );
}
