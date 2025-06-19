import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // 共通の基本設定
  const config = {
    plugins: [react(), tailwindcss()],
    base: "/",
  };

  // "serve" (開発モード) の場合は　HTTPSやポートの設定を追加する
  if (command === "serve") {
    return {
      ...config,
      server: {
        https: {
          key: fs.readFileSync(
            path.resolve(
              __dirname,
              "../backend/config/cert.dev/localhost-key.pem"
            )
          ),
          cert: fs.readFileSync(
            path.resolve(__dirname, "../backend/config/cert.dev/localhost.pem")
          ),
        },
        port: 3000,
      },
    };
  }

  // "build" (本番ビルドモード) の場合は　HTTPS設定なしで返す
  return config;
});
