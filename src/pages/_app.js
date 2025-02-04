import "@/styles/globals.css";
import { Lexend } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/redux/providers";
import { Bounce, Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import React, { Suspense } from "react";
import Loader from "@/components/ReUseableComponents/Loader";
import { TranslationProvider } from "@/components/Layout/TranslationContext";
import PushNotificationLayout from "@/components/firebaseNotification/PushNotification";

const font = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  
  return (
    <main className={font.className}>
      <Providers>
        <ThemeProvider attribute="class">
          <Suspense fallback={<Loader />}>
            <TranslationProvider>
                <PushNotificationLayout>
                <Component {...pageProps} />
                </PushNotificationLayout>
            </TranslationProvider>
          </Suspense>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            // theme="colored"
            transition={Bounce}
          />
        </ThemeProvider>
      </Providers>
    </main>
  );
}
