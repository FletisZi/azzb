import { BsPersonCircle } from 'react-icons/bs';
import styles from './sidebar.module.css';
import { FaUser } from 'react-icons/fa';
import { CircleDollarSign } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Sidebar({setActiveComponent}){
    const router = useRouter();

    return(
        <div className={styles.sidebar}>
          <BsPersonCircle size={60} color="#90cdf4" />
          <div className={styles.sidebarTitle}>Área Administrativa</div>

          <div className={styles.menuItem} onClick={(e )=>{e.preventDefault; setActiveComponent('listaalunos');}}>
            <FaUser size={50} className={styles.menuIcon} />
            Alunos
          </div>

          <div className={styles.menuItem}>
            <CircleDollarSign size={50} color={'#A6DDFE'} className={styles.menuIcon} />
            Finanças
          </div>
        </div>
    )
}