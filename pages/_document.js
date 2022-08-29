// In _document.js
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5050549310032121"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        async="true"
        onError={ (e) => { console.error('GoogleAds script failed to load', e) }}
      ></Script>
      </body>
    </Html>
  )
}