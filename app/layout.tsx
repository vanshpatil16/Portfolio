import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vansh Patil — ML Engineer & Researcher",
  description:
    "Vansh Patil — Computer Science undergrad researching transformer architectures and speech processing at IIT Patna. Builds end-to-end ML pipelines, ships production FastAPI backends, and wins hackathons.",
  metadataBase: new URL("https://vanshpatil.dev"),
  openGraph: {
    title: "Vansh Patil — ML Engineer & Researcher",
    description:
      "ML engineer & researcher. NLP, speech, RAG, knowledge graphs. IIT Patna · DJ Sanghvi.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-accent="chartreuse" data-display="serif" data-projects="cards">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="no-grain no-cursor">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
