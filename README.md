# DeckCipher AI 🛰️
**NVIDIA-Powered Presentation Intelligence Engine**

DeckCipher AI is a professional-grade analytical tool built to bridge the gap between unstructured slide decks and actionable business intelligence. Utilizing **NVIDIA NIM (Inference Microservices)** and client-side XML parsing, it transforms static PowerPoints into structured dashboards.

## 🚀 Key Engineering Features
* **Context Engineering:** Implements a Multi-Persona Analysis engine, allowing users to toggle between CFO, Technical, and Creative analytical lenses.
* **Technical Operations:** Features a real-time 'Operational Terminal' that visualizes the browser-side parsing of OpenXML data and API handshakes.
* **Zero-Server Architecture:** High-speed `.pptx` unzipping and text extraction performed entirely in the browser using `JSZip`, ensuring maximum user privacy and zero latency.
* **Data Visualization:** Integrated `Chart.js` dashboard for sentiment and tone quantification.
* **Local Vault:** Secure client-side `localStorage` caching for API credentials and historical analysis sessions.

## 🛠️ Tech Stack
* **Language:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Design System:** Custom Glassmorphism UI with CSS Variables (Dark/Light Mode)
* **AI Infrastructure:** NVIDIA NIM (Llama-3.1-70B-Instruct)
* **Libraries:** JSZip (Binary OpenXML Parsing), Chart.js (Data Visualization)
* **Deployment:** Designed for static hosting (GitHub Pages, Vercel, Netlify)

## 📐 Systems Architecture
1. **Ingestion:** HTML5 File API reads the `.pptx` as an `ArrayBuffer`.
2. **Extraction:** `JSZip` unzips the OpenXML structure to programmatically traverse and scrape text from `ppt/slides/*.xml` nodes (`<a:t>`).
3. **Contextualization:** Extracted text is wrapped in a "Persona-Driven" Master System Prompt.
4. **Inference:** Secure asynchronous `fetch` call to the NVIDIA NIM API endpoint.
5. **Visualization:** Strict JSON response is parsed and mapped to dynamic DOM nodes and Chart.js instances.

## 💼 Professional Application
This project demonstrates advanced front-end engineering capabilities, including:
- Handling unstructured binary data extraction directly in the browser.
- Architecting robust, fault-tolerant AI inference pipelines.
- Designing enterprise-ready, accessible, and responsive user interfaces.
- Managing client-side state and security (API key isolation).

---

## 🌐 GitHub Pages Deployment Guide

Because this app utilizes a **Zero-Server Architecture** (there is no Node.js backend or database to host), it can be deployed completely free in seconds using GitHub Pages. 

### Deployment Steps:
1. **Push to GitHub**: Make sure all three files (`index.html`, `style.css`, and `app.js`) are committed and pushed to the **root** `/` directory of your GitHub repository.
2. **Open Settings**: Navigate to your repository on GitHub and click the **Settings** tab.
3. **Go to Pages**: In the left sidebar, click on **Pages**.
4. **Configure Build and Deployment**:
   - Under **Source**, select `Deploy from a branch`.
   - Under **Branch**, select your main branch (e.g., `main` or `master`).
   - Ensure the folder dropdown is set to **`/ (root)`**.
   - Click **Save**.
5. **Wait for the Build**: GitHub will run a background workflow to deploy your site. This usually takes less than a minute.
6. **Access Your Live App**: Refresh the page, and you will see a URL at the top stating *"Your site is live at https://[your-username].github.io/[repository-name]"*.

*(Note: Because the API key is securely saved in the user's `localStorage` via the in-app Settings modal, you can safely deploy this to a public repository without leaking your own NVIDIA credentials!)*

---

## 🧪 How to Test the Application

To verify the end-to-end functionality of DeckCipher AI, follow these professional testing steps:

1. **Access the Live Environment**: Navigate to the deployed application URL (e.g., [http://tanvii.me/DeckCipher_AI/](http://tanvii.me/DeckCipher_AI/)).
2. **Secure Key Configuration**: 
   - Click the **Settings** button in the top right corner.
   - Enter your active **NVIDIA NIM API Key**.
   - Click **Save Configuration** (your key is instantly encrypted into browser `localStorage`).
3. **Establish Context**: Use the "Analytical Lens" dropdown to select a Persona (e.g., *Chief Financial Officer* or *Technical Lead*).
4. **Data Ingestion (The Test File)**: 
   - You will need a standard Microsoft PowerPoint file (`.pptx`).
   - *Test Tip:* Create a simple 2-3 slide `.pptx` file containing some mock business data (e.g., "Q3 Revenue is up 15%", "We need to hire 5 engineers").
   - Drag and drop this `.pptx` file directly into the **Upload Zone**.
5. **Monitor Telemetry**: Watch the **Operations Terminal** in real-time as the system unzips the binary file, scrapes the XML text nodes, and initiates the secure handshake with the NVIDIA Llama-3.1-70B model.
6. **Review Insights**: Within seconds, the dashboard will populate with a tailored Executive Summary, Strategic Action Items, and a dynamic Chart.js Sentiment graph.
