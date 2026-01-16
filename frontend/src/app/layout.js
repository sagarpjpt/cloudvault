import { Geist, Geist_Mono } from "next/font/google";
import {Toaster} from 'react-hot-toast'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CloudVault | Store & Share Securely",
  description: "Secure cloud-based file storage and sharing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster
          toastOptions={{
            style: {
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
