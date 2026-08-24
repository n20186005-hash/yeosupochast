# 여수 낭만포차거리 안내

여수시 하멜로 102의 **여수밤바다 낭만포차거리**를 소개하는 독립 비영리 관광정보 사이트입니다. Astro + Tailwind CSS + TypeScript로 구성한 정적 사이트이며 Cloudflare Workers의 정적 자산 배포를 대상으로 합니다.

## 실행 환경

- Node.js: `24.18.1` (`.node-version`, `engines` 고정)
- pnpm: `11.22.0` (`packageManager`, `engines` 고정)
- Astro: `7.2.4`
- TypeScript: `6.0.3`
- Tailwind CSS: `4.3.3`

## 설치 및 검사

```bash
corepack enable
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
```

## 도메인 설정

도메인은 **한 곳**에서만 주입합니다. `.env` 또는 배포 환경변수에 아래 값을 설정하세요.

```bash
SITE_URL=https://실제-도메인
```

`SITE_URL`이 비어 있어도 빌드됩니다. 이 경우 canonical/절대 `og:url`을 생략하고, `@astrojs/sitemap`도 활성화하지 않습니다. 도메인이 설정되면 Astro의 `site` 값을 통해 canonical, Open Graph, JSON-LD와 sitemap이 같은 기준 URL을 사용합니다.

## Cloudflare Workers 배포

```bash
pnpm deploy
```

`wrangler.jsonc`는 `dist/`를 Workers 정적 자산으로 배포합니다.

## 개인정보·쿠키

- Google Analytics 측정 ID: `G-HXM22WWPKP`
- 분석 동의가 브라우저 저장소에 `analytics: true`로 저장된 경우에만 Google Analytics 스크립트를 불러옵니다.
- `/privacy/`, `/terms/`, `/cookies/`는 팝업이 아닌 독립 페이지입니다.

## 이미지 라이선스

프로젝트에 사진 파일을 로컬로 포함했습니다.

- `yeosu-night.jpg` — thomas park, Wikimedia Commons, CC BY 2.0
- `hamel-lighthouse.jpg` — Altostratus, Wikimedia Commons, CC BY-SA 4.0
- `hamel-memorial-hall.jpg` — Altostratus, Wikimedia Commons, CC BY-SA 4.0
- `odongdo-bridge.jpg` — Kwj2772, Wikimedia Commons, CC BY-SA 4.0

사진 저작권은 각 원저작자에게 있습니다.

## 주요 공개자료

- 여수시청·여수관광문화: 낭만포차 운영시간, 휴무, 위치, 운영현황
- 한국관광공사 관광정보·열린관광: 위치, 좌표, 주차, 무장애 편의정보
- 한국공항공사 여수공항: 공항 대중교통·택시 정보

실시간 영업, 날씨, 버스 노선, 주차 여유 등은 변동성이 커 출발 직전 공식·실시간 채널에서 재확인해야 합니다.
