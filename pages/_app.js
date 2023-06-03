import { LivepeerConfig } from '@livepeer/react';
import LivepeerClient from '../client';
import '../styles/globals.css';
 
function MyApp({ Component, pageProps }) {
  return (
    <LivepeerConfig client={LivepeerClient}>
      <Component {...pageProps} />
    </LivepeerConfig>
  );
}
 
export default MyApp;