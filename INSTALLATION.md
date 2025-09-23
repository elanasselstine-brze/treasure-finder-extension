# Quick Installation Guide

## 1. Install the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Turn on "Developer mode" (top right corner)
3. Click "Load unpacked"
4. Select the `Design debt reporter` folder
5. You should see the extension icon appear in your toolbar ✨

## 2. Set Up Google Sheets (Optional but Recommended)

### Create the Google Apps Script:

1. Go to [script.google.com](https://script.google.com)
2. Click "New project"
3. Delete the sample code and paste the code from `google-sheets-script.js`
4. Save the project (Ctrl/Cmd + S)

### Deploy as Web App:

1. Click "Deploy" → "New deployment"
2. Settings:
   - Type: "Web app"  
   - Execute as: "Me"
   - Who has access: "Anyone"
3. Click "Deploy"
4. **Copy the URL that appears**

### Configure Extension:

1. Right-click the extension icon → "Options"
2. Paste the URL in "Google Apps Script Web App URL"
3. Click "Save Settings"
4. Click "Test Connection" (should show success message)

## 3. Start Using!

1. Go to any webpage
2. Click the extension icon
3. Click "Report" 
4. Take a screenshot (or skip)
5. Fill out the issue details
6. Submit!

Your issues will automatically appear in a new Google Sheet called "UX Issues Tracker".

---

**That's it! You're ready to start tracking UX issues! 🎯**

Need help? Check the full [README.md](README.md) for detailed instructions.
