# 💎 Treasure Finder - Setup Guide

## Welcome to Treasure Finder!
Your new tool for spotting and reporting UX issues with ease! Follow these simple steps to get started.

---

## 📥 Step 1: Install the Extension

### From Chrome Web Store (Recommended):
1. **Click the private installation link** provided by your admin
2. Click **"Add to Chrome"**
3. Click **"Add extension"** when prompted
4. You'll see the Treasure Finder icon (💎) appear in your browser toolbar

### Confirm Installation:
- Look for the gem icon (💎) in your Chrome toolbar
- Click it to see "Treasure Finder" popup
- You're ready to configure!

---

## ⚙️ Step 2: Configure JIRA Integration

### Get Your JIRA API Token:
1. **Go to** [id.atlassian.com](https://id.atlassian.com)
2. **Click "Security"** in the left sidebar
3. **Click "Create and manage API tokens"**
4. **Click "Create API token"**
5. **Give it a name** like "Treasure Finder Extension"
6. **Click "Create"**
7. **IMPORTANT**: Copy the token immediately - you won't see it again!

### Configure the Extension:
1. **Right-click the Treasure Finder icon** (💎) in your toolbar
2. **Select "Options"**
3. **Choose "JIRA Integration"** (should be selected by default)
4. **Fill in your details**:
   - **JIRA URL**: `https://yourcompany.atlassian.net` (replace with your company's URL)
   - **Email**: Your JIRA login email
   - **API Token**: Paste the token you just created
   - **Project Key**: Ask your JIRA admin (usually something like "SUPPORT", "BUG", or "UX")
   - **Issue Type**: Leave as "Task" (or ask your admin what to use)

### Test Your Connection:
1. **Click "Test JIRA Connection"**
2. **Wait for the green success message**
3. **You may see warnings** about "issue types" - this is **normal and expected**!
   - Most users don't have permission to view issue types
   - The extension automatically uses "Task" as fallback
   - Your connection is working fine even with these warnings
4. **Click "Save Settings"** when basic connection test passes

---

## 🎯 Step 3: Report Your First Issue!

### Find a UX Problem:
- Navigate to any page with a UX issue
- Could be a confusing button, broken layout, unclear text, etc.

### Report the Issue:
1. **Click the Treasure Finder icon** (💎)
2. **Click "Report 📷"**
3. **Select the problem area**:
   - Your cursor changes to a crosshair
   - Click and drag to highlight the specific issue area
   - Press ESC if you want to cancel
4. **Review your screenshot**:
   - Check that it captures the problem clearly
   - Click "Retake" if needed, or "Next" to continue
5. **Fill out the details**:
   - **Summary**: Brief description (e.g., "Button text is unclear")
   - **Task**: What were you trying to do?
   - **Solution**: Your suggestion for fixing it
   - **Issue Type**: Quick win, UX optimization, redesign, or unknown
   - **Customer Impact**: Rate 1-5 (5 = high impact)
   - **Effort to Fix**: Rate 1-5 (5 = lots of work)
6. **Click "Submit"**
7. **Watch the progress animation** and celebration! 🎉

### What Happens Next:
- Your issue automatically appears in JIRA
- Screenshots are attached to the JIRA ticket
- Your team can prioritize and assign the issue
- You'll get a "Issue submitted!" confirmation

---

## 💡 Pro Tips

### Taking Great Screenshots:
- **Be precise**: Select only the problematic area
- **Include context**: Make sure surrounding elements provide context
- **Avoid sensitive data**: Don't capture personal information in screenshots

### Writing Helpful Reports:
- **Be specific**: "Button is unclear" → "Save button says 'Process' instead of 'Save'"
- **Include your goal**: What were you trying to accomplish?
- **Suggest solutions**: Even simple ideas help the team understand the problem

### Using Categories:
- **Quick win**: Easy fixes (typos, color changes, small text updates)
- **UX optimization**: Moderate improvements (button placement, form flow)
- **Redesign**: Major changes (layout overhaul, new features)
- **Unknown**: Not sure how complex the fix would be

---

## 🆘 Troubleshooting

### Extension Not Working:
1. **Refresh the page** and try again
2. **Check if you're on a restricted page** (chrome://, Chrome Web Store, etc.)
3. **Reload the extension**: Go to chrome://extensions → click refresh on Treasure Finder

### JIRA Connection Issues:
1. **Verify your JIRA URL** (should be https://yourcompany.atlassian.net)
2. **Check your API token** hasn't expired
3. **Confirm project permissions** with your JIRA admin
4. **Try the debug tools** in Options → "🔍 Debug Project Info"

### "Issue Types" 404 Errors (NORMAL):
1. **This is expected** - most JIRA users see this warning
2. **Your connection is fine** - warnings about issue types are normal
3. **Extension uses "Task" automatically** - works in 95% of projects
4. **Only worry if** issue submission actually fails
5. **If issues fail**, ask admin which issue types to use: Task, Story, Bug, Improvement

### Screenshot Problems:
1. **Make sure you click and drag** (don't just click)
2. **Press ESC to cancel** and try again
3. **Check if the page allows screenshots** (some secure pages block this)

### Can't See Issues in JIRA:
1. **Check the correct project** (verify project key with admin)
2. **Look for filter settings** in JIRA that might hide new issues
3. **Confirm permissions** - you might need "Browse Issues" access

---

## 🎉 You're All Set!

**Congratulations!** You're now ready to help improve your product by spotting and reporting UX issues. Every issue you find makes the user experience better for everyone!

### Need Help?
- **Contact your IT admin** for installation support
- **Ask your product team** about which issues to prioritize
- **Check JIRA** to see your submitted issues and their progress

**Happy treasure hunting!** 💎✨

---

*Treasure Finder transforms UX issue reporting from a chore into an engaging adventure. Every problem you spot is a valuable treasure that helps build better products!*
