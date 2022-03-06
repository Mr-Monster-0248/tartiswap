import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>TartiFaucet</title>
        <meta name="description" content="A faucet for the great tartiners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <h1>TartiFaucet</h1>
      </div>
    </>
  );
}
