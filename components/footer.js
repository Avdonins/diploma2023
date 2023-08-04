import A from "./A";
import styles from '../styles/footer.module.css';

export default function Footer () {
    return (
        <>
            <div className={styles.footer}>
                <A
                    href={"/"}
                    text={"Главная"}
                />
                <p style={{color: "white"}}>Kovalev Roman Evgenievich 4411</p>
            </div>
        </>
    )
}