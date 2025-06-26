# Frontend Setup (GitHub Pages)

## Quick Start

1. **Update API URL**
   - In `script.js`, set `API_BASE_URL` to your Apps Script web app URL.

2. **Deploy to GitHub Pages**
   - Push the `frontend/` folder to your GitHub repository.
   - Enable GitHub Pages in your repository settings (set source to `/frontend` or `/main` branch as appropriate).

## Automated Deployment with GitHub Actions

You can automate deployment of the frontend using GitHub Actions. This will deploy your `frontend/` folder to GitHub Pages on every push to `main`.

### 1. Add GitHub Actions Workflow

Create a file at `.github/workflows/deploy.yml` in your repository with the following content:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy frontend to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend
```

### 2. Commit and Push

- Commit your changes and push to the `main` branch.
- The workflow will automatically deploy your frontend to GitHub Pages.

### 3. Access Your Site

- After the workflow completes, your site will be available at `https://<your-username>.github.io/<your-repo>/`.

---

For more details, see the [GitHub Pages documentation](https://docs.github.com/en/pages). 