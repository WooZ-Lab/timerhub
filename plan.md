# TimerHub — Secure Manual Day Exchange (Implementation Plan)

Persistent source of truth for this session. Read the relevant phase before starting it and update it after every completed phase.

## Baseline verification (Phase 0 gate)

- GitHub `origin/main` inspected: `fa56fb1 feat: add confirmed manual resend for Clockodo unknown entries`.
- Local `main` equals `origin/main`; no local commits ahead of GitHub.
- Local uncommitted changes at session start (must be preserved, never committed with this feature):
  - `app.js` (+75 lines) `[TB-ACTION]` canvas debug `console.log` instrumentation.
  - `style.css` (+8 lines) `#activitiesGrid .activity-btn.activity-node` positioning override.
- 39 untracked backup files and `.agents/` must remain untouched.
- Focused commit staging will filter out `[TB-ACTION]` and `activity-node` hunks via the existing hunk filter, exactly as previous sessions did.

## Current architecture facts (verified)

- Vanilla JS PWA. `index.html` → `clockodo-client.js` → `app.js`. No bundler.
- Data model: IndexedDB `TimerHubDB` v4. Stores: `activities`, `timeEntries`, `settings`, `layout`, `syncBatches`, `snapshots`, `groups`.
- Time entry shape: `id, activityId, activityNameSnapshot, startTimestamp, endTimestamp, notes, project, service, customerId, serviceId, customerName, serviceName, source, isEdited, editedAt, syncStatus, syncBatchId, clockodoEntryId, ...` (`normalizeTimeEntry` in `app.js`).
- Activity shape: `{ id, name, color, shape, size, customerId, serviceId, customerName, serviceName, position, archived, createdAt, updatedAt }` and `this.COLORS` palette.
- Day Review: `renderReview()` + `.review-toolbar` (Add Entry, Review & Sync) + `reviewEntriesList`.
- Backups: `StorageRepository.exportAll/importAll` (`timerhub-backup` v1) and `backupData()` download pattern (Blob + anchor click).
- File reading precedent: `restoreData()` uses a hidden `<input type="file">` + `FileReader.readAsText`.
- Localization: base `translations` + `extendedTranslations` (EN/DE/RU). `tests/push-flow.test.js` asserts dictionary keys exactly match all `this.t('...')` / `data-i18n` references and that all three locales have identical key sets. New keys must be referenced and added to all locales.
- Clockodo sync is explicit via `confirmDayReview` → `confirmAndSyncClockodo` → `performConfirmedBatchSync`; import must never call these.
- Crypto: browser Web Crypto used in `worker/index.js`; `crypto.getRandomValues` used for tokens. No client-side crypto utility yet.
- Service worker `sw.js` `CACHE_FILES` list must include new static assets.
- Deploy asset ignore `.assetsignore` excludes `node_modules/`, `worker/`, `*.backup*`, wrangler/package files. Vendored files in `vendor/` WILL be deployed, `node_modules/` will not.
- Local server command: `./run-server.sh` → `python3 -m http.server 8000` (also `run-server.bat` on Windows).
- Tests: `npm test` → `node --test` (166 tests before this feature).

## Phase 1 — Exchange format + security model

New file `exchange.js` (browser global `TimerHubExchange`, same pattern as `clockodo-client.js`), loaded before `app.js`.

Versioned plaintext snapshot (`format: 'timerhub-exchange'`, `version: 1`):

```json
{
  "format": "timerhub-exchange",
  "version": 1,
  "exportId": "<uuid>",
  "date": "YYYY-MM-DD",
  "exportedAt": 0,
  "entries": [{
    "startTimestamp": 0, "endTimestamp": 0,
    "activityName": "", "notes": "",
    "customerId": null, "serviceId": null,
    "customerName": "", "serviceName": ""
  }]
}
```

Never exported: credentials, tokens, API keys, settings, sync state, Clockodo entry IDs, local activity/entry IDs, layout, groups, browser state.

Encrypted `.timerhub` envelope (JSON):

```json
{
  "format": "timerhub-exchange",
  "version": 1,
  "algorithm": "AES-256-GCM",
  "iv": "<base64url 12 bytes>",
  "ciphertext": "<base64url>",
  "createdAt": 0
}
```

Validation returns typed errors: `invalid_exchange_file`, `unsupported_exchange_version`, `invalid_transfer_code`, `exchange_decrypt_failed`, `invalid_exchange_payload`.

Gate: pure build/validate functions + tests.

## Phase 2 — AES-256-GCM encryption + transfer secret

- Secret: 32 random bytes from `crypto.getRandomValues`, encoded base64url (43 chars). Never user-chosen.
- `formatTransferCode(secret)`: groups of 4 for display; full secret retained. `normalizeTransferCode(input)`: strip separators/whitespace, validate base64url, reject wrong length.
- AES-256-GCM via `crypto.subtle.importKey('raw', key, 'AES-GCM', false, [...])`, fresh 12-byte IV per encryption, AAD = canonical `timerhub-exchange|1|<createdAt>` so format/version/metadata tampering fails authentication.
- Encrypt/decrypt accept an optional `cryptoImpl` for tests.
- Fail safely on wrong secret, modified ciphertext, modified metadata, corruption, unsupported version, malformed payload.

Gate: `tests/exchange.test.js` round-trip, wrong secret, tampered ciphertext, tampered metadata, corrupted file, invalid version, malformed payload, no plaintext work data, no credentials.

## Phase 3 — Day export

- Review toolbar: `Export day` button (icon + text).
- `exportReviewDay()`: gather the day's completed entries → `buildDayPayload` → fresh secret → encrypt → download `timerhub-exchange_<timestamp>.timerhub` (filename contains no work data/date-coded work info) → open export modal showing the transfer code, Copy and Show QR actions.
- No Worker calls. Secret never leaves the device.

Gate: export payload/envelope tests; filename contains no activity/customer data; no network call.

## Phase 4 — Import + local decryption

- Review toolbar: `Import day` button (icon + text).
- Import modal: hidden `<input type="file" accept=".timerhub">`, chosen filename, transfer code input, Scan QR button, Decrypt button, error area.
- `decryptExchangeFile()`: extension/structure/version/auth/decryption/schema/timestamp/required-field/Customer+Service type validation. Nothing enters the day model before validation succeeds.
- Guaranteed fallback: button → file picker → `.timerhub` (no OS file-association dependency).

Gate: import validation tests (wrong code, tampered file, wrong extension, malformed schema all rejected before model mutation).

## Phase 5 — Import preview

- Preview shows source date, entry count, total, per-entry time range/duration/activity/notes/customer/service, plus warnings (missing fields, timestamp anomalies, unknown Clockodo customer/service when reference lists are loaded, overlapping existing entries).
- Import requires an explicit button press; decryption alone never inserts.
- Repeat import detected via `exportId` → warning + `Import again` label.

Gate: preview content tests; no entry created until confirm.

## Phase 6 — Import into Day Review

- Resolve activity by normalized name among `this.activities`; create one (palette color, circle/medium) if missing. Local activity IDs are never trusted cross-device.
- Create entries with the existing `addEntry`/`createTimeEntry` model, preserving exact timestamps, name snapshot, notes, customer/service IDs and names, `source: 'manual'`, `syncStatus: 'unsynced'`.
- Unknown customer/service IDs are kept (validated types) and flagged; no Clockodo calls.
- Imported entries are editable with the existing entry editor.
- After import: switch `reviewDate` to the exchange day and `renderReview()`.

Gate: import integration tests; timestamps/assignments preserved; no `createEntry`/batch calls during import.

## Phase 7 — Repeat-import protection

- Ledger in `settings` key `exchangeImports` (`[{ exportId, importedAt }]`, capped at 100) via existing storage helpers. No DB version bump.
- Same `exportId` → do not silently duplicate; show warning; require explicit `Import again`.
- Transfer code stays valid; the same file can always be decrypted again.

Gate: first import, repeated import warning, cancelled repeated import (zero writes), confirmed repeated import (creates entries).

## Phase 8 — QR transfer

- QR payload is only `timerhub-exchange:1:<secret>` — no work data, no payload, no credentials.
- Sender: Show QR (canvas via vendored `qrcode-generator`, MIT).
- Receiver: Scan QR via native `BarcodeDetector` when available, else vendored `jsQR` (MIT); camera permission errors fall back to manual code entry. Copy/paste fallback always present.
- New dependencies justified: no existing QR support; both libraries are small, browser-compatible, MIT, and vendored into `vendor/` because the project has no bundler. `package.json` records them; `sw.js` precaches the vendored files.

Gate: QR payload contains only protocol + secret; jsQR round-trip decodes the generated module matrix; scan UI feature-detection tests.

## Phase 9 — Local mobile test environment

Procedure (documented for the operator, server run from repo root):

1. PC (or Android/Termux host): `./run-server.sh` (or `python3 -m http.server 8000`).
2. Find LAN IP (e.g. `ip addr` / `ipconfig`).
3. Phone on the same Wi-Fi opens `http://<PC-LAN-IP>:8000`.
4. Export a day on one device, save `.timerhub`, copy the transfer code.
5. Transfer the file (AirDrop/Drive/USB/chat) and enter the code on the second device.
6. Decrypt → preview → Import → Day Review → verify entries/timestamps/assignments.
7. Verify no Clockodo request occurs (Clockodo disconnected or queued sync only after explicit confirmation).
8. Repeat import → warning → Import again.
9. QR: display on sender, scan on receiver; if camera is blocked on plain HTTP, use manual code entry (documented fallback).

Environment note: this session runs on Android/Termux, so the PC+phone split cannot be physically completed here. Automated end-to-end (export → decrypt → import → review → repeat) plus the local server smoke test are executed; the on-device camera/browser step remains an operator action and is reported as the only unverified gate. HTTPS is only needed for camera APIs (`BarcodeDetector`/`getUserMedia`); if unavailable, manual code entry is the guaranteed path.

Gate: automated E2E + `curl` asset smoke test; physical mobile steps listed as operator action.

## Phase 10 — UI + localization

- Icons + text for Export day, Import day, Copy, Show QR, Scan QR, Choose file, Decrypt, Import, Import again, Cancel/Close.
- All strings in EN/DE/RU. No duplicate Day Review heading (bottom nav already provides it). Touch targets reuse `.action-btn` / `.review-action-btn`. Preserve existing visual language and purple/unknown behavior.

Gate: translation reference test passes; all locales symmetrical.

## Phase 11 — Security + regression audit

Checklist: no plaintext work data or secret uploaded; no credentials/tokens/sync state exported; QR has no work data; decryption requires the secret; tampering/wrong secret fail safely; import never calls Clockodo; existing Clockodo/UNKNOWN/FAILED/SYNCED/customer-service/Day Review/localization behavior intact; no existing tests weakened; no secrets in filenames/URLs/logs/errors/IndexedDB/Worker requests.

Gate: audit results recorded here; full suite green.

## Phase 12 — Final end-to-end validation

Automated E2E in the test harness: create realistic day → export → assert file has no plaintext work data → decrypt with secret → bad secret fails → import into a fresh app → preview data → confirm import → Day Review entries/timestamps/customer/service → zero Clockodo calls → Clockodo only via explicit confirm/send → repeat import protection.

Gates: `npm test`, `node --check` changed files, `git diff --check`, diff review, no unrelated modifications.

## Git / deployment policy

- Local commits per phase (`feat: ... phase N` or equivalent).
- No pushes and no deployment until every gate passes.
- The final push/deploy only if the mobile gate is genuinely verified; otherwise stop and report.

## Phase status

- [x] Phase 0 — baseline verified, plan committed locally.
- [ ] Phase 1 — exchange format + validation
- [ ] Phase 2 — AES-256-GCM + transfer secret
- [ ] Phase 3 — day export
- [ ] Phase 4 — import + decryption
- [ ] Phase 5 — import preview
- [ ] Phase 6 — import into Day Review
- [ ] Phase 7 — repeat-import protection
- [ ] Phase 8 — QR transfer
- [ ] Phase 9 — local mobile test procedure
- [ ] Phase 10 — UI + localization
- [ ] Phase 11 — security + regression audit
- [ ] Phase 12 — final end-to-end validation
