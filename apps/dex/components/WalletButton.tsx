import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { injected } from '../wallets/connectors/injected';

export const WalletButton = () => {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React<ethers.providers.Web3Provider>();

  const connect = () => {
    activate(injected).catch((err) => console.error);
  };

  const disconnect = () => {
    deactivate();
  };
  return (
    <button onClick={active ? disconnect : connect}>
      {active ? 'disconnect from' : 'connect to'} metamask
    </button>
  );
};
