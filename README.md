# 💎 Treasure Finder Chrome Extension

Transform UX issue reporting into an engaging treasure hunt! A powerful Chrome browser extension for capturing, documenting, and tracking UX issues and bugs in web applications. Features direct page area selection, beautiful progress animations, and seamless JIRA Cloud integration.

## Features

✨ **One-Click Issue Reporting** - Click the gem icon and start treasure hunting!  
🎯 **Direct Page Area Selection** - Click and drag to select exactly the problem area  
📸 **Pixel-Perfect Screenshots** - Capture clean, precise screenshots without overlays  
🎬 **Beautiful Progress Animations** - Engaging circular progress with celebration moments  
🏢 **JIRA Cloud Integration** - Issues automatically appear in your JIRA project with attachments  
📝 **Smart Issue Forms** - Categorize by impact, effort, and issue type  
📊 **Google Sheets Fallback** - Alternative integration option available  
🚀 **Professional Deployment** - Complete guides for organizational rollout  
⚙️ **5-Minute Setup** - From installation to first issue in minutes

## Installation

### Option 1: Load as Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" button
4. Select the `Design debt reporter` folder
5. The extension should appear in your extensions list and toolbar

### Option 2: Package and Install

1. From `chrome://extensions/`, click "Pack extension"
2. Select the `Design debt reporter` folder
3. Install the generated `.crx` file

## Setup Google Sheets Integration

### Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the contents of `google-sheets-script.js`
4. Save the project with a meaningful name (e.g., "UX Issue Tracker")

### Step 2: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Choose deployment type: **Web app**
3. Configure settings:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone (required for the extension to work)
4. Click **Deploy**
5. Copy the web app URL provided

### Step 3: Configure Extension

1. Right-click the extension icon and select "Options"
2. Paste the web app URL in the "Google Apps Script Web App URL" field
3. Click "Save Settings"
4. Click "Test Connection" to verify setup

## Usage

### Reporting an Issue

1. **Navigate** to the webpage with the issue
2. **Click** the extension icon in the toolbar
3. **Click "Report"** to begin the process
4. **Screenshot** will be captured automatically (or skip if desired)
5. **Fill out the form** with issue details:
   - **Summary**: Brief description of the issue
   - **Task**: What were you trying to accomplish?
   - **Solution**: How should this be fixed? (optional)
   - **Type**: Quick win, UX optimization, redesign, or unknown
   - **Customer Impact**: Rate 1-5 scale
   - **Effort to Fix**: Rate 1-5 scale
6. **Submit** the issue

### Managing Data

- **View Settings**: Right-click extension → "Options"
- **Export Data**: Export local data to CSV file
- **Clear Data**: Remove all locally stored issues
- **Test Connection**: Verify Google Sheets integration

## File Structure

```
Design debt reporter/
├── manifest.json              # Extension configuration
├── popup.html                 # Main popup interface
├── popup.js                   # Popup functionality
├── styles.css                 # Popup styling
├── options.html               # Settings page
├── options.js                 # Settings functionality
├── options.css                # Settings styling
├── content.js                 # Content script for web pages
├── google-sheets-script.js    # Google Apps Script code
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
└── README.md                  # This file
```

## Data Fields

The extension captures the following information for each issue:

| Field | Description | Required |
|-------|-------------|----------|
| Timestamp | When the issue was reported | Auto |
| URL | Page where issue was found | Auto |
| Summary | Brief description of the issue | Yes |
| Task | What user was trying to accomplish | No |
| Solution | Suggested fix or solution | No |
| Issue Type | Quick win, UX optimization, redesign, unknown | No |
| Customer Impact | Scale of 1-5 (1=very low, 5=very high) | No |
| Effort to Fix | Scale of 1-5 (1=very easy, 5=very hard) | No |
| Has Screenshot | Whether a screenshot was captured | Auto |

## Google Sheets Output

When configured, issues are automatically added to a Google Sheet with:
- Automatic spreadsheet creation ("UX Issues Tracker")
- Formatted headers and auto-resizing columns  
- Optional screenshot storage in Google Drive
- Real-time collaboration features

## Privacy & Security

- **No external tracking**: All data stays within your Google account or local browser
- **Minimal permissions**: Only requests necessary Chrome API access
- **Local backup**: Issues stored locally if Google Sheets unavailable
- **User control**: Full control over data export and deletion

## Troubleshooting

### Extension Not Working
- Verify developer mode is enabled in Chrome
- Check for console errors in popup (F12 → Console)
- Try reloading the extension

### Google Sheets Issues
- Ensure web app is deployed with "Anyone" access
- Test the webhook URL directly
- Check Google Apps Script execution logs
- Verify CORS settings aren't blocking requests

### Screenshots Not Capturing
- Grant necessary tab permissions when prompted
- Try refreshing the page before capturing
- Check if page has restrictive security policies

## Contributing

This extension was built with modern web technologies and Chrome Extension Manifest V3. To contribute:

1. Fork the repository
2. Make your changes
3. Test thoroughly across different websites
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or feature requests, please create an issue in the project repository or contact the development team.

---

**Happy UX Issue Tracking! 🎉**
