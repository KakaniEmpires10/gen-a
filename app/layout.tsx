import type { Metadata } from "next";
import "./globals.css";
import 'next-cloudinary/dist/cld-video-player.css';
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { playfair, poppins } from "@/lib/font";

export const metadata: Metadata = {
  title: "gen-a",
  description: "katalisator generasi unggul yang terkemuka, mandiri, berwawasan global, inovatif, dan aktif dalam mengembangkan evidence-based solution atas permasalahan di masyarakat",
  keywords: "lembaga edukasi, riset, training, pengabdian, katalisator generasi unggul, lembaga pendidikan, lembaga riset, lembaga pelatihan, lembaga pengabdian masyarakat, gen-a, lsm, lembaga sosial, lembaga penelitian, lembaga pendidikan tinggi, banda aceh, lsm banda aceh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} antialiased`}
      >
        <NextTopLoader color="#Eab308" showSpinner={false} />
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              fontSize: "16px",
              padding: "16px 20px",
              borderRadius: "12px",
              minWidth: "300px",
            },
            success: {
              style: {
                background: "#16a34a",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#16a34a",
              },
            },
            error: {
              style: {
                background: "#dc2626",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
