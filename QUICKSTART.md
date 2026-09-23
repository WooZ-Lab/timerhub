# TimerHub - Quick Start Guide (5 minutes)

## 🚀 Get Started in 5 Steps

### Step 1: Extract Files (1 min)

```bash
unzip timerhub.zip
cd timerhub
```

### Step 2: Start Server (1 min)

**On Windows:**
- Double-click `run-server.bat`

**On Mac/Linux:**
```bash
bash run-server.sh
```

**Manual:**
```bash
python -m http.server 8000
```

### Step 3: Open in Browser (30 sec)

Visit: `http://localhost:8000`

You'll see an empty grid with a **+** button.

### Step 4: Create First Activity (1 min)

1. Tap **+** button
2. Enter name: `Abkleben`
3. Choose blue color
4. Select medium size
5. Tap **Save**

Boom! You have a button.

### Step 5: Start Tracking (30 sec)

1. Tap **Abkleben** button
2. See elapsed time appear
3. Open **📋 Log** to verify entry
4. Copy or export

**Done! You're tracking time.**

---

## 📱 Install on Android (Optional)

1. Open app in **Chrome** browser
2. Wait for "Install" prompt
3. Tap "Install"
4. App appears on home screen

**That's it.** No app store needed.

---

## 🎯 Real-World Usage

**Morning:**
```
08:00 → Tap ABKLEBEN (starts)
09:15 → Tap ENTLADEN (Abkleben ends, Entladen starts)
10:00 → Tap MALEN (Entladen ends, Malen starts)
12:00 → Tap PAUSE (Malen ends)
13:00 → Tap MALEN (Pause ends, Malen starts)
17:00 → Tap MALEN (stops tracking)
```

**Evening:**
- Open Log → See perfect 8-hour breakdown
- Export CSV → Send to manager
- Data = automatically logged

---

## 🎨 Customize (Optional)

### Add More Activities

1. Tap **+**
2. Name: `Tapezieren`
3. Purple color
4. Tap **Save**

Repeat for your work types.

### Change Colors/Shapes

1. Long-press activity button
2. Tap **Edit**
3. Change color or shape
4. Tap **Save**

---

## 💾 Backup Your Data

### Create Backup

1. Settings (⚙️)
2. "Backup Data"
3. Save the JSON file somewhere safe

### Restore Backup

1. Settings (⚙️)
2. "Restore Data"
3. Select your JSON file
4. Merge or Replace

---

## 🌙 Dark Mode

1. Settings (⚙️)
2. Theme → Dark
3. UI instantly switches

---

## 🌍 Change Language

1. Settings (⚙️)
2. Language → Deutsch / Русский
3. All text updates

Available: English, German, Russian

---

## 📊 Export Log

After tracking for a day:

1. Log (📋)
2. Choose date or range
3. Pick export format:
   - **Copy** → Paste to message/email
   - **Share** → Android share menu
   - **TXT** → Download text file
   - **CSV** → Open in Excel/Sheets
   - **JSON** → Backup/advanced use

---

## ⚙️ Settings Reference

| Setting | Options | Default |
|---------|---------|---------|
| Theme | System/Light/Dark | System |
| Language | EN/DE/RU | English |
| Time Format | 24h/12h | 24h |
| First Day | Sunday/Monday | Monday |
| Confirm Delete | Yes/No | Yes |

---

## 🆘 Troubleshooting

### "App doesn't work offline"

1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Wait 5 seconds
3. Disconnect wifi
4. Should work

### "Lost data after refresh"

Check:
1. Browser hasn't cleared site data
2. Storage quota not exceeded (very unlikely)
3. Try restore from backup

### "Can't install as PWA"

Make sure:
- Using Chrome/Edge/Firefox
- No "Incognito" mode
- Not on older browser
- Try different browser

### "Time shows wrong value"

1. Check device time is correct
2. Close/reopen app
3. If still wrong, check entry in Log and edit

---

## 🎮 Test with Demo Data

In **Settings** (development mode only):

1. Tap "Load Demo Data"
2. 6 sample activities created
3. Yesterday's fake time entries added
4. Perfect for testing UI

Delete demo activities to start fresh.

---

## 💡 Pro Tips

### Multi-Task Tracking

Create activities for:
- Admin work
- Coffee breaks
- Meetings
- Travel
- Equipment setup

### Export Before Leaving Site

At end of day:
1. Open Log
2. Tap Copy
3. Send to team chat/email
4. Backup data

### Weekly Review

Every Friday:
1. Log → Date Range
2. Pick Mon-Fri
3. Export CSV
4. Analyze hours per activity
5. Send to manager

### Automatic Backup

Every week:
1. Settings → Backup Data
2. Save to Google Drive/OneDrive
3. Phone data is safe

---

## 🚀 Deploy Online (Optional)

Want to share with team?

### Easiest: Netlify Drop

1. Drag all files to [netlify.drop.io](https://app.netlify.com/drop)
2. Get instant public URL
3. Share link
4. Everyone can install PWA

### Also Works:
- Vercel (GitHub)
- GitHub Pages
- Your own web server (with HTTPS)

See `DEPLOYMENT.md` for details.

---

## 🎯 Next Steps

1. ✅ Track today's work
2. ✅ Export your first log
3. ✅ Install on phone
4. ✅ Create backup
5. ✅ Customize colors

**That's all you need!**

---

## FAQ

**Q: Is my data private?**
A: Yes! Everything stays on your device. No uploads, no servers.

**Q: Can I use on phone and computer?**
A: Yes, but separately. Each device has own copy. Backup/restore to sync.

**Q: Do I need internet?**
A: Only for first visit. Then works fully offline.

**Q: Can I delete activities?**
A: Yes. Past time entries stay in history though (intentional).

**Q: What if I restart phone while tracking?**
A: App remembers! Reopens with correct elapsed time.

**Q: How many entries can I store?**
A: Thousands. Designed for years of data.

---

## Support

- **README.md** — Full documentation
- **DEPLOYMENT.md** — How to deploy online
- **ARCHITECTURE.md** — How it works (dev reference)
- **Code comments** — Well-documented JavaScript

---

## Version

**TimerHub v1.0** — September 2026

- ✅ Full offline support
- ✅ Complete time logging
- ✅ Multi-language
- ✅ PWA installation
- ✅ Export/backup

---

**Ready to go?**

1. Extract the ZIP
2. Run server
3. Open browser
4. Tap **+** to create first activity
5. Start tracking

**That's it!**

---

*One tap. One work. One log.*

*Simple. Reliable. Works offline.*

