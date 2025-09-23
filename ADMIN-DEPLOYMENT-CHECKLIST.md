# 🚀 Treasure Finder - Admin Deployment Checklist

## Pre-Deployment Preparation

### ✅ Chrome Web Store Setup:
- [ ] Extension uploaded to Chrome Web Store
- [ ] Set to "Unlisted" visibility 
- [ ] Approved and published
- [ ] Installation link ready to share

### ✅ JIRA Configuration:
- [ ] JIRA project created/selected for UX issues
- [ ] Project permissions configured (users need "Create Issues" and "Add Attachments")
- [ ] Issue types verified (Task, Bug, Story, etc.)
- [ ] Project key documented for users
- [ ] Admin API token created for testing

---

## User Onboarding Process

### 📧 Step 1: Share Installation Details
**Send to users:**
```
Subject: 💎 New Tool: Treasure Finder - Spot UX Issues Easily!

Hi team!

We're rolling out Treasure Finder, a new browser extension that makes reporting UX issues quick and fun!

🔗 Install here: [Your Private Chrome Store Link]
📋 Setup guide: [Link to END-USER-SETUP-GUIDE.md]

What you'll need:
• Your JIRA login email
• 5 minutes for setup
• JIRA URL: https://[yourcompany].atlassian.net
• Project Key: [YOUR_PROJECT_KEY]

Questions? Reply to this email or check the setup guide!
```

### 📋 Step 2: Required Information for Users
**Provide these details:**
- **JIRA URL**: `https://[yourcompany].atlassian.net`
- **Project Key**: `[YOUR_PROJECT_KEY]` (e.g., "UX", "SUPPORT", "BUG")
- **Recommended Issue Type**: `Task` or `Bug` (whatever works in your setup)
- **Support contact**: Who to reach for technical issues

### 🎯 Step 3: User Setup Verification
**Help users verify their setup:**
1. Users click "Test JIRA Connection" in extension options
2. Green success message = ready to go
3. Red error = needs troubleshooting (see guide)

---

## Support & Troubleshooting

### 🔧 Common Setup Issues:

**❌ "JIRA connection not successful"**
- Check JIRA URL format (must include https://)
- Verify user has JIRA account and project access
- Ensure API token is fresh (they expire)

**⚠️ "JIRA API Error 404" with HTML response (NORMAL)**
- This is expected for 95% of users
- Users don't have "View Development Tools" permission
- Extension automatically uses "Task" as fallback
- Only escalate if actual issue creation fails

**❌ "Project not found" or 404 errors**
- Verify project key is correct (case-sensitive)
- Check user has "Browse Projects" permission
- Confirm project exists and is accessible

**❌ "Invalid issue type" errors**
- Check available issue types in the project
- Use extension's "🧪 Test Issue Types" debug tool
- Update recommended issue type for users

**❌ Screenshot not working**
- Some pages block screenshot capture (banking, secure sites)
- Extension needs to be reloaded after Chrome updates
- User needs to allow site permissions

### 🛠️ Debug Tools Available:
- **Options → "🔍 Debug Project Info"**: Shows detailed JIRA connection diagnostics
- **Options → "🧪 Test Issue Types"**: Tests which issue types work
- **Browser Console**: Detailed error logs (F12 → Console)

---

## Success Metrics to Track

### 📊 Usage Analytics (via JIRA):
- Number of issues created via Treasure Finder
- User adoption rate (how many team members actively using)
- Issue resolution time (faster triage with better screenshots?)
- User feedback on the tool

### 🎯 Quality Indicators:
- Issues contain useful screenshots
- Descriptions are clear and actionable  
- Appropriate categorization (quick win vs redesign)
- Team finds the reports helpful

---

## Ongoing Maintenance

### 🔄 Monthly Check-ins:
- [ ] Verify JIRA integration still working
- [ ] Check for Chrome extension updates needed
- [ ] Collect user feedback and feature requests
- [ ] Review submitted issues for quality

### 📈 Optimization Opportunities:
- Add custom JIRA fields if needed (customer impact, effort scores)
- Create JIRA automation rules for issue routing
- Set up dashboards to visualize UX issue trends
- Train team on effective issue categorization

---

## 🎉 Launch Day Checklist

### Final Pre-Launch (Day Before):
- [ ] Test the full flow yourself (install → configure → report issue)
- [ ] Verify JIRA issues are being created correctly
- [ ] Screenshots attaching properly
- [ ] Prepare launch announcement email
- [ ] Have support contact ready for questions

### Launch Day:
- [ ] Send installation email to team
- [ ] Be available for setup questions
- [ ] Monitor first few issue submissions
- [ ] Celebrate successful reports! 🎉

### First Week Follow-up:
- [ ] Check adoption rates
- [ ] Gather initial feedback
- [ ] Address any technical issues
- [ ] Share success stories to encourage usage

---

## 📞 Support Resources

**For Technical Issues:**
- Share the END-USER-SETUP-GUIDE.md
- Use built-in debug tools in extension options
- Check browser console for detailed errors

**For JIRA Configuration:**
- Verify project permissions and access
- Check issue type availability
- Confirm API token hasn't expired

**For User Training:**
- Share best practices for writing clear issue reports
- Demonstrate effective screenshot selection
- Explain the categorization system (quick win vs redesign)

---

## 🚀 You're Ready to Launch!

This checklist ensures smooth deployment of Treasure Finder to your organization. The tool transforms UX issue reporting from a tedious process into an engaging, treasure-hunting adventure that your team will actually want to use!

**Remember**: The goal is making it so easy to report UX issues that your team does it instinctively whenever they spot problems. With proper setup and support, Treasure Finder will become an invaluable part of your product improvement process.

**Happy deploying!** 💎✨
