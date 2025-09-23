# 🐛 Debugging Guide - "Report" Button Not Working

## ✅ **FIXED: Automatic Content Script Loading**

The main issue was that the content script wasn't loading on some pages. I've now added:
- ✅ **Automatic content script injection** when needed
- ✅ **Better error messages** for unsupported pages  
- ✅ **Page compatibility checking**
- ✅ **Enhanced debugging** with detailed console messages

## 🔍 Quick Testing Steps

### **Step 1: Reload Extension (IMPORTANT!)**
1. Go to `chrome://extensions/`
2. Find "UX Issue Tracker"
3. Click the **reload/refresh icon** ↻ (this loads the new fixes)
4. Make sure it's **enabled** (toggle is blue)

### **Step 1b: Test on the Dedicated Test Page**
1. **Open the test page**: `test-page.html` (double-click to open in browser)
2. **Click the extension icon**
3. **Click "Report"** - should now work automatically!
4. **Select one of the colored test areas**

### **Step 2: Check Console Errors**
1. Right-click the extension icon → **"Inspect popup"**
2. Go to **Console tab**
3. Click "Report" button
4. Look for **red error messages**
5. Screenshot any errors and share them

### **Step 3: Check Content Script Loading**
1. Open **Developer Tools** on the webpage (F12)
2. Go to **Console tab**
3. Look for messages like "UX Issue Tracker initialized" or errors
4. Try clicking "Report" and see if any messages appear

### **Step 4: Check Permissions**
1. Go to `chrome://extensions/`
2. Click **"Details"** on UX Issue Tracker
3. Scroll to **"Site access"**
4. Make sure it shows "On all sites" or "On click"

## 🔧 Common Issues & Fixes

### **Issue 1: Content Script Not Loading (NOW FIXED!)**
**Symptoms:** "Could not establish connection" error
**Fix:** ✅ **Automatic injection now handles this!**
```
The extension will now automatically inject the content script if needed.
If it still fails, the page might be restricted (see Issue 4 below).
```

### **Issue 2: Permission Denied**
**Symptoms:** Console shows "Cannot access chrome-extension://" errors
**Fix:**
```
1. Chrome Extensions → UX Issue Tracker → Details
2. Change "Site access" to "On all sites"
3. Refresh webpage and try again
```

### **Issue 3: Tab Messaging Failed**
**Symptoms:** Console shows "Could not establish connection" 
**Fix:**
```
1. Refresh the webpage
2. Wait 2-3 seconds
3. Try clicking "Report" again
```

### **Issue 4: Restricted Pages (NEW CHECK!)**
**Symptoms:** Error message "Cannot run on [URL]. Please try on a regular webpage."
**Pages that WON'T work:**
- `chrome://` pages (Chrome settings, extensions, etc.)
- `chrome-extension://` pages (Extension pages)
- Chrome Web Store pages
- `file://` local files (unless you enable file access)

**Fix:** ✅ **The extension now tells you clearly when a page won't work!**
```
1. Try on a regular website like google.com or example.com
2. Use the provided test-page.html for testing
```

### **Issue 5: JavaScript Errors**
**Symptoms:** Red errors in popup console
**Fix:**
```
1. Take screenshot of the exact error
2. Click reload on the extension
3. Try on the test-page.html first
```

## 🕵️ Advanced Debugging

### **Check Content Script Injection:**
1. Open DevTools on webpage (F12)
2. Go to **Sources tab**
3. Look for **Content Scripts** in the left sidebar
4. Should see `content.js` listed
5. If missing, content script isn't loading

### **Test on Different Sites:**
- Try on `https://example.com`
- Try on `https://google.com`  
- Try on `https://github.com`
- If it works on some sites but not others, might be CSP (Content Security Policy) blocking

### **Check Extension Logs:**
1. Go to `chrome://extensions/`
2. Toggle "Developer mode" ON (top right)
3. Click "background page" or "service worker" link
4. Check console for extension errors

## 📋 Information to Collect

If still not working, please share:

1. **Chrome version:** Help → About Google Chrome
2. **Operating system:** Windows/Mac/Linux
3. **Website URL** where you're testing
4. **Console errors** (screenshot from popup inspect)
5. **Browser console errors** (screenshot from webpage F12)
6. **Extension status** (enabled/disabled, permissions)

## ⚡ Quick Fixes to Try

### **Fix 1: Complete Reload**
```
1. chrome://extensions/ 
2. Remove the extension completely
3. Load unpacked again from the folder
4. Try on a simple website like example.com
```

### **Fix 2: Reset Extension**
```
1. Go to extension options (right-click icon → Options)
2. Clear any stored data
3. Reload extension
4. Try again
```

### **Fix 3: Test Permissions**
```
1. Try clicking Report on https://example.com
2. If it works there, the original site might block it
3. Check browser console for Content Security Policy errors
```

## 🎯 Expected Behavior (After Fixes)

When working correctly, you should see:

### **In Popup Console:**
```
🚀 Report button clicked - starting screenshot process
📱 Starting page selection...
🔄 Starting page-based area selection
📋 Showing step 2b (selection status)
🔍 Getting active tab...
✅ Active tab found: {id: 123, url: "..."}
🔄 Ensuring content script is loaded...
✅ Content script already loaded (or injected successfully)
📤 Sending message to content script...
✅ Content script responded: {success: true}
🎯 Area selection started on page successfully
```

### **User Experience:**
1. Click "Report" → Popup shows "Select Problem Area on Page"
2. Switch to webpage tab → **Dark overlay appears automatically**
3. **Instructions panel shows at top** of page
4. **Click and drag directly on page** to select area
5. Selection completes → **popup reopens with cropped screenshot**

Let me know what you find in the console errors! 🔍
