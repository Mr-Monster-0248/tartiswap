import { NetworkConnector } from '@web3-react/network-connector';
export const network = new NetworkConnector({
  urls: {
    1: 'https://mainnet.infura.io/v3/802b576107de4648a78e369a3b467d93',
    3: 'https://ropsten.infura.io/v3/802b576107de4648a78e369a3b467d93',
    4: 'https://rinkeby.infura.io/v3/802b576107de4648a78e369a3b467d93',
  },
  defaultChainId: 4,
});
