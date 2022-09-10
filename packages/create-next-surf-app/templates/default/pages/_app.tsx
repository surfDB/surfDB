import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [authenticationStatus, setAuthenticationStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');

  const [user, setUser] = useState(null);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch('/api/auth/nonce');
      const res = await response.json();
      return res;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      console.log({ signature });
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authSig: {
            message,
            signature,
            signedMessage: message.prepareMessage(),
          },
        }),
      });
      console.log({ verifyRes });
      setAuthenticationStatus(
        verifyRes.ok ? 'authenticated' : 'unauthenticated'
      );
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setAuthenticationStatus('unauthenticated');
    },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      const user = await res.json();
      console.log({ user });
      setAuthenticationStatus(
        user.address ? 'authenticated' : 'unauthenticated'
      );
    })();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      >
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme()}
          modalSize="compact"
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default MyApp;
