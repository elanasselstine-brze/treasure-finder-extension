# 🧹 Treasure Finder - Production Cleanup Plan

## 🎯 Goal: Clean, Professional Chrome Web Store Release

**Removing:**
- Google Sheets/Drive integration (JIRA-only now)  
- Internal testing documentation
- Development/debug tools
- Unused files and code

---

## 📁 FILES TO DELETE

### Google Sheets Related:
- `CONNECTION-FIX-GUIDE.md` - Google Sheets setup guide
- Any Google Apps Script references in docs

### Internal Testing/Development Files:
- `COORDINATE-MATCHING-TEST.md` - Internal coordinate testing
- `DEBUG-SCREENSHOT-FLOW.md` - Development debugging
- `NEW-FLOW-TESTING-GUIDE.md` - Internal testing guide  
- `TESTING-FLOW-GUIDE.md` - Internal testing guide
- `TROUBLESHOOTING.md` - Development troubleshooting
- `debug-jira.js` - Development debug tool
- `test-page.html` - Testing page
- `jira-url-checker.html` - Development tool
- `create-promotional-assets.html` - Development tool
- `create-icons.html` - Development tool

### Development Documentation:
- `CLEAN-SCREENSHOT-FIX.md` - Internal fix documentation
- `COORDINATE-MATCHING-TEST.md` - Development testing
- `ESC-KEY-FIX.md` - Internal fix documentation  
- `MINIMAL-POPUP-DESIGN.md` - Internal design notes
- `POPUP-STYLING-UPDATE.md` - Internal styling notes
- `PROFESSIONAL-COPY-UPDATE.md` - Internal copy changes
- `TREASURE-FINDER-REBRANDING.md` - Internal rebrand notes
- `TREASURE-SUBMISSION-ANIMATION.md` - Internal animation notes

### Redundant/Old Files:
- `Production Package/` folder - Appears to be old version
- `01-Activate extension.jpg` through `05-Celebration.jpg` - Old screenshots
- `INSTALLATION.md` - Redundant (covered in user guides)

### GitHub Setup Files (Keep but could move):
- `init-git-repo.sh` - Development setup script
- `GITHUB-BEGINNER-WALKTHROUGH.md` - Very specific to our setup process
- `GITHUB-SETUP-GUIDE.md` - Might be too detailed for end users

---

## 🔧 CODE CLEANUP

### popup.js:
- Remove `submitToGoogleSheets()` function
- Remove `getGoogleSheetsConfig()` function  
- Update `submitIssue()` to only handle JIRA + local storage
- Clean up Google Sheets references in comments

### options.js:
- Remove all Google Sheets UI elements and logic
- Remove `useSheets`, `webhookUrl`, etc.
- Simplify to JIRA-only configuration
- Remove Google Sheets testing functions

### options.html:
- Remove Google Sheets configuration section
- Simplify to JIRA-only UI
- Remove radio buttons (JIRA is the only option)

### options.css:
- Remove unused Google Sheets styling

### General:
- Reduce console.log verbosity for production
- Remove development comments
- Clean up any unused variables/functions

---

## 📋 FILES TO KEEP (Essential for Users)

### Core Extension Files:
- `manifest.json`
- `popup.html`, `popup.js`, `styles.css`
- `content.js`, `background.js`
- `options.html`, `options.js`, `options.css`
- `jira-integration.js`
- `icons/` folder
- `privacy-policy.html`

### User Documentation (Keep & Polish):
- `README.md` - Main project description
- `END-USER-SETUP-GUIDE.md` - Essential for users
- `ADMIN-DEPLOYMENT-CHECKLIST.md` - Essential for admins  
- `QUICK-REFERENCE-CARD.md` - Helpful user reference
- `JIRA-SETUP-GUIDE.md` - Essential JIRA setup
- `JIRA-DEBUGGING-GUIDE.md` - Helpful for JIRA issues
- `JIRA-404-ERROR-EXPLANATION.md` - Essential for common issue
- `DEPLOYMENT-GUIDE.md` - Essential for organizations
- `PUBLISH-TO-CHROME-STORE.md` - Useful for future updates
- `CHROME-STORE-LISTING.md` - Essential for publishing

### Development Tools (Keep):
- `.gitignore`
- `package.json` 
- Git-related files

---

## 🎯 RESULT: Clean, Professional Extension

After cleanup:
- **JIRA-only integration** (no Google Sheets confusion)
- **Essential documentation only** (no internal dev notes)
- **Clean codebase** (no unused functions/variables)
- **Professional appearance** (ready for Chrome Web Store)
- **Simpler maintenance** (less code to maintain)

This will make your extension:
- ✅ Easier for users to understand and set up
- ✅ More professional and polished
- ✅ Simpler to maintain and update
- ✅ Ready for public Chrome Web Store release

