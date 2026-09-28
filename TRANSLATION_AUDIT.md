# Localization, notification, and UI stability audit

Date: 2026-09-28

## Status

The previously documented static-audit findings have been addressed. English, German, and Russian share the same runtime translation keys, including the additional UI, validation, export, shape, and notification strings. Static HTML labels and accessibility text are connected through `data-i18n*` attributes; changing language updates those elements, the document language, rendered views, and active background alarm copy.

Notification test messages and reminder fallbacks are localized in the page, Service Worker, and Durable Object. The selected locale is passed with subscriptions, test pushes, and scheduled alarms. Custom notification text is translated before it is sent.

Activity colors remain unchanged. Text contrast is chosen from the activity's actual color; all activity buttons and color swatches have context-aware outlines against light and dark theme surfaces. System theme changes are applied without reloading.

## Additional fixes

- Reused the existing localized `confirmDelete` string for the settings label and removed redundant translation declarations.
- Normalized unsupported saved languages, themes, time formats, and first-day settings.
- Fixed stale custom color picker state and preset swatch matching when editing activities.
- Prevented stale toast timers from hiding newer messages.
- Guarded against malformed push payload values in the Service Worker and made invalid Worker locales fall back to the saved locale.
- Corrected locale-aware date/time display, overlapping date-range filtering, and CSV quoting/time formatting.
- Escaped activity names and imported entry identifiers before inserting them into log markup.
- Added accessible labels/focus indicators and updated the browser theme color when themes change.
- Persisted the selected locale for Service Worker fallback pushes, including malformed and locale-less payloads; language changes sync it to the active worker.
- Kept open activity modal/menu titles current during language changes and dismisses transient toast text from the previous language.
- Removed obsolete duplicate translation declarations and unused legacy labels that had been superseded by current UI copy.
- Localized generated demo activity names so sample content follows the selected language.
- Localized exported log and backup filenames.

## Verification

- `npm test`: passing (12 tests); includes Worker push delivery, VAPID encryption/configuration, all three notification locales for tests and reminders, persisted Service Worker fallback locale, dictionary parity/usage, language-driven DOM text, localized demo copy, custom white/black color persistence, locale-aware dates/times, CSV quoting, overlapping date-range filtering, unsafe log input escaping, and color contrast/outline checks.
- `node --check app.js`, `node --check sw.js`, `node --check worker/index.js`, and `node --check tests/push-flow.test.js`: passing.
- `git diff --check`: passing.
- The repository defines no build, type-check, or lint scripts.
- `wrangler deploy --dry-run` was attempted but Wrangler/esbuild could not resolve the Worker entry point from the Android shared-storage workspace (`/storage/emulated/0/...`); the normal Node import/integration tests and syntax checks do resolve and execute that file.
- No browser automation package or browser executable is available in this environment. Browser permission prompts and OS-level notification presentation could not be exercised interactively; notification delivery and locale fallback behavior are covered with the existing Worker/Service Worker integration harness.

## Manual platform checks still useful

On supported browsers, confirm notification permission behavior and OS presentation, inspect screen-reader output, and check wrapping on narrow screens. These depend on browser and operating-system behavior and are not represented by the repository's automated test setup.
