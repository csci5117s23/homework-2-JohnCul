import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css'


export default function Home() {
    const router = useRouter();
    function changeItem(){
        router.push('/todos');
    }


    return(
    <div className={styles.errorWrapper}>
        <div>ERROR</div>
        <button className="pure-button" onClick={changeItem}>Return to Todos</button>
    </div>
    )
}