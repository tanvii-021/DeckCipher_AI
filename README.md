<div align="center">
  
# 🛰️ DeckCipher AI

**The Enterprise Presentation Intelligence Engine**

[![Deploy Status](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge&logo=github)](http://tanvii.me/DeckCipher_AI/)
[![Advanced AI](https://img.shields.io/badge/Powered_by-Advanced_AI-00ff00?style=for-the-badge)](http://tanvii.me/DeckCipher_AI/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Transform static slide decks into actionable business intelligence in seconds.*

[**Explore the Live Dashboard**](http://tanvii.me/DeckCipher_AI/) • [**Report Bug**](https://github.com/tanvii-021/DeckCipher_AI/issues) • [**Request Feature**](https://github.com/tanvii-021/DeckCipher_AI/issues)

</div>

---

## 📖 Overview

**DeckCipher AI** is a professional-grade analytical client designed to bridge the gap between unstructured `.pptx` presentations and structured executive data. 

Built on a cutting-edge **Zero-Server Architecture**, DeckCipher operates entirely within the browser. It parses binary OpenXML files locally and interfaces with advanced Large Language Models to deliver multi-persona insights, strategic action items, and sentiment analysis—all without ever uploading your proprietary files to a third-party server.

---

## ✨ Enterprise Features

| Feature | Description |
| :--- | :--- |
| 🛡️ **Zero-Server Privacy** | `.pptx` files are parsed locally in your browser using `JSZip`. Your actual file never leaves your machine. |
| 🧠 **Advanced AI Integration** | Utilizes enterprise-grade 70B parameter models via direct API handshakes for unparalleled reasoning. |
| 🎭 **Multi-Persona Analysis** | View your deck through different lenses: **CFO**, **Technical Lead**, **Marketing**, or **Executive**. |
| 📊 **Dynamic Telemetry** | Real-time Operations Terminal logs the XML extraction and API network requests as they happen. |
| 📈 **Sentiment Visualization** | Automatically maps the AI's tonal analysis into an interactive `Chart.js` graph. |
| 🗄️ **Local History Vault** | Sessions and custom API configurations are encrypted and cached in your browser's `localStorage`. |

---

## 🏗️ Systems Architecture & The AI Engine

### How does the AI work on the deployed site?
The application is hosted via GitHub Pages, which serves static HTML, CSS, and JavaScript. 

1. **Client-Side Extraction:** When a user drops a `.pptx` file into the live UI, the browser uses the `JSZip` library to crack open the binary file and extract text from the XML nodes.
2. **Direct Inference:** The JavaScript logic takes the extracted text, wraps it in a Persona-based system prompt, and makes an asynchronous `fetch()` request directly to an advanced AI API endpoint.
3. **Seamless Public Access & BYOK:** The application has a **built-in default API key** seamlessly hardcoded into the backend logic. This means anyone visiting the site can use the AI immediately without signing up or entering credentials! However, for enterprise users who want absolute privacy, DeckCipher uses a secure **Settings Modal**. Users can paste their own private API Key into the UI, overriding the default key.

---

## 🚀 Live Deployment & Testing Guide

Want to see DeckCipher AI in action? The application is fully deployed and accessible right now.

> **Live Application URL:** [http://tanvii.me/DeckCipher_AI/](http://tanvii.me/DeckCipher_AI/)

### Step-by-Step Testing Protocol

<details>
<summary><b>1. Open the Dashboard</b></summary>

1. Open the [Live Dashboard](http://tanvii.me/DeckCipher_AI/).
2. You can immediately start using the application thanks to the integrated default AI key!
*(Optional: Click the Settings gear to supply your own private API key for dedicated rate limits).*
</details>

<details>
<summary><b>2. Set the Analytical Lens</b></summary>

Use the dropdown menu to select the perspective you want the AI to adopt. 
*Example: Select **Chief Financial Officer** if you want the AI to ruthlessly focus on revenue and cost metrics.*
</details>

<details>
<summary><b>3. Ingest Data (Upload a .pptx)</b></summary>

Drag and drop any standard Microsoft PowerPoint (`.pptx`) file into the designated upload zone. 
*Don't have one? Create a 2-slide test deck with some fake business bullet points!*
</details>

<details>
<summary><b>4. Monitor the Operations Terminal</b></summary>

Click **Initiate Analysis**. Watch the black Operations Terminal on the screen. You will see real-time logs as the browser locally unzips the file, extracts the text, and initiates the secure inference handshake.
</details>

<details>
<summary><b>5. Review the AI Insights</b></summary>

Within seconds, the dashboard will render:
- A tailored Executive Summary.
- A bulleted list of strategic Action Items.
- A dynamic `Chart.js` graph breaking down the presentation's overall sentiment.
</details>

---

## 💻 Technical Stack

- **UI/UX:** Custom Glassmorphism Design System, CSS Variables (Dark/Light Mode), Phosphor Icons, Inter Font.
- **Frontend Logic:** Vanilla ES6+ JavaScript, HTML5.
- **Parsing Engine:** `JSZip` (Client-side binary manipulation).
- **AI/ML Layer:** High-performance REST APIs.
- **Data Visualization:** `Chart.js`.
- **Hosting:** GitHub Pages (Zero-Server Architecture).

---
<div align="center">
  <i>Engineered for high-performance context processing.</i>
</div>
