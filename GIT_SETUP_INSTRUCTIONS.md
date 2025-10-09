# Git & GitHub Setup Instructions

## ✅ Local Repository - DONE!

Your local git repository is now initialized and committed:
- **71 files** committed
- **19,357 lines** of code
- Initial commit hash: `58821a8`

---

## 🚀 Push to GitHub

### Option 1: Create Repository via GitHub Website (Easiest)

#### Step 1: Create New Repository on GitHub
1. Go to https://github.com/new
2. **Repository name**: `powder-coating-app` (or any name you prefer)
3. **Description**: `Modern powder coating web app with instant quote wizard and Stripe checkout`
4. **Visibility**: Choose **Private** or **Public**
5. ⚠️ **IMPORTANT**: Do NOT initialize with README, .gitignore, or license (we already have these!)
6. Click **"Create repository"**

#### Step 2: Connect Local Repo to GitHub
After creating the repo, GitHub will show you commands. Use these:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/powder-coating-app.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/powder-coating-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Option 2: Create Repository via GitHub CLI (Advanced)

If you have GitHub CLI installed:

```bash
# Login (if not already)
gh auth login

# Create and push
gh repo create powder-coating-app --private --source=. --remote=origin --push
```

---

## 📋 Quick Commands Reference

### Check Current Status
```bash
git status
git log --oneline
```

### View Remote
```bash
git remote -v
```

### Push Changes (After Initial Setup)
```bash
git add .
git commit -m "Your commit message"
git push
```

### Create a New Branch
```bash
git checkout -b feature/your-feature-name
git push -u origin feature/your-feature-name
```

---

## 🔒 What's Protected (Won't Be Pushed)

Thanks to `.gitignore`, these files/folders are safe:
- ✅ `.env` - Your Stripe keys and secrets
- ✅ `screenshots/` - All screenshots
- ✅ `*.png`, `*.jpg` - All images
- ✅ `node_modules/` - Dependencies
- ✅ `target/` - Rust build files
- ✅ Investigation scripts (`investigate.js`, etc.)

---

## ⚠️ Before Pushing - Security Checklist

- [x] `.env` is in `.gitignore` ✅
- [x] No Stripe keys in code ✅
- [x] No database passwords in code ✅
- [x] No secrets committed ✅
- [x] Screenshots excluded ✅

---

## 🎯 Recommended GitHub Repository Settings

After pushing, configure these in GitHub:

### 1. Branch Protection (Settings → Branches)
- Require pull request reviews
- Require status checks before merging
- Don't allow force pushes

### 2. Secrets (Settings → Secrets and variables → Actions)
Add these for CI/CD:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL`
- `REDIS_URL`

### 3. Topics/Tags
Add topics to help others find your repo:
- `rust`
- `react`
- `typescript`
- `stripe`
- `powder-coating`
- `vite`
- `axum`
- `postgresql`

---

## 📝 Commit Message Format (For Future Commits)

Follow this format for good commits:

```
Type: Brief summary (50 chars or less)

More detailed explanation if needed (wrap at 72 chars)

- Bullet points for specific changes
- Another change
- And another

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```bash
git commit -m "feat: Add payment confirmation email"
git commit -m "fix: Resolve checkout webhook signature verification"
git commit -m "docs: Update Stripe setup guide with live mode instructions"
```

---

## 🔄 Typical Workflow

```bash
# Start working
git checkout -b feature/new-feature

# Make changes...
# (code, code, code)

# Commit
git add .
git commit -m "feat: Add new feature"

# Push
git push -u origin feature/new-feature

# Create PR on GitHub
gh pr create --title "Add new feature" --body "Description of changes"

# Or create PR via GitHub website
```

---

## 🆘 Troubleshooting

### "Remote already exists"
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### "Permission denied" (SSH)
Set up SSH key or use HTTPS URL instead

### "Branch 'main' doesn't exist"
```bash
git branch -M main
```

### Accidentally committed .env
```bash
# Remove from git but keep locally
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

Then change all your Stripe keys immediately!

---

## ✅ Next Steps

1. [ ] Create GitHub repository
2. [ ] Add remote origin
3. [ ] Push to GitHub
4. [ ] Add repository topics/description
5. [ ] Set up branch protection
6. [ ] Add GitHub Secrets for CI/CD
7. [ ] Create a `dev` branch for development

---

## 📖 Useful Links

- **GitHub Docs**: https://docs.github.com/en/get-started
- **Git Documentation**: https://git-scm.com/doc
- **GitHub CLI**: https://cli.github.com
- **SSH Keys Setup**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

Your repository is ready to be pushed to GitHub! 🚀
