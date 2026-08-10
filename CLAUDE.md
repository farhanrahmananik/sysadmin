# CLAUDE.md — Portfolio site build brief

Project context for Claude Code. Read this before changing anything.

## What this is

A single-page personal portfolio for **Md Farhan Rahman Anik** — infrastructure /
security engineer and PHP-Laravel developer based in Cottbus, Germany.
Audience: German recruiters and hiring managers for Werkstudent, IT administration,
cloud administration and security operations roles.

The page has one job: in thirty seconds, make a recruiter believe this person can
run enterprise systems *and* build the applications on them, then give them the CV,
the repositories and a way to make contact.

Current state: split into three files — `index.html`, `css/style.css`, `js/main.js` —
no build step, no bundler, and (since the performance pass) no third-party requests
at all: fonts and tech-stack icons are self-hosted. Open `index.html` in a browser
and it works: the stylesheet is linked in `<head>`, the script is loaded with `defer`
at the end of `<body>`. Inline `onerror` fallback handlers on `<img>` tags (icon and
thumbnail fallbacks) stay inline in the HTML by design — everything else lives in
the two external files. See **File structure** below.

## File structure

```
index.html              markup only — head, header, hero, sections, footer
impressum.html          legal notice (§ 5 DDG) — see Legal pages below
datenschutz.html        privacy policy (DSGVO) — see Legal pages below
verify/index.html       credentials page — SELF-CONTAINED, see Credentials page below
css/style.css           all CSS (was the inline <style> block)
js/main.js              all JS (was the inline <script> block), loaded with defer
assets/
  fonts/                 self-hosted woff2 subsets (latin + latin-ext) — see Fonts below
  projects/              five project thumbnail WebPs (see Projects section)
  images/stack/          all 45 tech-stack icons, self-hosted (see Tech stack section)
  images/logos/          btu.png, primeasia.png — processed university logos (see below)
Md_Farhan_Rahman_Anik_CV.pdf
```

When editing, CSS changes go in `css/style.css`, JS changes go in `js/main.js`.
Don't reintroduce an inline `<style>` or `<script>` block in `index.html` — the
split is deliberate (Task A of the original build brief) and verified to render
identically to the pre-split single file.

## Design system — do not drift from this

Colours (CSS custom properties, defined in `:root`):

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0C0E` | page background |
| `--ink-raise` | `#131519` | card hover |
| `--ink-deep` | `#060708` | marquee, contact, footer |
| `--line` | `#23262C` | borders, buttons |
| `--line-soft` | `#191C21` | hairline dividers |
| `--fog` | `#868C96` | secondary text |
| `--fog-bright` | `#AEB4BE` | body copy |
| `--paper` | `#ECEDE9` | primary text |
| `--signal` | `#D9A441` | amber accent — **sparingly** |
| `--live` | `#6FA88B` | status dots only |

Never introduce a new colour. If something needs emphasis, use `--signal`, and if
`--signal` is already doing work nearby, use weight or spacing instead.

Type:
- Display — **Archivo** 600–800, uppercase, tracking `-.03em`. Headlines only.
- Body — **IBM Plex Sans** 300–400.
- Utility — **IBM Plex Mono** for labels, eyebrows, tags, dates, stats.

The mono/Plex pairing is deliberate: it belongs to the enterprise-infrastructure
world the subject works in. Keep it.

Structural rules:
- Section labels are mono, uppercase, prefixed with an amber `/`.
- Sections divide with 1px hairlines, not shadows, not rounded cards.
- Border radius is `0` everywhere. Do not add any.
- Signature element = the console strip in the hero (typed `whoami` output) plus
  the live Berlin clock and status dot in the facts list.
- Motion system (complete — do not add more): (1) hero load sequence — console
  types, the two name lines rise staggered, role/body fade up, then one amber
  scanline sweeps the name once; (2) cursor spotlight in the hero — a dot grid
  revealed through a radial mask plus a faint amber glow following the pointer
  (fine pointers only); (3) a 2px amber scroll-progress bar fixed to the top
  edge; (4) hover traces — a 1px amber line draws along the top of focus and
  project cards; (4b) experience timeline — each role row has a left rail that
  draws downward on entry, a hollow diamond node that fills amber, bullets that
  cascade in with a stagger, and a row-hover raise that warms the date and
  reveals amber HUD corner brackets (gradient-painted on `.role::after`); the
  date column carries mono duration chips and a filled "Most recent" chip on
  the newest role; (5) buttons lift 2px on hover, the footer wordmark stroke
  warms toward amber; (6) scrollspy — an `IntersectionObserver` (rootMargin
  `-45% 0px -50% 0px`) marks the nav link for the section in view with `.active`
  (amber text + a 1px amber underline); section anchors carry
  `scroll-margin-top: 80px` so the sticky header never covers a jump target;
  (7) identity-card 3D tilt — on fine-pointer devices, `.pcard` tracks the
  cursor with `rotateX`/`rotateY` (max ~4deg, `perspective(900px)`) while
  hovered, and returns to its static `-2deg` resting rotation on mouseleave;
  (8) `::selection` is styled amber-on-ink (`--signal` background, `--ink`
  text); (9) a single styled `console.log` easter egg (amber wordmark + the
  GitHub link) for anyone opening DevTools — nothing else may log to the
  console; (10) the tab title swaps to `⚠ Connection idle — Farhan` on
  `window` blur and restores the original title on focus. Items (1), (2), (4b)
  and (7) are motion/transform effects and die under `prefers-reduced-motion`
  and/or on touch (7 and 2 also require `pointer: fine`); (6), (8), (9) and
  (10) are not motion and are unaffected by reduced-motion. Anything beyond
  this list is scope creep: refuse it, or remove an existing effect first.
- Hero identity card (`.pcard`): a light `--paper` card in the dark hero — photo
  with a 10px paper inset, amber `Portfolio / 2026` badge on the photo, then
  eyebrow, name, one-line summary, location, and a two-cell GitHub/LinkedIn link
  bar. The card sits at `-2deg` with a 1px `--signal` outline frame offset behind
  it; on touch devices or under `prefers-reduced-motion` it simply straightens
  to `0deg` on hover/tap, and on fine-pointer desktops that straighten becomes
  the dynamic 3D tilt described in motion-system item (7). This card is the
  page's one light surface — do not introduce another. On mobile it caps at
  320px and moves above the intro.
- CV download link — **two elements, never both visible.** `.head-cta` is the
  bordered button in the header bar and is `display:none` at `<=880px`;
  `.nav-cta` is the last child of `<nav id="nav">`, `display:none` by default and
  `display:block` only inside that same `<=880px` block. Keep the pair exclusive:
  if both ever show, a screen reader reads the same link twice. `.nav-cta` is the
  primary action in the burger menu, not a seventh link, so it is a filled block —
  `background:var(--signal)`, `color:var(--ink-deep)`, full width, centred, 14px
  mono (one step up from the 13px nav links), `padding:16px`, `border-top:0` to
  drop the hairline the other rows carry, and `margin-top:14px` to separate it
  from them. `border-radius:0`, like everything except the `#cform` send pill.
  It also needs `:focus-visible{outline-color:var(--ink-deep)}`: the global focus
  ring is `--signal`, which is invisible on an amber fill. The menu's
  `.nav.open{max-height}` is a hard ceiling — it is 420px for seven rows, so
  adding a nav item means raising it or the new row is clipped. Both elements
  exist on all three pages (`index.html`, `impressum.html`, `datenschutz.html`).
- Contact form (`#cform`): name/email pair, subject, message, amber pill submit.
  The pill is the page's single border-radius exception; nothing else may be
  rounded. Submit builds a `mailto:` and opens the visitor's mail app — there is
  no backend and no data storage, which also keeps the Datenschutzerklärung
  simple. If a real backend is ever added (Formspree etc.), the privacy page must
  be updated in the same commit.
- Favicon (`assets/favicon.svg`): a fixed asset — the amber terminal-prompt mark
  (`--signal` background, a `--ink` chevron/prompt glyph and cursor bar). This is
  the final design; do not redraw, restyle, or "improve" it. `assets/favicon.ico`
  (32×32 + 16×16) and `assets/apple-touch-icon.png` (180×180, no transparency)
  are generated from this exact SVG — if the SVG ever needs to change, regenerate
  both from the new source rather than hand-editing the raster copies. Linked in
  `<head>` via three tags (`icon` SVG, `icon` ICO with `sizes="any"`,
  `apple-touch-icon`); apply the same three tags to any new HTML page added to
  the site (e.g. the still-pending Impressum/Datenschutzerklärung pages).

Quality floor, must survive every change:
- Responsive down to 360px.
- Visible `:focus-visible` outline in `--signal`.
- `prefers-reduced-motion` respected — typing, marquee and reveal all degrade.
- No layout shift on font load.

## Tasks, in order

1. **Remaining links.** All ten project links, the hero-card GitHub profile link
   and LinkedIn are real. Still a placeholder (`href="#"`): the Xing profile —
   ask the user for the URL.
2. **Project thumbnails — done.** See the **Projects section** below.
2. **CV file.** Drop `Md_Farhan_Rahman_Anik_CV.pdf` next to `index.html` so the
   header download button works.
3. **Photo asset.** The hero portrait is currently inlined as a base64 WebP so the
   file stays self-contained. Once the project has a folder, move it out: save
   `assets/profile.webp` (800×1000, ~70KB, already provided) and change the `img`
   `src` to `assets/profile.webp`. Add `loading="eager"` and `fetchpriority="high"`
   — it is above the fold, so it should not be lazy-loaded.
4. **Screenshots.** Each project card should carry one 16:9 screenshot above the
   title. Lazy-load these ones, keep them under 200KB each (WebP), and give every
   image real alt text. This is the single highest-impact change on the page.
5. **Impressum and Datenschutzerklärung — done.** `impressum.html` and
   `datenschutz.html`, same design system, linked from the footer on every
   page. See **Legal pages** below before editing either.
6. **Meta and social.** Add `og:title`, `og:description`, `og:image` (a 1200×630
   card built from the wordmark), and JSON-LD `Person` schema. (Favicon is done —
   see Design system below.)
7. **Performance pass — done.** Fonts self-hosted as `woff2` subsets with
   `font-display: swap` (Google Fonts request dropped); all 45 tech-stack icons
   self-hosted too (both CDNs dropped). Zero third-party requests on the page —
   see **Fonts** and **Tech stack section** below before adding anything that
   would reintroduce one. Lighthouse 95+ target not yet independently verified.

## Later, only if wanted

- Convert to Astro when a blog or per-project detail pages are needed. Not before —
  a static HTML/CSS/JS trio is the correct tool for the current content.
- A German-language toggle. Worth real points with German recruiters.

## Rules for edits

- No CSS frameworks. No jQuery. No build tooling — task 7 (performance pass) is
  done and didn't need any; the font/icon self-hosting was done with one-off
  scripts, not a permanent build step. Keep it that way.
- Keep it to `index.html` + `css/style.css` + `js/main.js` + `assets/` — no bundler,
  no npm dependency, no further splitting unless the project genuinely outgrows this.
- Do not add stock illustrations, gradient blobs, glassmorphism, or a hero video.
- Every claim on the page must be defensible in an interview. If a project's copy
  overstates what was built, cut the copy — not the interview.

## Fonts

All three families (Archivo, IBM Plex Sans, IBM Plex Mono) are self-hosted —
`assets/fonts/*.woff2`, `@font-face` rules at the top of `css/style.css`, no
Google Fonts request anywhere. Only `latin` and `latin-ext` subsets were kept
(the original Google CSS also serves `vietnamese`/`cyrillic`/`greek`, which are
unnecessary here and were dropped). Each weight has two `@font-face` blocks
(one per subset, distinguished by `unicode-range`) — that's why there are 18
blocks for 9 weight/family combinations, not 9. Archivo and IBM Plex Sans are
variable fonts on Google's end, so several weights legitimately point at the
same physical file per subset (e.g. Archivo 500/600/700/800 latin all share one
file) — that's correct, not a bug; don't "fix" it by duplicating files per
weight. To add a weight: fetch
`https://fonts.googleapis.com/css2?family=<Family>:wght@<weight>` with a
browser user-agent (Google only serves `woff2` to modern UAs), keep just the
`latin`/`latin-ext` blocks, download the referenced `.woff2` into
`assets/fonts/`, and append the block to `css/style.css`.

## Tech stack section

The Skills section is a logo tile grid (`.stack` / `.tile`): 52 tiles with a
mono label each. All icons are self-hosted in `assets/images/stack/` (45 files
— no `cdn.simpleicons.org` or `cdn.jsdelivr.net` requests remain anywhere on
the page). Tiles use `box-shadow: 0 0 0 1px var(--line-soft)` for hairlines
(NOT a grid background) so a partially-filled last row leaves no dark patch.
Two tile kinds: icon tiles (img with onerror fallback to the `.fb`
abbreviation) and nine custom inline SVG glyphs (`.gly`, 24×24 viewBox, 1.5
stroke, currentColor with exactly one `var(--signal)` amber accent each) for
tech with no logo anywhere — AD, GPO, Exchange, Failover Cluster, DNS/DHCP,
SELinux, Firewalld, IAM, Incident Handling. These are original icons drawn for
this site; keep new glyphs in the same family (same stroke, one amber detail,
no fills except tiny amber dots). The letter tiles carry recruiter-relevant
keywords; never remove them in favor of logo-only tiles. To add a tile with a
real logo: download the SVG from its source into `assets/images/stack/`
(matching filename pattern: plain slug for Simple Icons, e.g. `docker.svg`;
`<slug>-<HEXCOLOR>.svg` for a recolored Simple Icons variant, e.g.
`redhat-AEB4BE.svg`; the devicon filename as-is for devicon sources, e.g.
`powershell-original.svg`) — never link back to a CDN. Check Simple Icons
before drawing a custom glyph: OPNsense looked like a glyph candidate but ships
as `opnsense.svg` from `cdn.simpleicons.org/opnsense`, so no tenth glyph was
added.

Every tile also carries `data-cat="web|systems|tools|cloud|security"` — required
by the mobile category filter (`.stack-filter`, `js/main.js`) even though desktop
ignores it. Adding a tile means picking the right `data-cat` and updating that
category's chip count (e.g. `Tools 10`) plus the `All 52` chip in the
`.stack-filter` markup and the overall `52` in `.sec-head .count`. Current
split: Web 11, Systems 12, Tools 10, Cloud 11, Security 8. On desktop
(`>880px`) all 52 tiles live in a
single `.stack-row` flex-wrap container with no category headings — this is
deliberate: splitting it into per-category containers (as a prior iteration did)
makes each chunk wrap independently and throws orphan partial rows into the
middle of the section instead of one clean taper. Don't reintroduce per-category
containers on desktop. The filter chip row itself (`role="group"`, real
`<button>`s with `aria-pressed`, square chips matching `.tag`/`.chip-now`) only
shows `<=880px`; category headings don't exist in the markup at all anymore.

## Projects section

Five cards, in this order — all sysadmin/security work, no Laravel projects
(the six Laravel/WooCommerce cards that used to live here were removed along
with their thumbnails; don't reinstate them):

1. **Traffic-Shape Client Detection** — kind `Python / Detection`. Decides
   whether an encrypted HTTPS page load came from a browser or an automated
   client from packet sizes, directions, inter-arrival times and burst structure
   only — never payload. Evaluated leave-one-round-out rather than on a random
   split, SHAP attribution computed on held-out rounds only; one perfectly
   separating feature was traced back to the capture harness and deleted. Repo
   `traffic-shape-client-detection`.
2. **OPNsense Firewall, Segmentation & VPN Lab** — kind `Network / Firewall`.
   OPNsense on Hyper-V routing five zones (WAN, LAN, DMZ, SOC/Test, WireGuard
   VPN) with least-privilege inter-zone policy, DHCP, DNS forwarding and NAT;
   every rule decision validated at three layers — firewall logs, client probes,
   tcpdump correlation — documented as a claim-to-evidence index. Repo
   `opnsense-firewall-vlan-vpn-lab`.
3. **Windows Server Active Directory Lab** — kind `Windows / Identity`. Hyper-V
   lab: AD DS + DNS, domain-joined client, OU hierarchy, GPO security baseline,
   group-based SMB/NTFS least privilege validated across a nine-point matrix,
   Event Viewer auditing, read-only PowerShell validation, eight sanitised
   evidence screenshots. Repo `windows-server-active-directory-lab`.
4. **Linux Infrastructure Automation Lab** — kind `Linux / Ansible`. Three-node
   Ubuntu lab, one control node driving two servers via eight playbooks (users,
   packages, UFW baseline, SSH hardening, Nginx, backups, maintenance timers);
   8/8 syntax-valid, 7/8 idempotent, fourteen evidence screenshots. Repo
   `linux-ansible-infrastructure-lab`.
5. **Email Header Analyzer** — kind `Python / SOC Tooling`. Zero-dependency CLI
   reading a `.eml` and emitting one JSON verdict (headers + Received chain,
   auth results, domain alignment, URL hostname mismatches, attachment SHA-256),
   scored by 46 weighted rules; calibrated on seven real messages with the
   measured outcome — two false negatives included — published, not tuned away.
   Repo `email-header-analyzer`.

The numbers in that copy (five zones, three validation layers, nine-point
matrix, eight/fourteen screenshots, 8/7 playbooks, 46 rules, two false
negatives) come from the repositories themselves. If a repo changes, change the
card — every claim has to stay defensible.

Section header: eyebrow "Projects", `.sec-head .count` is `05`. Both must move
together with the card count.

Thumbnails live in `assets/projects/<repo-slug>.webp` (note: `assets/projects/`,
not `assets/images/projects/` — the inline `onerror` on each `<img>` rewrites the
latter to the former as a fallback, which is why both paths appear in the
markup). Each one is that project's own OG image, downloaded from its GitHub
Pages site and converted with `ffmpeg -c:v libwebp -quality 82`; all five are
under 45KB. Thumbnails stay small (`.proj-thumb`, 118px, 40:21) beside the
title — never full-width covers, the user explicitly rejected that.

`.proj-grid` is a two-column grid. With an odd card count the last card would
leave an empty `--line-soft` cell, so
`.proj-grid > .proj:last-child:nth-child(odd){grid-column:1/-1}` makes it span
the full width — verified at five cards (the fifth spans both columns at
1400px). Below 760px the grid is single-column and the rule is inert.

Each `.proj` card ends with a `.proj-links` row (not a bare `.proj-link` anymore)
holding two links: "View repository" (`data-repo`) and "Project page"
(`data-live`, the GitHub Pages URL — `https://farhanrahmananik.github.io/<repo>/`).
They sit on one row separated by a `border-left: 1px solid var(--line)` hairline
on the second link; `.proj-links{flex-wrap:wrap}` lets them drop to two rows on
narrow viewports. Adding a project means adding both links, not just the repo one.

## Credentials page (`verify/index.html`)

**This page is self-contained and does not share the main site's CSS.** It has
its own inline `<style>` block, its own `@font-face` rules (pointing at the same
`../assets/fonts/*.woff2` files, so the zero-third-party-request guarantee still
holds), and no JavaScript at all. It does not link `css/style.css` and does not
load `js/main.js`. Keep it that way: it is a standalone document a recruiter may
be sent directly, and the inline style block is deliberate here even though
`index.html` forbids one.

**The token names collide with `css/style.css` and mean different things.** Do
not copy CSS rules, custom-property names, or colour values between the two
files without translating them:

| Token | `css/style.css` (main site) | `verify/index.html` |
|---|---|---|
| `--ink` | `#0B0C0E` — page **background** | `#E8E6E1` — **text** colour |
| `--bg` | not defined | `#0B0C0E` — page background |
| `--line` | `#23262C` | `#22262B` (close, not identical) |
| `--accent` | not defined | `#D9A441` — same value as `--signal` |
| `--signal` | `#D9A441` — amber accent | not defined |
| `--surface` | not defined | `#121417` — raised panels |
| `--muted` | not defined | `#8A8F97` — secondary text |

The `--ink` inversion is the dangerous one: a rule reading `color: var(--ink)`
is correct on the verify page and invisible-on-invisible if pasted into
`css/style.css`. The two palettes are intentionally near-identical *visually* —
same amber, same near-black — so the mistake will not look obviously wrong while
editing.

Components on the page (all defined in its own `<style>`): `.record` entries
inside `.records`, each with a `.record-head` (an `h2` plus one `.issuer` mono
chip — exactly one, don't add a second as a subtitle), a `dl`/`dt`/`dd` field
list, and a `.route` note block with a `.route-label` heading. `.route` comes in
two variants: the default amber left border for "here is how to verify this
yourself", and `.route.unavailable` (muted left border) for anything that
*cannot* be checked at the issuer — a decommissioned directory, or a document
withheld for privacy. Pick the variant by meaning, not by looks. There is
deliberately **no per-record counter and no in-page section nav** — four records
don't need them, and the manifest line covers the count.

Anchor ids follow a short lowercase slug of the credential:
`#rhcsa`, `#rhce`, `#zcpe`, `#masters-enrollment`. Every `.record` carries one.
There is no sticky header on this page, so no `scroll-margin-top` is needed —
an anchor jump lands the record's top edge exactly at the viewport top.

**Adding a record means updating the manifest line** in the header
(`.manifest .out`) — currently `4 records · 2 verifiable at issuer · 1 issuer no
longer holds records · 1 documented on request`. That line is the page's record
count and its honesty summary in one; if it disagrees with the records below it,
the page has lost the thing it exists for. Bump `.foot .updated` in the same
edit.

The Master's enrolment record must never name a semester, a season, or an
expected graduation date — the user asked for an entry that stays accurate
without seasonal maintenance. Certificate PDFs live in `assets/certs/`; the
enrolment certificate is deliberately **not** among them (it carries enrolment
number, date of birth, birthplace and a document verification code), which is
what that record's Privacy note explains.

## Credentials logos

Every entry in Education and Certifications carries a small monochrome logo via
`.cred-logo-row` (flex, 14px gap, vertically centred, no borders/hover — `img` +
a `div` with the existing `cred-when`/`cred-what`/`cred-where` lines). All logos
are recoloured flat `#AEB4BE` so RHCSA/RHCE/ZCPE/BTU/Primeasia read as one family:
- RHCSA, RHCE: `assets/images/stack/redhat-AEB4BE.svg`. ZCPE:
  `assets/images/stack/zend-AEB4BE.svg`. Both self-hosted since the performance
  pass (was `cdn.simpleicons.org/<slug>/AEB4BE`, now dropped like every other
  CDN icon — see Tech stack section). To recolor a Simple Icons logo again,
  fetch `https://cdn.simpleicons.org/<slug>/<HEXCOLOR-no-#>` once and save the
  SVG locally; don't link the CDN URL directly.
- BTU, Primeasia: local files at `assets/images/logos/{btu,primeasia}.png` —
  cropped to content, recoloured pixel-by-pixel (alpha kept as the shape mask),
  180px tall source, displayed at `.cred-logo-edu{height:30px}` (certs are 26px,
  the `.cred-logo` default). BTU's Wikimedia source is a full icon+wordmark
  lockup; the wordmark was cropped out because at 30px it's illegible — only the
  "b·tu" mark ships. Primeasia's logo came from primeasia.edu.bd directly, not
  Wikipedia — Wikipedia's copy is marked non-free/fair-use, restricted to that
  article, and isn't licensed for reuse here. If either institution's logo ever
  needs updating, re-derive from a properly licensed source and keep the same
  flat-`#AEB4BE`-on-transparent treatment.

## Legal pages

`impressum.html` and `datenschutz.html` reuse the exact same head/header/footer
as `index.html` (same favicon links, same stylesheet, same `js/main.js`), with
two deliberate differences: the header nav links point to `index.html#about`
etc. (not bare `#about`) since these are separate pages, and the "Back to
top ↑" footer link becomes "Back to home ↑" pointing at `index.html`. Content
lives in `.legal` (a plain readable-width prose column — new CSS, not reused
from elsewhere, since nothing else on the site needed dense multi-paragraph
text) inside the normal `.section`/`.wrap` scaffolding, with a bordered
`.en-summary` box up top on both pages (plain English TL;DR before the German
legal text, per the brief). Neither page uses `.rv` scroll-reveal — legal text
should just be visible, not gated behind a scroll animation.

`js/main.js` had to be made defensive for this: several blocks
(`getElementById('track')`/`'clock'`/`'termOut'`, `document.getElementById('hero')`,
`document.getElementById('cform')`) previously assumed those elements always
exist and would throw on any page that lacks them, which — since the script
runs as one synchronous IIFE — would silently kill everything *after* the
first missing element (scroll progress, footer year, the console easter egg,
etc.). Every such lookup is now null-checked before use. Keep this pattern for
any future element lookup in `main.js`: don't assume a page has hero/marquee/
contact-form/tech-stack markup just because `index.html` does.

The Impressum's postal address came directly from the user — never invent or
placeholder one in a legal notice. The Datenschutzerklärung's core honest claim
(no cookies, no analytics, no third-party requests, no server-side storage,
contact form is `mailto:`-only) is only true *because* of the performance
pass (Fonts / Tech stack section above) — if a third-party request is ever
reintroduced (a new CDN icon, an embed, an analytics snippet), the privacy
policy's §2/§6/§7 text becomes inaccurate and must be updated in the same
commit. The GitHub Pages hosting disclosure (§3 — GitHub Inc., USA, server-log
data including IP addresses) is the one processing activity that's genuinely
unavoidable for any hosted site and must stay regardless of what else changes.
