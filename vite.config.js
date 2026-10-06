import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


function inlineCss() {
  return {
    name: 'inline-css',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      return html.replace(
        /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g,
        (match, href) => {
          const key = href.replace(/^\//, '')
          const asset = ctx.bundle[key]
          if (!asset) return match
          delete ctx.bundle[key]
          return `<style>${asset.source}</style>`
        },
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), inlineCss()],

    server: {
      port: Number(env.APP_PORT) || 5173,
    },

    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1',
      ),
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  }
})
