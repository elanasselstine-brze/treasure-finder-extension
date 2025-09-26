# Treasure Finder - Local Installation Guide

*For internal team distribution while awaiting Chrome Web Store approval*

## 📋 **Quick Summary**

Install Treasure Finder locally on Chrome by:
1. Download the extension files
2. Enable Chrome Developer Mode
3. Load the unpacked extension
4. Configure JIRA settings

---

## 📥 **Step 1: Download Extension Files**

### **Option A: Download ZIP from GitHub (Recommended)**
1. **Visit**: `https://github.com/elanasselstine-brze/treasure-finder-extension`
2. **Click** the green **"Code"** button
3. **Select** "Download ZIP"
4. **Extract** the ZIP file to a folder on your computer (e.g., `Desktop/treasure-finder/`)

### **Option B: Download Pre-packaged Version**
If Elan provides a ZIP file directly:
1. **Save** `treasure-finder-v1.1.0.zip` to your computer
2. **Extract** the ZIP file to a folder (e.g., `Desktop/treasure-finder/`)

---

## 🔧 **Step 2: Install in Chrome**

### **2.1: Enable Developer Mode**
1. **Open Chrome**
2. **Navigate to**: `chrome://extensions/`
3. **Toggle ON** the **"Developer mode"** switch (top-right corner)

### **2.2: Load the Extension**
1. **Click** "Load unpacked" button (appears after enabling Developer mode)
2. **Navigate to** the extracted treasure-finder folder
3. **Select** the folder containing `manifest.json`
4. **Click** "Select Folder" or "Open"

### **2.3: Verify Installation**
✅ You should see "Treasure Finder" appear in your extensions list  
✅ The 🔍 magnifying glass icon should appear in your Chrome toolbar

---

## ⚙️ **Step 3: Configure JIRA Integration**

### **3.1: Open Extension Options**
**Method 1**: Right-click the 🔍 icon → "Options"  
**Method 2**: Go to `chrome://extensions/` → Find Treasure Finder → Click "Details" → "Extension options"

### **3.2: Configure JIRA Settings**
1. **JIRA URL**: `https://brazeonmars.atlassian.net`
2. **Email**: Your Braze email address
3. **API Token**: [Get your JIRA API token](https://id.atlassian.com/manage-profile/security/api-tokens)
4. **Project Key**: `PDE` (or your team's project key)
5. **Issue Type**: `Task` (recommended)

### **3.3: Test Connection**
1. **Click** "Test JIRA Connection"
2. **Wait** for green checkmark ✅
3. **If errors occur**: Check your JIRA credentials and network access

---

## 🎯 **Step 4: Start Using Treasure Finder**

### **Basic Workflow:**
1. **Navigate** to any webpage with UX issues
2. **Click** the 🔍 extension icon
3. **Click** "Report" to start issue capture
4. **Select** problem area by clicking and dragging
5. **Fill out** the form with issue details:
   - **Summary**: Brief description
   - **Task**: What user was trying to do
   - **Solution**: Your suggested fix
   - **Type**: Quick Win / UX Optimization / Redesign / Unknown
   - **Priority**: P0 (Highest) / P1 (High) / P2 (Medium)
6. **Submit** → Issue automatically created in JIRA with screenshot!

---

## 🔍 **Troubleshooting**

### **Extension Not Loading?**
- ✅ Check that you selected the folder containing `manifest.json`
- ✅ Ensure Developer mode is enabled
- ✅ Try refreshing the extensions page (`chrome://extensions/`)

### **JIRA Connection Fails?**
- ✅ Verify your JIRA URL is correct: `https://brazeonmars.atlassian.net`
- ✅ Check your API token is valid and not expired
- ✅ Confirm you have access to the PDE project
- ✅ Try the "Debug Project Info" button for detailed diagnostics

### **Screenshots Not Working?**
- ✅ Ensure you're clicking and dragging to select an area
- ✅ Press ESC to cancel and try again
- ✅ Check that the page has finished loading

### **Extension Updates**
When new versions are released:
1. **Download** the new version
2. **Go to** `chrome://extensions/`
3. **Click** the refresh icon ↻ on Treasure Finder
4. **Or remove** and reinstall with new files

---

## 🏢 **Team Distribution**

### **For Managers/Admins:**
1. **Download** the latest version from GitHub
2. **Share** this installation guide with your team
3. **Set up** a team JIRA project if needed
4. **Provide** team members with:
   - Extension files (ZIP)
   - JIRA project key
   - This installation guide

### **For Team Members:**
- **Follow** this guide step-by-step
- **Ask** your admin for JIRA project details
- **Test** with a sample issue to verify setup
- **Report** any technical issues to Elan or your admin

---

## 📞 **Support**

### **Technical Issues:**
- **Developer**: Elan Asselstine (elan.asselstine@braze.com)
- **GitHub Issues**: [Report bugs here](https://github.com/elanasselstine-brze/treasure-finder-extension/issues)

### **JIRA Access Issues:**
- **Contact** your JIRA administrator
- **Verify** project permissions
- **Check** API token validity

---

## 🎉 **You're Ready!**

Once configured, Treasure Finder will help your team:
- ✅ **Capture UX issues** with precise screenshots
- ✅ **Organize by priority** (P0/P1/P2) and type
- ✅ **Track in JIRA** with proper categorization
- ✅ **Improve workflows** with actionable UX debt tracking

**Happy treasure hunting!** 🔍✨
