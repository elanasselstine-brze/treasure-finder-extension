// Content script for Treasure Finder
// This script runs on all web pages and handles direct page area selection

class UXTrackerContent {
    constructor() {
        this.selectionOverlay = null;
        this.selectionBox = null;
        this.isSelecting = false;
        this.selectionStart = { x: 0, y: 0 };
        this.selectionEnd = { x: 0, y: 0 };
        
        // Bind the keyboard handler once to maintain function reference for proper removal
        this.boundKeyDownHandler = this.handleKeyDown.bind(this);
        
        this.init();
    }

    init() {
        console.log('🚀 UX Tracker Content Script initialized on:', window.location.href);
        
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 Content script received message:', request);
            
            if (request.action === 'getPageInfo') {
                const response = {
                    url: window.location.href,
                    title: document.title,
                    timestamp: new Date().toISOString()
                };
                console.log('📤 Sending page info:', response);
                sendResponse(response);
            } else if (request.action === 'startAreaSelection') {
                console.log('🎯 Starting area selection...');
                try {
                    this.startAreaSelection();
                    const response = { success: true, timestamp: Date.now() };
                    console.log('✅ Area selection started successfully:', response);
                    sendResponse(response);
                } catch (error) {
                    console.error('❌ Failed to start area selection:', error);
                    sendResponse({ success: false, error: error.message });
                }
            } else if (request.action === 'cancelAreaSelection') {
                console.log('❌ Cancelling area selection...');
                this.cancelAreaSelection();
                sendResponse({ success: true });
            } else {
                console.log('❓ Unknown action:', request.action);
                sendResponse({ success: false, error: 'Unknown action' });
            }
            
            // Return true to indicate we will send a response asynchronously
            return true;
        });

        // Add page tracking indicator
        this.addPageIndicator();
        console.log('✅ Content script setup complete');
    }

    startAreaSelection() {
        console.log('Starting area selection on page');
        
        // Create full-page selection overlay
        this.createSelectionOverlay();
        
        // Add event listeners for selection
        this.attachSelectionListeners();
        
        // Show instructions
        this.showInstructions();
    }

    createSelectionOverlay() {
        // Remove existing overlay if present
        this.removeSelectionOverlay();

        // Create overlay container
        this.selectionOverlay = document.createElement('div');
        this.selectionOverlay.id = 'ux-tracker-selection-overlay';
        this.selectionOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.3) !important;
            z-index: 999999 !important;
            cursor: crosshair !important;
            user-select: none !important;
        `;

        // Create selection box
        this.selectionBox = document.createElement('div');
        this.selectionBox.id = 'ux-tracker-selection-box';
        this.selectionBox.style.cssText = `
            position: absolute !important;
            border: 2px solid #6366f1 !important;
            background: rgba(99, 102, 241, 0.1) !important;
            pointer-events: none !important;
            display: none !important;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5) !important;
        `;

        // Create instructions panel
        const instructions = document.createElement('div');
        instructions.id = 'ux-tracker-instructions';
        instructions.style.cssText = `
            position: absolute !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: white !important;
            padding: 16px 24px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 14px !important;
            color: #333 !important;
            z-index: 1000000 !important;
            text-align: center !important;
        `;
        instructions.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">Click and drag to highlight the issue</div>
            <div style="font-size: 12px; color: #666;">Press ESC to cancel</div>
        `;

        // Append elements to overlay
        this.selectionOverlay.appendChild(this.selectionBox);
        this.selectionOverlay.appendChild(instructions);
        
        // Add to page
        document.body.appendChild(this.selectionOverlay);

        console.log('Selection overlay created');
    }

    attachSelectionListeners() {
        if (!this.selectionOverlay) return;

        // Mouse events for area selection
        this.selectionOverlay.addEventListener('mousedown', (e) => this.startSelection(e));
        this.selectionOverlay.addEventListener('mousemove', (e) => this.updateSelection(e));
        this.selectionOverlay.addEventListener('mouseup', (e) => this.endSelection(e));

        // Keyboard events - use bound handler for proper removal
        document.addEventListener('keydown', this.boundKeyDownHandler);
    }

    startSelection(event) {
        if (event.target !== this.selectionOverlay) return;
        
        event.preventDefault();
        this.isSelecting = true;
        
        this.selectionStart.x = event.clientX;
        this.selectionStart.y = event.clientY;
        this.selectionEnd.x = this.selectionStart.x;
        this.selectionEnd.y = this.selectionStart.y;
        
        this.selectionBox.style.display = 'block';
        this.updateSelectionBox();
        
        console.log('Selection started at:', this.selectionStart);
    }

    updateSelection(event) {
        if (!this.isSelecting) return;
        
        event.preventDefault();
        this.selectionEnd.x = event.clientX;
        this.selectionEnd.y = event.clientY;
        
        this.updateSelectionBox();
    }

    endSelection(event) {
        if (!this.isSelecting) return;
        
        event.preventDefault();
        this.isSelecting = false;
        
        // Calculate selection dimensions
        const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
        const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);
        
        console.log('Selection ended:', { width, height });
        
        // Check minimum size (30x30 pixels for page selection)
        if (width >= 30 && height >= 30) {
            this.completeSelection();
        } else {
            this.showError('Selection too small - please select a larger area');
            this.selectionBox.style.display = 'none';
        }
    }

    updateSelectionBox() {
        if (!this.selectionBox) return;
        
        const left = Math.min(this.selectionStart.x, this.selectionEnd.x);
        const top = Math.min(this.selectionStart.y, this.selectionEnd.y);
        const width = Math.abs(this.selectionEnd.x - this.selectionStart.x);
        const height = Math.abs(this.selectionEnd.y - this.selectionStart.y);
        
        this.selectionBox.style.left = left + 'px';
        this.selectionBox.style.top = top + 'px';
        this.selectionBox.style.width = width + 'px';
        this.selectionBox.style.height = height + 'px';
    }

    completeSelection() {
        // Calculate final selection area
        const selection = {
            left: Math.min(this.selectionStart.x, this.selectionEnd.x),
            top: Math.min(this.selectionStart.y, this.selectionEnd.y),
            width: Math.abs(this.selectionEnd.x - this.selectionStart.x),
            height: Math.abs(this.selectionEnd.y - this.selectionStart.y)
        };

        console.log('✅ Area selection completed:', selection);

        // Show immediate feedback 
        this.showSelectionComplete();

        // Get device pixel ratio and scroll position for accurate coordinate conversion
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        
        console.log('📏 CONTENT: Device pixel ratio:', devicePixelRatio);
        console.log('📜 CONTENT: Scroll position:', {x: scrollX, y: scrollY});

        // IMPORTANT: Remove overlay FIRST to get clean screenshot without dark overlay
        console.log('🎭 CONTENT: Removing overlay for clean screenshot...');
        this.removeSelectionOverlay();

        // Wait briefly for overlay to fully disappear, then send data for screenshot
        setTimeout(() => {
            console.log('📤 CONTENT: Sending areaSelected message to background (overlay removed):', selection);
            
            chrome.runtime.sendMessage({
                action: 'areaSelected',
                selection: selection,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                deviceInfo: {
                    pixelRatio: devicePixelRatio,
                    scrollX: scrollX,
                    scrollY: scrollY
                }
            }, (response) => {
                console.log('📬 CONTENT: Background response:', response);
                if (response && response.stored) {
                    console.log('✅ CONTENT: Selection data stored, popup should reopen automatically');
                }
            });
        }, 150); // Brief delay to ensure overlay is completely gone for clean screenshot
    }

    showSelectionComplete() {
        if (this.instructionsPanel) {
            this.instructionsPanel.innerHTML = `
                <div style="text-align: center; color: #4CAF50; font-weight: bold;">
                    ✅ Screenshot captured!
                    <div style="font-size: 14px; margin-top: 5px; color: #666;">
                        Opening preview...
                    </div>
                </div>
            `;
        }
    }

    handleKeyDown(event) {
        console.log('🔤 CONTENT: Key pressed:', event.key, 'Selection overlay active:', !!this.selectionOverlay);
        
        if ((event.key === 'Escape' || event.keyCode === 27) && this.selectionOverlay) {
            console.log('⚡ CONTENT: ESC key detected - canceling area selection');
            event.preventDefault(); // Prevent default ESC behavior
            this.cancelAreaSelection();
        }
    }

    cancelAreaSelection() {
        console.log('Area selection cancelled');
        
        // Send cancellation message to background (popup might be closed)
        chrome.runtime.sendMessage({
            action: 'areaSelectionCancelled'
        });
        
        // Also clear any pending selection data
        chrome.runtime.sendMessage({
            action: 'clearPendingSelection'
        });

        this.removeSelectionOverlay();
    }

    removeSelectionOverlay() {
        if (this.selectionOverlay) {
            this.selectionOverlay.remove();
            this.selectionOverlay = null;
            this.selectionBox = null;
        }

        // Remove keyboard listener - use same bound handler reference
        document.removeEventListener('keydown', this.boundKeyDownHandler);
        
        this.isSelecting = false;
    }

    showInstructions() {
        // Instructions are already shown in the overlay
        console.log('Selection instructions displayed');
    }

    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: #fef2f2 !important;
            color: #dc2626 !important;
            padding: 12px 20px !important;
            border-radius: 6px !important;
            border: 1px solid #fecaca !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 14px !important;
            z-index: 1000001 !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        `;
        errorDiv.textContent = message;

        if (this.selectionOverlay) {
            this.selectionOverlay.appendChild(errorDiv);
        }

        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    addPageIndicator() {
        // Add a subtle indicator when the extension is available
        const indicator = document.createElement('div');
        indicator.id = 'ux-tracker-indicator';
        indicator.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            width: 8px !important;
            height: 8px !important;
            background: #6366f1 !important;
            border-radius: 50% !important;
            z-index: 999998 !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            pointer-events: none !important;
        `;
        
        document.body.appendChild(indicator);

        // Show indicator when extension is active
        chrome.runtime.onMessage.addListener((request) => {
            if (request.action === 'showIndicator') {
                indicator.style.opacity = '0.7';
                setTimeout(() => {
                    indicator.style.opacity = '0';
                }, 2000);
            }
        });
    }

    getPageContext() {
        return {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            scroll: {
                x: window.scrollX,
                y: window.scrollY
            },
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize the content script (prevent multiple initialization)
if (!window.uxTrackerContent) {
    console.log('🚀 Initializing UX Tracker Content Script...');
    window.uxTrackerContent = new UXTrackerContent();
} else {
    console.log('⚠️  UX Tracker Content Script already initialized');
}
