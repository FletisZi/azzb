import { Undo2 } from "lucide-react";
import styles from "./btnBack.module.css";
import { useRouter } from "next/router";

export default function BtnBackLink({ link }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => {
          router.push('/admin')
        }}
      >
        <Undo2 size={25} color={"#0083FF"} strokeWidth={3} />
      </button>
    </div>
  );
}
