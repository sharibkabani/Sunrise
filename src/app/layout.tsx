"use client";

import "@/app/globals.css";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/Navbar";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Insert the Voiceflow chat script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
        (function(d, t) {
            var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
            v.onload = function() {
              window.voiceflow.chat.load({
                verify: { projectID: '67958801464ea16365530bb4' },
                url: 'https://general-runtime.voiceflow.com/',
                versionID: 'production'
              });
            }
            v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
            v.type = "text/javascript"; 
            s.parentNode.insertBefore(v, s);
        })(document, 'script');
      `;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
