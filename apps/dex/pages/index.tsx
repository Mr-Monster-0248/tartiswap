import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { WalletButton } from '../components/WalletButton';
import styles from '../styles/Home.module.css';
import { useTartine } from '../wallets/contracts/TartisSwap';

export default function Home() {
  const { active, account, library } =
    useWeb3React<ethers.providers.Web3Provider>();

  const [ballance, setBallance] = useState('');
  const [tartineBallance, setTartineBallance] = useState('');
  const { tartine } = useTartine('0x5fbdb2315678afecb367f032d93f642f64180aa3');

  useEffect(() => {
    if (account) {
      library.getBalance(account).then((ballanceBigNumber) => {
        setBallance(ethers.utils.formatEther(ballanceBigNumber));
      });
    }
  }, [account, library]);

  useEffect(() => {
    if (account) {
      tartine.balanceOf(account).then((b) => {
        setTartineBallance(ethers.utils.formatEther(b));
      });
    }
  });

  const faucet = (amount: number) => {
    const bigNumber = ethers.BigNumber.from(amount).mul(
      ethers.BigNumber.from(10).pow(18),
    );
    tartine.faucet(bigNumber);
  };

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
        {active && (
          <>
            <p>Hello {account}</p>
            <p>ballance = {ballance}</p>
            <p>Tartine ballance = {tartineBallance}</p>
          </>
        )}

        <button onClick={() => faucet(10)}>give 10 Tartine</button>
      </div>
    </>
  );
}
