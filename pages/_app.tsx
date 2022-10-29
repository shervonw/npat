import type { AppProps } from 'next/app'
import { StateReducerProvider, UsersProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UsersProvider>
      <StateReducerProvider>
        <Component {...pageProps} />
      </StateReducerProvider>
    </UsersProvider>

  )
}

export default MyApp
