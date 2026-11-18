# CSI Cyber Solutions website

Static marketing site for CSI Cyber Solutions, a veteran-owned cybersecurity consultancy in Las Vegas, NV.

## Structure

```
site/
  index.html      Home
  services.html   vCISO, Incident Response, Risk & Compliance, DoD/CMMC, Gaming & Hospitality
  about.html      Background and certifications
  contact.html    Contact form and incident line
  404.html
  assets/         styles.css, main.js, favicon.svg
```

Plain HTML and CSS with no build step and no external dependencies, so pages load fast and there is nothing to patch.

## Preview locally

```
cd site
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

`.github/workflows/pages.yml` publishes `site/` to GitHub Pages on every push to `main`.
One-time setup: in the repository go to **Settings > Pages** and set **Source** to **GitHub Actions**.
To use a custom domain, add it under Settings > Pages and create a `site/CNAME` file containing the domain.

## Placeholders to replace before launch

- Phone numbers `(702) 555-0100` (office) and `(702) 555-0199` (incident line)
- Email `info@example.com`
- Contact form endpoint `https://formspree.io/f/your-form-id` in `site/contact.html`
