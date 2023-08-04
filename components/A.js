import Link from "next/link"
import styles from '../styles/A.module.css';

export default function A ({ text, href }) {
    return (
        <div className={styles.wrapper}>
            <Link href={href} className={styles.link}>
                {text}
            </Link>
        </div>
    )
}