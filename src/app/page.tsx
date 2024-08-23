import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <h1>Horror Alarm</h1>
        </div>
      </div>
    </main>
  );
}
