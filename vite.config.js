import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

    //for later use when im done 
    //   "@app": path.resolve(__dirname, "src/app"),

    //   // Shared building blocks
    //   "@components": path.resolve(__dirname, "src/components"),
    //   "@assets": path.resolve(__dirname, "src/assets"),
    //   "@constants": path.resolve(__dirname, "src/constants"),

    //   // Feature-based architecture
    //   "@features": path.resolve(__dirname, "src/features"),

    //   // Cross-cutting concerns
    //   "@hooks": path.resolve(__dirname, "src/hooks"),
    //   "@lib": path.resolve(__dirname, "src/lib"),
    //   "@services": path.resolve(__dirname, "src/services"),
    //   "@queries": path.resolve(__dirname, "src/queries"),
    //   "@store": path.resolve(__dirname, "src/store"),
    //   "@router": path.resolve(__dirname, "src/router"),
    //   "@i18n": path.resolve(__dirname, "src/i18n"),
      // "@mappers": path.resolve(__dirname, "src/mappers"),
    // ,
    },
  },
  // server: {
  //   historyApiFallback: true,
  // },
})
