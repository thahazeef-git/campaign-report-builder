import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <script type="module" src="https://md-block.verou.me/md-block.js" />
      <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="true" fetchpriority="high" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <meta name="description" content="Campaign Report Builder"></meta>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter&family=Kaushan+Script&display=swap" rel="stylesheet" />
      <title>Campaign Report Builder</title>
    </Head>
    <Component {...pageProps} />
  </>;
}

export default MyApp;