// JIRA Connection Debugging Tool
// Run this in the browser console on the options page

async function debugJIRAConnection() {
    console.log('🔧 Starting JIRA Connection Debug...');
    console.log('=====================================');
    
    // Get configuration from the form
    const config = {
        jiraUrl: document.getElementById('jiraUrl').value.trim(),
        email: document.getElementById('jiraEmail').value.trim(), 
        apiToken: document.getElementById('jiraApiToken').value.trim(),
        projectKey: document.getElementById('jiraProject').value.trim().toUpperCase(),
        issueType: document.getElementById('jiraIssueType').value
    };
    
    console.log('📋 Configuration Check:');
    console.log('  JIRA URL:', config.jiraUrl);
    console.log('  Email:', config.email);
    console.log('  API Token:', config.apiToken ? `${config.apiToken.substring(0, 8)}...` : 'MISSING');
    console.log('  Project Key:', config.projectKey);
    console.log('  Issue Type:', config.issueType);
    console.log('');
    
    // Validate configuration
    const requiredFields = ['jiraUrl', 'email', 'apiToken', 'projectKey'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        return;
    }
    
    // Validate URL format
    if (!config.jiraUrl.startsWith('https://')) {
        console.error('❌ JIRA URL must start with https://');
        return;
    }
    
    // Validate JIRA Cloud URL
    const isCloudJira = config.jiraUrl.includes('atlassian.net');
    
    if (isCloudJira) {
        console.log('🌤️ Detected JIRA Cloud instance - perfect!');
        if (!config.email.includes('@')) {
            console.warn('⚠️ JIRA Cloud requires email address, not username');
        }
    } else {
        console.error('❌ URL doesn\'t look like JIRA Cloud (should contain atlassian.net)');
        console.log('Expected format: https://yourcompany.atlassian.net');
        return;
    }
    
    console.log('✅ Configuration validation passed');
    console.log('');
    
    // Test basic authentication
    console.log('🔐 Testing JIRA Cloud Authentication...');
    try {
        const authUrl = `${config.jiraUrl}/rest/api/3/myself`;
        console.log('  Testing URL:', authUrl);
        
        const authResponse = await fetch(authUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${config.email}:${config.apiToken}`)}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('  Auth Response Status:', authResponse.status);
        
        if (authResponse.status === 401) {
            console.error('❌ Authentication failed - Invalid email or API token');
            const errorText = await authResponse.text();
            console.error('  Error details:', errorText);
            return;
        }
        
        if (authResponse.status === 403) {
            console.error('❌ Access forbidden - Account might be restricted');
            return;
        }
        
        if (!authResponse.ok) {
            console.error(`❌ Auth request failed: ${authResponse.status} ${authResponse.statusText}`);
            return;
        }
        
        const userInfo = await authResponse.json();
        console.log('✅ Authentication successful!');
        console.log('  User:', userInfo.displayName);
        console.log('  Account ID:', userInfo.accountId);
        console.log('');
        
    } catch (error) {
        console.error('❌ Authentication test failed:', error);
        return;
    }
    
    // Test project access
    console.log('📁 Testing Project Access...');
    try {
        const projectUrl = `${config.jiraUrl}/rest/api/3/project/${config.projectKey}`;
        console.log('  Project URL:', projectUrl);
        
        const projectResponse = await fetch(projectUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${config.email}:${config.apiToken}`)}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('  Project Response Status:', projectResponse.status);
        
        if (projectResponse.status === 404) {
            console.error(`❌ Project '${config.projectKey}' not found`);
            console.error('  - Check if project key is correct');
            console.error('  - Check if you have access to this project');
            return;
        }
        
        if (!projectResponse.ok) {
            console.error(`❌ Project access failed: ${projectResponse.status} ${projectResponse.statusText}`);
            return;
        }
        
        const projectInfo = await projectResponse.json();
        console.log('✅ Project access successful!');
        console.log('  Project Name:', projectInfo.name);
        console.log('  Project ID:', projectInfo.id);
        console.log('  Project Type:', projectInfo.projectTypeKey);
        console.log('');
        
    } catch (error) {
        console.error('❌ Project access test failed:', error);
        return;
    }
    
    // Test permissions (simplified for Cloud compatibility)
    console.log('🔑 Testing Permissions...');
    try {
        const issueTypesUrl = `${config.jiraUrl}/rest/api/3/project/${config.projectKey}/issuetypes`;
        
        const issueTypesResponse = await fetch(issueTypesUrl, {
            headers: {
                'Authorization': `Basic ${btoa(`${config.email}:${config.apiToken}`)}`,
                'Accept': 'application/json'
            }
        });
        
        if (issueTypesResponse.ok) {
            const issueTypes = await issueTypesResponse.json();
            console.log('✅ Issue types accessible (indicates good permissions):');
            issueTypes.forEach(type => {
                const marker = type.name === config.issueType ? '👈 SELECTED' : '';
                console.log(`  - ${type.name} ${marker}`);
            });
            
            const hasSelectedType = issueTypes.some(type => type.name === config.issueType);
            if (!hasSelectedType) {
                console.warn(`⚠️ Selected issue type '${config.issueType}' not found in project`);
                console.log('  Available types:', issueTypes.map(t => t.name).join(', '));
            } else {
                console.log('✅ Selected issue type verified');
            }
        } else {
            console.warn('⚠️ Could not verify issue types, but basic access works');
        }
        console.log('');
        
    } catch (error) {
        console.warn('⚠️ Permissions test failed (non-critical):', error.message);
        console.log('  This is usually fine - basic access is confirmed');
    }
    
    // Test CORS and network
    console.log('🌐 Testing Network & CORS...');
    console.log('  CORS should work from extension context');
    console.log('  If running in regular webpage, CORS might block requests');
    console.log('');
    
    console.log('🎉 JIRA Connection Debug Complete!');
    console.log('=====================================');
    console.log('If all tests passed, JIRA integration should work.');
    console.log('If any failed, check the error messages above.');
    console.log('');
    console.log('💡 Next steps:');
    console.log('1. Fix any configuration issues found above');
    console.log('2. Try the "Test JIRA Connection" button in the extension');
    console.log('3. Test creating an actual issue');
    
    return 'Debug completed - check console output above';
}

// Auto-run if this script is executed
console.log('🔧 JIRA Debug Tool Loaded');
console.log('Run debugJIRAConnection() to start debugging');
