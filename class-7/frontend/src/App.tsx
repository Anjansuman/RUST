import { Coins } from "lucide-react"
import { MainBlock } from "./Components/MainBlock"
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useEffect, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// import "@solana/wallet-adapter-react-ui/styles.css";


function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
  ], [network]);


  return <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect >
        <WalletModalProvider>
          <div className='h-screen w-screen bg-gray-900 text-white p-4'>
            <header className="text-3xl font-semibold flex items-center gap-3 fixed ">
              <div>
                <Coins />
              </div>
              <div>
                Coin Flip
              </div>
            </header>

            {!connected() ?
              <div>
                <WalletMultiButton />
              </div>
              :
              <div className="h-full flex items-center justify-center ">
                <MainBlock />
              </div>
            }
            
          </div>
        </WalletModalProvider>
      </WalletProvider>
  </ConnectionProvider>
}

function connected() {
  const connected = useConnection();

  return connected ? true : false;
}


export default App
