import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="!pointer-events-auto">
      <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_PLACE_API_KEY}&libraries=places&loading=async`}></script>
        <Main />
        <NextScript />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </Html>
  );
}
