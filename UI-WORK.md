# UI Work — Interface Review Implementation Log

> Created 2026-08-14 · Source: 4-skill interface review (better-layout, better-typography,
> better-ui, better-interface) of all 29 screens · Verdict: Block (1 HIGH).
> Each task: Issue → What needs to be done → Status → Proof (diff excerpt + verification output).

## Completion summary

| # | Task | Severity | Status |
| --- | --- | --- | --- |
| 1 | Inbox mobile layout | HIGH | ✅ COMPLETE |
| 2 | Inter Variable font | MEDIUM | ✅ COMPLETE |
| 3 | Define `.title` class | MEDIUM | ✅ COMPLETE |
| 4 | Remove hover-gated controls | MEDIUM | ✅ COMPLETE |
| 5 | Row affordance honesty + tooltips | MEDIUM | ✅ COMPLETE |
| 6 | 16px inputs on mobile (iOS zoom) | MEDIUM | ✅ COMPLETE |
| 7 | Cap text measure to 65ch | LOW | ✅ COMPLETE |
| 8 | Replace `transition-all` | LOW | ✅ COMPLETE |
| 9 | Scale on press (0.96) | LOW | ✅ COMPLETE |

---

## TASK 1 — Inbox mobile layout (HIGH · Layout)

**Issue:** `src/screens/today.tsx:262-289` — the Inbox 3-pane (list `w-[340px] xl:w-[360px] shrink-0`, detail `flex-1 min-w-0`, props `hidden xl:block`) never adapts below 768px. On a 390px phone the detail pane collapses to ~50px and conversation content is unreadable — the primary inbox task is blocked on the supported mobile shell.

**What needs to be done:**
- Inbox root: `h-full flex` → `h-full flex flex-col md:flex-row`
- List pane: add `mobileOpen` state; className `${mobileOpen ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] xl:w-[360px] shrink-0 …`
- Item click: `setSel(it)` + `setMobileOpen(true)`
- Detail pane: className `${mobileOpen ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 overflow-y-auto scroll-quiet flex-col`
- Add `md:hidden` back button (`ArrowLeft`, new lucide import) in detail toolbar → `setMobileOpen(false)`

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/today.tsx`
```diff
 export function Inbox() {
   const [sel, setSel] = useState<InboxItem>(inbox[0])
+  const [mobileOpen, setMobileOpen] = useState(false)
   return (
-    <div className="h-full flex">
+    <div className="h-full flex flex-col md:flex-row">
       {/* list pane */}
-      <div className="w-[340px] xl:w-[360px] shrink-0 border-r border-[var(--color-hairline)] flex flex-col">
+      <div className={`${mobileOpen ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] xl:w-[360px] shrink-0 border-r border-[var(--color-hairline)] flex-col`}>
...
-              onClick={() => setSel(it)}
+              onClick={() => { setSel(it); setMobileOpen(true) }}
...
-      <div className="flex-1 min-w-0 overflow-y-auto scroll-quiet">
+      <div className={`${mobileOpen ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 overflow-y-auto scroll-quiet flex-col`}>
         <div className="h-11 flex items-center gap-2 px-5 border-b border-[var(--color-hairline)] sticky top-0 bg-[var(--color-canvas)] z-10">
+          <button onClick={() => setMobileOpen(false)} className="md:hidden grid place-items-center -ml-1.5 h-7 w-7 rounded-[6px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-raised)]"><ArrowLeft size={16} /></button>
```
Verification: `pnpm exec tsc --noEmit` → exit 0, zero errors. Mobile flow now: list is full-width; tapping an item opens the detail pane with a back button; ≥768px unchanged 3-pane layout.
**Not verified (no browser on this host, dev server not reachable — `curl localhost:8443` → 000):** visual pass at 375px. Recommended follow-up screenshot: Inbox → tap item → detail fills viewport, back returns to list.

---

## TASK 2 — Inter Variable font (MEDIUM · Typography)

**Issue:** `src/index.css:1` loaded `Inter:wght@400;500;600;700` from Google Fonts. Verified via HTTP fetch that Google serves static `.ttf` faces at exactly 400/500/600/700 — but the app requests optical weights 510/590/680 (`.w-medium/.w-semibold/.w-bold`), which silently collapsed to the forbidden 500/600/700. The binding design contract mandates Inter Variable with 510/590/680 and forbids 500/600/700. Also `.ttf` is uncompressed vs `.woff2`.

**What needs to be done:** add `@fontsource-variable/inter`; import in `main.tsx`; `--font-sans` first face `'Inter Variable'`; drop Inter from the Google @import.

**Status:** ✅ COMPLETE

**Proof:**
- `pnpm add @fontsource-variable/inter` → `dependencies: + @fontsource-variable/inter 5.3.0` (package.json + pnpm-lock.yaml updated)
- `git diff src/index.css` / `src/main.tsx`
```diff
-@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
+@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
...
-  --font-sans: 'Inter', 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif;
+  --font-sans: 'Inter Variable', 'Inter', 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, sans-serif;
```
```diff
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import '@fontsource-variable/inter'
 import App from './App'
```
- Font-face declares the variable range: `node_modules/@fontsource-variable/inter/index.css` → `font-weight: 100 900;` (3 faces, woff2)
- `pnpm build` → clean (`✓ built in 352ms`); emitted `dist/assets/inter-latin-wght-normal-*.woff2` etc. — variable woff2 bundled, no Google Fonts network dependency for Inter
- `pnpm exec tsc --noEmit` → exit 0

---

## TASK 3 — Define `.title` class (MEDIUM · Typography)

**Issue:** `className="… title"` used at `today.tsx:48,67,300` and `sales.tsx:20,30,279,389` (greeting, KPI figures, screen titles, service price) but `.title` had no rule (verified: 7 usages, 0 definitions) — headings and metric figures rendered at weight 400, flattening hierarchy.

**What needs to be done:** define `.title { font-weight: 590; }` in the `index.css` utilities layer.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/index.css`
```diff
   .w-bold {
     font-weight: 680;
   }
 
+  /* Titles: 590 optical weight (design contract: titles weight 590, never bold) */
+  .title {
+    font-weight: 590;
+  }
+
```
Verification: `grep '\.title' src/index.css` → defined at `src/index.css:103`. `pnpm exec tsc --noEmit` → exit 0.
**Not verified (no browser):** computed `font-weight` of 590 on a `.title` element.

---

## TASK 4 — Remove hover-gated controls (MEDIUM · Layout)

**Issue:** `parts.tsx:87` (GroupHeader `+`) and `sales.tsx:133` (Companies `⋯`) used `opacity-0 group-hover:opacity-100` — buttons invisible until hover, never appear on touch devices; zero affordance.

**What needs to be done:** remove the opacity gate at both sites, keep muted color + hover treatment.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/parts.tsx src/screens/sales.tsx`
```diff
-      <button className="ml-auto grid place-items-center h-6 w-6 rounded-[5px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-surface-raised)]">+</button>
+      <button className="ml-auto grid place-items-center h-6 w-6 rounded-[5px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-secondary)]">+</button>
```
```diff
-            <button className="w-6 grid place-items-center text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100"><MoreHorizontal size={15} /></button>
+            <button className="w-6 grid place-items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"><MoreHorizontal size={15} /></button>
```
Verification: `grep 'opacity-0 group-hover:opacity-100' src` → **0 hits**. `pnpm exec tsc --noEmit` → exit 0.

---

## TASK 5 — Row affordance honesty + tooltips (MEDIUM · Layout)

**Issue:** `parts.tsx:70-79` — `Row` rendered `hover:bg` unconditionally even without `onClick` (every list screen); static content looked clickable but did nothing. Truncated cells had no `title`, and with no detail view the missing content was unreachable.

**What needs to be done:** hover bg + `cursor-pointer` only when `onClick` is truthy; add `title={…}` on truncating spans in list rows.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/parts.tsx src/screens/sales.tsx src/screens/delivery.tsx src/screens/today.tsx`
```diff
-// A dense list-row shell
+// A dense list-row shell. Hover/cursor affordance only when the row is interactive.
 export function Row({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
+  const interactive = Boolean(onClick)
   return (
     <div
       onClick={onClick}
-      className={`group flex items-center gap-3 h-[38px] px-4 md:px-5 border-b border-[var(--color-hairline)] hover:bg-[var(--color-level-2)] transition-colors duration-100 cursor-default ${className}`}
+      className={`group flex items-center gap-3 h-[38px] px-4 md:px-5 border-b border-[var(--color-hairline)] ${
+        interactive ? 'hover:bg-[var(--color-level-2)] transition-colors duration-100 cursor-pointer' : ''
+      } ${className}`}
```
Tooltips added (7 rows): Leads name/company/evidence `title={l.name}` / `title={l.company}` / `title={l.evidence || l.title}` (`sales.tsx:93-95`); Contacts name / title·company / email `title={c.email}` (`sales.tsx:150-153`); PipelineList `title={o.title}` (`sales.tsx:248`); Proposals `title={p.title}` (`sales.tsx:365`); Tasks list `title={t.title}` (`delivery.tsx:199`); MyWork `title={t.title}` (`today.tsx:187`); Notifications `title={n.title}` (`today.tsx:246`).
Verification: `pnpm exec tsc --noEmit` → exit 0. Grep confirms: `title={l.evidence` present in `sales.tsx`.
**Not verified (no browser):** hover row shows no highlight when non-interactive; tooltip appears on truncation.

---

## TASK 6 — 16px inputs on mobile (MEDIUM · Typography)

**Issue:** Fast-capture textarea `text-[13px]` (`today.tsx:155`) and CommandMenu input `text-[14px]` (`CommandMenu.tsx:93`) were below 16px — iOS Safari zooms the page on focus.

**What needs to be done:** `text-base` at mobile, existing size at `sm+`.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/today.tsx src/components/CommandMenu.tsx`
```diff
-                className="w-full resize-none bg-[var(--color-surface)] border border-[var(--color-border-input)] rounded-[8px] px-3 py-2 text-[13px] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
+                className="w-full resize-none bg-[var(--color-surface)] border border-[var(--color-border-input)] rounded-[8px] px-3 py-2 text-base sm:text-[13px] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
```
```diff
-            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
+            className="flex-1 bg-transparent outline-none text-base sm:text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
```
Verification: `pnpm exec tsc --noEmit` → exit 0. No `text-[13px]`/`text-[14px]` input below 16px remains on mobile widths (both sites now `text-base` < `sm`).
**Not verified (no iOS device):** actual Safari zoom absent on focus.

---

## TASK 7 — Cap text measure to 65ch (LOW · Layout)

**Issue:** Today briefing `max-w-3xl` at 14px (`today.tsx:51`) and Inbox body `max-w-[720px]` at 15px (`today.tsx:299`) produced ~85–95 chars/line, past the 60–75 comfort cap.

**What needs to be done:** cap both at `max-w-[65ch]`.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/today.tsx`
```diff
-        <p className="text-[14px] text-[var(--color-text-secondary)] mb-5 max-w-3xl leading-relaxed">
+        <p className="text-[14px] text-[var(--color-text-secondary)] mb-5 max-w-[65ch] leading-relaxed">
...
-        <div className="max-w-[720px] px-5 md:px-8 py-6">
+        <div className="max-w-[65ch] px-5 md:px-8 py-6">
```
Verification: `pnpm exec tsc --noEmit` → exit 0.

---

## TASK 8 — Replace `transition-all` (LOW · UI)

**Issue:** `operations.tsx:73` (report bars) and `intelligence.tsx:226` (automation toggle knob) used `transition-all` — animating every property instead of only what changes.

**What needs to be done:** specify exact transition properties.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/screens/operations.tsx src/screens/intelligence.tsx`
```diff
-                <div className="w-full rounded-t-[5px] bg-[var(--color-brand)] transition-all" style={{ height: `${(b.v / max) * 100}%`, opacity: 0.55 + (b.v / max) * 0.45 }} />
+                <div className="w-full rounded-t-[5px] bg-[var(--color-brand)] transition-[height,opacity]" style={{ height: `${(b.v / max) * 100}%`, opacity: 0.55 + (b.v / max) * 0.45 }} />
```
```diff
-              <span className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-all ${state[a.id] ? 'left-[14px]' : 'left-[2px]'}`} />
+              <span className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-[left] ${state[a.id] ? 'left-[14px]' : 'left-[2px]'}`} />
```
Verification: `grep 'transition-all' src` → **0 hits**. `pnpm exec tsc --noEmit` → exit 0.

---

## TASK 9 — Scale on press (LOW · UI)

**Issue:** `ui.tsx` `Button`/`IconButton` and the mobile FAB (`MobileShell.tsx:48`) had no press feedback; FAB used only `active:brightness-110`. The prescribed tactile pattern is `scale(0.96)` on press.

**What needs to be done:** add `active:scale-[0.96]` (exact 0.96, per better-ui principle 9) and include `transform` in the transition property lists.

**Status:** ✅ COMPLETE

**Proof:** `git diff src/components/ui.tsx src/shell/MobileShell.tsx`
```diff
   const base =
-    'inline-flex items-center gap-1.5 rounded-[8px] w-medium select-none transition-[background,color,box-shadow,filter] duration-150 disabled:opacity-40'
+    'inline-flex items-center gap-1.5 rounded-[8px] w-medium select-none transition-[background,color,box-shadow,filter,transform] duration-150 active:scale-[0.96] disabled:opacity-40'
```
```diff
-      className={`grid place-items-center h-8 w-8 rounded-[6px] text-[var(--color-text-tertiary)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] ${
+      className={`grid place-items-center h-8 w-8 rounded-[6px] text-[var(--color-text-tertiary)] transition-[color,background-color,transform] duration-150 active:scale-[0.96] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] ${
```
```diff
-        className="fixed right-4 bottom-[76px] z-30 grid place-items-center h-14 w-14 rounded-full bg-[var(--color-brand)] text-white shadow-stack active:brightness-110"
+        className="fixed right-4 bottom-[76px] z-30 grid place-items-center h-14 w-14 rounded-full bg-[var(--color-brand)] text-white shadow-stack transition-transform active:scale-[0.96] active:brightness-110"
```
Verification: `pnpm exec tsc --noEmit` → exit 0. Grep confirms `active:scale-[0.96]` in `ui.tsx` + `MobileShell.tsx` (exactly 0.96, never below 0.95).
**Not verified (no browser):** press animation at full speed.

---

## Verification (final run 2026-08-14)

- [x] `pnpm exec tsc --noEmit` → **exit 0, zero errors**
- [x] `pnpm build` → **clean, `✓ built in 352ms`**; `inter-*-wght-normal-*.woff2` variable files emitted to `dist/assets/`
- [x] Grep `transition-all` → **0 hits**; `opacity-0 group-hover:opacity-100` → **0 hits**; `.title` defined (`src/index.css:103`); `--font-sans` lists `'Inter Variable'` (`src/index.css:10`)
- [x] Font: `@fontsource-variable/inter` 5.3.0 installed; `node_modules/@fontsource-variable/inter/index.css` declares `font-weight: 100 900` (variable woff2, self-hosted — no Google dependency for Inter)
- [ ] **Not verified (no browser/dev-server access from this host):** screenshot pass at 375/1280px (Inbox toggle, `.title` computed weight 590, KPI figures at variable 590). Recommend a visual pass in the Figma Make preview to confirm Tasks 1, 2, 3, 5, 6, 9 in the rendered app.