# 🌤️ JIRA Cloud Debugging Guide

## 🚨 **Quick Debug Process**

### **Step 1: What's the exact error?**
Please copy the **exact error message** you're seeing. Common ones:

❌ **"401 Unauthorized"** → Invalid email/API token for JIRA Cloud
❌ **"404 Not Found"** → Wrong JIRA Cloud URL or project key  
❌ **"403 Forbidden"** → No permissions in JIRA Cloud
❌ **"CORS error"** → Network/browser issue (rare with Cloud)
❌ **"Could not establish connection"** → URL/network problem  

### **Step 2: Run Debug Tool**

1. **Right-click extension** → **Options**
2. **Right-click on page** → **Inspect** → **Console**
3. **Copy and paste this command**:

```javascript
// Copy this entire block and paste in console
fetch('/debug-jira.js').then(r=>r.text()).then(code=>eval(code)).then(()=>debugJIRAConnection())
```

This will test every part of your JIRA connection step-by-step.

### **Step 3: Check JIRA Cloud Configuration**

Verify each field **exactly**:

| Field | Format | Example | Common Issues |
|-------|--------|---------|---------------|
| **JIRA Cloud URL** | `https://company.atlassian.net` | `https://acme.atlassian.net` | ❌ Missing https:// <br> ❌ Wrong domain <br> ❌ Extra paths |
| **Email** | Your JIRA Cloud email | `john@company.com` | ❌ Wrong email <br> ❌ Typos |
| **API Token** | 24-char token | `ATATxxxxxxxxxxxxx` | ❌ Expired token <br> ❌ Copy/paste error |
| **Project Key** | Uppercase letters | `PROJ` | ❌ Wrong case <br> ❌ Project doesn't exist |

---

## 🔍 **Common Issues & Solutions**

### **🔐 Issue 1: "401 Unauthorized"**

**Cause**: Invalid email or API token for JIRA Cloud

**Solutions**:
1. **Get new API token**:
   - Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Delete old token (they expire after 1 year)
   - Create new one: "UX Issue Tracker"
   - Copy immediately (you won't see it again!)

2. **Check email**: Must be **exact** JIRA Cloud account email
3. **Test manually**: Try logging into JIRA Cloud web interface

### **📁 Issue 2: "404 Not Found" or "Project not found"**

**Cause**: Wrong JIRA Cloud URL or project key

**Solutions**:
1. **Verify JIRA Cloud URL**:
   - Must be `https://yourcompany.atlassian.net`
   - NOT `https://yourcompany.atlassian.net/jira`
   - NOT `https://yourcompany.jira.com`
   - NOT any other domain

2. **Find correct project key**:
   - Go to your JIRA Cloud project
   - Look at URL: `https://company.atlassian.net/projects/PROJ`
   - Project key is `PROJ` (usually uppercase)

3. **Check project access**: Make sure you can see the project in JIRA Cloud

### **🚫 Issue 3: "403 Forbidden" or "Access denied"**

**Cause**: No permissions to create issues in JIRA Cloud

**Solutions**:
1. **Check project permissions**:
   - Ask JIRA admin to add you to project
   - Need "Create Issues" permission
   - Need "Browse Projects" permission

2. **Try different project**: Test with a project you have admin access to
3. **Check license**: Ensure you have a valid JIRA Cloud license

### **⚙️ Issue 4: "Issue type not found"**

**Cause**: Selected issue type doesn't exist in your JIRA Cloud project

**Solutions**:
1. **Check available types**:
   - Go to JIRA Cloud project
   - Create Issue → See available types
   - Common types: Bug, Task, Story, Improvement

2. **Update extension settings**: Change to existing type

---

## 🧪 **Manual Testing Steps**

### **Test 1: Basic JIRA Cloud Authentication**
```bash
# Replace with your JIRA Cloud details
curl -u "your-email@company.com:YOUR_API_TOKEN" \
  https://yourcompany.atlassian.net/rest/api/3/myself
```

**Expected**: JSON with your user info  
**If error**: Check email/token

### **Test 2: JIRA Cloud Project Access**
```bash
curl -u "your-email@company.com:YOUR_API_TOKEN" \
  https://yourcompany.atlassian.net/rest/api/3/project/PROJ
```

**Expected**: JSON with project info  
**If error**: Check Cloud URL/project key

### **Test 3: Issue Creation**
Try creating a simple issue manually in JIRA Cloud web interface.

---

## 🔧 **Advanced Debugging**

### **Enable Console Logging**
1. Open browser console on extension pages
2. Look for detailed error messages
3. JIRA integration logs all API calls

### **Check Network Tab**
1. Open Developer Tools → Network
2. Try JIRA connection test
3. Look for failed requests (red ones)
4. Click on failed request → see exact error

### **Test Different Browsers**
- Try Chrome, Edge, Firefox
- Some browsers have different security policies

---

## 🆘 **Still Not Working?**

### **Collect Debug Info**
Please provide:

1. **Exact error message** (copy-paste from console)
2. **Your JIRA setup**: 
   - Cloud (atlassian.net) or Server?
   - Your JIRA URL (without credentials)
3. **Browser**: Chrome, Edge, Firefox?
4. **Network**: Corporate network? VPN?
5. **Debug tool output** (from Step 2 above)

### **Alternative Solutions**

If JIRA integration doesn't work, you can:

1. **Use Google Sheets** (simpler setup)
2. **Use Zapier/Make** to connect Sheets → JIRA  
3. **Export local data** and import to JIRA manually
4. **Email integration** (if your JIRA has email-to-issue)

---

## 📚 **Quick Reference**

### **JIRA Cloud URLs**
- **Correct**: `https://company.atlassian.net`
- **Wrong**: `https://company.atlassian.net/jira` (extra path)
- **Wrong**: `https://company.jira.com` (wrong domain)
- **Wrong**: `http://...` (must be HTTPS)

### **JIRA Cloud API Token Requirements**
- Must be from [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens)
- 24 characters long
- Starts with `ATAT`
- Expires after 1 year (create new one)
- Use with your email address

### **Required JIRA Cloud Permissions**
- Browse Projects
- Create Issues  
- Add Comments
- Create Attachments

**Run the debug tool first - it will identify the exact issue!** 🔍
