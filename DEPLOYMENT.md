# Deploying Scentoria to Cloudflare Pages

## Quick Deploy (Method 1 - Dashboard)

1. **Visit Cloudflare Pages**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**

2. **Configure Build**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Environment variables: NODE_VERSION=18
   ```

3. **Deploy**
   - Click **Save and Deploy**
   - Wait 2-3 minutes for build
   - Access at: `your-project.pages.dev`

---

## CLI Deploy (Method 2 - Wrangler)

### Install Wrangler
```bash
npm install -g wrangler
```

### Login to Cloudflare
```bash
wrangler login
```

### Build & Deploy
```bash
npm run build
wrangler pages deploy dist --project-name=scentoria
```

---

## Custom Domain Setup

1. **Add Domain in Cloudflare Pages**
   - Go to your Pages project
   - **Custom domains** → **Set up a custom domain**
   - Enter: `www.scentoria.ma` or `scentoria.ma`

2. **DNS Configuration**
   - Cloudflare will auto-configure DNS if domain is on Cloudflare
   - If external DNS: Add CNAME record pointing to `your-project.pages.dev`

---

## Environment Variables (Optional)

If you need to add API keys or other secrets:

1. Go to **Settings** → **Environment variables**
2. Add variables for production:
   ```
   NODE_VERSION=18
   ```

---

## Automatic Deployments

Cloudflare Pages automatically deploys when you push to GitHub:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployments at `branch-name.scentoria.pages.dev`

---

## Troubleshooting

### Build Fails
- Check Node version: Should be 18+
- Verify `package.json` has `"build": "vite build"`
- Check build logs in Cloudflare dashboard

### Routes Don't Work (404s)
- Ensure `public/_redirects` exists with: `/*    /index.html   200`
- This enables SPA routing

### Images Not Loading
- Check browser console for errors
- Unsplash API may have rate limits
- Consider using real product images

---

## Performance Optimizations

After deployment, check:
- Cloudflare Analytics (free tier)
- Web Vitals in Cloudflare Speed tab
- Enable Auto Minify (HTML, CSS, JS)

---

## Cost

**FREE** for unlimited sites with:
- Unlimited bandwidth
- Unlimited requests
- 500 builds/month
- 1 concurrent build

Perfect for this project!
