import { Geist_Mono, Open_Sans } from "next/font/google";
import Head from "next/head";
import { KeyboardSignature } from "@/components/KeyboardSignature";

const sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Digitized Signatures</title>
      </Head>
      <div
        className={`w-screen h-screen flex flex-col items-center justify-center ${sans.variable} ${mono.variable} font-sans`}
      >
        <KeyboardSignature />

        <a
          href="https://github.com/cnrad/keyboard-signature"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-neutral-500 absolute bottom-4 w-auto mx-auto text-center hover:underline hover:text-neutral-200"
        >
          github
        </a>
      </div>
    </>
  );
}
