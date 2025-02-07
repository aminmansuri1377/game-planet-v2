import "animate.css";
import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import "../../i18n";
import type { AppType } from "next/app";
import { trpc } from "../../utils/trpc";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RecoilRoot>
      <Toaster position="top-right" reverseOrder={false} />

      <RecoilNexus />

      <SessionProvider session={session}>
        <div className="glow-effect text-white">
          <Header />
          <div className="px-8 flex flex-col items-center justify-center min-h-screen">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </RecoilRoot>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp));
