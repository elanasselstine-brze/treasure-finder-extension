# 🔧 Fix Your Google Sheet Connection + Screenshot URLs

## Issues You're Having:
1. ❌ **Google Sheet connection broken**
2. ❌ **Want screenshot URLs instead of "Yes/No" in the sheet**

## 🚀 Complete Fix (Do These Steps in Order)

### **Step 1: Update Your Google Apps Script**

1. **Go to [script.google.com](https://script.google.com)**
2. **Open your UX Issue Tracker project**
3. **REPLACE ALL CODE** with the contents from `improved-google-script.js` file I created
4. **Save the project** (Ctrl/Cmd + S)

### **Step 2: Redeploy Your Web App**

1. **Click "Deploy"** → **"Manage deployments"**
2. **Click the edit icon** (pencil) next to your existing deployment
3. **Change "Version" to "New version"**
4. **Make sure settings are:**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. **Click "Deploy"**
6. **Copy the new web app URL** (it should be the same as before)

### **Step 3: Test the Connection in Google Apps Script**

1. **In the function dropdown, select `testConnection`**
2. **Click ▶️ Run**
3. **Check the execution log** - you should see:
   ```
   ✅ Connection test successful!
   📊 Spreadsheet URL: [your sheet URL]
   📁 Screenshots folder URL: [your folder URL]
   ```

If you see errors here, **STOP** and let me know what they say.

### **Step 4: Update Your Extension**

1. **Go to `chrome://extensions/`**
2. **Find "UX Issue Tracker"**
3. **Click the reload icon** ↻

### **Step 5: Test Your Extension Connection**

1. **Right-click the extension icon** → **"Options"**
2. **Make sure your webhook URL is entered correctly**
3. **Click "Test Connection"**
4. **Should see "✅ Connection test successful!"**

### **Step 6: Test End-to-End**

1. **Use your extension to submit a test issue with a screenshot**
2. **Check your Google Sheet** - should see:
   - New row with your test data
   - **Screenshot URL column** instead of "Has Screenshot"
   - Actual Google Drive link in that column (if screenshot was taken)
3. **Click the screenshot URL** - should open the screenshot in Google Drive

## 📊 **What's Changed:**

### **Before:**
| Column | Data |
|--------|------|
| Has Screenshot | Yes/No |

### **After:**
| Column | Data |
|--------|------|
| Screenshot URL | https://drive.google.com/file/d/ABC123... |

## 🔍 **Troubleshooting Common Issues:**

### **Issue: "Webhook URL not found (404 error)"**
**Fix:** 
- Make sure you redeployed with "New version" 
- Check that "Who has access" is set to "Anyone"
- Try the web app URL directly in a browser

### **Issue: "CORS error"** 
**Fix:**
- Your Google Apps Script isn't deployed properly
- Make sure "Execute as: Me" and "Who has access: Anyone"

### **Issue: "Connection test successful but extension fails"**
**Fix:**
- Reload the extension completely
- Check browser console for errors (F12 → Console)
- Make sure webhook URL is saved in extension options

### **Issue: "Screenshots not appearing in Drive"**
**Fix:**
- Check if "UX Issues Screenshots" folder exists in Google Drive
- Run `getOrCreateScreenshotFolder()` function in Google Apps Script
- Make sure Google Apps Script has Drive permissions

## 🎯 **Quick Verification Steps:**

1. **Google Apps Script test functions work?** ✅
2. **Extension options page connection test works?** ✅  
3. **New Google Sheet column shows "Screenshot URL"?** ✅
4. **Screenshot URLs are clickable links to Google Drive?** ✅

## 📞 **If You're Still Having Issues:**

Run these diagnostic functions in Google Apps Script and tell me the results:

1. **`testConnection()`** - Basic connectivity
2. **`getCurrentDeploymentInfo()`** - Get your webhook URL
3. **`testDataInsertion()`** - Test adding data to sheet

**Also check:**
- Extension browser console errors (F12 → Console while using extension)
- Google Apps Script execution logs
- Your webhook URL matches what's in your extension options

The main changes I made:
- ✅ Fixed data format compatibility 
- ✅ Added screenshot URL storage instead of Yes/No
- ✅ Improved error handling and logging
- ✅ Better connection testing
- ✅ Automatic folder and spreadsheet creation

Try these steps and let me know if you get stuck at any point! 🚀
