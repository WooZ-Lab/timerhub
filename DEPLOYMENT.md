# Deployment Guide - TimerHub

## Quick Start

### Local Testing (5 minutes)

1. **Navigate to project directory:**
   ```bash
   cd path/to/timerhub
   ```

2. **Run start script:**
   - **Windows:** Double-click `run-server.bat`
   - **Mac/Linux:** Run `bash run-server.sh`
   
   Or manually:
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

4. **Test offline:**
   - Open DevTools (F12)
   - Network tab → Disable (Works Offline)
   - Refresh page
   - App should still work

---

## Deploy to Netlify (Free, Recommended)

### Via Netlify Drop (Easiest)

1. Go to [netlify.drop.io](https://app.netlify.com/drop)
2. Drag & drop all project files
3. Wait for upload
4. Copy the generated URL
5. Share or install as PWA

### Via Git + Netlify

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial TimerHub"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your repository
   - Deploy settings (use defaults)
   - Click "Deploy"

3. **Access your app:**
   - Netlify provides a URL (e.g., `timerhub-abc123.netlify.app`)
   - Install as PWA from the URL

---

## Deploy to Vercel (Free)

1. **Create account at vercel.com**

2. **Import project:**
   - Click "New Project"
   - Select GitHub repository
   - Click "Import"

3. **Configure:**
   - Framework: Other (or blank)
   - Root Directory: ./
   - Deploy

4. **Access your app:**
   - Automatic HTTPS
   - Custom domain support
   - Install as PWA

---

## Deploy to GitHub Pages (Free)

1. **Create GitHub repository:**
   - Name: `username.github.io` or `timerhub`

2. **Push files:**
   ```bash
   git add .
   git commit -m "TimerHub"
   git push origin main
   ```

3. **Enable Pages:**
   - Repository Settings
   - GitHub Pages
   - Source: main branch
   - Save

4. **Access your app:**
   - https://username.github.io/
   - Or https://username.github.io/timerhub/

---

## Deploy to Your Own Server

### Requirements

- Web server with HTTPS (required for PWA)
- HTTP/2 support (recommended)
- Static file serving

### Steps

1. **Upload files via FTP/SFTP:**
   ```
   index.html
   style.css
   app.js
   sw.js
   manifest.json
   ```

2. **Configure HTTPS:**
   - Use Let's Encrypt (free)
   - Configure SSL certificate on your server

3. **Set correct MIME types** (if needed):
   ```
   .json → application/json
   .js → application/javascript
   .css → text/css
   ```

4. **Access your app:**
   - https://your-domain.com
   - Install as PWA

### Apache (.htaccess)

```apache
# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set correct MIME types
<FilesMatch "\.js$">
    AddType application/javascript .js
</FilesMatch>

<FilesMatch "\.json$">
    AddType application/json .json
</FilesMatch>

# Cache control
<FilesMatch "\.(js|css|json|svg|png|jpg)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Don't cache HTML
<FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# Enable SW caching
<FilesMatch "^sw\.js$">
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
</FilesMatch>
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name timerhub.example.com;

    ssl_certificate /etc/letsencrypt/live/timerhub.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timerhub.example.com/privkey.pem;

    root /var/www/timerhub;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/json;

    # Cache control
    location ~* \.(js|css|png|jpg|jpeg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Service Worker
    location ~* ^/sw\.js$ {
        add_header Cache-Control "max-age=0, no-cache, no-store, must-revalidate";
    }

    # SPA routing
    try_files $uri $uri/ /index.html;

    # MIME types
    types {
        application/json json;
        application/javascript js;
        text/css css;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name timerhub.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## PWA Installation Testing

### On Desktop (Chrome/Edge)

1. Open app URL
2. Look for "Install" button in address bar
3. Click and confirm
4. App appears in Start Menu (Windows) or Applications (Mac)

### On Android

1. Open app URL in Chrome
2. Tap menu (⋮)
3. "Install app" or wait for install prompt
4. Confirm
5. App appears on home screen

### On iOS

1. Open app URL in Safari
2. Tap Share (↗)
3. "Add to Home Screen"
4. Name it "TimerHub"
5. Confirm
6. App appears on home screen

### Verify PWA Features

Open DevTools (F12) and check:

1. **Application tab:**
   - Manifest loaded
   - Service Worker registered
   - App is installable

2. **Service Worker section:**
   - Status: Activated
   - Offline mode: Works

3. **Network:**
   - Set throttling to "Offline"
   - Reload
   - App still loads (from cache)

---

## SSL Certificate Setup

### Using Let's Encrypt (Free)

**On Linux with Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d timerhub.example.com
```

**Manual renewal:**
```bash
sudo certbot renew
```

**Auto-renewal:**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Using Cloudflare (Free)

1. Add domain to Cloudflare
2. SSL/TLS → Flexible or Full
3. Automatic HTTPS

---

## Performance Optimization

### Current Optimizations

- Service Worker caching
- GZIP compression
- Async script loading
- CSS-only animations
- IndexedDB for fast data loading

### Additional Steps

1. **Enable BROTLI compression** (better than GZIP)
2. **Use HTTP/2 Server Push** for manifest.json
3. **Set long cache expiry** for static files
4. **Monitor Core Web Vitals** with Lighthouse

---

## Monitoring & Updates

### Service Worker Updates

Users get latest version automatically:
1. SW checks for updates on each visit
2. If new version found, downloads in background
3. Shows "Update available" notification
4. User can refresh to get latest

### Version History

Current version: `1.0`
- Embedded in CACHE_VERSION in sw.js
- Update CACHE_VERSION to force update

---

## Troubleshooting Deployment

### Issue: "Not a valid PWA"

**Fix:**
- Enable HTTPS (required)
- Add manifest.json
- Register Service Worker
- Test with Lighthouse

### Issue: Service Worker not updating

**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Update CACHE_VERSION in sw.js

### Issue: CORS errors

**Fix:**
- All files must be same origin
- Use relative paths only
- No external CDNs

### Issue: "Add to Home Screen" not appearing

**Fix:**
- Use HTTPS
- Have valid manifest.json
- Register Service Worker
- App must have icon
- Use Chrome/Edge (not all browsers show prompt)

---

## Security Checklist

- ✅ HTTPS enabled
- ✅ Service Worker updated
- ✅ Manifest configured
- ✅ No external dependencies
- ✅ No tracking/analytics
- ✅ No API calls (all local)
- ✅ Data stored locally only

---

## Performance Checklist

Run Lighthouse audit (Chrome DevTools):

- ✅ Performance > 90
- ✅ Accessibility > 90
- ✅ Best Practices > 90
- ✅ PWA checklist complete
- ✅ SEO > 90

---

## Disaster Recovery

### If data is lost:

1. **Check browser cache:**
   ```
   Chrome: Settings → Storage → IndexedDB
   ```

2. **Restore from backup:**
   - Settings → "Restore Data"
   - Select JSON backup file

3. **Recover from browser history:**
   - Chrome DevTools → Application → Storage

---

## Domain & Custom Setup

### Custom Domain on Netlify

1. Go to Site Settings
2. Domain Management
3. Add custom domain
4. Update DNS records

### Custom Domain on Vercel

1. Project Settings
2. Domains
3. Add domain
4. Update DNS records

---

## Bandwidth & Storage

### Data Size

- HTML: ~2 KB
- CSS: ~8 KB
- JS: ~25 KB
- Manifest: ~2 KB
- **Total:** ~37 KB

### Per User Storage

- IndexedDB: 10 MB default (configurable per browser)
- Typical usage: 1-10 MB per user (thousands of entries)

---

## Support Domains

If self-hosting:
- Set up email support
- Create FAQ page
- Add contact form

---

## Next Steps

1. ✅ Deploy to Netlify/Vercel (easiest)
2. ✅ Test PWA installation on phone
3. ✅ Run Lighthouse audit
4. ✅ Share public URL with team
5. ✅ Monitor performance

---

**Your TimerHub is now live!**

*Share the URL with your team.*
*They can install it as an app.*
*All data stays on their device.*

