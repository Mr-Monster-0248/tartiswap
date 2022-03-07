import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import { WalletButton } from '../components/WalletButton';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { active, account } = useWeb3React();

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
        <WalletButton />
        {active && `hello ${account}`}
      </div>
    </>
  );
}
