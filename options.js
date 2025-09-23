class OptionsManager {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadSettings();
        this.updateDataCount();
    }

    initializeElements() {
        // Integration choice elements
        this.useJIRA = document.getElementById('useJIRA');
        this.useSheets = document.getElementById('useSheets');
        this.jiraSection = document.getElementById('jiraSection');
        this.sheetsSection = document.getElementById('sheetsSection');

        // JIRA elements
        this.jiraUrl = document.getElementById('jiraUrl');
        this.jiraEmail = document.getElementById('jiraEmail');
        this.jiraApiToken = document.getElementById('jiraApiToken');
        this.jiraProject = document.getElementById('jiraProject');
        this.jiraIssueType = document.getElementById('jiraIssueType');
        this.testJIRABtn = document.getElementById('testJIRABtn');
        this.debugJIRABtn = document.getElementById('debugJIRABtn');
        this.testIssueBtn = document.getElementById('testIssueBtn');

        // Google Sheets elements
        this.webhookUrl = document.getElementById('webhookUrl');
        this.screenshotWebhook = document.getElementById('screenshotWebhook');
        this.testBtn = document.getElementById('testBtn');

        // Common elements
        this.saveBtn = document.getElementById('saveBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.statusMessage = document.getElementById('statusMessage');
        this.dataCount = document.getElementById('dataCount');
    }

    attachEventListeners() {
        // Integration choice listeners
        this.useJIRA.addEventListener('change', () => this.toggleIntegrationSections());
        this.useSheets.addEventListener('change', () => this.toggleIntegrationSections());

        // Button listeners
        this.saveBtn.addEventListener('click', () => this.saveSettings());
        this.testBtn.addEventListener('click', () => this.testConnection());
        this.testJIRABtn.addEventListener('click', () => this.testJIRAConnection());
        this.debugJIRABtn.addEventListener('click', () => this.debugJIRAProject());
        this.testIssueBtn.addEventListener('click', () => this.testIssueTypes());
        this.exportBtn.addEventListener('click', () => this.exportLocalData());
        this.clearBtn.addEventListener('click', () => this.clearLocalData());

        // Auto-save on input changes
        this.webhookUrl.addEventListener('blur', () => this.saveSettings());
        this.screenshotWebhook.addEventListener('blur', () => this.saveSettings());
        
        // JIRA auto-save listeners
        this.jiraUrl.addEventListener('blur', () => this.saveSettings());
        this.jiraEmail.addEventListener('blur', () => this.saveSettings());
        this.jiraApiToken.addEventListener('blur', () => this.saveSettings());
        this.jiraProject.addEventListener('blur', () => this.saveSettings());
        this.jiraIssueType.addEventListener('change', () => this.saveSettings());
    }

    toggleIntegrationSections() {
        if (this.useJIRA.checked) {
            this.jiraSection.classList.remove('hidden');
            this.sheetsSection.classList.add('hidden');
        } else if (this.useSheets.checked) {
            this.jiraSection.classList.add('hidden');
            this.sheetsSection.classList.remove('hidden');
        }
    }

    async loadSettings() {
        try {
            const result = await this.getStoredSettings();
            const integrationConfig = result.integrationConfig || {};
            const googleSheetsConfig = result.googleSheetsConfig || {};

            // Load integration choice
            if (integrationConfig.useJIRA) {
                this.useJIRA.checked = true;
                this.toggleIntegrationSections();
            } else {
                this.useSheets.checked = true;
                this.toggleIntegrationSections();
            }

            // Load JIRA settings
            if (integrationConfig.jiraConfig) {
                this.jiraUrl.value = integrationConfig.jiraConfig.jiraUrl || '';
                this.jiraEmail.value = integrationConfig.jiraConfig.email || '';
                this.jiraApiToken.value = integrationConfig.jiraConfig.apiToken || '';
                this.jiraProject.value = integrationConfig.jiraConfig.projectKey || '';
                this.jiraIssueType.value = integrationConfig.jiraConfig.issueType || 'Bug';
            }

            // Load Google Sheets settings
            this.webhookUrl.value = googleSheetsConfig.webhookUrl || '';
            this.screenshotWebhook.value = googleSheetsConfig.screenshotWebhook || '';

            console.log('Settings loaded:', { integrationConfig, googleSheetsConfig });
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showStatus('Error loading settings', 'error');
        }
    }

    async saveSettings() {
        try {
            // Save integration choice and config
            const integrationConfig = {
                useJIRA: this.useJIRA.checked,
                jiraConfig: this.useJIRA.checked ? {
                    jiraUrl: this.jiraUrl.value.trim(),
                    email: this.jiraEmail.value.trim(),
                    apiToken: this.jiraApiToken.value.trim(),
                    projectKey: this.jiraProject.value.trim().toUpperCase(),
                    issueType: this.jiraIssueType.value
                } : null,
                googleSheetsConfig: this.useSheets.checked ? {
                    webhookUrl: this.webhookUrl.value.trim(),
                    screenshotWebhook: this.screenshotWebhook.value.trim()
                } : null,
                lastUpdated: new Date().toISOString()
            };

            // Also save Google Sheets config separately for backward compatibility
            const googleSheetsConfig = {
                webhookUrl: this.webhookUrl.value.trim(),
                screenshotWebhook: this.screenshotWebhook.value.trim(),
                lastUpdated: new Date().toISOString()
            };

            // Store both configs
            await chrome.storage.sync.set({ 
                integrationConfig: integrationConfig,
                googleSheetsConfig: googleSheetsConfig
            });
            
            this.showStatus('Settings saved successfully!', 'success');
            console.log('Settings saved:', { integrationConfig, googleSheetsConfig });
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving settings', 'error');
        }
    }

    async testConnection() {
        const webhookUrl = this.webhookUrl.value.trim();
        
        if (!webhookUrl) {
            this.showStatus('Please enter a webhook URL first', 'error');
            return;
        }

        this.testBtn.textContent = 'Testing...';
        this.testBtn.disabled = true;

        try {
            // Test with dummy data using the new format
            const testData = [
                new Date().toISOString(),
                'https://example.com/connection-test',
                'Test issue from extension setup',
                'Testing the Google Sheets connection',
                'Connection working properly',
                'quick-win',
                '1',
                '1',
                '' // Screenshot URL will be filled by server
            ];

            console.log('Testing connection to:', webhookUrl);
            console.log('Test payload:', { formData: testData });

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData: testData })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Try to parse the response
            const result = await response.json();
            console.log('Response data:', result);

            if (result.status === 'success') {
                let successMessage = '✅ Connection test successful! ';
                if (result.spreadsheetUrl) {
                    successMessage += `Check your data at: ${result.spreadsheetUrl}`;
                } else {
                    successMessage += 'Check your Google Sheet for the test entry.';
                }
                this.showStatus(successMessage, 'success');
            } else {
                throw new Error(result.message || 'Unknown error from Google Apps Script');
            }

        } catch (error) {
            console.error('Connection test failed:', error);
            
            let errorMessage = 'Connection test failed: ';
            if (error.message.includes('HTTP 404')) {
                errorMessage += 'Webhook URL not found. Please check your Google Apps Script deployment.';
            } else if (error.message.includes('CORS')) {
                errorMessage += 'CORS error. Make sure your Google Apps Script is deployed with "Anyone" access.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Check your internet connection and webhook URL.';
            } else {
                errorMessage += error.message;
            }
            
            this.showStatus(errorMessage, 'error');
        } finally {
            this.testBtn.textContent = 'Test Connection';
            this.testBtn.disabled = false;
        }
    }

    async testJIRAConnection() {
        // Validate required fields
        const requiredFields = {
            'JIRA URL': this.jiraUrl.value.trim(),
            'Email': this.jiraEmail.value.trim(),
            'API Token': this.jiraApiToken.value.trim(),
            'Project Key': this.jiraProject.value.trim()
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                this.showStatus(`${field} is required for JIRA connection test`, 'error');
                return;
            }
        }

        this.testJIRABtn.textContent = 'Testing...';
        this.testJIRABtn.disabled = true;

        try {
            // Create JIRA integration instance
            const jiraConfig = {
                jiraUrl: this.jiraUrl.value.trim(),
                email: this.jiraEmail.value.trim(),
                apiToken: this.jiraApiToken.value.trim(),
                projectKey: this.jiraProject.value.trim().toUpperCase(),
                issueType: this.jiraIssueType.value
            };

            // Load JIRA integration script if not already loaded
            if (typeof window.JIRAIntegration === 'undefined') {
                await this.loadJIRAScript();
            }

            const jira = new window.JIRAIntegration(jiraConfig);
            
            // Test connection
            console.log('Testing JIRA connection...');
            const result = await jira.testConnection();
            
            console.log('✅ JIRA connection test result:', result);
            this.showStatus(
                `✅ JIRA connection successful! Connected to project "${result.projectName}" (${result.projectKey})`, 
                'success'
            );

        } catch (error) {
            console.error('❌ JIRA connection test failed:', error);
            
            let errorMessage = 'JIRA connection failed: ';
            if (error.message.includes('401')) {
                errorMessage += 'Invalid credentials. Check your email and API token.';
            } else if (error.message.includes('404')) {
                errorMessage += 'Project not found. Check your JIRA URL and project key.';
            } else if (error.message.includes('403')) {
                errorMessage += 'Access denied. Check your JIRA permissions.';
            } else {
                errorMessage += error.message;
            }
            
            this.showStatus(errorMessage, 'error');
        } finally {
            this.testJIRABtn.textContent = 'Test JIRA Connection';
            this.testJIRABtn.disabled = false;
        }
    }

    async debugJIRAProject() {
        // Validate required fields first
        const requiredFields = {
            'JIRA URL': this.jiraUrl.value.trim(),
            'Email': this.jiraEmail.value.trim(),
            'API Token': this.jiraApiToken.value.trim(),
            'Project Key': this.jiraProject.value.trim()
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                this.showStatus(`${field} is required for debugging`, 'error');
                return;
            }
        }

        // Disable button and show loading
        this.debugJIRABtn.textContent = '🔍 Debugging...';
        this.debugJIRABtn.disabled = true;

        try {
            console.log('🚀 === STARTING JIRA DEBUG SESSION ===');
            
            // Load JIRA script and create integration instance
            await this.loadJIRAScript();
            
            const jiraConfig = {
                jiraUrl: this.jiraUrl.value.trim(),
                email: this.jiraEmail.value.trim(),
                apiToken: this.jiraApiToken.value.trim(),
                projectKey: this.jiraProject.value.trim(),
                issueType: this.jiraIssueType.value || 'Bug'
            };

            const jiraIntegration = new window.JIRAIntegration(jiraConfig);
            
            // Run the debug
            console.log('📊 Running detailed project debug...');
            const debugResult = await jiraIntegration.debugProjectInfo();
            
            if (debugResult.success) {
                console.log('🎉 Debug completed successfully!');
                
                let statusMessage = `✅ Debug completed successfully!\n`;
                statusMessage += `📁 Project: ${debugResult.projectName}\n`;
                statusMessage += `📝 Available Issue Types: ${debugResult.availableIssueTypes.join(', ')}\n`;
                statusMessage += `🎯 Your configured type "${jiraConfig.issueType}" is ${debugResult.configuredTypeValid ? 'VALID' : 'INVALID'}\n`;
                statusMessage += '\n📋 Check browser console for detailed output.';
                
                if (!debugResult.configuredTypeValid) {
                    statusMessage += `\n\n💡 Suggestion: Change your Issue Type to one of: ${debugResult.availableIssueTypes.slice(0, 3).join(', ')}`;
                }
                
                this.showStatus(statusMessage, 'success');
            }

        } catch (error) {
            console.error('❌ JIRA Debug failed:', error);
            
            let errorMessage = '❌ Debug failed: ';
            if (error.message.includes('401')) {
                errorMessage += 'Invalid credentials. Check your email and API token.';
            } else if (error.message.includes('404')) {
                errorMessage += 'Project not found. Check your JIRA URL and project key.';
            } else if (error.message.includes('403')) {
                errorMessage += 'Access denied. Check your JIRA permissions.';
            } else {
                errorMessage += error.message;
            }
            
            this.showStatus(errorMessage, 'error');
        } finally {
            this.debugJIRABtn.textContent = '🔍 Debug Project Info';
            this.debugJIRABtn.disabled = false;
        }
    }

    async testIssueTypes() {
        // Validate required fields first
        const requiredFields = {
            'JIRA URL': this.jiraUrl.value.trim(),
            'Email': this.jiraEmail.value.trim(),
            'API Token': this.jiraApiToken.value.trim(),
            'Project Key': this.jiraProject.value.trim()
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                this.showStatus(`${field} is required for testing`, 'error');
                return;
            }
        }

        // Disable button and show loading
        this.testIssueBtn.textContent = '🧪 Testing...';
        this.testIssueBtn.disabled = true;

        try {
            console.log('🚀 === STARTING ISSUE TYPE TEST ===');
            
            // Load JIRA script and create integration instance
            await this.loadJIRAScript();
            
            const jiraConfig = {
                jiraUrl: this.jiraUrl.value.trim(),
                email: this.jiraEmail.value.trim(),
                apiToken: this.jiraApiToken.value.trim(),
                projectKey: this.jiraProject.value.trim(),
                issueType: this.jiraIssueType.value || 'Bug'
            };

            const jiraIntegration = new window.JIRAIntegration(jiraConfig);
            
            // Test issue type compatibility
            console.log('🧪 Testing issue type compatibility...');
            const workingIssueType = await jiraIntegration.testIssueCreation();
            
            let statusMessage = `✅ Issue type test completed!\n`;
            statusMessage += `🎯 Recommended issue type: ${workingIssueType}\n`;
            statusMessage += `💡 This bypasses the permission-restricted issue types endpoint\n`;
            statusMessage += '\n📋 Check browser console for detailed output.';
            
            // Auto-update the issue type field if different
            if (workingIssueType !== jiraConfig.issueType) {
                statusMessage += `\n\n🔧 Auto-updating your issue type from "${jiraConfig.issueType}" to "${workingIssueType}"`;
                this.jiraIssueType.value = workingIssueType;
                await this.saveSettings(); // Auto-save the change
            }
            
            this.showStatus(statusMessage, 'success');

        } catch (error) {
            console.error('❌ Issue type test failed:', error);
            
            let errorMessage = '❌ Issue type test failed: ';
            if (error.message.includes('401')) {
                errorMessage += 'Invalid credentials. Check your email and API token.';
            } else if (error.message.includes('404')) {
                errorMessage += 'Project not found. Check your JIRA URL and project key.';
            } else if (error.message.includes('403')) {
                errorMessage += 'Access denied. You may need "Create Issues" permission.';
            } else {
                errorMessage += error.message;
            }
            
            this.showStatus(errorMessage, 'error');
        } finally {
            this.testIssueBtn.textContent = '🧪 Test Issue Types';
            this.testIssueBtn.disabled = false;
        }
    }

    async loadJIRAScript() {
        return new Promise((resolve, reject) => {
            if (typeof window.JIRAIntegration !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'jira-integration.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async exportLocalData() {
        try {
            const data = await this.getLocalData();
            
            if (data.length === 0) {
                this.showStatus('No local data to export', 'info');
                return;
            }

            // Convert to CSV format
            const headers = [
                'Timestamp',
                'URL', 
                'Summary',
                'Task',
                'Solution',
                'Issue Type',
                'Customer Impact',
                'Effort to Fix',
                'Has Screenshot'
            ];

            const csvContent = [
                headers.join(','),
                ...data.map(item => [
                    item.timestamp,
                    `"${item.url}"`,
                    `"${item.summary?.replace(/"/g, '""') || ''}"`,
                    `"${item.task?.replace(/"/g, '""') || ''}"`,
                    `"${item.solution?.replace(/"/g, '""') || ''}"`,
                    item.issueType || '',
                    item.customerImpact || '',
                    item.effortToFix || '',
                    item.hasScreenshot ? 'Yes' : 'No'
                ].join(','))
            ].join('\n');

            // Download the CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `ux-issues-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showStatus(`Exported ${data.length} issues to CSV file`, 'success');

        } catch (error) {
            console.error('Export failed:', error);
            this.showStatus('Export failed', 'error');
        }
    }

    async clearLocalData() {
        if (!confirm('Are you sure you want to delete all local data? This cannot be undone.')) {
            return;
        }

        try {
            await this.clearStoredData();
            this.updateDataCount();
            this.showStatus('Local data cleared successfully', 'success');
        } catch (error) {
            console.error('Clear data failed:', error);
            this.showStatus('Failed to clear local data', 'error');
        }
    }

    async updateDataCount() {
        try {
            const data = await this.getLocalData();
            const count = data.length;
            
            if (count === 0) {
                this.dataCount.textContent = 'No local data stored';
            } else {
                this.dataCount.textContent = `${count} issue${count === 1 ? '' : 's'} stored locally`;
            }
        } catch (error) {
            console.error('Error updating data count:', error);
            this.dataCount.textContent = 'Error loading data count';
        }
    }

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.classList.remove('hidden');

        // Auto-hide success and info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                this.statusMessage.classList.add('hidden');
            }, 4000);
        }
    }

    // Storage helper methods
    getStoredSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['googleSheetsConfig'], resolve);
        });
    }

    storeSettings(config) {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ googleSheetsConfig: config }, resolve);
        });
    }

    getLocalData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['uxIssues'], (result) => {
                resolve(result.uxIssues || []);
            });
        });
    }

    clearStoredData() {
        return new Promise((resolve) => {
            chrome.storage.local.remove(['uxIssues'], resolve);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OptionsManager();
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 's':
                event.preventDefault();
                document.getElementById('saveBtn')?.click();
                break;
            case 't':
                event.preventDefault();
                document.getElementById('testBtn')?.click();
                break;
        }
    }
});
