import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>TartiSwap</title>
        <meta
          name="description"
          content="A decentralized exchange made for true tartiners"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <h1>TartiSwap</h1>
      </div>
    </>
  );
}
