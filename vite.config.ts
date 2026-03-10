import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

  return {
    server: {
      host: "::",
      port: 8089,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/explain-term": {
          target: "https://expvlrwhuyvamakewwoj.supabase.co",
          changeOrigin: true,
          rewrite: () => "/functions/v1/explain-term",
          headers: {
            apikey: publishableKey,
            Authorization: `Bearer ${publishableKey}`,
          },
        },
        "/api/auth": {
          target: "https://expvlrwhuyvamakewwoj.supabase.co",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/auth/, "/auth/v1"),
          headers: {
            apikey: publishableKey,
            Authorization: `Bearer ${publishableKey}`,
          },
        },
        "/api/admin-fallback-login": {
          target: "https://expvlrwhuyvamakewwoj.supabase.co",
          changeOrigin: true,
          rewrite: () => "/functions/v1/admin-fallback-login",
          headers: {
            apikey: publishableKey,
            Authorization: `Bearer ${publishableKey}`,
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
