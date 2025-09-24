class TreasureFinder {
    constructor() {
        this.currentStep = 1;
        this.screenshotData = null;
        this.currentUrl = '';
        this.issueData = {};
        this.isWaitingForSelection = false;
        this.selectedArea = null;

        this.initializeElements();
        this.attachEventListeners();
        this.loadCurrentUrl();
        
        // Check for pending selection data from background script
        this.checkForPendingSelection();
        
        // Mark as initialized
        document.body.classList.add('ux-tracker-initialized');
    }

    initializeElements() {
        
        // Steps
        this.steps = {
            1: document.getElementById('step1'),
            2: document.getElementById('step2'),
            '2b': document.getElementById('step2b'),
            3: document.getElementById('step3'),
            4: document.getElementById('step4'),
            5: document.getElementById('step5')
        };

        // Buttons
        this.reportBtn = document.getElementById('reportBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.recordAnotherBtn = document.getElementById('recordAnotherBtn');
        this.viewTicketBtn = document.getElementById('viewTicketBtn');
        this.closeBtn = document.getElementById('closeBtn');
        
        // Page selection buttons
        this.cancelSelectionBtn = document.getElementById('cancelSelectionBtn');

        // Form elements
        this.form = document.getElementById('issueForm');
        this.summary = document.getElementById('summary');
        this.task = document.getElementById('task');
        this.solution = document.getElementById('solution');
        this.issueType = document.getElementById('issueType');
        this.priority = document.getElementById('priority');

        // Other elements
        this.urlDisplay = document.getElementById('urlDisplay');
        this.screenshotImg = document.getElementById('screenshotImg');
        this.confirmScreenshotImg = document.getElementById('confirmScreenshotImg');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Animation elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.circularProgress = document.getElementById('circularProgress');
        this.progressCircle = document.getElementById('progressCircle');
        this.progressText = document.getElementById('progressText');
        this.celebrationStep = document.getElementById('celebrationStep');
        
        // Page selection state
        this.isWaitingForSelection = false;
        this.selectedArea = null;
        
        // Check for critical missing elements
        const criticalElements = ['step1', 'reportBtn'];
        for (const elementId of criticalElements) {
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Critical element not found: ${elementId}`);
            }
        }
        
    }

    attachEventListeners() {
        
        if (this.reportBtn) {
            this.reportBtn.addEventListener('click', () => {
                this.startScreenshot();
            });
        }
        
        if (this.skipBtn) {
            this.skipBtn.addEventListener('click', () => this.skipScreenshot());
        }
        if (this.retakeBtn) {
            this.retakeBtn.addEventListener('click', () => this.retakeScreenshot());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.goToForm());
        }
        if (this.recordAnotherBtn) {
            this.recordAnotherBtn.addEventListener('click', () => this.reset());
        }
        if (this.viewTicketBtn) {
            this.viewTicketBtn.addEventListener('click', () => this.openJiraTicket());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => window.close());
        }
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.submitForm(e));
        }
        
        // Page selection event listeners
        if (this.cancelSelectionBtn) {
            this.cancelSelectionBtn.addEventListener('click', () => this.cancelPageSelection());
        }

        
        // Test message reception capability
        this.testMessageReception();
    }

    testMessageReception() {
        
        // Test that the message listener is working
        setTimeout(() => {
        }, 500);
    }

    async checkForPendingSelection() {
        
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getPendingSelection'
            });
            
            
            if (response && response.hasPendingSelection && response.data) {
                
                // Process the pending selection as if it just happened
                await this.handleAreaSelected(
                    response.data.selection, 
                    response.data.viewport, 
                    response.data.deviceInfo
                );
                
            } else {
                this.showStep(1);
            }
            
        } catch (error) {
            console.error('❌ POPUP: Error checking for pending selection:', error);
            this.showStep(1);
        }
    }

    async loadCurrentUrl() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentUrl = tab.url;
            if (this.urlDisplay) {
                this.urlDisplay.textContent = this.currentUrl;
            }
        } catch (error) {
            console.error('Error getting current URL:', error);
            this.currentUrl = 'Unable to capture URL';
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        Object.values(this.steps).forEach(step => {
            step.classList.add('hidden');
        });

        // Show current step
        if (this.steps[stepNumber]) {
            this.steps[stepNumber].classList.remove('hidden');
            this.currentStep = stepNumber;
        }

        // Special handling for success step (step 5)
        if (stepNumber === 5) {
            this.updateSuccessScreen();
        }

        // Hide error messages when changing steps
        this.hideError();
    }

    updateSuccessScreen() {
        // Show/hide JIRA ticket button based on whether we have a JIRA result
        if (this.viewTicketBtn) {
            if (this.jiraResult && this.jiraResult.issueUrl) {
                this.viewTicketBtn.classList.remove('hidden');
            } else {
                this.viewTicketBtn.classList.add('hidden');
            }
        }
    }

    async startScreenshot() {
        
        try {
            // Start page-based area selection
            await this.startPageSelection();
            
        } catch (error) {
            console.error('❌ Page selection error:', error);
            this.showError('Failed to start area selection. Please try again.');
            
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }
    }

    async startPageSelection() {
        
        try {
            // Show selection status step
            this.showStep('2b');
            this.isWaitingForSelection = true;
            
            // Get active tab and send message to content script
            console.log('🔍 Getting active tab...');
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }
            
            console.log('✅ Active tab found:', {
                id: tab.id,
                url: tab.url,
                title: tab.title
            });

            // Check if page is compatible
            if (!this.isPageCompatible(tab.url)) {
                throw new Error(`Cannot run on ${tab.url}. Please try on a regular webpage.`);
            }
            
            // Try to ensure content script is loaded
            await this.ensureContentScriptLoaded(tab.id);
            
            console.log('📤 Sending message to content script...');
            const response = await chrome.tabs.sendMessage(tab.id, { 
                action: 'startAreaSelection',
                timestamp: Date.now()
            });
            
            console.log('✅ Content script responded:', response);
            console.log('🎯 Area selection started on page successfully');
            console.log('🔽 Closing popup to focus on page selection');
            
            // Close popup to let user focus on page area selection
            window.close();
            
        } catch (error) {
            console.error('❌ Failed to start page selection:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // More specific error messages
            if (error.message.includes('Could not establish connection')) {
                this.showError('Content script failed to load. Please refresh the page and try again.');
            } else if (error.message.includes('Cannot run on')) {
                this.showError(error.message);
            } else if (error.message.includes('No active tab')) {
                this.showError('No active tab found. Please make sure you have a webpage open.');
            } else {
                this.showError('Failed to start area selection. Please refresh the page and try again.');
            }
            
            this.showStep(1);
        }
    }

    isPageCompatible(url) {
        // Check if the URL is compatible with content scripts
        if (!url) return false;
        
        // Chrome internal pages
        if (url.startsWith('chrome://') || 
            url.startsWith('chrome-extension://') ||
            url.startsWith('edge://') ||
            url.startsWith('about:') ||
            url.startsWith('moz-extension://')) {
            return false;
        }

        // Chrome Web Store
        if (url.includes('chrome.google.com/webstore')) {
            return false;
        }

        // Local files (unless extension has file access)
        if (url.startsWith('file://')) {
            return false;
        }

        return true;
    }

    async ensureContentScriptLoaded(tabId) {
        console.log('🔄 Ensuring content script is loaded...');
        
        try {
            // First, try a simple ping to see if content script responds
            const pingResponse = await chrome.tabs.sendMessage(tabId, { 
                action: 'getPageInfo' 
            });
            console.log('✅ Content script already loaded:', pingResponse);
            return true;
        } catch (error) {
            console.log('📝 Content script not responding, attempting to inject...');
            
            try {
                // Inject the content script manually
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
                
                console.log('✅ Content script injected successfully');
                
                // Wait a bit for initialization
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Verify it's working
                const testResponse = await chrome.tabs.sendMessage(tabId, { 
                    action: 'getPageInfo' 
                });
                console.log('✅ Content script responding after injection:', testResponse);
                return true;
                
            } catch (injectionError) {
                console.error('❌ Failed to inject content script:', injectionError);
                throw new Error('Could not load content script. Please refresh the page and try again.');
            }
        }
    }

    async captureSelectedArea(selection, deviceInfo = {}) {
        console.log('Capturing selected area:', selection);
        console.log('Device info for coordinate conversion:', deviceInfo);
        
        return new Promise((resolve, reject) => {
            // Capture the visible tab
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 90 }, (dataUrl) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                // Create canvas to crop the selected area
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Account for device pixel ratio and scroll position
                    const pixelRatio = deviceInfo.pixelRatio || 1;
                    
                    // Convert CSS coordinates to actual screenshot pixel coordinates
                    const actualLeft = selection.left * pixelRatio;
                    const actualTop = selection.top * pixelRatio;
                    const actualWidth = selection.width * pixelRatio;
                    const actualHeight = selection.height * pixelRatio;
                    
                    console.log('📊 Coordinate conversion:');
                    console.log('   CSS coordinates:', selection);
                    console.log('   Pixel ratio:', pixelRatio);
                    console.log('   Actual coordinates:', {left: actualLeft, top: actualTop, width: actualWidth, height: actualHeight});
                    console.log('   Screenshot dimensions:', {width: img.width, height: img.height});
                    
                    // Set canvas size to actual pixel selection size
                    canvas.width = actualWidth;
                    canvas.height = actualHeight;
                    
                    // Draw the selected area from the full screenshot using actual pixel coordinates
                    ctx.drawImage(
                        img,
                        actualLeft, actualTop, actualWidth, actualHeight,
                        0, 0, actualWidth, actualHeight
                    );
                    
                    // Get cropped screenshot data
                    this.screenshotData = canvas.toDataURL('image/png', 0.9);
                    
                    // Update preview images
                    if (this.screenshotImg) {
                        this.screenshotImg.src = this.screenshotData;
                    }
                    if (this.confirmScreenshotImg) {
                        this.confirmScreenshotImg.src = this.screenshotData;
                    }
                    
                    console.log('✅ Selected area captured and cropped with pixel ratio correction');
                    resolve(this.screenshotData);
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to process screenshot'));
                };
                
                img.src = dataUrl;
            });
        });
    }


    async handleAreaSelected(selection, viewport, deviceInfo) {
        console.log('🎯 Area selected on page:', selection);
        console.log('🖥️ Device info:', deviceInfo);
        
        this.isWaitingForSelection = false;
        this.selectedArea = selection;
        
        try {
            console.log('📷 Capturing selected area immediately...');
            
            // Show immediate feedback - preview is coming
            this.showPreviewLoading();
            
            // Capture the selected area with device info for accurate cropping
            await this.captureSelectedArea(selection, deviceInfo);
            
            console.log('✅ Screenshot captured and cropped successfully');
            
            // Restore the step3 content and show preview immediately
            console.log('📋 Showing screenshot preview NOW (Step 3)');
            this.restoreStep3Content();
            this.showStep(3);
            
            // Update URL display for context  
            if (this.urlDisplay) {
                this.urlDisplay.textContent = this.currentUrl;
            }
            
            // Focus the extension popup to make sure it's visible
            window.focus();
            
        } catch (error) {
            console.error('❌ Failed to capture selected area:', error);
            this.showError('Failed to capture the selected area. Please try again.');
            this.showStep(1);
        }
    }

    showPreviewLoading() {
        // Briefly show that preview is loading
        if (this.steps && this.steps[2]) { // step3 (index 2)
            const step3 = this.steps[2];
            step3.innerHTML = `
                <div class="preview-loading">
                    <div class="loading-spinner"></div>
                    <h3>📸 Processing Screenshot...</h3>
                    <p>Preparing your preview</p>
                </div>
            `;
            this.showStep(3);
        }
    }

    restoreStep3Content() {
        // Restore the original step3 content
        if (this.steps && this.steps[2]) { // step3 (index 2)
            const step3 = this.steps[2];
            step3.innerHTML = `
                <div class="screenshot-confirm">
                    <div class="confirmation-header">
                        <h3>Preview Selected Area</h3>
                        <p>This is the screenshot that will be submitted</p>
                    </div>
                    
                    <div class="url-display" id="urlDisplay"></div>
                    
                    <div class="screenshot-preview">
                        <img id="confirmScreenshotImg" alt="Selected area screenshot">
                    </div>
                    
                    <div class="button-group">
                        <button class="secondary-btn" id="retakeBtn">🔄 Retake</button>
                        <button class="primary-btn" id="nextBtn">✅ Looks Good - Next</button>
                    </div>
                    
                    <div class="preview-instructions">
                        <small>💡 Review the screenshot above. Click "Retake" to select a different area, or "Next" to continue with the form.</small>
                    </div>
                </div>
            `;
            
            // Re-initialize the elements and event listeners for step3
            this.initializeStep3Elements();
        }
    }

    initializeStep3Elements() {
        // Re-get the elements after restoring content
        this.urlDisplay = document.getElementById('urlDisplay');
        this.confirmScreenshotImg = document.getElementById('confirmScreenshotImg');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Re-add event listeners
        if (this.retakeBtn) {
            this.retakeBtn.addEventListener('click', () => this.retakeScreenshot());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.goToForm());
        }
        
        // Update the screenshot if we have it
        if (this.confirmScreenshotImg && this.screenshotData) {
            this.confirmScreenshotImg.src = this.screenshotData;
        }
    }

    handleAreaSelectionCancelled() {
        console.log('Area selection cancelled');
        
        this.isWaitingForSelection = false;
        this.selectedArea = null;
        
        // Go back to step 1
        this.showStep(1);
    }

    async cancelPageSelection() {
        console.log('Cancelling page selection');
        
        // Send cancel message to content script
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.sendMessage(tab.id, { action: 'cancelAreaSelection' });
        } catch (error) {
            console.error('Failed to cancel page selection:', error);
        }
        
        this.handleAreaSelectionCancelled();
    }

    skipScreenshot() {
        this.screenshotData = null;
        this.showStep(4);
    }

    async retakeScreenshot() {
        console.log('🔄 Retake button clicked - restarting area selection');
        
        try {
            // Restart the page selection process
            await this.startPageSelection();
        } catch (error) {
            console.error('❌ Retake screenshot error:', error);
            this.showError('Failed to restart area selection. Please try again.');
            this.showStep(3);
        }
    }

    goToForm() {
        console.log('➡️ Next button clicked - proceeding to form (Step 4)');
        console.log('📊 Screenshot data ready:', !!this.screenshotData);
        this.showStep(4);
    }


    async submitForm(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.showLoading(true);

        try {
            // Collect form data
            this.collectFormData();
            
            // Submit to configured service (JIRA or local storage)
            await this.submitIssue();
            
            // Success animation will handle showing step 5
            console.log('✅ Treasure submitted successfully! Animation in progress...');
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Failed to submit the issue. Please try again.');
            this.showLoading(false); // Stop animation on error
        }
    }

    validateForm() {
        if (!this.summary.value.trim()) {
            this.showError('Summary is required');
            this.summary.focus();
            return false;
        }

        return true;
    }

    collectFormData() {
        this.issueData = {
            timestamp: new Date().toISOString(),
            url: this.currentUrl,
            summary: this.summary.value.trim(),
            task: this.task.value.trim(),
            solution: this.solution.value.trim(),
            issueType: this.issueType.value,
            priority: this.priority.value,
            hasScreenshot: !!this.screenshotData,
            screenshotData: this.screenshotData
        };
    }


    async storeLocally() {
        // Store the issue data locally if external service is not configured
        const existingData = await this.getLocalData();
        existingData.push(this.issueData);
        
        return new Promise((resolve) => {
            chrome.storage.local.set({ 'uxIssues': existingData }, resolve);
        });
    }

    async submitIssue() {
        // Check configuration to decide between JIRA or local storage
        const config = await this.getIntegrationConfig();
        
        if (config.useJIRA && config.jiraConfig) {
            console.log('🎯 Submitting to JIRA...');
            await this.submitToJIRA(config.jiraConfig);
        } else {
            console.log('💾 No JIRA configured, storing locally...');
            await this.storeLocally();
        }
    }

    async submitToJIRA(jiraConfig) {
        console.log('🎯 Creating JIRA issue...', this.issueData);

        try {
            // Initialize JIRA integration
            const jira = new window.JIRAIntegration(jiraConfig);
            
            // Test connection first
            console.log('🧪 Testing JIRA connection...');
            await jira.testConnection();
            
            // Create the issue
            console.log('📝 Creating JIRA issue...');
            const result = await jira.createIssue(this.issueData);
            
            console.log('✅ JIRA issue created successfully:', result);
            
            // Store success info for display
            this.jiraResult = result;
            
        } catch (error) {
            console.error('❌ JIRA submission failed:', error);
            
            // Fallback to local storage with error info
            this.issueData.jiraError = error.message;
            await this.storeLocally();
            
            throw new Error(`JIRA submission failed: ${error.message}. Issue saved locally instead.`);
        }
    }

    async getIntegrationConfig() {
        try {
            const result = await chrome.storage.sync.get(['integrationConfig']);
            return result.integrationConfig || {};
        } catch (error) {
            console.error('Error getting integration config:', error);
            return {};
        }
    }

    async getLocalData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['uxIssues'], (result) => {
                resolve(result.uxIssues || []);
            });
        });
    }

    reset() {
        // Reset all data
        this.screenshotData = null;
        this.issueData = {};
        this.jiraResult = null;
        
        // Reset page selection state
        this.isWaitingForSelection = false;
        this.selectedArea = null;
        
        // Cancel any ongoing page selection
        if (this.isWaitingForSelection) {
            this.cancelPageSelection();
        }
        
        // Reset form
        this.form.reset();
        
        // Clear images
        if (this.screenshotImg) this.screenshotImg.src = '';
        if (this.confirmScreenshotImg) this.confirmScreenshotImg.src = '';
        
        // Go back to step 1
        this.showStep(1);
        
        // Reload current URL
        this.loadCurrentUrl();
    }

    openJiraTicket() {
        if (this.jiraResult && this.jiraResult.issueUrl) {
            // Open JIRA ticket in new tab
            chrome.tabs.create({ url: this.jiraResult.issueUrl });
        } else {
            console.error('No JIRA ticket URL available');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    // === TREASURE SUBMISSION ANIMATION ===
    
    showLoading(show) {
        if (show) {
            this.startTreasureSubmissionAnimation();
        } else {
            this.hideTreasureSubmissionAnimation();
        }
    }

    startTreasureSubmissionAnimation() {
        // Show loading overlay with circular progress
        this.loadingOverlay.classList.remove('hidden');
        this.circularProgress.classList.remove('hidden');
        this.celebrationStep.classList.add('hidden');
        
        // Reset progress circle to empty
        this.progressCircle.style.strokeDashoffset = '339.292'; // Full circumference
        this.progressText.textContent = ''; // No text - let animation speak for itself
        
        // Start progress animation
        this.animateProgress();
    }

    animateProgress() {
        let progress = 0;
        const duration = 1250; // 1.25 seconds total animation (half the original speed)
        const interval = 25; // Update every 25ms for smooth animation
        const steps = duration / interval;
        const progressStep = 100 / steps;
        
        const progressInterval = setInterval(() => {
            progress += progressStep;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Complete the circle
                this.updateProgressCircle(100);
                
                // Show celebration after brief delay
                setTimeout(() => {
                    this.showCelebration();
                }, 200);
            } else {
                this.updateProgressCircle(progress);
            }
        }, interval);
        
        // Store interval for cleanup if needed
        this.progressInterval = progressInterval;
    }

    updateProgressCircle(progress) {
        // Calculate stroke-dashoffset based on progress (0-100)
        const circumference = 339.292; // 2 * π * 54
        const offset = circumference - (circumference * progress / 100);
        this.progressCircle.style.strokeDashoffset = offset;
        
        // No text updates - let the visual animation speak for itself
    }

    showCelebration() {
        // Hide circular progress
        this.circularProgress.classList.add('hidden');
        
        // Show celebration emoji with animation
        this.celebrationStep.classList.remove('hidden');
        
        // After celebration animation, show final success screen
        setTimeout(() => {
            this.hideTreasureSubmissionAnimation();
            this.showStep(5);
        }, 1500); // 1.5s for celebration display
    }

    hideTreasureSubmissionAnimation() {
        // Hide entire overlay
        this.loadingOverlay.classList.add('hidden');
        this.circularProgress.classList.add('hidden');
        this.celebrationStep.classList.add('hidden');
        
        // Clean up any running intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
}

// Initialize the app when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Treasure Finder...');
        const tracker = new TreasureFinder();
        console.log('Treasure Finder initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Treasure Finder:', error);
        
        // Show error in the UI if possible
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; 
            top: 10px; 
            left: 10px; 
            right: 10px; 
            background: #fef2f2; 
            color: #dc2626; 
            padding: 12px; 
            border-radius: 6px; 
            font-size: 14px;
            z-index: 9999;
            border: 1px solid #fecaca;
        `;
        errorDiv.textContent = `Extension failed to load: ${error.message}`;
        document.body.appendChild(errorDiv);
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.close();
    }
});

// Add fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOMContentLoaded hasn't fired yet
} else {
    // DOMContentLoaded has already fired
    setTimeout(() => {
        if (!document.querySelector('.ux-tracker-initialized')) {
            console.log('Fallback initialization triggered');
            try {
                new UXIssueTracker();
            } catch (error) {
                console.error('Fallback initialization failed:', error);
            }
        }
    }, 100);
}
