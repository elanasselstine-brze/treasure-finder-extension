# 🎓 GitHub Beginner Walkthrough - Treasure Finder

## Step-by-Step Guide from GitHub Account to First Push

**You have:** ✅ GitHub account created  
**You need:** Connect your Treasure Finder extension to GitHub

---

## 🛠️ Step 1: Install and Configure Git

### Check if Git is already installed:
```bash
git --version
```

**If you see a version number** (like `git version 2.39.0`) → Git is installed, skip to Step 1B  
**If you see "command not found"** → Continue to Step 1A

### Step 1A: Install Git (if needed)
```bash
# Install Git using Homebrew (recommended for Mac)
# First install Homebrew if you don't have it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git:
brew install git
```

**Alternative:** Download from [git-scm.com](https://git-scm.com/downloads)

### Step 1B: Configure Git with Your Info
```bash
# Replace with your actual name and GitHub email
git config --global user.name "Your Full Name"
git config --global user.email "your.email@gmail.com"

# Verify it worked:
git config --global user.name
git config --global user.email
```

**Important:** Use the **same email** you used for your GitHub account!

---

## 🌐 Step 2: Create GitHub Repository

### Go to GitHub.com and:
1. **Click the "+" button** in top-right corner
2. **Select "New repository"**
3. **Fill out the form:**
   - **Repository name:** `treasure-finder-extension`
   - **Description:** `Chrome extension for spotting and reporting UX issues`
   - **Visibility:** Choose "Private" (recommended) or "Public"
   - **❌ DO NOT check "Add a README file"** (we already have one)
   - **❌ DO NOT add .gitignore or license** (we have these too)
4. **Click "Create repository"**

### Copy the Repository URL
After creating, you'll see a page with setup instructions. **Copy the HTTPS URL** - it looks like:
```
https://github.com/yourusername/treasure-finder-extension.git
```

---

## 💻 Step 3: Connect Your Local Project to GitHub

### Open Terminal and navigate to your project:
```bash
# Go to your Treasure Finder folder
cd "/Users/elan.asselstine/Desktop/Design debt reporter"

# Verify you're in the right place (should show your extension files)
ls
```

You should see files like: `manifest.json`, `popup.html`, `popup.js`, etc.

### Initialize Git Repository:
```bash
# Initialize git in this folder
git init

# Check status (shows untracked files)
git status
```

### Add Your GitHub Repository as "Origin":
```bash
# Replace with YOUR repository URL from Step 2
git remote add origin https://github.com/yourusername/treasure-finder-extension.git

# Verify it worked
git remote -v
```

---

## 📦 Step 4: Make Your First Commit

### Add All Files:
```bash
# Add all files to staging area
git add .

# Check what will be committed
git status
```

### Create Your First Commit:
```bash
git commit -m "Initial commit: Treasure Finder Chrome Extension v1.0.0

Features:
- Direct page area selection for precise bug reporting
- JIRA Cloud integration with automatic issue creation
- Beautiful progress animations and celebrations
- Professional deployment guides for organizations
- Comprehensive user documentation and setup guides"
```

---

## 🚀 Step 5: Push to GitHub

### Set Main Branch and Push:
```bash
# Set main branch (GitHub's default)
git branch -M main

# Push to GitHub for the first time
git push -u origin main
```

**You'll be prompted for authentication:**
- **Username:** Your GitHub username
- **Password:** Your GitHub password OR Personal Access Token (see below if needed)

---

## 🔐 Authentication Troubleshooting

### If Password Doesn't Work:
GitHub requires Personal Access Tokens for HTTPS. Here's how:

1. **Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Click "Generate new token (classic)"**
3. **Give it a name:** "Treasure Finder Extension"
4. **Select expiration:** 90 days (or longer)
5. **Select scopes:** Check "repo" (full control of private repositories)
6. **Click "Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
8. **Use this token as your password** when pushing

---

## ✅ Step 6: Verify Success

### Check GitHub:
1. **Go to your repository URL:** `https://github.com/yourusername/treasure-finder-extension`
2. **You should see all your files!** 🎉
3. **README.md should display** showing your "💎 Treasure Finder" description

### Create Your First Release (Optional but Recommended):
```bash
# Create a version tag
git tag v1.0.0

# Push the tag
git push origin v1.0.0
```

Then on GitHub.com:
1. **Go to your repo → Releases → Create a new release**
2. **Choose tag:** v1.0.0
3. **Title:** "Treasure Finder v1.0.0 - Initial Release"
4. **Description:** List your main features
5. **Click "Publish release"**

---

## 🎯 What You've Accomplished

✅ **Git installed and configured**  
✅ **GitHub repository created**  
✅ **Local project connected to GitHub**  
✅ **First commit and push completed**  
✅ **Version control now active**  

---

## 🔄 Daily Git Workflow (For Future Updates)

### When you make changes to your extension:
```bash
# Check what changed
git status

# Add changes
git add .

# Commit with a descriptive message
git commit -m "Fix: Improved JIRA error handling"

# Push to GitHub
git push
```

### For new versions:
```bash
# Update version in manifest.json first, then:
git add .
git commit -m "Version 1.1.0: Add faster progress animation"
git tag v1.1.0
git push && git push --tags
```

---

## 🆘 Common Issues & Solutions

### "Permission denied" errors:
- Check your GitHub username/email in git config
- Verify you're using the correct repository URL
- Try using a Personal Access Token instead of password

### "Repository not found":
- Double-check the repository URL
- Make sure the repository exists on GitHub
- Verify you have access to it

### Files not showing up:
- Run `git status` to see what's staged
- Make sure you ran `git add .` before committing
- Check that you pushed with `git push`

### "Already exists" when creating repository:
- Choose a different repository name
- Or use the existing one and skip repository creation

---

## 🎉 You're Now a Git/GitHub User!

Your Treasure Finder extension is now:
- ✅ **Backed up safely** in the cloud
- ✅ **Version controlled** - track all changes
- ✅ **Ready for collaboration** - others can contribute
- ✅ **Professional** - proper development workflow
- ✅ **Deployable** - ready for automated publishing

**Welcome to the world of professional software development!** 💎🚀
