import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import localFont from "next/font/local";
import Provider from '@/context/Provider'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Human Coherence Evaluation of TopicModels",
  description: "Created by Manuel Couto Pintos and David E. Losada Carril",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html className='h-full w-full overflow-hidden' lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full relative group ${inter.className}`}>
          <div className="w-full h-full absolute bg-gray-200 p-4 bg-slate-950/30 flex place-items-center before:absolute 
                  before:h-[400px] before:w-[480px] before:-translate-x-1/3 before:rounded-full
                  before:blur-2xl before:content-[''] after:absolute after:-z-20 
                  after:h-[280px] after:w-[240px] after:translate-x-3/4 after:bg-gradient-conic 
                  after:blur-2xl after:content-[''] before:bg-gradient-to-br 
                  before:from-transparent before:to-blue-700 before:opacity-10 after:from-sky-900 
                  after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] justify-center -inset-1 pointer-events-none"/>

              <div className='w-full h-full z-40 px-4 pt-2 flex flex-col justify-between gap-2 max-h-screen'>
                <div className='h-[70px] w-full py-2'>
                  <NavBar />
                </div>
                <div className='h-[calc(100%-85px)] w-full flex justify-center '>
                  <div className="h-full w-full pt-2">
                    {children}
                    <ToastContainer/>
                  </div>
                </div>
              </div>
        </body>
      </html>
    </Provider>
  );
}
