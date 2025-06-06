// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";
import axios from "axios";

export default function Document({ favicon }) {
  return (
    <Html lang="en">
      <Head>
        {/* Dynamic favicon rendered on server-side */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0277fa" />

        <link rel="icon" href={favicon ? favicon : '/favicon'} sizes="32x32" type="image/png" />
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_PLACE_API_KEY}&libraries=places&loading=async`}></script>
        
        {/* Site Behaviour Tracking Script */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var sbSiteSecret = '581c62ee-1ee8-4b0c-a613-c9007ff98397';
                window.sitebehaviourTrackingSecret = sbSiteSecret;
                var scriptElement = document.createElement('script');
                scriptElement.async = true;
                scriptElement.id = 'site-behaviour-script-v2';
                scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=' + sbSiteSecret;
                document.head.appendChild(scriptElement); 
              })();
            `
          }}
        /> */}
      </Head>
      <body className="!pointer-events-auto">
        <Main />
        <NextScript />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </Html>
  );
}

// Fetch favicon from API in `getInitialProps`
Document.getInitialProps = async (ctx) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}get_settings`;
    const res = await axios.post(url);
    const favicon = res.data?.data?.general_settings?.favicon;

    return { ...initialProps, favicon };
  } catch (error) {
    console.error("Error fetching favicon:", error);
    return { ...initialProps, favicon: null };
  }
};

