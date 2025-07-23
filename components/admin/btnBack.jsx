import { Undo2 } from "lucide-react";
import styles from "./btnBack.module.css";

export default function BtnBack({ link, setActiveComponent }) {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => {
          setActiveComponent(link);
        }}
      >
        <Undo2 size={25} color={"#0083FF"} strokeWidth={3} />
      </button>
    </div>
  );
}
