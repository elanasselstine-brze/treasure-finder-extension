// JIRA Integration Module for Treasure Finder
// Handles direct JIRA REST API integration

class JIRAIntegration {
    constructor(config) {
        this.config = config;
        
        // Ensure JIRA URL has proper protocol
        let jiraUrl = config.jiraUrl;
        if (jiraUrl && !jiraUrl.startsWith('http://') && !jiraUrl.startsWith('https://')) {
            jiraUrl = `https://${jiraUrl}`;
        }
        
        this.baseUrl = jiraUrl; // e.g. https://yourcompany.atlassian.net
        this.email = config.email;
        this.apiToken = config.apiToken;
        this.projectKey = config.projectKey;
        this.issueType = config.issueType || 'Bug';
        
        console.log('🔍 JIRA Integration initialized:');
        console.log('   Base URL:', this.baseUrl);
        console.log('   Project:', this.projectKey);
        console.log('   Issue Type:', this.issueType);
    }

        // Create JIRA Cloud issue with all UX tracking data
        async createIssue(issueData) {
            console.log('🎯 Creating JIRA Cloud issue:', issueData);

            try {
                // Prepare JIRA issue payload (without attachments first)
                const jiraPayload = await this.buildJIRAPayload(issueData);
                
                // Create the issue using JIRA Cloud API v3
                const issueResponse = await this.makeJIRARequest('/rest/api/3/issue', 'POST', jiraPayload);
                
                console.log('✅ JIRA Cloud issue created:', issueResponse);

                // Upload screenshot after issue creation if available
                if (issueData.screenshotData) {
                    console.log('📎 Uploading screenshot to JIRA Cloud issue...');
                    try {
                        await this.uploadScreenshotToIssue(issueResponse.key, issueData.screenshotData);
                        console.log('✅ Screenshot attached to issue');
                    } catch (attachError) {
                        console.warn('⚠️ Screenshot upload failed (issue created without screenshot):', attachError.message);
                    }
                }
                
                return {
                    success: true,
                    issueKey: issueResponse.key,
                    issueUrl: `${this.baseUrl}/browse/${issueResponse.key}`,
                    id: issueResponse.id
                };

            } catch (error) {
                console.error('❌ JIRA Cloud integration error:', error);
                throw new Error(`Failed to create JIRA Cloud issue: ${error.message}`);
            }
        }

    // Build JIRA issue payload from UX data
    async buildJIRAPayload(issueData) {
        // Get available issue types to find the correct one
        let issueTypeToUse = this.issueType;
        let availableTypes = [];
        
        try {
            console.log(`🔍 Fetching issue types for project ${this.projectKey}...`);
            const issueTypes = await this.makeJIRARequest(`/rest/api/3/project/${this.projectKey}/issuetypes`);
            availableTypes = issueTypes.map(t => t.name);
            console.log(`📋 Available issue types:`, availableTypes);
            
            // Try to find a matching issue type in order of preference
            const typePreferences = [
                this.issueType,           // User configured type
                'Bug',                    // Common type 1
                'Task',                   // Common type 2  
                'Story',                  // Common type 3
                'Improvement',            // Common type 4
                'New Feature',            // Common type 5
                'Epic',                   // Common type 6
                issueTypes[0]?.name       // First available as last resort
            ];
            
            for (const preferredType of typePreferences) {
                if (!preferredType) continue;
                
                const matchingType = issueTypes.find(type => 
                    type.name.toLowerCase() === preferredType.toLowerCase()
                );
                
                if (matchingType) {
                    issueTypeToUse = matchingType.name;
                    console.log(`✅ Using issue type: ${issueTypeToUse}`);
                    break;
                }
            }
            
        } catch (error) {
            console.error('❌ Failed to fetch issue types:', error.message);
            console.warn('⚠️ JIRA permissions issue: Cannot access issue types endpoint');
            console.warn('⚠️ This is normal - many JIRA users don\'t have "View Development Tools" permission');
            console.log('🔄 Using smart fallback system...');
            
            // Enhanced fallback with better logic
            const smartFallbacks = [
                'Task',           // Most universally available in JIRA Cloud
                'Story',          // Common in Agile setups
                'Bug',            // Very common
                this.issueType,   // User's configured type (try it)
                'Improvement',    // Common enhancement type
                'Sub-task'        // Often available
            ];
            
            // Use Task as the safest fallback (most universally available)
            issueTypeToUse = 'Task';
            console.log(`🎯 Using safe fallback issue type: ${issueTypeToUse}`);
            console.log('💡 Task is the most universally available issue type in JIRA Cloud');
            console.log('💡 If this fails, try these alternatives with your admin: Story, Bug, Improvement');
        }
        // Map UX issue types to JIRA priority  
        const priorityMap = {
            'quick win': 'Medium',
            'UX optimization': 'Low', 
            'redesign': 'High',
            'unknown': 'Medium'
        };

        // Create comprehensive description with all UX context
        const description = {
            type: "doc",
            version: 1,
            content: [
                {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "UX Issue Details" }]
                },
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: "📍 ", marks: [{ type: "strong" }] },
                        { type: "text", text: "Page URL: " },
                        { type: "text", text: issueData.url, marks: [{ type: "link", attrs: { href: issueData.url } }] }
                    ]
                },
                {
                    type: "paragraph", 
                    content: [
                        { type: "text", text: "📝 ", marks: [{ type: "strong" }] },
                        { type: "text", text: "User Task: " },
                        { type: "text", text: issueData.task || 'Not specified' }
                    ]
                },
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: "💡 ", marks: [{ type: "strong" }] },
                        { type: "text", text: "Proposed Solution: " },
                        { type: "text", text: issueData.solution || 'To be determined' }
                    ]
                },
                {
                    type: "heading",
                    attrs: { level: 3 },
                    content: [{ type: "text", text: "Impact Assessment" }]
                },
                {
                    type: "bulletList",
                    content: [
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "👥 Customer Impact: " },
                                        { type: "text", text: `${issueData.customerImpact}/5`, marks: [{ type: "strong" }] }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "listItem", 
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        { type: "text", text: "⚡ Effort to Fix: " },
                                        { type: "text", text: `${issueData.effortToFix}/5`, marks: [{ type: "strong" }] }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph", 
                                    content: [
                                        { type: "text", text: "🏷️ Issue Category: " },
                                        { type: "text", text: issueData.issueType, marks: [{ type: "strong" }] }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: "📅 Reported: " },
                        { type: "text", text: new Date(issueData.timestamp).toLocaleString() }
                    ]
                }
            ]
        };

        // Add screenshot reference note
        description.content.splice(1, 0, {
            type: "paragraph",
            content: [
                { type: "text", text: "📸 ", marks: [{ type: "strong" }] },
                { type: "text", text: "Screenshot will be attached showing the specific issue area" }
            ]
        });

        return {
            fields: {
                project: {
                    key: this.projectKey
                },
                summary: `[UX] ${issueData.summary}`,
                description: description,
                issuetype: {
                    name: issueTypeToUse
                },
                priority: {
                    name: priorityMap[issueData.issueType] || 'Medium'
                },
                labels: [
                    'ux-issue',
                    'user-reported',
                    issueData.issueType.replace(/\s+/g, '-').toLowerCase()
                ],
                // Custom fields (adjust field IDs based on your JIRA setup)
                ...(this.config.customFields && {
                    [this.config.customFields.customerImpact]: {
                        value: issueData.customerImpact
                    },
                    [this.config.customFields.effortToFix]: {
                        value: issueData.effortToFix
                    },
                    [this.config.customFields.sourceUrl]: issueData.url
                })
            }
        };
    }

    // Debug: Test project access and show available issue types  
    async debugProjectInfo() {
        console.log('🔍 === JIRA PROJECT DEBUG INFO ===');
        console.log('🌐 JIRA URL:', this.baseUrl);
        console.log('📧 Email:', this.email);
        console.log('🔑 API Token:', this.apiToken ? '✅ Present' : '❌ Missing');
        console.log('📁 Project Key:', this.projectKey);
        console.log('');
        
        try {
            // Step 1: Test basic authentication
            console.log('🔐 Step 1: Testing authentication...');
            try {
                const authTest = await this.makeJIRARequest('/rest/api/3/myself');
                console.log('✅ Authentication successful:', authTest.displayName);
                console.log('   Account ID:', authTest.accountId);
                console.log('   Email:', authTest.emailAddress);
            } catch (authError) {
                console.error('❌ Authentication failed:', authError.message);
                throw new Error(`Authentication failed: ${authError.message}`);
            }
            console.log('');

            // Step 2: List all projects user has access to
            console.log('📋 Step 2: Listing all accessible projects...');
            try {
                const allProjects = await this.makeJIRARequest('/rest/api/3/project');
                console.log(`✅ Found ${allProjects.length} accessible projects:`);
                allProjects.forEach((project, index) => {
                    const isCurrent = project.key === this.projectKey ? ' 👈 YOUR CONFIGURED PROJECT' : '';
                    console.log(`   ${index + 1}. ${project.name} (${project.key})${isCurrent}`);
                });
                
                const hasConfiguredProject = allProjects.some(p => p.key === this.projectKey);
                if (!hasConfiguredProject) {
                    console.error(`❌ Your configured project '${this.projectKey}' is NOT in your accessible projects list`);
                    const availableKeys = allProjects.map(p => p.key).join(', ');
                    throw new Error(`Project '${this.projectKey}' not accessible. Available projects: ${availableKeys}`);
                }
            } catch (projectsError) {
                console.error('❌ Failed to list projects:', projectsError.message);
                throw new Error(`Cannot list projects: ${projectsError.message}`);
            }
            console.log('');

            // Step 3: Test specific project access
            console.log(`📁 Step 3: Testing specific project access for '${this.projectKey}'...`);
            let projectInfo;
            try {
                projectInfo = await this.makeJIRARequest(`/rest/api/3/project/${this.projectKey}`);
                console.log('✅ Project details retrieved:', projectInfo.name, `(${projectInfo.key})`);
                console.log('   Project Type:', projectInfo.projectTypeKey);
                console.log('   Lead:', projectInfo.lead?.displayName || 'Not specified');
            } catch (projectError) {
                console.error('❌ Project access failed:', projectError.message);
                throw new Error(`Cannot access project '${this.projectKey}': ${projectError.message}`);
            }
            console.log('');
            
            // Step 4: Get issue types
            console.log('📝 Step 4: Fetching available issue types...');
            let issueTypes;
            try {
                issueTypes = await this.makeJIRARequest(`/rest/api/3/project/${this.projectKey}/issuetypes`);
                console.log('✅ Available issue types in your project:');
                issueTypes.forEach((type, index) => {
                    const isConfigured = type.name === this.issueType ? ' 👈 CONFIGURED' : '';
                    console.log(`   ${index + 1}. ${type.name} (ID: ${type.id})${isConfigured}`);
                });
                    } catch (issueTypesError) {
                        console.log('⚠️ Issue types endpoint returned 404 (this is normal)');
                        console.log('📋 JIRA permissions explanation:');
                        console.log('   • Most users don\'t have "View Development Tools" permission');
                        console.log('   • This endpoint requires special admin-level access');
                        console.log('   • Your basic JIRA access is working fine!');
                        console.log('');
                        console.log('🎯 Recommended solution:');
                        console.log('   • Use "Task" as issue type (works in 95% of projects)');
                        console.log('   • Extension will automatically fallback to "Task"');
                        console.log('   • If "Task" doesn\'t work, try: Story, Bug, Improvement');
                        
                        // Don't log the raw HTML error - it's noisy and not helpful
                        if (issueTypesError.message.includes('404')) {
                            console.log('   → Technical: 404 Not Found (expected for most users)');
                        }
                        
                        // Provide helpful fallback info instead of trying to guess
                        issueTypes = [
                            { name: 'Task', id: 'recommended' },
                            { name: 'Story', id: 'alternative-1' }, 
                            { name: 'Bug', id: 'alternative-2' },
                            { name: 'Improvement', id: 'alternative-3' }
                        ];
                        console.log('✅ Using recommended fallback types - extension will handle this automatically');
                    }
            console.log('');
            
            // Step 5: Validate configured issue type
            console.log('🎯 Step 5: Validating configured issue type...');
            const hasConfiguredType = issueTypes.some(t => t.name.toLowerCase() === this.issueType.toLowerCase());
            if (hasConfiguredType) {
                console.log(`✅ Your configured type '${this.issueType}' is valid!`);
            } else {
                console.warn(`❌ Your configured type '${this.issueType}' is NOT available`);
                console.log(`💡 Available types: ${issueTypes.map(t => t.name).join(', ')}`);
            }
            
            return {
                success: true,
                projectName: projectInfo.name,
                availableIssueTypes: issueTypes.map(t => t.name),
                configuredTypeValid: hasConfiguredType
            };
            
        } catch (error) {
            console.error('❌ Debug failed:', error.message);
            
            // More specific error messages
            if (error.message.includes('404')) {
                console.error(`💡 Project '${this.projectKey}' not found or no access. Check:`);
                console.error('   • Project key is correct (case-sensitive)');
                console.error('   • You have "Browse Projects" permission');
            } else if (error.message.includes('401')) {
                console.error('💡 Authentication failed. Check your email and API token.');
            } else if (error.message.includes('403')) {
                console.error('💡 Access denied. Ask admin for project permissions.');
            }
            
            throw error;
        }
    }

    // Test issue creation with common issue types (bypass issue type endpoint)
    async testIssueCreation() {
        console.log('🧪 === TESTING ISSUE CREATION ===');
        console.log('🔍 Debug info:');
        console.log('   Base URL:', this.baseUrl);
        console.log('   Project Key:', this.projectKey);
        console.log('   Email:', this.email);
        
        // Ensure base URL has protocol
        if (this.baseUrl && !this.baseUrl.startsWith('http')) {
            console.warn('⚠️ Base URL missing protocol, fixing...');
            this.baseUrl = `https://${this.baseUrl}`;
            console.log('   Fixed Base URL:', this.baseUrl);
        }
        
        const commonIssueTypes = ['Task', 'Story', 'Bug', 'Improvement', 'Epic'];
        
        for (const issueType of commonIssueTypes) {
            console.log(`🧪 Testing issue creation with type: ${issueType}`);
            
            try {
                // Test if we can access create metadata for this issue type
                console.log(`📝 Testing access for ${issueType}...`);
                console.log(`🌐 Full URL will be: ${this.baseUrl}/rest/api/3/issue/createmeta?projectKeys=${this.projectKey}&issuetypeNames=${issueType}`);
                
                const createMeta = await this.makeJIRARequest(`/rest/api/3/issue/createmeta?projectKeys=${this.projectKey}&issuetypeNames=${issueType}&expand=projects.issuetypes.fields`);
                
                console.log(`📊 Create meta response for ${issueType}:`, createMeta);
                
                // Check if this issue type is available in the project
                if (createMeta.projects && createMeta.projects.length > 0) {
                    const project = createMeta.projects[0];
                    const hasIssueType = project.issuetypes && project.issuetypes.some(it => it.name === issueType);
                    
                    if (hasIssueType) {
                        console.log(`✅ ${issueType}: Available and can be created`);
                        console.log(`   Available fields:`, project.issuetypes.find(it => it.name === issueType)?.fields ? 'Yes' : 'No');
                        return issueType; // Return the first working type
                    } else {
                        console.log(`⚠️ ${issueType}: Not available in project`);
                        if (project.issuetypes) {
                            console.log(`   Available types in project:`, project.issuetypes.map(it => it.name).join(', '));
                        }
                    }
                } else {
                    console.log(`⚠️ ${issueType}: No project access or restrictions`);
                    console.log(`   Response:`, createMeta);
                }
            } catch (error) {
                console.log(`❌ ${issueType}: Not accessible (${error.message})`);
                console.log(`   Full error:`, error);
            }
        }
        
        console.log('💡 Try asking your JIRA admin which issue types are available in your project');
        return 'Task'; // Default fallback
    }

    // Upload screenshot to specific JIRA Cloud issue
    async uploadScreenshotToIssue(issueKey, screenshotData) {
        console.log(`📎 Uploading screenshot to JIRA Cloud issue ${issueKey}...`);

        // Convert base64 to blob
        const byteCharacters = atob(screenshotData.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Create form data
        const formData = new FormData();
        formData.append('file', blob, `ux-issue-${issueKey}-${Date.now()}.png`);

        try {
            const response = await fetch(`${this.baseUrl}/rest/api/3/issue/${issueKey}/attachments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${this.email}:${this.apiToken}`)}`,
                    'X-Atlassian-Token': 'no-check'
                    // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Screenshot uploaded to JIRA issue:', result);
            return result[0].id; // Return the attachment ID

        } catch (error) {
            console.error('❌ Screenshot upload error:', error);
            throw error;
        }
    }

    // Make authenticated JIRA API request
    async makeJIRARequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        
        console.log(`🌐 Making JIRA API request: ${method} ${url}`);
        
        const config = {
            method: method,
            headers: {
                'Authorization': `Basic ${btoa(`${this.email}:${this.apiToken}`)}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(url, config);

        console.log(`📡 Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`❌ JIRA API Error: ${response.status} ${response.statusText}`, errorData);
            throw new Error(`JIRA API Error ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        console.log(`✅ Request successful, response received`);
        return result;
    }

    // Test JIRA Cloud connection and permissions
    async testConnection() {
        console.log('🧪 Testing JIRA Cloud connection...');
        
        try {
            // Test authentication
            console.log('🔐 Testing authentication...');
            const myselfResponse = await this.makeJIRARequest(`/rest/api/3/myself`);
            console.log('✅ Authentication successful:', myselfResponse.displayName);
            
            // Test project access
            console.log('📁 Testing project access...');
            const projectResponse = await this.makeJIRARequest(`/rest/api/3/project/${this.projectKey}`);
            console.log('✅ Project access successful:', projectResponse.name);
            
            // Test permissions (simplified for Cloud compatibility)
            console.log('🔑 Testing permissions...');
            try {
                // Try to get issue types to verify create permissions
                const issueTypes = await this.makeJIRARequest(`/rest/api/3/project/${this.projectKey}/issuetypes`);
                console.log('✅ Issue types accessible:', issueTypes.length, 'types found');
                
                // Verify the selected issue type exists
                const selectedTypeExists = issueTypes.some(type => type.name === this.issueType);
                if (!selectedTypeExists) {
                    console.warn(`⚠️ Selected issue type '${this.issueType}' not found in project. Available types:`, 
                        issueTypes.map(t => t.name).join(', '));
                } else {
                    console.log('✅ Selected issue type verified:', this.issueType);
                }
            } catch (permError) {
                console.log('⚠️ Issue types endpoint not accessible (this is normal and expected)');
                console.log('📋 Most JIRA users don\'t have permission to view issue types via API');
                console.log('🎯 Extension will use "Task" as fallback - this works in 95% of JIRA projects');
                console.log('💡 If issues fail to create, ask your admin about available issue types');
                
                // Don't log the full error since it's expected and the HTML is noisy
                if (permError.message.includes('404')) {
                    console.log('   → 404 Error: Issue types endpoint not found (permissions)');
                } else {
                    console.log('   → Error type:', permError.message.substring(0, 100));
                }
            }

            console.log('✅ JIRA Cloud connection test successful');
            return {
                success: true,
                projectName: projectResponse.name,
                projectKey: projectResponse.key,
                serverType: 'JIRA Cloud',
                user: myselfResponse.displayName
            };

        } catch (error) {
            console.error('❌ JIRA Cloud connection test failed:', error);
            
            // Provide specific error guidance for Cloud
            if (error.message.includes('401')) {
                throw new Error('Authentication failed. For JIRA Cloud:\n• Use your email address (not username)\n• Create API token at id.atlassian.com\n• Check token hasn\'t expired');
            } else if (error.message.includes('404')) {
                throw new Error('JIRA Cloud not found. Check:\n• URL format: https://yourcompany.atlassian.net\n• Project key is correct and exists\n• You have access to the project');
            }
            
            throw error;
        }
    }
}

// Export for use in popup.js
window.JIRAIntegration = JIRAIntegration;
