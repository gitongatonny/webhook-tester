/**
 * Webhook Testing Tool
 * A modern, secure, and user-friendly tool for testing webhook endpoints
 */

// Main WebhookTester object
const WebhookTester = {
  // Core functions
  initializeTabs: function() {
    if (typeof document !== 'undefined') {
      // Code from script.js's initializeTabs function
      // ...
    }
  },
  
  sendRequest: async function(url, options) {
    // Code from script.js's sendRequest function
    // ...
  },
  
  // Main init function
  init: function(containerId) {
    if (typeof document === 'undefined') {
      console.warn('Webhook Testing Tool: DOM not available. Tool is running in a non-browser environment.');
      return false;
    }
    
    // If containerId is provided, initialize the tool in that container
    if (containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Webhook Testing Tool: Container with id "${containerId}" not found.`);
        return false;
      }
      
      // Clone the HTML structure from index.html and insert into container
      // Initialize event listeners
      // ...
    } else {
      // Initialize the tool on the current page
      // ...
    }
    
    return true;
  }
};

// Make it available in the browser environment
if (typeof window !== 'undefined') {
  window.WebhookTester = WebhookTester;
}

// CommonJS export (for Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebhookTester;
}

// ES Module export
if (typeof exports !== 'undefined') {
  exports.default = WebhookTester;
  
  // Named exports for specific functionality
  exports.sendRequest = WebhookTester.sendRequest;
}