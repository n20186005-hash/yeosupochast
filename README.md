# Independent Yeosu Nangman Pocha guide

Korean Astro site at yeosupochast.com. Existing homepage and three policy/settings URLs are preserved. It is not the city, a merchant directory, booking service or live opening-status system.

Use the pinned package/lockfile versions. Verify with `pnpm check`, `pnpm build` and `node scripts/behavior-test.mjs`; `ASTRO_TELEMETRY_DISABLED=1` avoids local telemetry setup where required. Baseline dist is ignored/untracked and CI builds it. Source/public assets and behavior scripts must be committed. The available local Node 24.19 runtime can report a warning against the existing 24.18.1 pin; checks/build results are recorded separately from that warning.

The repository's official Cloudflare Workers Builds check maps production to project yeosupochast. Worker ASSETS handles HTTPS-apex redirects with path/query preserved and real noindex404. Configuration does not alter domain bindings, preview or Access.

## Public sources reviewed 20 October 2026

- https://yeosu.go.kr/tour/leisure/bambada/gun_carriage and official mobile version: city tourism lists Hamel-ro102, beneath Geobukseon Bridge since1 October2019, scale18 stalls,18:00–next-day01:00 in both winter/summer, card-payment principle, first-Wednesday closure with holiday and April–June/August–October exceptions, and weather/other closure provisions. The full direct page timed out in this review; the official indexed content/mobile content was available. Individual openings are not guaranteed.
- https://data.visitkorea.or.kr/linkedview/2647847 : tourism data still shows summer18–01 and winter17–24, plus first-Wednesday exceptions and parking. Its winter hours differ from city tourism; preserve attribution rather than promote either into an unconditional schema schedule.

- https://maps.app.goo.gl/yUMFWpsQHDT4Kw1X6 :20 October2026 snapshot3.5/7341, pin34.7364135,127.7493336,102 Hamel-ro, all seven days18:00–next-day01:00. No telephone or website displayed. This place listing does not override city closure exceptions or prove every stall open; pin is orientation, not an entrance. Old reviews are not republished or treated as today’s merchant list.

Current transport routes, accessibility across every segment, admission fees, menus, food suitability and nearby-entry conditions were not verified. Nearby places and accommodation areas are planning candidates requiring their own checks.

Image attribution and limitations are in LICENSES.md. Analytics remains optional and refusal disables it immediately; failed persistence cannot silently revive a stale grant in the same tab. Privacy notice describes the actual Maps iframe, analytics and hosting; there is no inquiry/account/booking interface.
