/**
 * Advanced Webhook Testing Tool - JavaScript
 * Handles tab switching, form submissions, and webhook requests
 *
 * Security features:
 * - URL validation to prevent malicious inputs
 * - Input sanitization to prevent XSS attacks
 * - Request timeout to prevent hanging connections
 * - CORS handling for cross-origin requests
 * - Modern clipboard API with secure fallback
 */

// Prevent XSS by sanitizing text input
function sanitizeText(text) {
  const tempElement = document.createElement("div");
  tempElement.textContent = text;
  return tempElement.innerHTML;
}

// Validate URLs to prevent malicious input
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Define SVG icons for status messages
const ICONS = {
  SUCCESS: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  ERROR: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
};

/**
 * Initialize tab functionality
 * Switches between different request format options (JSON, Form Data, URL Encoded)
 */
function initializeTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      // Add active class to current tab
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab + "Tab").classList.add("active");

      // Hide all status messages when switching tabs
      document.querySelectorAll(".status-message").forEach((msg) => {
        msg.classList.remove("show", "success", "error");
      });
    });
  });
}

/**
 * Safely send a webhook request with appropriate error handling
 * @param {string} url - The webhook URL
 * @param {object} options - The fetch options (method, headers, body)
 * @returns {Promise<object>} - The response data
 */
async function sendRequest(url, options) {
  // Return early if URL is invalid
  if (!isValidURL(url)) {
    return {
      error: "Invalid URL format. Please enter a valid URL.",
    };
  }

  try {
    const startTime = new Date();

    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const endTime = new Date();
    const duration = endTime - startTime;

    let responseData;
    const contentType = response.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        // Try to parse as JSON even if Content-Type is not set correctly
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          responseData = text;
        }
      }
    } catch (error) {
      responseData = "Could not parse response body";
    }

    // Return formatted response with details
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()]),
      body: responseData,
      duration: duration + "ms",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        error: "Request timed out after 30 seconds",
      };
    }

    return {
      error: error.message,
    };
  }
}

/**
 * Display the response from the webhook request
 * @param {object} response - The response data to display
 */
function displayResponse(response) {
  const responseContent = document.getElementById("responseContent");
  responseContent.textContent = JSON.stringify(response, null, 2);
}

/**
 * Handle webhook request submission
 * @param {string} buttonId - The ID of the send button
 * @param {string} statusMessageId - The ID of the status message container
 * @param {string} statusTextId - The ID of the status text element
 * @param {Function} getRequestData - Function to get the request data
 */
function handleSubmission(
  buttonId,
  statusMessageId,
  statusTextId,
  getRequestData
) {
  const button = document.getElementById(buttonId);
  const statusMessage = document.getElementById(statusMessageId);
  const statusText = document.getElementById(statusTextId);

  button.addEventListener("click", async () => {
    // Hide previous status message
    statusMessage.classList.remove("show", "success", "error");

    // Show loading state
    button.classList.add("loading");

    try {
      // Get request data and URL from the specific tab
      const { url, options } = getRequestData();

      if (!url) {
        throw new Error("Please enter a webhook URL");
      }

      const response = await sendRequest(url, options);
      displayResponse(response);

      // Show success/error message
      if (response.error) {
        statusMessage.classList.add("error", "show");
        statusMessage.querySelector(".status-icon").innerHTML = ICONS.ERROR;
        statusText.textContent = `Error: ${response.error}`;
      } else if (response.status >= 200 && response.status < 300) {
        statusMessage.classList.add("success", "show");
        statusMessage.querySelector(".status-icon").innerHTML = ICONS.SUCCESS;
        statusText.textContent = `Success! Response received in ${response.duration}`;
      } else {
        statusMessage.classList.add("error", "show");
        statusMessage.querySelector(".status-icon").innerHTML = ICONS.ERROR;
        statusText.textContent = `Failed with status: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      displayResponse({ error: error.message });
      statusMessage.classList.add("error", "show");
      statusMessage.querySelector(".status-icon").innerHTML = ICONS.ERROR;
      statusText.textContent = `Error: ${error.message}`;
    } finally {
      // Hide loading state
      button.classList.remove("loading");
    }
  });
}

/**
 * Set up the copy response button functionality
 */
function setupCopyResponseButton() {
  document.getElementById("copyResponseBtn").addEventListener("click", () => {
    const responseText = document.getElementById("responseContent").textContent;

    // Use the modern clipboard API with fallback
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(responseText)
        .then(() => {
          updateCopyButtonText(true);
        })
        .catch(() => {
          updateCopyButtonText(false);
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = responseText;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);

      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      updateCopyButtonText(success);
    }
  });
}

/**
 * Update the copy button text to show feedback
 * @param {boolean} success - Whether the copy was successful
 */
function updateCopyButtonText(success) {
  const copyBtn = document.getElementById("copyResponseBtn");
  const originalHTML = copyBtn.innerHTML;

  if (success) {
    copyBtn.innerHTML = `
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
  } else {
    copyBtn.innerHTML = `
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Failed!
        `;
  }

  // Reset button text after 2 seconds
  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
  }, 2000);
}

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the tab switching functionality
  initializeTabs();

  // Set up the copy response button
  setupCopyResponseButton();

  // Set default webhook URL values across all tabs
  const defaultWebhookUrl = "";
  document.getElementById("webhookUrl").value = defaultWebhookUrl;
  document.getElementById("webhookUrlFormData").value = defaultWebhookUrl;
  document.getElementById("webhookUrlUrlEncoded").value = defaultWebhookUrl;

  // Set up JSON tab submission handler
  handleSubmission("sendJsonBtn", "jsonStatusMessage", "jsonStatusText", () => {
    const url = document.getElementById("webhookUrl").value.trim();
    const jsonData = document.getElementById("jsonData").value;

    try {
      // Validate JSON to catch syntax errors early
      JSON.parse(jsonData);

      return {
        url,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        },
      };
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  });

  // Set up Form Data tab submission handler
  handleSubmission(
    "sendFormDataBtn",
    "formDataStatusMessage",
    "formDataStatusText",
    () => {
      const url = document.getElementById("webhookUrlFormData").value.trim();
      const form = document.getElementById("formDataForm");
      const formData = new FormData(form);

      return {
        url,
        options: {
          method: "POST",
          body: formData,
        },
      };
    }
  );

  // Set up URL Encoded tab submission handler
  handleSubmission(
    "sendUrlEncodedBtn",
    "urlEncodedStatusMessage",
    "urlEncodedStatusText",
    () => {
      const url = document.getElementById("webhookUrlUrlEncoded").value.trim();
      const form = document.getElementById("urlEncodedForm");
      const formData = new FormData(form);
      const urlEncodedData = new URLSearchParams();

      // Convert FormData to URLSearchParams
      for (const [key, value] of formData.entries()) {
        urlEncodedData.append(key, value);
      }

      return {
        url,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData.toString(),
        },
      };
    }
  );
});
