import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

// Import Inter font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Project-specific weights
  display: "swap", // Improves performance with immediate fallback font
});

// Import Merriweather font
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"], // For display and headings
  display: "swap", // Ensures text renders immediately
});

export const metadata = {
  title: "ChirpChecker",
  description: "Ensure the credibility of your chirps with seamless verification.",
  keywords: "ChirpChecker, credibility verification, fact-checking, AI tools",
  author: "ChirpChecker Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Meta Tags for SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
      </head>
      <body className="antialiased bg-gray-50 text-gray-800">
        {/* Main Application Layout */}
        {children}
      </body>
    </html>
  );
}
