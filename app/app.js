/**
 * ════════════════════════════════════════════
 *  DeckCipher AI — app.js
 *  Client-side presentation analytics engine
 * ════════════════════════════════════════════
 */

// ─── DOM References ───
const dropZone       = document.getElementById('drop-zone');
const fileInput      = document.getElementById('file-input');
const fileInfo       = document.getElementById('file-info');
const fileNameEl     = document.getElementById('file-name');
const fileSizeEl     = document.getElementById('file-size');
const analyzeBtn     = document.getElementById('analyze-btn');
const resultsSection = document.getElementById('results-section');
const loadingOverlay = document.getElementById('loading-overlay');

// Result content slots
const summaryContent = document.getElementById('summary-content');
const actionsContent = document.getElementById('actions-content');
const toneContent    = document.getElementById('tone-content');

// ─── State ───
let selectedFile = null;

// ─── Helpers ───

/**
 * Format bytes into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Show / hide the loading overlay.
 * @param {boolean} show
 */
function setLoading(show) {
  loadingOverlay.classList.toggle('hidden', !show);
}

/**
 * Validate that the file is a .pptx
 * @param {File} file
 * @returns {boolean}
 */
function isValidPPTX(file) {
  const validMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  return file.name.toLowerCase().endsWith('.pptx') || file.type === validMime;
}

// ─── File Selection ───

/**
 * Handle a selected file — validate, display info, enable button.
 * @param {File} file
 */
function handleFileSelect(file) {
  if (!isValidPPTX(file)) {
    alert('Please upload a valid .pptx file.');
    return;
  }

  selectedFile = file;

  // Populate file info bar
  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = formatFileSize(file.size);
  fileInfo.classList.remove('hidden');
  analyzeBtn.disabled = false;

  // Reset results
  resultsSection.classList.add('hidden');
}

// ─── Drag & Drop ───

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFileSelect(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
});

// ─── Core Pipeline ───

/**
 * Extract text content from a .pptx file.
 *
 * @param {File} file — The .pptx file selected by the user
 * @returns {Promise<string>} — The extracted plain text
 */
async function extractTextFromPPTX(file) {
  console.log('[DeckCipher] extractTextFromPPTX called with:', file.name);
  try {
    const zip = await JSZip.loadAsync(file);
    const slideFiles = Object.keys(zip.files)
      .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        // Ensure slide1.xml comes before slide10.xml
        const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
        return numA - numB;
      });

    let extractedContext = '';
    for (const slideName of slideFiles) {
      const xml = await zip.file(slideName).async('string');
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const textNodes = doc.getElementsByTagName('a:t');
      const slideText = Array.from(textNodes).map(n => n.textContent).join(' ');
      extractedContext += slideText + '\n\n';
    }
    
    // Add placeholder text if no text is extracted (for testing empty/mock files)
    if (!extractedContext.trim()) {
      return `[Placeholder] Extracted text from "${file.name}" would appear here.\n\nSlide 1: Introduction to Q4 Strategy...\nSlide 2: Revenue projections and KPIs...\nSlide 3: Team action items and next steps...`;
    }

    return extractedContext.trim();
  } catch (error) {
    console.error('[DeckCipher] Error extracting text from PPTX:', error);
    throw error;
  }
}

/**
 * PLACEHOLDER — Send extracted text to NVIDIA NIM API for analysis.
 *
 * Implementation plan:
 *   1. POST to the NVIDIA NIM inference endpoint
 *   2. Include a system prompt instructing the model to produce:
 *      - An executive summary
 *      - A list of action items
 *      - A tone/sentiment analysis
 *   3. Parse the structured JSON response
 *
 * @param {string} text — Plain text extracted from the presentation
 * @returns {Promise<{summary: string, actions: string[], tone: string}>}
 */
async function sendToNvidiaAPI(text) {
  // TODO: Replace with real NVIDIA NIM API call
  //
  // Example future implementation:
  // ─────────────────────────────────────────────
  // const NVIDIA_API_KEY = 'your-api-key';
  // const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
  //
  // const response = await fetch(NVIDIA_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${NVIDIA_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: 'meta/llama-3.1-70b-instruct',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: `You are a presentation analyst. Given the text of a PowerPoint presentation, return a JSON object with three keys:
  //           1. "summary" — a concise executive summary (2-3 sentences)
  //           2. "actions" — an array of actionable items extracted from the deck
  //           3. "tone" — a short analysis of the overall tone and sentiment`,
  //       },
  //       { role: 'user', content: text },
  //     ],
  //     temperature: 0.3,
  //     max_tokens: 1024,
  //   }),
  // });
  //
  // const data = await response.json();
  // return JSON.parse(data.choices[0].message.content);
  // ─────────────────────────────────────────────

  console.log('[DeckCipher] sendToNvidiaAPI called. Text length:', text.length);

  // Simulated API latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock response for development
  return {
    summary:
      'The presentation outlines a comprehensive Q4 strategy focused on expanding market share in the enterprise segment. Key themes include revenue acceleration through strategic partnerships, product-led growth initiatives, and operational efficiency improvements targeting a 15% cost reduction.',
    actions: [
      'Finalize partnership agreement with Acme Corp by Nov 15',
      'Launch enterprise tier pricing — target date: Dec 1',
      'Conduct customer discovery interviews (n=30) by end of Q4',
      'Prepare board deck with updated financial projections',
      'Schedule cross-functional alignment meeting for next sprint',
    ],
    tone:
      'The overall tone is confident and forward-looking, with a strong emphasis on data-driven decision making. The language is assertive but collaborative, suggesting alignment across leadership. Sentiment: Positive (82%), Neutral (15%), Cautionary (3%).',
  };
}

// ─── Render Results ───

/**
 * Populate the three result cards with API response data.
 * @param {{summary: string, actions: string[], tone: string}} results
 */
function renderResults(results) {
  // Executive Summary
  summaryContent.textContent = results.summary;
  summaryContent.classList.remove('card-placeholder');

  // Action Items
  actionsContent.innerHTML = '';
  actionsContent.classList.remove('card-placeholder-list');
  const ul = document.createElement('ul');
  results.actions.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  actionsContent.replaceWith(ul);
  ul.id = 'actions-content';

  // Tone Analysis
  toneContent.textContent = results.tone;
  toneContent.classList.remove('card-placeholder');

  // Show results section
  resultsSection.classList.remove('hidden');
}

// ─── Analyze Button Handler ───

analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  try {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Extracting Text…';

    // Step 1: Extract text from the PPTX
    const extractedContext = await extractTextFromPPTX(selectedFile);

    // Step 2: Show loading state after extraction
    setLoading(true);
    document.querySelector('.spinner-label').textContent = 'AI is thinking…';
    analyzeBtn.textContent = 'AI is thinking…';

    // Step 3: Send to NVIDIA API for analysis
    const results = await sendToNvidiaAPI(extractedContext);

    // Step 4: Render results
    renderResults(results);

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error('[DeckCipher] Analysis failed:', error);
    alert('Something went wrong during analysis. Please try again.');
  } finally {
    setLoading(false);
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Presentation';
    document.querySelector('.spinner-label').textContent = 'Analyzing your presentation…';
  }
});

// ─── Init ───
console.log('[DeckCipher AI] Initialized — Ready for upload.');
