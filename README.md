# 🚀 Webhook Testing Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-production-green.svg?style=flat-square)

**A modern, secure, and user-friendly tool for testing webhook endpoints**

<br>

![Webhook Testing Tool Demo](https://via.placeholder.com/800x450?text=Webhook+Testing+Tool)

</div>

## ✨ Features

- **🔄 Multiple Request Formats** - Test webhooks using JSON, Form Data, or URL Encoded formats
- **🛡️ Security-Focused** - Built with robust security measures to prevent common vulnerabilities
- **🎨 Modern UI/UX** - Dark-themed, responsive interface with intuitive controls
- **⚡ Real-time Feedback** - Instant response visualization with color-coded status indicators
- **📋 Easy Copy** - One-click response copying for sharing or documentation
- **📱 Fully Responsive** - Works seamlessly across desktop, tablet, and mobile devices

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Security Features](#-security-features)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

### Option 1: Download and Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/webhook-testing-tool.git

# Navigate to project directory
cd webhook-testing-tool

# Open in your browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Option 2: Use CDN (Coming Soon)

Include the tool directly in your project:

```html
<link rel="stylesheet" href="https://cdn.example.com/webhook-testing-tool/style.css">
<script src="https://cdn.example.com/webhook-testing-tool/script.js"></script>
```

## 🔍 Usage

1. **Select Your Request Format**
   - Choose between JSON, Form Data, or URL Encoded formats

2. **Enter Your Webhook URL**
   - Input the endpoint you want to test

3. **Customize Your Payload**
   - JSON: Write or paste your JSON data
   - Form Data / URL Encoded: Fill in the form fields

4. **Send Your Request**
   - Click the "Send" button to make the request

5. **View Response Details**
   - Examine status code, headers, response body, and timing
   - Copy the response with a single click

## 🔒 Security Features

The Webhook Testing Tool is built with security as a priority:

- **🛡️ Content Security Policy (CSP)** - Prevents XSS attacks
- **🔍 URL Validation** - Ensures only valid URLs are processed
- **🧹 Input Sanitization** - Prevents injection attacks
- **⏱️ Request Timeout** - Avoids indefinite hanging connections
- **🔄 CORS Handling** - Manages cross-origin requests properly
- **✂️ Secure Clipboard Implementation** - Safely handles clipboard operations

## ⚙️ Configuration

### Custom Default Settings

Edit the `script.js` file to configure default settings:

```javascript
const defaultWebhookUrl = 'https://your-default-webhook.com/endpoint';
```

### Custom Styling

The tool uses CSS variables for easy theming. Edit the `:root` section in `style.css`:

```css
:root {
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --accent-primary: #2962ff;
    /* ... other variables */
}
```

## 📚 API Reference

### HTTP Methods Supported

- `POST` - Currently the tool focuses on POST requests which are most common for webhooks

### Content Types

- `application/json` - For JSON payloads
- `multipart/form-data` - For Form Data submissions
- `application/x-www-form-urlencoded` - For URL encoded data

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by Tonny Gitonga

</div>