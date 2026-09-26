# TimerHub - Visual Time Tracker

A lightweight, offline-first time tracking application optimized for construction workers and manual labor. One-tap activity switching with automatic time logging.

**Key Features:**
- ⚡ Zero-configuration time tracking
- 📱 Works offline after first load
- 🎯 One-tap activity switching
- 📊 Detailed time logs with filtering
- 📥 Export to TXT, CSV, JSON
- 💾 Local data backup/restore
- 🌙 Dark/Light theme support
- 🌍 Multi-language (EN, DE, RU)
- 📲 PWA - Installable on Android/iOS

---

## Installation

For Codex command execution and npm limitations specific to Android/Termux, see
[TERMUX.md](TERMUX.md).

### Option 1: Local Development (Recommended)

1. **Extract the project files** to a directory
2. **Start a local server:**

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Node.js (if installed):**
   ```bash
   npx http-server
   ```

   **PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

4. **Install as PWA:**
   - Chrome/Edge: Look for "Install" button in address bar
   - Firefox: Menu → "Install app"
   - Safari on iOS: Share → "Add to Home Screen"

### Option 2: Deploy to Web Server

1. Upload all files to your web server (Netlify, Vercel, GitHub Pages, etc.)
2. Ensure HTTPS is enabled (required for PWA)
3. Access the URL and install as PWA

---

## Installation on Android

### Method 1: Chrome/Edge (Recommended)

1. Open the app URL in Chrome or Edge
2. Wait for the address bar button to appear
3. Tap the "Install" button
4. Confirm installation
5. App appears on home screen

### Method 2: Manual Add to Home Screen

1. Open the app in browser
2. Menu (⋮) → "Add to home screen"
3. Name it "TimerHub"
4. Confirm

### Method 3: Firefox

1. Open the app in Firefox
2. Menu → "Install app"
3. Confirm

---

## Installation on iOS

1. Open the app in Safari
2. Tap Share icon at bottom
3. Select "Add to Home Screen"
4. Name it "TimerHub"
5. Confirm

---

## How to Use

### Main Screen

The main screen displays activity buttons in a grid. Each button represents a work task.

**Default activities:**
- Abkleben
- Malen
- Tapezieren
- Entladen
- Anfahrt
- Pause

**To start tracking:**
1. Tap any activity button
2. App records the start time
3. Button shows elapsed time

**To switch activities:**
1. Tap a different activity button
2. Previous activity automatically ends
3. New activity automatically starts

**To stop tracking:**
1. Tap the active button again
2. Activity ends

### Creating Activities

1. Tap the **+** button (bottom right)
2. Enter activity name
3. Choose color and shape
4. Select size (Small/Medium/Large)
5. Tap "Save"

### Editing Activities

1. Long-press any activity button
2. Tap "Edit"
3. Modify details
4. Tap "Save"

### Deleting Activities

1. Long-press any activity button
2. Tap "Delete"
3. Confirm

**Note:** Deleting doesn't remove historical time entries. Past logs remain accessible.

### Time Log

Access via **📋** button in top navigation.

**Features:**
- Filter by date (Today, Yesterday, Date Range, All)
- Filter by activity
- View daily totals and activity summaries
- Edit individual time entries
- Delete time entries with undo option

**Edit Time Entry:**
1. Tap any entry in the log
2. Modify activity, date, or time
3. System detects conflicts
4. Tap "Save"

### Export & Sharing

**Copy to Clipboard:**
- Tap "Copy" button → Copies formatted log text

**Share:**
- Tap "Share" button → Opens share dialog

**Export Formats:**
- **TXT:** Human-readable format (recommended for printing)
- **CSV:** Spreadsheet-compatible format
- **JSON:** Complete data export for import/backup

### Backup & Restore

**Create Backup:**
1. Settings (⚙️) → "Backup Data"
2. Save the JSON file

**Restore Backup:**
1. Settings (⚙️) → "Restore Data"
2. Select the JSON file
3. Choose "Merge" or "Replace"

---

## Settings

### Theme
- **System:** Follow device preference
- **Light:** Light background, dark text
- **Dark:** Dark background, light text

### Language
- English
- German (Deutsch)
- Russian (Русский)

### Time Format
- 24-hour format
- 12-hour format

### First Day of Week
- Sunday or Monday

### Other Options
- Confirm before delete
- Load demo data (development only)

---

## Data Storage

**Where is my data stored?**

All data is stored **locally** in your device's browser using **IndexedDB**:
- Activities configuration
- Time entries
- Settings
- Layout (button positions)

**Data is NOT:**
- Uploaded to any server
- Shared with anyone
- Synced across devices (local only)

**To backup:**
1. Settings → "Backup Data"
2. Save the JSON file to cloud storage (Google Drive, Dropbox, OneDrive, etc.)

**To restore:**
1. Keep the JSON file safe
2. Settings → "Restore Data" → Select the file

---

## Keyboard Shortcuts

- **Enter** in activity name field: Save activity

---

## Tips & Tricks

### Daily Workflow

1. **Morning:** Tap "Abkleben" to start
2. **During day:** Tap new activity when switching
3. **Breaks:** Tap "Pause"
4. **End of day:** Check LOG to verify all entries
5. **Copy log:** Share with manager or export

### Weekly Export

1. Navigate to Log screen
2. Filter "Date Range" → Select week
3. Tap "Export CSV"
4. Open in Excel/Sheets for analysis

### Recovering Lost Data

If you accidentally deleted activity buttons:
1. **Time entries are safe** — they remain in history
2. Recreate the activity button with the same name
3. The history automatically connects

### Performance

The app is optimized to handle:
- 50+ activity buttons
- Thousands of time entries
- Fast loading on slow connections (offline-first design)

---

## Troubleshooting

### App not saving data?
- Check browser storage isn't disabled
- Clear browser cache and reload
- Try different browser

### Service Worker not updating?
- Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Or wait up to 24 hours for auto-update

### Time entries showing wrong time?
- Check device time is correct
- Time entries use absolute timestamps (device independent)

### Can't install as PWA?
- Ensure using HTTPS (localhost is exempt)
- Try Chrome or Edge browser
- Check browser supports PWA

### Data looks wrong after restore?
- Choose "Merge" to keep existing data
- Choose "Replace" to overwrite
- Always keep a backup before major operations

---

## Development

### Project Structure

```
timerhub/
├── index.html       # HTML structure
├── style.css        # Styling (no external deps)
├── app.js           # Main application logic
├── sw.js            # Service Worker
├── manifest.json    # PWA configuration
└── README.md        # This file
```

### No External Dependencies

- Pure HTML5
- Vanilla CSS3
- Vanilla JavaScript (ES6+)
- IndexedDB for storage
- Service Worker for offline support

### Demo Mode

In development (localhost), a demo button appears in settings:
- Creates 6 sample activities
- Generates sample time entries
- Useful for testing UI/features

---

## Browser Support

### Desktop
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Mobile
- ✅ Chrome Android
- ✅ Firefox Android
- ✅ Safari iOS
- ✅ Edge Mobile

### Offline Support
- ✅ Works offline after first load
- ✅ All data stored locally
- ✅ No internet required (except first visit)

---

## Privacy & Security

- **No tracking:** No analytics, no user tracking
- **No cloud sync:** Data never leaves your device
- **No ads:** No advertising
- **Open source principles:** Transparent code
- **Local storage only:** IndexedDB on your device

---

## Future Enhancements

Possible additions (not yet implemented):
- Clockodo integration
- Excel export with formatting
- Photo attachments to entries
- Voice commands
- Team/shared time tracking
- Project templates
- Analytics dashboard

---

## License

Free to use, modify, and distribute.

---

## Version

**TimerHub v1.0**
- Initial release
- Full offline support
- Complete time logging
- Multi-language support
- PWA installation

---

## Support

For issues or questions:
1. Check this README
2. Try demo data to verify app works
3. Clear browser cache and reload
4. Check browser console (F12) for errors

---

## Quick Start Checklist

- [ ] Extracted files
- [ ] Started local server (or uploaded to web)
- [ ] Opened http://localhost:8000 (or your URL)
- [ ] Created first activity
- [ ] Tapped activity button to start tracking
- [ ] Opened Log to see entries
- [ ] Installed as PWA on phone
- [ ] Tested offline by disconnecting wifi

**You're ready to track time!**

---

*Made for construction workers, field technicians, and anyone tracking manual work.*

*Simple. Fast. Reliable. Works offline.*
