import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ThemeBoot } from "@/components/theme-boot";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";

const APP_NAME = "Pear Rivière Generator";
const THEME_BOOT = `try{var t=localStorage.getItem('riviere-theme');document.documentElement.dataset.theme=t==='white'?'white':'black';if(localStorage.getItem('riviere-lang')==='th')document.documentElement.lang='th'}catch(e){}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0c0b0a" },
      {
        name: "description",
        content:
          "Pear-shaped convertible rivière pattern generator for gold and silver, with true pear dimensions, carat, pricing, and manufacturing output.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <PreviewHostBridge />
        <ThemeBoot />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            className: "bg-card text-foreground border-border",
          }}
        />
        <Scripts />
      </body>
    </html>
  ),
});
