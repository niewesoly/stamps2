# Deploying Stamps - Static Site Guide

## Build Output

The application builds to **`build/client/`** as a fully static site. No server runtime is required.

```bash
npm run build
# Output: build/client/
```

## Build Statistics

- **286 pre-rendered HTML files** (all routes)
- **~14MB total size**
- **SPA fallback** included for client-side routing (`__spa-fallback.html`)

## Deployment Options

### GitHub Pages

```bash
# Install gh-pages if not already installed
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d build/client"

# Deploy
npm run deploy
```

**Important:** If deploying to a subdirectory (e.g., `username.github.io/stamps`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/stamps/',
  // ... rest of config
})
```

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build/client`
4. Add `_redirects` file to `public/` for SPA routing:

```
/*    /index.html   200
```

Or use `build/client/__spa-fallback.html` as a catch-all.

### Vercel

1. Import project
2. Framework preset: **Other**
3. Build Command: `npm run build`
4. Output Directory: `build/client`
5. Install Command: `npm install`

### Cloudflare Pages

```bash
npx wrangler pages deploy build/client
```

Or connect GitHub repository in Cloudflare dashboard.

### Any Static Host / CDN

Simply upload contents of `build/client/` to your web server.

**Required headers:**
- Serve `.html` files with `Content-Type: text/html`
- Enable gzip/brotli compression for `.js` and `.css`

## SPA Routing

The build includes `__spa-fallback.html` for client-side routing. Configure your server to serve this file for all routes that don't match a static file.

**Example nginx config:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build/client;
    index index.html;

    location / {
        try_files $uri $uri/ /__spa-fallback.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Variables

All environment variables must be set **at build time**. The application fetches data from the API during build.

If you need to configure the API URL, add to `.env`:

```
VITE_API_URL=https://stamps.zhr.pl/api/badges
```

Then access via `import.meta.env.VITE_API_URL` in code.

## Preview Build Locally

```bash
npm run preview
# Opens http://localhost:3000
```

## Troubleshooting

### Build fails with "prerender" error

Ensure you have network access to fetch from `https://stamps.zhr.pl/api/badges`.

### Routes return 404 after hard refresh

Your server isn't configured to serve `__spa-fallback.html` for unknown routes. See SPA Routing section above.

### Assets return 404

Ensure your server serves files from `build/client/` root, not a subdirectory (unless `base` is configured).
