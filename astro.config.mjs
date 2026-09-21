import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 배포 도메인은 https 고정값이며, 필요할 때만 환경변수로 덮어씁니다.
// site가 있어야 canonical·절대 og:url·hreflang·sitemap이 함께 생성됩니다.
const SITE = process.env.SITE_URL?.trim() || 'https://yeosupochast.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
