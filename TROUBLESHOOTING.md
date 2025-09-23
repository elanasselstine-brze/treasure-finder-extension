# Extension Troubleshooting Guide

## The Issue
Your extension was rendering too narrow and the buttons weren't clickable. I've made several fixes to resolve this.

## Fixes Applied

### 1. CSS Width Issues Fixed
- ✅ Removed problematic responsive CSS that was forcing full-screen mode
- ✅ Set explicit width constraints for Chrome extension popup
- ✅ Added `!important` declarations to prevent width overrides

### 2. JavaScript Error Handling
- ✅ Added comprehensive error logging and debugging
- ✅ Added fallback initialization in case of timing issues
- ✅ Added element validation to catch missing DOM elements

### 3. Debug Tools Added
- ✅ Temporary debug script to diagnose issues
- ✅ Console logging for all initialization steps
- ✅ Button click testing and element validation

## How to Test the Fixes

### Step 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "UX Issue Tracker"
3. Click the **reload/refresh** icon ↻
4. The extension should reload with the new code

### Step 2: Test the Popup
1. Click the extension icon in your toolbar
2. The popup should now render at proper width (400px)
3. You should see the "Report" button clearly
4. Click the "Report" button - it should work now!

### Step 3: Check Debug Console (if still having issues)
1. Right-click the extension icon → "Inspect popup"
2. In the DevTools Console tab, you should see:
   ```
   === UX Issue Tracker Debug Info ===
   Window dimensions: 400 x [height]
   Document ready state: complete
   Body dimensions: 400 x [height]
   === Element Check ===
   step1: ✓ Found
   reportBtn: ✓ Found
   [... more element checks ...]
   === Container Styles ===
   Width: 400px
   [... more style info ...]
   === Step Visibility ===
   Step 1: Visible
   [... other steps should be Hidden ...]
   === Testing Button Click ===
   Report button found, testing click...
   ✓ Button is clickable
   ```

## If Still Having Issues

### Common Problems & Solutions

**Problem**: Extension still renders narrow
- **Solution**: Make sure you reloaded the extension completely
- **Check**: Browser zoom level (should be 100%)
- **Try**: Disable other extensions temporarily

**Problem**: Buttons still not clickable
- **Solution**: Check the console for JavaScript errors
- **Check**: Make sure all files are in the correct location
- **Try**: Clear browser cache and reload extension

**Problem**: Console shows "Critical element not found" errors
- **Solution**: Check that `popup.html` file is correct and complete
- **Check**: File permissions (should be readable)

### Manual Test Steps

1. **Width Test**: The popup should be exactly 400px wide
2. **Height Test**: Should be around 500px+ tall with proper spacing
3. **Button Test**: "Report" button should be centered and clickable
4. **Step Test**: Only Step 1 should be visible initially

### Remove Debug Code (Once Working)

After confirming everything works:

1. Edit `popup.html`
2. Remove this line: `<script src="debug.js"></script>`
3. Delete the `debug.js` file
4. Reload the extension one more time

## Expected Behavior

✅ **Popup opens at 400px width**  
✅ **Header shows "UX Issue Tracker" with sparkle icon**  
✅ **"Report" button is visible and centered**  
✅ **Clicking "Report" starts screenshot capture**  
✅ **Form flows through all 5 steps properly**  

## Still Need Help?

If you're still having issues after trying these fixes:

1. **Check the console output** and let me know what errors you see
2. **Try opening the popup in a regular browser tab** by going to:  
   `chrome-extension://[EXTENSION-ID]/popup.html`
3. **Test with a fresh Chrome profile** to rule out conflicts

The extension should now work properly! Let me know if you need any clarification on these steps.
