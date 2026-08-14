# Operator OS — Design Acceptance Checklist

> Binding quality gate for UI changes. Derived from `src/imports/linear-app-DESIGN-3.md` and the authoritative project handoff.
>
> The imported design document is read-only. This checklist governs implementation in the application source, especially `src/index.css`, shared primitives, shell components, and screens.

## Non-negotiable visual contract

- [ ] The UI is Linear-inspired: dark-first, high-contrast, compact, keyboard-oriented, and quietly engineered—not a generic dashboard.
- [ ] **Indigo `#5e6ad2` is the only chrome accent.** It may serve primary action, active/selected state, focus/ring, and the intentionally indigo semantic badge where specified.
- [ ] Status hues are reserved for state indicators, priorities, labels, health, and similar semantics. They are never used as decorative chrome, navigation accent, generic button color, or arbitrary chart decoration.
- [ ] All visual styling uses semantic design tokens. No component relies on ad-hoc literal colors, except where a documented CSS primitive/API requires a token-backed value.
- [ ] Both dark and light themes are first-class requirements. A feature is incomplete until its same semantic token roles and interaction states work in both themes.

## Theme/token acceptance

### Required semantic roles

- [ ] Canvas, level-1/2/3, surface, surface-raised, surface-active, and scrim are semantic tokens.
- [ ] Primary, secondary, tertiary, and muted text are semantic tokens.
- [ ] Default, strong, input, hairline, and line borders are semantic tokens.
- [ ] Brand, link accent, and focus ring are semantic tokens.
- [ ] Status blue, green, red, orange, yellow, teal, gray, and indigo roles are semantic tokens.
- [ ] Shadow, radius, spacing, type, and motion values remain tokenized/shared where the existing styling system supports them.

### Dark theme

- [ ] Canvas is near-black (`#08090a`) with a stepped elevation ladder rather than arbitrary dark grays.
- [ ] Hairline dividers use the translucent white workhorse token (`#ffffff0d`); borders do not become visually heavy.
- [ ] Panels, menus, inputs, and overlays map to their documented surface/elevation roles.
- [ ] Shadows remain restrained and support separation without “floating card” visual noise.

### Light theme

- [ ] A light token block exists and is activated through a deliberate theme mechanism (for example, `data-theme="light"`), not scattered light-mode overrides.
- [ ] `color-scheme` follows the active theme; native controls and browser UI do not remain dark in light mode.
- [ ] Canvas is white and elevated layers use the documented light neutral ladder.
- [ ] Light-theme hairlines use the mirrored translucent-black role (`#0000000d`).
- [ ] The indigo brand remains `#5e6ad2`; link accent/ring values meet light-surface contrast needs.
- [ ] Status colors use light-legible token values, not dark-theme values blindly copied onto white.
- [ ] Light shadows provide necessary separation without gray wash or excessive contrast.
- [ ] Theme preference is durable and no-FOUC behavior is considered when the theme switcher is implemented.

## Typography acceptance

- [ ] Inter is wired as the primary sans family and remains the UI’s main typeface.
- [ ] Font rendering preserves the specified compact, high-legibility product-app character.
- [ ] Optical utility weights are used where emphasis is needed: `510` medium, `590` semibold, `680` bold.
- [ ] **Never use true `500`, `600`, or `700` font weights.**
- [ ] Numeric UI (metrics, dates, time, references, counts) uses tabular numerals when alignment matters.
- [ ] Monospace is reserved for code-like content, key fragments, commands, and technical labels.
- [ ] Text hierarchy comes from semantic text roles and weight/size, not arbitrary color saturation or status colors.

## Shape, density, and layout acceptance

- [ ] The layout follows a 4px rhythm and preserves the existing compact density.
- [ ] Sidebar and menu rows remain compact; controls are generally 28–32px tall unless a clear exception needs a documented shared variant.
- [ ] Lists use quiet hairline boundaries and dense, scannable row structure.
- [ ] Corners remain restrained: roughly 4–8px for controls and 8–12px for panels; avoid pillifying generic product UI.
- [ ] Surfaces are flat/structured by elevation and hairlines, not by excessive gradients, oversized radii, or card shadows.
- [ ] Desktop and mobile retain equivalent information and actionable paths even when layout adapts.
- [ ] Dense desktop tables/boards adapt into viable mobile layouts; no clipped essential content or unreachable actions.

## Component and interaction acceptance

- [ ] Reuse `src/components/ui.tsx` and `src/screens/parts.tsx` primitives before introducing bespoke controls.
- [ ] Buttons follow existing primary/secondary/ghost hierarchy and token-driven hover/focus/disabled states.
- [ ] Active navigation uses the brand semantic role, never a status color.
- [ ] Focus-visible treatment is consistent, keyboard-reachable, and token-driven.
- [ ] Hover, selected, pressed, disabled, empty, error, loading, and unavailable states have dark/light parity.
- [ ] Command menu and keyboard interactions preserve fast, dense, quiet product behavior.
- [ ] Destructive, approval, and automation interactions use semantic risk/status communication without inventing competing brand accents.

## Data visualization and status acceptance

- [ ] Charts encode series/state deliberately; status colors are used only where the series itself represents state.
- [ ] Color is never the sole indicator of status, priority, health, or action outcome.
- [ ] Status dots, badges, priority icons, agent/run states, and integration states use the designated semantic status tokens.
- [ ] Marketing-style gradients, rainbow series, and decorative data colors are rejected.

## Motion acceptance

- [ ] Motion is brief, intentional, and non-bouncy—roughly 120–200ms for typical surfaces.
- [ ] Menus, overlays, sheets, and row feedback use existing motion/easing conventions unless a shared replacement is intentionally made.
- [ ] `prefers-reduced-motion` remains respected.
- [ ] Animation never obscures a loading, success, failure, or approval state.

## Accessibility and quality acceptance

- [ ] Keyboard operation works for all interactive controls; focus order is logical.
- [ ] Visible text/interactive targets remain legible and usable at narrow widths.
- [ ] Icon-only controls have meaningful accessible labels.
- [ ] Contrast is checked in both themes, including muted text, selected rows, disabled controls, focus rings, and status markers.
- [ ] Semantic HTML and native controls are used where appropriate; custom interaction does not remove required semantics.
- [ ] No global, unlayered CSS reset is introduced that overrides Tailwind v4 layers.

## Review procedure for each UI change

1. Identify the relevant semantic token and existing primitive before coding.
2. Implement against tokens—never solve a local mismatch with a raw hex color or one-off visual system.
3. Check the changed surface in dark and light themes at desktop and mobile widths.
4. Check default, hover, focus, active/selected, disabled, empty/loading/error (when applicable), and status/risk variants.
5. Confirm Inter weight usage, compact density, and status-color discipline.
6. Confirm the current route/shell remains reachable and keyboard behavior is not regressed.
7. If the binding design documentation and an existing project style conflict, stop and resolve the source-of-truth conflict before silently redesigning.

## Review artifacts

For a substantial UI phase, record:

- affected routes/components;
- tokens/primitives reused or added;
- dark and light screenshots or equivalent visual confirmation;
- mobile confirmation;
- accessibility/keyboard notes;
- any deliberate deviations from `linear-app-DESIGN-3.md`, with rationale and approval.
