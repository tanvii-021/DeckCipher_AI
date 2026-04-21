/**
 * ════════════════════════════════════════════
 *  DeckCipher AI — Premium Client Logic
 * ════════════════════════════════════════════
 */

// ─── DOM Elements ───
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const htmlEl = document.documentElement;

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const apiKeyInput = document.getElementById('api-key-input');
const proxyUrlInput = document.getElementById('proxy-url-input');
const toggleVisBtn = document.getElementById('toggle-visibility-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// Terminal
const terminalConsole = document.getElementById('terminal-console');
const termStatus = document.getElementById('term-status');

// Vault
const vaultList = document.getElementById('vault-list');

// Engine Controls
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileNameEl = document.getElementById('file-name');
const fileSizeEl = document.getElementById('file-size');
const analyzeBtn = document.getElementById('analyze-btn');
const personaSelect = document.getElementById('persona-select');

// Results
const resultsSection = document.getElementById('results-section');
const summaryContent = document.getElementById('summary-content');
const actionsContent = document.getElementById('actions-content');
const resultPersonaBadge = document.getElementById('result-persona-badge');
const toneSummary = document.getElementById('tone-summary');

// State
let selectedFile = null;
let chartInstance = null;

// ─── Utility: Terminal Logger ───
function logTerm(message, type = 'system') {
  const line = document.createElement('div');
  line.className = `term-line ${type}`;
  
  const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
  line.textContent = `[${timestamp}] ${message}`;
  
  terminalConsole.appendChild(line);
  terminalConsole.scrollTop = terminalConsole.scrollHeight;
}

function setTermStatus(status, isError = false) {
  termStatus.textContent = status;
  termStatus.style.color = isError ? '#ff5555' : 'var(--nvidia-green)';
}

// ─── Theme Management ───
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  
  // Update icon
  const icon = themeToggleBtn.querySelector('i');
  if (newTheme === 'light') {
    icon.classList.remove('ph-sun');
    icon.classList.add('ph-moon');
  } else {
    icon.classList.remove('ph-moon');
    icon.classList.add('ph-sun');
  }
});

// ─── Settings & API Key Management ───
// The default key allows public visitors to use the app immediately.
const DEFAULT_API_KEY = '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';

function loadApiKey() {
  // If the user has saved a custom key in settings, use it. Otherwise, use the default.
  return localStorage.getItem('deckcipher_nvidia_key') || DEFAULT_API_KEY;
}

function loadProxyUrl() {
  return localStorage.getItem('deckcipher_proxy_url') || '';
}

function saveApiKey(key, proxy) {
  if (key.trim() === '') {
    localStorage.removeItem('deckcipher_nvidia_key');
    logTerm('Custom API Key cleared. Reverted to default system key.', 'system');
  } else {
    localStorage.setItem('deckcipher_nvidia_key', key.trim());
    logTerm('Custom API Key saved securely to local storage.', 'success');
  }
  
  if (proxy.trim() === '') {
    localStorage.removeItem('deckcipher_proxy_url');
  } else {
    localStorage.setItem('deckcipher_proxy_url', proxy.trim());
    logTerm('CORS Proxy URL saved.', 'success');
  }
}

// Open Modal
openSettingsBtn.addEventListener('click', () => {
  apiKeyInput.value = localStorage.getItem('deckcipher_nvidia_key') || '';
  proxyUrlInput.value = localStorage.getItem('deckcipher_proxy_url') || '';
  settingsModal.classList.remove('hidden');
});

// Close Modal
const closeModal = () => settingsModal.classList.add('hidden');
closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Toggle visibility
toggleVisBtn.addEventListener('click', () => {
  const isPassword = apiKeyInput.type === 'password';
  apiKeyInput.type = isPassword ? 'text' : 'password';
  const icon = toggleVisBtn.querySelector('i');
  icon.classList.toggle('ph-eye', !isPassword);
  icon.classList.toggle('ph-eye-slash', isPassword);
});

// Save Settings
saveSettingsBtn.addEventListener('click', () => {
  saveApiKey(apiKeyInput.value, proxyUrlInput.value);
  closeModal();
});

// ─── Local Vault (History) ───
function loadVault() {
  const history = JSON.parse(localStorage.getItem('deckcipher_vault') || '[]');
  vaultList.innerHTML = '';
  
  if (history.length === 0) {
    vaultList.innerHTML = '<p class="empty-state">No previous analyses found.</p>';
    return;
  }
  
  history.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'vault-item';
    div.innerHTML = `
      <div class="vault-meta">
        <span>${new Date(entry.timestamp).toLocaleDateString()}</span>
        <span>${entry.persona.toUpperCase()}</span>
      </div>
      <div class="vault-title">${entry.filename}</div>
    `;
    
    div.addEventListener('click', () => renderResults(entry.data, entry.persona));
    vaultList.appendChild(div);
  });
}

function saveToVault(filename, persona, data) {
  const history = JSON.parse(localStorage.getItem('deckcipher_vault') || '[]');
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    filename,
    persona,
    data
  });
  
  // Keep only last 10
  if (history.length > 10) history.pop();
  
  localStorage.setItem('deckcipher_vault', JSON.stringify(history));
  loadVault();
  logTerm(`Analysis cached to Local Vault.`, 'system');
}

// ─── File Handling ───
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pptx', 'pdf', 'docx', 'doc'].includes(ext)) {
    logTerm(`Invalid file type: ${file.name}. Expected .pptx, .pdf, or .docx`, 'error');
    return;
  }
  
  selectedFile = file;
  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = formatBytes(file.size);
  
  dropZone.classList.add('hidden');
  fileInfo.classList.remove('hidden');
  
  logTerm(`File loaded in memory: ${file.name} (${formatBytes(file.size)})`, 'success');
}

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => e.target.files.length && handleFile(e.target.files[0]));

// Drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('drag-over'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

// ─── Multi-Format Parsing Engine ───

// 1. PDF Extractor
async function extractTextFromPDF(file) {
  logTerm('Initiating PDF.js engine...', 'system');
  setTermStatus('Parsing PDF');
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    logTerm(`Loaded PDF with ${pdf.numPages} page(s).`, 'system');
    
    let extractedContext = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      const pageText = strings.join(' ');
      if (pageText.trim()) {
        extractedContext += `[Page ${i}]\n${pageText}\n\n`;
      }
    }
    logTerm(`Extraction complete. Total text length: ${extractedContext.length} chars.`, 'success');
    return extractedContext.trim() || '[Placeholder] Failed to extract meaningful text from PDF.';
  } catch (error) {
    logTerm(`PDF Parse Error: ${error.message}`, 'error');
    throw error;
  }
}

// 2. DOCX Extractor
async function extractTextFromDOCX(file) {
  logTerm('Initiating Mammoth.js engine...', 'system');
  setTermStatus('Parsing DOCX');
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    logTerm(`Extraction complete. Total text length: ${result.value.length} chars.`, 'success');
    return result.value.trim() || '[Placeholder] Failed to extract meaningful text from DOCX.';
  } catch (error) {
    logTerm(`DOCX Parse Error: ${error.message}`, 'error');
    throw error;
  }
}

// 3. PPTX Extractor
async function extractTextFromPPTX(file) {
  logTerm('Initiating JSZip engine...', 'system');
  setTermStatus('Parsing XML');
  
  try {
    const zip = await JSZip.loadAsync(file);
    logTerm('Archive loaded successfully.', 'system');
    
    // Find all slide XML files
    const slideFiles = Object.keys(zip.files)
      .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
        return numA - numB;
      });
      
    logTerm(`Detected ${slideFiles.length} slide(s) to process.`, 'system');
    
    let extractedContext = '';
    
    for (let i = 0; i < slideFiles.length; i++) {
      const slideName = slideFiles[i];
      const xml = await zip.file(slideName).async('string');
      
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const textNodes = doc.getElementsByTagName('a:t');
      const slideText = Array.from(textNodes).map(n => n.textContent).join(' ');
      
      if (slideText.trim()) {
        extractedContext += `[Slide ${i+1}]\n${slideText}\n\n`;
      }
    }
    
    if (!extractedContext.trim()) {
      logTerm('No text found in slides. Using fallback mock data for testing.', 'error');
      return `[Slide 1] Q4 Revenue was $5.2M, up 15%. [Slide 2] Action required: Need to expand cloud infrastructure to support EU growth.`;
    }
    
    logTerm(`Extraction complete. Total text length: ${extractedContext.length} chars.`, 'success');
    return extractedContext.trim();
    
  } catch (error) {
    logTerm(`Parse Error: ${error.message}`, 'error');
    throw error;
  }
}

// Master Router
async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return await extractTextFromPDF(file);
  } else if (ext === 'docx' || ext === 'doc') {
    return await extractTextFromDOCX(file);
  } else if (ext === 'pptx') {
    return await extractTextFromPPTX(file);
  } else {
    throw new Error('Unsupported file type.');
  }
}

// ─── NVIDIA API Engine ───
async function analyzeWithNVIDIA(text, persona) {
  const apiKey = loadApiKey();
  
  if (!apiKey) {
    logTerm('API Key missing. Please configure it in Settings.', 'error');
    throw new Error('API Key missing');
  }
  
  logTerm(`Initiating handshake with NVIDIA NIM (Llama-3.1-70B)...`, 'system');
  setTermStatus('Inference Active');
  
  const personaPrompts = {
    cfo: "You are a Chief Financial Officer. Focus on revenue, costs, ROI, financial risks, and fiscal strategy.",
    tech_lead: "You are a Technical Lead. Focus on architecture, engineering efforts, technical debt, and infrastructure requirements.",
    marketing: "You are a Marketing Director. Focus on brand messaging, audience engagement, market positioning, and campaign strategy.",
    executive: "You are an Executive Generalist. Focus on high-level strategy, major milestones, overarching risks, and company alignment."
  };
  
  const systemPrompt = `
${personaPrompts[persona]}

Analyze the following presentation text. You must return your response STRICTLY as a JSON object with four keys. Do NOT wrap the JSON in markdown blocks like \`\`\`json.
{
  "summary": "A concise executive summary based on your persona lens.",
  "actions": ["Actionable item 1", "Actionable item 2", "Actionable item 3"],
  "sentiment": {
    "positive": 60,
    "neutral": 30,
    "negative": 10
  },
  "tone_summary": "A one sentence summary of the presentation's overall tone."
}
`;

  try {
    const proxyUrl = loadProxyUrl();
    const endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';
    const finalUrl = proxyUrl ? proxyUrl + encodeURIComponent(endpoint) : endpoint;
    
    if (!proxyUrl && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      logTerm('Warning: Running on external domain without a proxy. CORS may block the request.', 'system');
    }

    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt.trim() },
          { role: 'user', content: text }
        ],
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NVIDIA API Error ${response.status}: ${err}`);
    }

    logTerm('Inference successful. Receiving payload...', 'success');
    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Cleanup markdown if present
    if (content.startsWith('```json')) {
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    return JSON.parse(content);
    
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      logTerm('Inference failed: CORS Blocked. Browser prevented direct API call from a remote domain.', 'error');
      logTerm('Solution: Open Settings and configure a CORS Proxy URL (e.g. corsproxy.io).', 'error');
    } else {
      logTerm(`Inference failed: ${error.message}`, 'error');
    }
    throw error;
  }
}

// ─── Rendering & Charts ───
function renderChart(sentimentData) {
  const ctx = document.getElementById('sentiment-chart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#f8f9fa' : '#18181b';
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Sentiment Breakdown (%)',
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: [
          'rgba(118, 185, 0, 0.7)',  // NVIDIA Green
          'rgba(161, 161, 170, 0.7)',// Zinc
          'rgba(255, 85, 85, 0.7)'   // Red
        ],
        borderColor: [
          '#76b900',
          '#a1a1aa',
          '#ff5555'
        ],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: textColor },
          grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
        },
        x: {
          ticks: { color: textColor },
          grid: { display: false }
        }
      }
    }
  });
}

function renderResults(data, persona) {
  // Update Persona Badge
  resultPersonaBadge.textContent = document.querySelector(`#persona-select option[value="${persona}"]`).textContent;
  
  // Summary
  summaryContent.innerHTML = data.summary;
  
  // Actions
  actionsContent.innerHTML = '';
  data.actions.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act;
    actionsContent.appendChild(li);
  });
  
  // Tone & Chart
  toneSummary.textContent = data.tone_summary;
  renderChart(data.sentiment);
  
  // Reveal UI
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Core Execution Flow ───
analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  
  const persona = personaSelect.value;
  
  try {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Processing...';
    
    // 1. Extract Text
    const rawText = await extractText(selectedFile);
    
    // 2. NVIDIA Inference
    const resultData = await analyzeWithNVIDIA(rawText, persona);
    logTerm('Payload parsed successfully.', 'success');
    
    // 3. Render
    renderResults(resultData, persona);
    
    // 4. Save to Vault
    saveToVault(selectedFile.name, persona, resultData);
    
    setTermStatus('Idle');
    
  } catch (error) {
    setTermStatus('Failed', true);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<i class="ph ph-sparkle"></i> Initiate Analysis';
  }
});

// ─── Initialization ───
document.addEventListener('DOMContentLoaded', () => {
  loadVault();
  logTerm('Welcome to DeckCipher. System is ready for analysis.', 'system');
});
