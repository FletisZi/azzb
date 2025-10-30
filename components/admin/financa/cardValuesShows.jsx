import { useRouter } from 'next/router';
import style from './cardValuesShows.module.css'




export default function CardValuesShows({ children, text, value, colorBK, urlLink }){
    const router = useRouter();

    const ruteLink = ()=>{
        router.push(urlLink);
    }
    return(
        <div className={style.conteiner}>
            <div className={style.wrapper}>
                <h3 className={style.text}>{text}</h3>
                <span className={style.value}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className={style.colorIcon} style={{ backgroundColor: colorBK }} onClick={ruteLink}>
                { children }
            </div>
        </div>
    )
}