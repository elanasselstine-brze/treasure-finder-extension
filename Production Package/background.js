// Background script for UX Issue Tracker
// Handles popup reopening after area selection

console.log('🔧 Background script loaded');

// Store selection data temporarily
let pendingSelection = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('🔧 BACKGROUND: Received message:', message);
    
    if (message.action === 'areaSelected') {
        console.log('🎯 BACKGROUND: Area selected, storing data and opening popup');
        
        // Store the selection data
        pendingSelection = {
            selection: message.selection,
            viewport: message.viewport,
            deviceInfo: message.deviceInfo,
            timestamp: Date.now()
        };
        
        // Open the popup again to show preview
        chrome.action.openPopup().then(() => {
            console.log('✅ BACKGROUND: Popup opened successfully');
        }).catch((error) => {
            console.log('⚠️ BACKGROUND: Could not open popup automatically:', error);
            console.log('💡 User will need to click extension icon to see preview');
        });
        
        sendResponse({received: true, stored: true});
        
    } else if (message.action === 'getPendingSelection') {
        console.log('📤 BACKGROUND: Popup requesting pending selection data');
        
        const data = pendingSelection;
        
        // Clear the data after sending
        pendingSelection = null;
        
        sendResponse({
            hasPendingSelection: !!data,
            data: data
        });
        
    } else if (message.action === 'clearPendingSelection') {
        console.log('🗑️ BACKGROUND: Clearing pending selection data');
        pendingSelection = null;
        sendResponse({cleared: true});
        
    } else if (message.action === 'areaSelectionCancelled') {
        console.log('❌ BACKGROUND: Area selection cancelled, clearing pending data');
        pendingSelection = null;
        sendResponse({cleared: true});
    }
});

// Clean up old selection data after 5 minutes
setInterval(() => {
    if (pendingSelection && Date.now() - pendingSelection.timestamp > 5 * 60 * 1000) {
        console.log('🧹 BACKGROUND: Cleaning up old selection data');
        pendingSelection = null;
    }
}, 60000); // Check every minute
