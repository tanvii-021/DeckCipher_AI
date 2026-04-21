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
