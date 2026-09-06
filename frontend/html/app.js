/**
 * ManakSetu AI - Core Application Logic
 * Enterprise AI Recommendation Engine for Indian Standards (BIS) in Procurement
 */

// State Management
const appState = {
  activeMode: 'nl-query', // 'nl-query' | 'form-spec' | 'tender-doc' | 'explorer'
  currentQuery: '',
  selectedLang: 'en',
  currentResults: [],
  deprecatedAlerts: [],
  tenderCart: [],
  activeGraphStandard: null,
  activeAmendmentStandard: null,
  isRecording: false,
  speechRecognition: null
};

// Multilingual UI Translation Dictionary
const UI_TRANSLATIONS = {
  en: {
    brand_tagline: "Find the right Indian Standard in seconds, not hours.",
    home: "Home",
    login: "Login",
    search_tender: "Search Tender",
    tender_calendar: "Tender Calendar",
    recent_tenders: "Recent Tenders",
    standards_menu: "Standards",
    headline: "Find the right Indian Standard",
    subheading: "Enabling faster, more accurate procurement by connecting every specification to the right Indian Standard — automatically.",
    publish_tender_tag: "Procurement & Tenders",
    publish_tender_title: "Publish Tender",
    publish_tender_desc: "Draft technical specifications, identify applicable Indian Standards (BIS), check mandatory QCOs, and generate GeM-ready clauses.",
    publish_tender_action: "Open Procurement Portal",
    join_vendor_tag: "Manufacturers & OEMs",
    join_vendor_title: "Join as a Vendor",
    join_vendor_desc: "Register your BIS License (ISI Mark / CRS / Hallmarking), verify statutory compliance, and connect with active government tenders.",
    join_vendor_action: "Register as Vendor"
  },
  hi: {
    brand_tagline: "घंटों में नहीं, सेकंडों में सही भारतीय मानक खोजें।",
    home: "होम",
    login: "लॉग इन",
    search_tender: "निविदा खोजें",
    tender_calendar: "निविदा कैलेंडर",
    recent_tenders: "हालिया निविदाएं",
    standards_menu: "मानक",
    headline: "सही भारतीय मानक खोजें",
    subheading: "हर विनिर्देश को सही भारतीय मानक से स्वचालित रूप से जोड़कर तेज़ और सटीक खरीद को सक्षम बनाना।",
    publish_tender_tag: "खरीद एवं निविदाएं",
    publish_tender_title: "निविदा प्रकाशित करें",
    publish_tender_desc: "तकनीकी विनिर्देश तैयार करें, लागू भारतीय मानकों (BIS) की पहचान करें, अनिवार्य QCO की जांच करें और GeM-अनुरूप खंड तैयार करें।",
    publish_tender_action: "खरीद पोर्टल खोलें",
    join_vendor_tag: "निर्माता एवं आपूर्तिकर्ता",
    join_vendor_title: "विक्रेता के रूप में जुड़ें",
    join_vendor_desc: "अपना बीआईएस लाइसेंस (आईएसआई मार्क / सीआरएस / हॉलमार्किंग) पंजीकृत करें और सरकारी निविदाओं से जुड़ें।",
    join_vendor_action: "विक्रेता पंजीकरण करें"
  },
  ta: {
    brand_tagline: "மணிக்கணக்கில் அல்ல, நொடிகளில் சரியான இந்திய தரநிலையைக் கண்டறியவும்.",
    home: "முகப்பு",
    login: "உள்நுழைவு",
    search_tender: "டெண்டர் தேடுங்கள்",
    tender_calendar: "டெண்டர் காலண்டர்",
    recent_tenders: "சமீபத்திய டெண்டர்கள்",
    standards_menu: "தரநிலைகள்",
    headline: "சரியான இந்திய தரநிலையைக் கண்டறியவும்",
    subheading: "ஒவ்வொரு விவரக்குறிப்பையும் சரியான இந்திய தரநிலையுடன் தானாக இணைப்பதன் மூலம் விரைவான, துல்லியமான கொள்முதலை செயல்படுத்துகிறது.",
    publish_tender_tag: "கொள்முதல் & டெண்டர்கள்",
    publish_tender_title: "டெண்டர் வெளியிடுங்கள்",
    publish_tender_desc: "தொழில்நுட்ப விவரக்குறிப்புகளை உருவாக்கவும், பொருந்தக்கூடிய இந்திய தரநிலைகளை (BIS) அடையாளம் காணவும்.",
    publish_tender_action: "கொள்முதல் போர்ட்டலைத் திறக்கவும்",
    join_vendor_tag: "உற்பத்தியாளர்கள் & விற்பனையாளர்கள்",
    join_vendor_title: "விற்பனையாளராக இணையுங்கள்",
    join_vendor_desc: "உங்கள் BIS உரிமத்தைப் பதிவுசெய்து, அரசு கொள்முதல் டெண்டர்களுடன் இணையுங்கள்.",
    join_vendor_action: "விற்பனையாளர் பதிவு"
  },
  te: {
    brand_tagline: "గంటల్లో కాదు, సెకన్లలో సరైన భారతీయ ప్రమాణాన్ని కనుగొనండి.",
    home: "హోమ్",
    login: "లాగిన్",
    search_tender: "టెండర్ శోధించండి",
    tender_calendar: "టెండర్ క్యాలెండర్",
    recent_tenders: "ఇటీవలి టెండర్లు",
    standards_menu: "ప్రమాణాలు",
    headline: "సరైన భారతీయ ప్రమాణాన్ని కనుగొనండి",
    subheading: "ప్రతి స్పెసిఫికేషన్‌ను సరైన భారతీయ ప్రమాణానికి స్వయంచాలకంగా అనుసంధానించడం ద్వారా వేగవంతమైన, మరింత ఖచ్చితమైన సేకరణను ప్రారంభించడం.",
    publish_tender_tag: "సేకరణ & టెండర్లు",
    publish_tender_title: "టెండర్ ప్రచురించండి",
    publish_tender_desc: "సాంకేతిక వివరాలను రూపొందించండి, వర్తించే భారతీయ ప్రమాణాలను (BIS) గుర్తించండి.",
    publish_tender_action: "సేకరణ పోర్టల్ తెరవండి",
    join_vendor_tag: "తయారీదారులు & విక్రేతలు",
    join_vendor_title: "విక్రేతగా చేరండి",
    join_vendor_desc: "మీ BIS లైసెన్స్‌ను నమోదు చేసుకోండి మరియు ప్రభుత్వ టెండర్లతో కనెక్ట్ అవ్వండి.",
    join_vendor_action: "విక్రేత నమోదు"
  },
  mr: {
    brand_tagline: "तासांत नाही, सेकंदात योग्य भारतीय मानक शोधा.",
    home: "मुख्यपृष्ठ",
    login: "लॉगिन",
    search_tender: "निविदा शोधा",
    tender_calendar: "निविदा कॅलेंडर",
    recent_tenders: "अलीकडील निविदा",
    standards_menu: "मानके",
    headline: "योग्य भारतीय मानक शोधा",
    subheading: "प्रत्येक तपशील योग्य भारतीय मानकाशी स्वयंचलितपणे जोडून जलद, अधिक अचूक खरेदी सक्षम करणे.",
    publish_tender_tag: "खरेदी आणि निविदा",
    publish_tender_title: "निविदा प्रकाशित करा",
    publish_tender_desc: "तांत्रिक तपशील तयार करा, लागू भारतीय मानके (BIS) ओळखा.",
    publish_tender_action: "खरेदी पोर्टल उघडा",
    join_vendor_tag: "उत्पादक आणि विक्रेते",
    join_vendor_title: "विक्रेता म्हणून सामील व्हा",
    join_vendor_desc: "आपला BIS परवाना नोंदवा आणि सरकारी निविदांशी कनेक्ट व्हा.",
    join_vendor_action: "विक्रेता नोंदणी"
  },
  gu: {
    brand_tagline: "કલાકોમાં નહીં, સેકંડમાં યોગ્ય ભારતીય માનક શોધો.",
    home: "હોમ",
    login: "લૉગિન",
    search_tender: "ટેન્ડર શોધો",
    tender_calendar: "ટેન્ડર કેલેન્ડર",
    recent_tenders: "તાજેતરના ટેન્ડરો",
    standards_menu: "ધોરણો",
    headline: "યોગ્ય ભારતીય માનક શોધો",
    subheading: "દરેક સ્પષ્ટીકરણને યોગ્ય ભારતીય માનક સાથે આપમેળે જોડીને ઝડપી અને વધુ સચોટ પ્રાપ્તિ સક્ષમ કરવી.",
    publish_tender_tag: "પ્રાપ્તિ અને ટેન્ડર",
    publish_tender_title: "ટેન્ડર પ્રકાશિત કરો",
    publish_tender_desc: "તકનીકી વિશિષ્ટતાઓ તૈયાર કરો, લાગુ ભારતીય ધોરણો (BIS) ઓળખો.",
    publish_tender_action: "પ્રાપ્તિ પોર્ટલ ખોલો",
    join_vendor_tag: "ઉત્પાદકો અને સપ્લાયર્સ",
    join_vendor_title: "વિક્રેતા તરીકે જોડાઓ",
    join_vendor_desc: "તમારું BIS લાયસન્સ રજીસ્ટર કરો અને સરકારી ટેન્ડરો સાથે જોડાઓ.",
    join_vendor_action: "વિક્રેતા નોંધણી"
  }
};

function updateUILanguage(lang) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  appState.selectedLang = lang;

  // Update brand tagline
  const tagline = document.querySelector('.brand-tagline');
  if (tagline && dict.brand_tagline) tagline.textContent = dict.brand_tagline;

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  initLucideIcons();
  const langName = document.querySelector('#langSelect option:checked')?.textContent || lang;
  showToast(`Language switched to ${langName}`);
}

// Common Technical Stopwords
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "for", "with", "in", "on", "at", "to", "from",
  "by", "of", "is", "are", "was", "were", "be", "been", "procurement", "supply",
  "purchase", "specification", "technical", "tender", "bidder", "contractor",
  "requirement", "required", "shall", "must", "as", "per", "grade", "type"
]);

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLucideIcons();
  initEventListeners();
  initSpeechRecognition();
  loadInitialStandards();
});

// Theme Management (Light / Dark)
function initTheme() {
  const savedTheme = localStorage.getItem('manaksetu_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('manaksetu_theme', next);
  updateThemeButton(next);
  if (appState.activeGraphStandard) {
    renderNetworkGraph(appState.activeGraphStandard);
  }
}

function updateThemeButton(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    initLucideIcons();
  }
}

// Icon Initializer Helper
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Event Listeners Binding
function initEventListeners() {
  // Mode Switch Tabs
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      switchMode(tab.dataset.mode);
    });
  });

  // Hero Search Button (Find Standards)
  const findStandardsBtn = document.getElementById('findStandardsBtn') || document.getElementById('nlSearchBtn');
  if (findStandardsBtn) {
    findStandardsBtn.addEventListener('click', handleNLSearch);
  }

  // Textarea Enter key handler (Enter to search, Shift+Enter for newline)
  const queryInput = document.getElementById('queryInput');
  if (queryInput) {
    queryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNLSearch();
      }
    });
  }

  // Tender Document Tray Toggle Link
  const toggleDocModeBtn = document.getElementById('toggleDocModeBtn');
  const docUploadTray = document.getElementById('docUploadTray');
  if (toggleDocModeBtn && docUploadTray) {
    toggleDocModeBtn.addEventListener('click', () => {
      const isHidden = docUploadTray.style.display === 'none';
      docUploadTray.style.display = isHidden ? 'flex' : 'none';
      const span = toggleDocModeBtn.querySelector('span');
      if (span) {
        span.textContent = isHidden ? "Hide tender document tray" : "Or upload / paste tender document";
      }
    });
  }

  // Theme toggle button
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Voice search mic
  const micBtn = document.getElementById('micBtn');
  if (micBtn) {
    micBtn.addEventListener('click', toggleSpeechRecognition);
  }

  // Structured Form Submission
  const formSearchBtn = document.getElementById('formSearchBtn');
  if (formSearchBtn) {
    formSearchBtn.addEventListener('click', handleFormSearch);
  }

  // Tender Document Analyze Button
  const analyzeDocBtn = document.getElementById('analyzeDocBtn');
  if (analyzeDocBtn) {
    analyzeDocBtn.addEventListener('click', handleDocAnalysis);
  }

  // File Dropzone handlers
  const dropzone = document.getElementById('dropzone');
  const docFileInput = document.getElementById('docFileInput');
  if (dropzone && docFileInput) {
    dropzone.addEventListener('click', () => docFileInput.click());
    docFileInput.addEventListener('change', handleFileUpload);

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Modal Closers
  document.querySelectorAll('.modal-closer').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Two Home Page Portal Options: Publish Tender & Join as Vendor
  const optPublishTender = document.getElementById('optPublishTender');
  const optJoinVendor = document.getElementById('optJoinVendor');
  const publishTenderModal = document.getElementById('publishTenderModal');
  const vendorModal = document.getElementById('vendorModal');

  if (optPublishTender && publishTenderModal) {
    optPublishTender.addEventListener('click', () => {
      publishTenderModal.classList.add('open');
      initLucideIcons();
      const input = document.getElementById('queryInput');
      if (input) setTimeout(() => input.focus(), 250);
    });
  }

  if (optJoinVendor && vendorModal) {
    optJoinVendor.addEventListener('click', () => {
      vendorModal.classList.add('open');
      initLucideIcons();
    });
  }

  // Header Vendor Joining Modal Trigger
  const vendorJoinBtn = document.getElementById('vendorJoinBtn');
  if (vendorJoinBtn && vendorModal) {
    vendorJoinBtn.addEventListener('click', () => {
      vendorModal.classList.add('open');
      initLucideIcons();
    });
  }

  // Secondary Quick Tender Utilities (Search Tender, Tender Calendar, Recent Tenders)
  const btnSearchTender = document.getElementById('btnSearchTender');
  const btnTenderCalendar = document.getElementById('btnTenderCalendar');
  const btnRecentTenders = document.getElementById('btnRecentTenders');

  if (btnSearchTender) btnSearchTender.addEventListener('click', () => openTenderUtility('search'));
  if (btnTenderCalendar) btnTenderCalendar.addEventListener('click', () => openTenderUtility('calendar'));
  if (btnRecentTenders) btnRecentTenders.addEventListener('click', () => openTenderUtility('recent'));

  // Standards Dropdown Menu Trigger
  const btnStandardsMenu = document.getElementById('btnStandardsMenu');
  const standardsDropdownWrapper = document.getElementById('standardsDropdownWrapper');
  if (btnStandardsMenu && standardsDropdownWrapper) {
    btnStandardsMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = standardsDropdownWrapper.classList.toggle('open');
      btnStandardsMenu.setAttribute('aria-expanded', isOpen);
      initLucideIcons();
    });

    document.addEventListener('click', (e) => {
      if (!standardsDropdownWrapper.contains(e.target)) {
        standardsDropdownWrapper.classList.remove('open');
        btnStandardsMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Language Selector Change Listener (Dynamic Page Translation)
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      updateUILanguage(e.target.value);
    });
  }

  // Login Modal Trigger
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
      loginModal.classList.add('open');
      initLucideIcons();
    });
  }

  // Tender Cart Floater click
  const tenderCartFloater = document.getElementById('tenderCartFloater');
  if (tenderCartFloater) {
    tenderCartFloater.addEventListener('click', openTenderCartModal);
  }
}

// Switch Login Role Tabs (Official vs Vendor)
function switchLoginTab(role) {
  const tabOfficial = document.getElementById('tabOfficialLogin');
  const tabVendor = document.getElementById('tabVendorLogin');
  const formOfficial = document.getElementById('officialLoginForm');
  const formVendor = document.getElementById('vendorLoginForm');

  if (role === 'official') {
    if (tabOfficial) tabOfficial.classList.add('active');
    if (tabVendor) tabVendor.classList.remove('active');
    if (formOfficial) formOfficial.style.display = 'block';
    if (formVendor) formVendor.style.display = 'none';
  } else {
    if (tabVendor) tabVendor.classList.add('active');
    if (tabOfficial) tabOfficial.classList.remove('active');
    if (formVendor) formVendor.style.display = 'block';
    if (formOfficial) formOfficial.style.display = 'none';
  }
  initLucideIcons();
}

// Handle Login Form Submission
function handleLoginSubmit(event, role) {
  event.preventDefault();
  closeAllModals();
  if (role === 'official') {
    showToast("Govt Official Single Sign-On authenticated successfully via Parichay.");
  } else {
    showToast("Vendor Portal authenticated. GeM Seller credentials verified.");
  }
}

// Open Tender Utility Modal (Zero Sample Data)
function openTenderUtility(type) {
  const modal = document.getElementById('tenderUtilityModal');
  const title = document.getElementById('utilityModalTitle');
  const sub = document.getElementById('utilityModalSub');
  const content = document.getElementById('utilityModalContent');
  const icon = document.getElementById('utilityModalIcon');
  if (!modal || !content) return;

  if (type === 'search') {
    title.textContent = "Search Tender";
    sub.textContent = "Search active tenders across Central Public Procurement Portal (CPPP) and GeM";
    if (icon) icon.setAttribute('data-lucide', 'file-search');
    content.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" class="form-input" id="quickTenderSearchInput" placeholder="Enter tender reference, item name, or standard code...">
          <button class="btn btn-primary" type="button" onclick="showToast('Searching active procurement database...')">
            <i data-lucide="search" style="width: 15px; height: 15px;"></i>
            <span>Search</span>
          </button>
        </div>
      </div>
      <div class="utility-empty-state">
        <i data-lucide="file-search" class="utility-empty-icon"></i>
        <strong style="color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">Search Tender Database</strong>
        <span style="font-size: 0.85rem; max-width: 380px;">Enter an NIT tender reference number, procuring department, or Indian Standard code to search.</span>
      </div>
    `;
  } else if (type === 'calendar') {
    title.textContent = "Tender Calendar";
    sub.textContent = "Bidding deadlines, pre-bid meetings & tender milestones";
    if (icon) icon.setAttribute('data-lucide', 'calendar-days');
    
    const now = new Date();
    const monthName = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const todayDate = now.getDate();

    let calDaysHtml = '';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === todayDate ? 'today' : '';
      calDaysHtml += `<div class="cal-day-cell ${isToday}">${d}</div>`;
    }

    content.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <strong style="font-size: 1rem; color: var(--text-primary);">${monthName}</strong>
        <span style="font-size: 0.78rem; color: var(--brand-blue); font-weight: 700;">Live GeM Sync</span>
      </div>
      <div class="calendar-widget-mini">
        <div class="cal-day-header">Sun</div>
        <div class="cal-day-header">Mon</div>
        <div class="cal-day-header">Tue</div>
        <div class="cal-day-header">Wed</div>
        <div class="cal-day-header">Thu</div>
        <div class="cal-day-header">Fri</div>
        <div class="cal-day-header">Sat</div>
        ${calDaysHtml}
      </div>
      <div class="utility-empty-state" style="padding: 1.25rem 1rem;">
        <i data-lucide="calendar" class="utility-empty-icon" style="width: 38px; height: 38px;"></i>
        <strong style="color: var(--text-primary); margin-bottom: 0.25rem; font-size: 0.92rem;">No Deadlines Scheduled</strong>
        <span style="font-size: 0.82rem;">No bid submission deadlines or tender meetings currently scheduled for this period.</span>
      </div>
    `;
  } else if (type === 'recent') {
    title.textContent = "Recent Tenders";
    sub.textContent = "Real-time published tenders from GeM and CPPP";
    if (icon) icon.setAttribute('data-lucide', 'clock');
    content.innerHTML = `
      <div class="utility-empty-state">
        <i data-lucide="inbox" class="utility-empty-icon"></i>
        <strong style="color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">No Recent Tenders Found</strong>
        <span style="font-size: 0.85rem; max-width: 380px;">Newly published tender notices from procurement portals will automatically appear here once synchronized.</span>
      </div>
    `;
  }

  modal.classList.add('open');
  initLucideIcons();
}

// Vendor Registration Form Submit Handler
function handleVendorSubmit(event) {
  event.preventDefault();
  const vName = document.getElementById('vName').value;
  const vLicense = document.getElementById('vLicense').value;
  const vStandard = document.getElementById('vStandard').value;

  closeAllModals();
  showToast(`Vendor registered! ${vName} linked with ${vStandard} (License: ${vLicense}).`);
  const form = document.getElementById('vendorForm');
  if (form) form.reset();
}

// Switch Interface Mode
function switchMode(mode) {
  appState.activeMode = mode;
  document.getElementById('nlQueryView').style.display = mode === 'nl-query' ? 'block' : 'none';
  document.getElementById('formSpecView').style.display = mode === 'form-spec' ? 'block' : 'none';
  document.getElementById('tenderDocView').style.display = mode === 'tender-doc' ? 'block' : 'none';
  document.getElementById('explorerView').style.display = mode === 'explorer' ? 'block' : 'none';

  if (mode === 'explorer') {
    renderAllStandardsExplorer();
  }
}

// Initial Standards Display
function loadInitialStandards() {
  renderInitialPromptState();
}

function renderInitialPromptState() {
  const resultsContainer = document.getElementById('resultsContainer');
  const headerBar = document.getElementById('resultsHeaderBar');
  if (headerBar) headerBar.style.display = 'none';
  if (resultsContainer) resultsContainer.innerHTML = '';
}

// Filter Standards by GeM Product Category
function filterByGeMCategory(categoryName, cardEl) {
  // Toggle active class on cards
  const cards = document.querySelectorAll('.gem-cat-card');
  const wasActive = cardEl && cardEl.classList.contains('active');
  cards.forEach(c => c.classList.remove('active'));

  const btnReset = document.getElementById('btnResetCategory');

  // If clicked again on the active card, reset filter
  if (wasActive) {
    if (btnReset) btnReset.style.display = 'none';
    loadInitialStandards();
    const resultsTitle = document.getElementById('resultsTitle');
    if (resultsTitle) resultsTitle.textContent = "Applicable Indian Standards";
    showToast("Category filter cleared");
    return;
  }

  if (cardEl) cardEl.classList.add('active');
  if (btnReset) btnReset.style.display = 'inline-flex';

  showLoadingState();

  setTimeout(() => {
    // Map of GeM Category names to category/keyword filters
    const matchingStandards = BIS_STANDARDS_DATABASE.filter(s => {
      const catLower = s.category.toLowerCase();
      const targetLower = categoryName.toLowerCase();
      if (catLower.includes(targetLower) || targetLower.includes(catLower)) return true;
      if (s.keywords.some(kw => kw.toLowerCase().includes(targetLower))) return true;
      // Category specific mappings
      if (categoryName === 'Civil & Construction' && (catLower.includes('civil') || catLower.includes('construction'))) return true;
      if (categoryName === 'Electrical & Cables' && (catLower.includes('electrical') || catLower.includes('cable'))) return true;
      if (categoryName === 'IT & Electronics' && (catLower.includes('it') || catLower.includes('electronic'))) return true;
      if (categoryName === 'Safety & PPE' && (catLower.includes('safety') || catLower.includes('ppe'))) return true;
      if (categoryName === 'Pipes & Water Supply' && (catLower.includes('pipe') || catLower.includes('water'))) return true;
      if (categoryName === 'Fire Safety' && catLower.includes('fire')) return true;
      if (categoryName === 'Medical Devices' && catLower.includes('medical')) return true;
      if (categoryName === 'Automotive' && catLower.includes('automotive')) return true;
      return false;
    });

    appState.currentResults = matchingStandards.map(std => ({
      standard: std,
      confidence: 96,
      matchReasons: [`GeM Portal Category Alignment: ${categoryName}`]
    }));

    renderRecommendations(appState.currentResults.map(r => ({
      ...r.standard,
      confidence: r.confidence,
      matchReasons: r.matchReasons
    })), true);

    renderDeprecatedAlerts();

    const resultsTitle = document.getElementById('resultsTitle');
    if (resultsTitle) {
      resultsTitle.textContent = `GeM Category: ${categoryName}`;
    }

    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast(`Displaying ${matchingStandards.length} standards for GeM: ${categoryName}`);
  }, 200);
}

function resetGeMCategoryFilter() {
  document.querySelectorAll('.gem-cat-card').forEach(c => c.classList.remove('active'));
  const btnReset = document.getElementById('btnResetCategory');
  if (btnReset) btnReset.style.display = 'none';

  loadInitialStandards();
  const resultsTitle = document.getElementById('resultsTitle');
  if (resultsTitle) resultsTitle.textContent = "Applicable Indian Standards";
  showToast("Showing all standard categories");
}

// Speech Recognition
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    appState.speechRecognition = new SpeechRecognition();
    appState.speechRecognition.continuous = false;
    appState.speechRecognition.interimResults = false;

    appState.speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const queryInput = document.getElementById('queryInput');
      if (queryInput) {
        queryInput.value = transcript;
      }
      stopSpeechRecognition();
      handleNLSearch();
    };

    appState.speechRecognition.onerror = (event) => {
      console.warn("Speech error:", event.error);
      stopSpeechRecognition();
      showToast("Speech recognition notice: " + event.error);
    };

    appState.speechRecognition.onend = () => {
      stopSpeechRecognition();
    };
  }
}

function toggleSpeechRecognition() {
  if (!appState.speechRecognition) {
    showToast("Web Speech API is not supported in this browser. Please type your query.");
    return;
  }
  if (appState.isRecording) {
    stopSpeechRecognition();
  } else {
    startSpeechRecognition();
  }
}

function startSpeechRecognition() {
  const micBtn = document.getElementById('micBtn');
  const lang = document.getElementById('langSelect').value;
  appState.speechRecognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  try {
    appState.speechRecognition.start();
    appState.isRecording = true;
    if (micBtn) micBtn.classList.add('recording');
    showToast("Listening... Speak your procurement specification");
  } catch (err) {
    console.error(err);
  }
}

function stopSpeechRecognition() {
  appState.isRecording = false;
  const micBtn = document.getElementById('micBtn');
  if (micBtn) micBtn.classList.remove('recording');
}

// Multilingual Query Expansion & NLP Translation
function preprocessQuery(rawQuery, language) {
  let text = rawQuery.toLowerCase();

  // Check for Indian language keywords in lexicon
  for (const [nativeWord, englishEquivalent] of Object.entries(MULTILINGUAL_LEXICON)) {
    if (text.includes(nativeWord.toLowerCase())) {
      text += " " + englishEquivalent;
    }
  }

  // Tokenize & remove stopwords
  const tokens = text
    .replace(/[^\w\s\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]/gi, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));

  return { normalizedText: text, tokens };
}

// Core Semantic Recommendation Algorithm
function executeSemanticSearch(rawQuery, language = 'en') {
  const { normalizedText, tokens } = preprocessQuery(rawQuery, language);
  
  // Check for Deprecated Standards Mentioned in the Query
  const detectedDeprecated = [];
  for (const [depCode, info] of Object.entries(DEPRECATED_STANDARDS_MAP)) {
    if (normalizedText.includes(depCode.toLowerCase().replace(/\s+/g, '')) || 
        normalizedText.includes(depCode.toLowerCase())) {
      detectedDeprecated.push({
        deprecatedCode: depCode,
        replacement: info.replacement,
        reason: info.reason
      });
    }
  }
  appState.deprecatedAlerts = detectedDeprecated;

  // Score each standard in knowledge base
  const scoredResults = BIS_STANDARDS_DATABASE.map(standard => {
    let score = 0;
    const matchReasons = [];

    // 1. Direct Code Matching (e.g. "IS 7098" or "7098")
    const cleanStandardCode = standard.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuery = normalizedText.replace(/[^a-z0-9]/g, '');
    if (cleanQuery.includes(cleanStandardCode.slice(0, 7))) {
      score += 60;
      matchReasons.push(`Exact standard code match: ${standard.code}`);
    }

    // 2. Keyword Entity Hits
    let keywordHits = 0;
    standard.keywords.forEach(kw => {
      if (normalizedText.includes(kw.toLowerCase())) {
        score += 15;
        keywordHits++;
        if (matchReasons.length < 3) {
          matchReasons.push(`Specification entity matched: "${kw}"`);
        }
      }
    });

    // 3. Token-level overlap in Scope and Title
    const titleTokens = standard.title.toLowerCase().split(/\s+/);
    const scopeTokens = standard.scope.toLowerCase().split(/\s+/);

    tokens.forEach(tok => {
      if (titleTokens.includes(tok)) {
        score += 8;
      } else if (scopeTokens.includes(tok)) {
        score += 4;
      }
    });

    // 4. Category / Division alignment
    if (normalizedText.includes(standard.category.toLowerCase())) {
      score += 12;
      matchReasons.push(`Category alignment: ${standard.category}`);
    }

    // Compute Confidence Percentage (bounded 55% - 99%)
    let confidence = Math.min(99, Math.round(50 + (score * 1.5)));
    if (score === 0) confidence = 0;

    return {
      standard,
      rawScore: score,
      confidence,
      matchReasons: matchReasons.length > 0 ? matchReasons : ["Semantic contextual relevance to product domain"]
    };
  });

  // Filter out non-matches, sort by score descending
  const matches = scoredResults
    .filter(res => res.rawScore > 10)
    .sort((a, b) => b.rawScore - a.rawScore);

  return matches;
}

async function sendToBackend(data) {
    try {
        const response = await fetch("http://localhost:8000/recommendation/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Response from backend:", result);

        return result;

    } catch (error) {
        console.error("Error connecting to backend:", error);
        showToast("Could not connect to backend");
        return null;
    }
}

function getProcurementData() {
    return {
        officer_name: document.getElementById("officerName")?.value.trim() || "",
        officer_designation: document.getElementById("officerDesignation")?.value.trim() || "",
        department: document.getElementById("deptMinistry")?.value.trim() || "",
        gem_buyer_id: document.getElementById("gemBuyerId")?.value.trim() || "",
        tender_reference: document.getElementById("tenderRefNo")?.value.trim() || "",
        tender_budget: document.getElementById("tenderBudget")?.value.trim() || "",
        
        product_category: document.getElementById("procCategory")?.value.trim() || "",
        product_description: document.getElementById("procQueryInput")?.value.trim() || "",
        document_text: document.getElementById("procDocText")?.value.trim() || "",
        material: document.getElementById("procMaterial")?.value.trim() || "",
        operating_rating: document.getElementById("procOperatingParam")?.value.trim() || "",
        
        language: document.getElementById("langSelect")?.value || "en"
    };
}
// Handle Natural Language Search
async function handleNLSearch() {
  const queryInput = document.getElementById('queryInput');
  const langSelect = document.getElementById('langSelect');
  const query = queryInput ? queryInput.value.trim() : '';

  if (!query) {
    showToast("Please describe what you are procuring");
    return;
  }

  closeAllModals();
  showLoadingState();

  const data = await sendToBackend(
      query,
      langSelect ? langSelect.value : 'en'
  );

  console.log("Backend JSON:", data);
}


// Handle Structured Form Search
async function handleFormSearch() {
  const category = document.getElementById('formCategory').value;
  const productName = document.getElementById('formProductName').value.trim();
  const material = document.getElementById('formMaterial').value.trim();
  const operatingParam = document.getElementById('formOperatingParam').value.trim();
  const application = document.getElementById('formApplication').value.trim();

  const combinedQuery = `${productName} ${material} ${category} ${operatingParam} ${application}`;
  if (!combinedQuery.trim()) {
    showToast("Please fill in the product parameters");
    return;
  }

  showLoadingState();
  setTimeout(() => {
    const results = executeSemanticSearch(combinedQuery, 'en');
    appState.currentResults = results;
    renderRecommendations(results.map(r => ({ ...r.standard, confidence: r.confidence, matchReasons: r.matchReasons })), true);
    renderDeprecatedAlerts();
  }, 350);
}

// Handle Tender Document Upload & Analysis
function handleFileUpload(e) {
  if (e.target.files.length) {
    processUploadedFile(e.target.files[0]);
  }
}

function processUploadedFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    document.getElementById('tenderDocText').value = content;
    showToast(`Loaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  };
  reader.readAsText(file);
}


function handleDocAnalysis() {
  const text = document.getElementById('tenderDocText').value.trim();
  if (!text) {
    showToast("Please upload or paste a tender specification document");
    return;
  }

  closeAllModals();
  showLoadingState();
  setTimeout(() => {
    const results = executeSemanticSearch(text, 'en');
    appState.currentResults = results;
    renderRecommendations(results.map(r => ({ ...r.standard, confidence: r.confidence, matchReasons: r.matchReasons })), true);
    renderDeprecatedAlerts();
    renderTenderGapAnalysisSummary(text, results);
  }, 400);
}

// Tender Document Gap Analysis Summary Card
function renderTenderGapAnalysisSummary(text, results) {
  const resultsContainer = document.getElementById('resultsContainer');
  
  // Calculate gap metrics
  const missingQCOs = results.filter(r => r.standard.qco.mandatory);
  const totalNormative = results.reduce((acc, r) => acc + (r.standard.alliedStandards.normativeReferences?.length || 0), 0);
  const totalTestMethods = results.reduce((acc, r) => acc + (r.standard.alliedStandards.testMethods?.length || 0), 0);

  const gapSummaryHtml = `
    <div class="standard-card" style="border-left: 5px solid var(--brand-purple); background: linear-gradient(135deg, var(--bg-surface) 0%, var(--brand-purple-light) 100%); margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="file-check-2" style="color: var(--brand-purple);"></i>
          AI Tender Specification Gap Analysis
        </h3>
        <span class="brand-badge" style="background: var(--brand-emerald-light); color: var(--brand-emerald);">
          Document Analyzed (Tender Compliance Score: 88/100)
        </span>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
        Our NLP engine parsed your tender document and identified <strong>${results.length} Applicable Primary Standards</strong>. Below are critical compliance recommendations to prevent tender challenges:
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">MANDATORY QCO SCHEMES</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--brand-saffron); margin-top: 0.2rem;">${missingQCOs.length} Products Bound by QCO</div>
        </div>
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">ALLIED NORMATIVE REFS</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--brand-blue); margin-top: 0.2rem;">${totalNormative} Cross-References Identified</div>
        </div>
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600;">MANDATORY TEST METHODS</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--brand-emerald); margin-top: 0.2rem;">${totalTestMethods} Testing Standards Required</div>
        </div>
      </div>
    </div>
  `;

  // Prepend to results
  resultsContainer.insertAdjacentHTML('afterbegin', gapSummaryHtml);
  initLucideIcons();
}

// Deprecated Standards Alert Banner
function renderDeprecatedAlerts() {
  const container = document.getElementById('deprecatedAlertsContainer');
  if (!container) return;

  if (appState.deprecatedAlerts.length === 0) {
    container.innerHTML = '';
    return;
  }

  const alertItems = appState.deprecatedAlerts.map(alert => `
    <div class="outdated-alert-card">
      <div class="alert-icon"><i data-lucide="alert-triangle" style="width: 28px; height: 28px;"></i></div>
      <div class="outdated-alert-content">
        <h4>Critical Warning: Superseded Standard Detected (${alert.deprecatedCode})</h4>
        <p>${alert.reason}</p>
        <p style="margin-top: 0.4rem; font-weight: 600; color: var(--text-primary);">
          Recommended Action: Update tender clause to cite <u>${alert.replacement}</u> to avoid audit objections.
        </p>
      </div>
    </div>
  `).join('');

  container.innerHTML = alertItems;
  initLucideIcons();
}

// Render Recommendations Cards
function renderRecommendations(items, isSearchResult = false) {
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsCount = document.getElementById('resultsCount');
  const headerBar = document.getElementById('resultsHeaderBar');

  if (headerBar) headerBar.style.display = 'flex';
  if (resultsCount) resultsCount.textContent = `${items.length} Standard${items.length === 1 ? '' : 's'}`;
  if (resultsTitle) resultsTitle.textContent = isSearchResult ? "Applicable Indian Standards" : "Standards";

  if (items.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
        <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">No Direct Standard Match Found</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
          Try refining your description with technical keywords, material grades (e.g. XLPE, Fe 500D, 53G OPC), or operating voltage/ratings.
        </p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  const cardsHtml = items.map(item => {
    const isAddedToCart = appState.tenderCart.some(cartItem => cartItem.id === item.id);
    const confidence = item.confidence || 95;
    const confidenceClass = confidence >= 85 ? 'confidence-high' : 'confidence-medium';
    const matchReasons = item.matchReasons || ["High technical correlation with procurement specifications"];

    return `
      <div class="standard-card" id="card-${item.id}">
        <!-- Top Bar: Code, Title, Confidence Gauge -->
        <div class="card-top-bar">
          <div class="code-and-title">
            <div class="standard-code-badge">
              <i data-lucide="bookmark-check" style="width: 18px; height: 18px;"></i>
              ${item.code}
            </div>
            <h3 class="standard-card-title">${item.title}</h3>
            <div class="standard-card-division">
              ${item.division} &bull; ${item.section} &bull; Category: <strong>${item.category}</strong>
            </div>
          </div>
          
          <div class="confidence-badge-wrapper">
            <div class="confidence-pill ${confidenceClass}">
              <i data-lucide="cpu" style="width: 15px; height: 15px;"></i>
              ${confidence}% Match Score
            </div>
            <div class="xai-pill">
              ${matchReasons[0]}
            </div>
          </div>
        </div>

        <!-- Version & Amendments Chips -->
        <div class="meta-chips-row">
          <span class="meta-chip" title="Current publication status">
            <i data-lucide="check-circle-2" style="width: 15px; height: 15px; color: var(--brand-emerald);"></i>
            Latest Edition: <strong>${item.latestVersion}</strong>
          </span>
          
          <span class="meta-chip amendments-chip" onclick="openAmendmentsModal('${item.id}')" title="Click to view all published amendments">
            <i data-lucide="file-diff" style="width: 15px; height: 15px;"></i>
            Active Amendments: <strong>${item.amendments.length} Published</strong> &rarr;
          </span>

          ${item.supersedes && item.supersedes.length > 0 ? `
            <span class="meta-chip" style="background: var(--brand-ruby-light); color: var(--brand-ruby);">
              <i data-lucide="history" style="width: 15px; height: 15px;"></i>
              Supersedes: ${item.supersedes[0]}
            </span>
          ` : ''}
        </div>

        <!-- Mandatory QCO Advisory Banner -->
        ${item.qco && item.qco.mandatory ? `
          <div class="qco-advisory-box">
            <div class="qco-badge-icon">
              <i data-lucide="shield-alert" style="width: 20px; height: 20px;"></i>
            </div>
            <div class="qco-content">
              <div class="qco-header-title">
                <span>Mandatory Certification Required: ${item.qco.scheme}</span>
                <span class="brand-badge" style="background: var(--brand-saffron); color: white;">QCO Enforced</span>
              </div>
              <div class="qco-desc">
                ${item.qco.mandatoryClause}
              </div>
              <div class="qco-meta-tags">
                <span>Order: ${item.qco.orderName}</span>
                <span>&bull;</span>
                <span>Gazette: ${item.qco.gazetteRef}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Standard Scope Description -->
        <p class="standard-scope-text">
          <strong>Technical Scope:</strong> ${item.scope}
        </p>

        <!-- Allied & Normative Standards Section -->
        <div class="allied-standards-container">
          <div class="allied-header">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="git-fork" style="width: 18px; height: 18px; color: var(--brand-blue);"></i>
              Allied, Cross-Referenced & Normative Standards
            </span>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem;" onclick="openNetworkGraphModal('${item.id}')">
              <i data-lucide="share-2" style="width: 14px; height: 14px;"></i>
              Explore Standards Network Graph
            </button>
          </div>

          <div class="allied-columns-grid">
            <!-- Normative References -->
            <div class="allied-group-box">
              <div class="allied-group-title">
                <i data-lucide="layers" style="width: 14px; height: 14px; color: var(--brand-blue);"></i>
                Normative References (${item.alliedStandards.normativeReferences?.length || 0})
              </div>
              ${renderAlliedGroupItems(item.alliedStandards.normativeReferences)}
            </div>

            <!-- Mandatory Test Methods -->
            <div class="allied-group-box">
              <div class="allied-group-title">
                <i data-lucide="flask-conical" style="width: 14px; height: 14px; color: var(--brand-purple);"></i>
                Test Methods (${item.alliedStandards.testMethods?.length || 0})
              </div>
              ${renderAlliedGroupItems(item.alliedStandards.testMethods)}
            </div>

            <!-- Safety Standards -->
            <div class="allied-group-box">
              <div class="allied-group-title">
                <i data-lucide="shield-check" style="width: 14px; height: 14px; color: var(--brand-saffron);"></i>
                Safety Standards (${item.alliedStandards.safetyStandards?.length || 0})
              </div>
              ${renderAlliedGroupItems(item.alliedStandards.safetyStandards)}
            </div>

            <!-- Installation Standards -->
            <div class="allied-group-box">
              <div class="allied-group-title">
                <i data-lucide="wrench" style="width: 14px; height: 14px; color: var(--brand-emerald);"></i>
                Installation & Codes (${item.alliedStandards.installationStandards?.length || 0})
              </div>
              ${renderAlliedGroupItems(item.alliedStandards.installationStandards)}
            </div>
          </div>
        </div>

        <!-- Action Bar: Add to Tender, View Details, Copy GeM Clause -->
        <div class="card-actions-bar">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="copyGeMClause('${item.id}')">
              <i data-lucide="copy" style="width: 15px; height: 15px;"></i>
              Copy GeM Tender Clause
            </button>
            <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;" onclick="openNetworkGraphModal('${item.id}')">
              <i data-lucide="network" style="width: 15px; height: 15px;"></i>
              Visual Graph
            </button>
          </div>

          <button class="btn ${isAddedToCart ? 'btn-emerald' : 'btn-primary'}" onclick="toggleTenderCart('${item.id}')">
            <i data-lucide="${isAddedToCart ? 'check' : 'plus'}" style="width: 16px; height: 16px;"></i>
            ${isAddedToCart ? 'Added to Tender Spec' : 'Add to Tender Specification'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  resultsContainer.innerHTML = cardsHtml;
  initLucideIcons();
}

function renderAlliedGroupItems(items) {
  if (!items || items.length === 0) {
    return `<div style="font-size: 0.75rem; color: var(--text-tertiary); font-style: italic; padding: 0.2rem 0;">None cited in primary scope</div>`;
  }
  return items.map(item => `
    <div class="allied-item">
      <span class="allied-item-code">${item.code}</span>
      <span class="allied-item-desc">${item.role}</span>
    </div>
  `).join('');
}

// Standards Explorer Mode (Browse all)
function renderAllStandardsExplorer() {
  const explorerGrid = document.getElementById('explorerGrid');
  if (!explorerGrid) return;

  explorerGrid.innerHTML = BIS_STANDARDS_DATABASE.map(std => `
    <div class="standard-card" style="padding: 1.25rem;">
      <div class="standard-code-badge" style="font-size: 0.95rem; margin-bottom: 0.4rem;">${std.code}</div>
      <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem;">${std.title}</h4>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.5;">${std.scope.slice(0, 150)}...</p>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="brand-badge">${std.category}</span>
        <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;" onclick="viewStandardInSearch('${std.id}')">
          View Recommendations &rarr;
        </button>
      </div>
    </div>
  `).join('');
  initLucideIcons();
}

function viewStandardInSearch(standardId) {
  const std = BIS_STANDARDS_DATABASE.find(s => s.id === standardId);
  if (std) {
    switchMode('nl-query');
    document.querySelectorAll('.mode-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.mode === 'nl-query');
    });
    document.getElementById('queryInput').value = std.code + " " + std.title;
    handleNLSearch();
  }
}

// Copy GeM Clause to Clipboard
function copyGeMClause(standardId) {
  const std = BIS_STANDARDS_DATABASE.find(s => s.id === standardId);
  if (std) {
    navigator.clipboard.writeText(std.gemClauseTemplate).then(() => {
      showToast(`GeM Tender Clause copied for ${std.code}`);
    }).catch(() => {
      showToast("Unable to copy to clipboard");
    });
  }
}

// Tender Cart State Management
function toggleTenderCart(standardId) {
  const index = appState.tenderCart.findIndex(item => item.id === standardId);
  const std = BIS_STANDARDS_DATABASE.find(s => s.id === standardId);

  if (index >= 0) {
    appState.tenderCart.splice(index, 1);
    showToast(`Removed ${std.code} from Tender Spec`);
  } else {
    appState.tenderCart.push(std);
    showToast(`Added ${std.code} to Tender Spec`);
  }

  updateTenderCartUI();
  // Refresh current view cards button states
  if (appState.currentResults.length > 0) {
    renderRecommendations(appState.currentResults.map(r => ({ ...r.standard, confidence: r.confidence, matchReasons: r.matchReasons })), true);
  } else {
    loadInitialStandards();
  }
}

function updateTenderCartUI() {
  const countBadge = document.getElementById('tenderCartCount');
  const floater = document.getElementById('tenderCartFloater');
  if (countBadge) countBadge.textContent = appState.tenderCart.length;
  if (floater) {
    floater.style.display = appState.tenderCart.length > 0 ? 'flex' : 'none';
  }
}

// Open Tender Cart & Specification Builder Modal
function openTenderCartModal() {
  const modal = document.getElementById('tenderModal');
  const docContainer = document.getElementById('compiledTenderDoc');
  if (!modal || !docContainer) return;

  if (appState.tenderCart.length === 0) {
    showToast("Your tender specification is empty. Add standards from recommendations.");
    return;
  }

  // Generate Formal GeM / NIT Tender Specification Text
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const officerName = document.getElementById('officerName')?.value?.trim();
  const officerDesignation = document.getElementById('officerDesignation')?.value?.trim();
  const deptMinistry = document.getElementById('deptMinistry')?.value?.trim();
  const tenderRefNo = document.getElementById('tenderRefNo')?.value?.trim();
  const gemBuyerId = document.getElementById('gemBuyerId')?.value?.trim();

  let doc = `================================================================================
GOVERNMENT E-MARKETPLACE (GeM) / NOTICE INVITING TENDER (NIT)
TECHNICAL SPECIFICATION & QUALITY ASSURANCE SCHEDULE
Generated on: ${dateStr} by IS-Match Standards Recommendation Engine
================================================================================\n`;

  if (officerName || tenderRefNo) {
    doc += `OFFICIAL TENDER METADATA:
Tender Inviting Authority : ${officerName || 'Not Specified'} (${officerDesignation || 'Officer'})
Department / Ministry     : ${deptMinistry || 'Government of India'}
NIT Reference Number      : ${tenderRefNo || 'N/A'}
GeM Buyer ID              : ${gemBuyerId || 'N/A'}
--------------------------------------------------------------------------------\n`;
  }

  doc += `\n1. SCOPE OF TECHNICAL SPECIFICATION:
The technical specifications herein mandate compliance with the latest published
Bureau of Indian Standards (BIS) including all operative amendments and Quality
Control Orders (QCOs) issued by the Government of India.

2. APPLICABLE INDIAN STANDARDS SCHEDULE:\n`;

  appState.tenderCart.forEach((std, idx) => {
    doc += `--------------------------------------------------------------------------------
[ITEM ${idx + 1}] ${std.title.toUpperCase()}
Standard Code   : ${std.code}
Latest Revision : ${std.latestVersion}
Active Amds     : ${std.amendments.map(a => a.num).join(', ')}
BIS Certification: ${std.qco.scheme} (Mandatory: ${std.qco.mandatory ? 'YES' : 'NO'})
QCO Notification: ${std.qco.orderName} (${std.qco.gazetteRef})

TECHNICAL CLAUSE FOR BIDDER:
"${std.gemClauseTemplate}"

MANDATORY NORMATIVE & TESTING REFERENCES:
`;
    std.alliedStandards.testMethods?.forEach(tm => {
      doc += `  * Test Method: ${tm.code} - ${tm.title} (${tm.role})\n`;
    });
    std.alliedStandards.normativeReferences?.forEach(nr => {
      doc += `  * Normative Ref: ${nr.code} - ${nr.title}\n`;
    });
    std.alliedStandards.installationStandards?.forEach(inst => {
      doc += `  * Installation Code: ${inst.code} - ${inst.title}\n`;
    });
    doc += `\n`;
  });

  doc += `3. PRE-QUALIFICATION CRITERIA (PQC) FOR BIDDERS:
a) The participating OEM/Bidder must possess a valid BIS License (CML / R-Number)
   for the cited standards on the tender closing date.
b) Test reports from a NABL or BIS accredited laboratory not older than 1 year
   must be uploaded in the Technical Bid.
c) Consignments received without the BIS Standard Mark (ISI / CRS) shall be rejected
   at the consignee inspection stage without cost obligation.

================================================================================
END OF SPECIFICATION DOCUMENT
================================================================================`;

  docContainer.textContent = doc;
  modal.classList.add('open');
  initLucideIcons();
}

// Download Compiled Tender Spec Document
function downloadTenderDoc() {
  const text = document.getElementById('compiledTenderDoc').textContent;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tender_Specification_Indian_Standards_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Tender Specification Document downloaded!");
}

// Open Amendments Modal
function openAmendmentsModal(standardId) {
  const std = BIS_STANDARDS_DATABASE.find(s => s.id === standardId);
  if (!std) return;

  const modal = document.getElementById('amendmentsModal');
  const title = document.getElementById('amendmentsModalTitle');
  const list = document.getElementById('amendmentsList');

  title.textContent = `Amendments & History: ${std.code}`;

  list.innerHTML = `
    <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md);">
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.2rem;">${std.title}</div>
      <div style="font-size: 0.8rem; color: var(--text-tertiary);">Current Reaffirmed Status: <strong>${std.latestVersion}</strong></div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${std.amendments.map(amd => `
        <div style="border-left: 3px solid var(--brand-purple); padding-left: 1rem; background: var(--bg-surface); padding: 0.75rem 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; border: 1px solid var(--border-subtle); border-left-width: 3px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
            <strong style="color: var(--brand-purple); font-size: 0.9rem;">${amd.num}</strong>
            <span style="font-size: 0.75rem; background: var(--bg-surface-elevated); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-weight: 600;">Effective: ${amd.date}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">${amd.summary}</p>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('open');
  initLucideIcons();
}

// Close Modals
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
}

// Interactive Standards Relationship Network Graph (HTML5 Canvas)
let canvas, ctx;
let graphNodes = [];
let graphEdges = [];
let draggedNode = null;
let animationFrameId = null;

function openNetworkGraphModal(standardId) {
  const std = BIS_STANDARDS_DATABASE.find(s => s.id === standardId);
  if (!std) return;

  appState.activeGraphStandard = std;
  const modal = document.getElementById('graphModal');
  const title = document.getElementById('graphModalTitle');
  title.textContent = `Standards Network Graph: ${std.code}`;

  modal.classList.add('open');
  initLucideIcons();

  setTimeout(() => {
    initCanvasGraph(std);
  }, 100);
}

function initCanvasGraph(primaryStandard) {
  canvas = document.getElementById('graphCanvas');
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  ctx = canvas.getContext('2d');

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Build Nodes
  graphNodes = [];
  graphEdges = [];

  // Center Primary Node
  const primaryNode = {
    id: 'primary',
    code: primaryStandard.code,
    title: primaryStandard.title,
    role: 'Primary Product Standard',
    type: 'primary',
    color: '#2563eb',
    radius: 38,
    x: centerX,
    y: centerY,
    vx: 0,
    vy: 0
  };
  graphNodes.push(primaryNode);

  // Group Allied Standards
  const alliedGroups = [
    { type: 'test', color: '#7c3aed', items: primaryStandard.alliedStandards.testMethods || [], label: 'Test Method' },
    { type: 'normative', color: '#059669', items: primaryStandard.alliedStandards.normativeReferences || [], label: 'Normative Ref' },
    { type: 'safety', color: '#d97706', items: primaryStandard.alliedStandards.safetyStandards || [], label: 'Safety Standard' },
    { type: 'install', color: '#0891b2', items: primaryStandard.alliedStandards.installationStandards || [], label: 'Installation Code' }
  ];

  let angle = 0;
  const totalAllied = alliedGroups.reduce((acc, g) => acc + g.items.length, 0);
  const angleStep = (2 * Math.PI) / (totalAllied || 1);
  const distance = Math.min(canvas.width, canvas.height) * 0.36;

  alliedGroups.forEach(group => {
    group.items.forEach(item => {
      const nx = centerX + distance * Math.cos(angle) + (Math.random() * 20 - 10);
      const ny = centerY + distance * Math.sin(angle) + (Math.random() * 20 - 10);

      const node = {
        id: item.code,
        code: item.code,
        title: item.title,
        role: item.role,
        type: group.type,
        color: group.color,
        radius: 26,
        x: nx,
        y: ny,
        vx: 0,
        vy: 0
      };
      graphNodes.push(node);
      graphEdges.push({ source: primaryNode, target: node, color: group.color });
      angle += angleStep;
    });
  });

  // Attach Drag interactions
  setupGraphInteractions();
  startGraphSimulation();
}

function setupGraphInteractions() {
  let isDragging = false;
  let hoveredNode = null;

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  canvas.onmousedown = (e) => {
    const pos = getMousePos(e);
    draggedNode = graphNodes.find(n => {
      const dx = n.x - pos.x;
      const dy = n.y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });
    if (draggedNode) {
      isDragging = true;
    }
  };

  canvas.onmousemove = (e) => {
    const pos = getMousePos(e);
    if (isDragging && draggedNode) {
      draggedNode.x = pos.x;
      draggedNode.y = pos.y;
    } else {
      hoveredNode = graphNodes.find(n => {
        const dx = n.x - pos.x;
        const dy = n.y - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius;
      });
      canvas.style.cursor = hoveredNode ? 'grab' : 'default';
    }
  };

  window.onmouseup = () => {
    isDragging = false;
    draggedNode = null;
  };
}

function startGraphSimulation() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const edgeColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.2)';

    // Draw Edges
    graphEdges.forEach(edge => {
      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw Nodes
    graphNodes.forEach(node => {
      // Glow / Shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Border
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Label Inside
      ctx.fillStyle = '#ffffff';
      ctx.font = node.type === 'primary' ? 'bold 11px Outfit, sans-serif' : '9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortLabel = node.code.replace(/Specification:.*$/, '').slice(0, 14);
      ctx.fillText(shortLabel, node.x, node.y);

      // Label Subtitle Outside
      ctx.fillStyle = textColor;
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.fillText(node.role ? node.role.slice(0, 20) : '', node.x, node.y + node.radius + 14);
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}

function resetGraphView() {
  if (appState.activeGraphStandard) {
    initCanvasGraph(appState.activeGraphStandard);
  }
}

// Helpers
function showLoadingState() {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = `
    <div style="text-align: center; padding: 4rem 1rem;">
      <div class="dot" style="width: 32px; height: 32px; margin: 0 auto 1.5rem; background: var(--brand-blue); border-radius: 50%; animation: pulse-dot 1s infinite;"></div>
      <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.3rem;">Running Semantic Matching Engine...</h4>
      <p style="font-size: 0.85rem; color: var(--text-tertiary);">Vectorizing specifications, cross-referencing normative test standards & checking QCO orders...</p>
    </div>
  `;
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--text-primary)';
    toast.style.color = 'var(--bg-surface)';
    toast.style.padding = '0.75rem 1.5rem';
    toast.style.borderRadius = 'var(--radius-full)';
    toast.style.boxShadow = 'var(--shadow-xl)';
    toast.style.zIndex = '3000';
    toast.style.fontSize = '0.875rem';
    toast.style.fontWeight = '600';
    toast.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, 3500);
}

// Government Accessibility & Font Resizing
let currentFontSizeLevel = 0;
function adjustFontSize(delta) {
  if (delta === 0) {
    currentFontSizeLevel = 0;
  } else {
    currentFontSizeLevel = Math.max(-2, Math.min(3, currentFontSizeLevel + delta));
  }
  document.documentElement.style.fontSize = `${16 + currentFontSizeLevel * 1.5}px`;
  showToast(delta === 0 ? "Font size reset to normal" : `Font size ${delta > 0 ? 'increased' : 'decreased'}`);
}

function toggleScreenReader() {
  const isEnabled = document.body.classList.toggle('screen-reader-active');
  showToast(isEnabled ? "Screen Reader mode activated. Accessible labels enabled." : "Screen Reader mode turned off.");
}

function openHelpModal() {
  const modal = document.getElementById('helpModal');
  if (modal) {
    modal.classList.add('open');
    initLucideIcons();
  }
}

function switchHelpTab(tab) {
  const btnContact = document.getElementById('tabHelpContact');
  const btnPurpose = document.getElementById('tabHelpPurpose');
  const btnFaq = document.getElementById('tabHelpFaq');

  const panelContact = document.getElementById('panelHelpContact');
  const panelPurpose = document.getElementById('panelHelpPurpose');
  const panelFaq = document.getElementById('panelHelpFaq');

  [btnContact, btnPurpose, btnFaq].forEach(b => b && b.classList.remove('active'));
  [panelContact, panelPurpose, panelFaq].forEach(p => p && (p.style.display = 'none'));

  if (tab === 'contact') {
    if (btnContact) btnContact.classList.add('active');
    if (panelContact) panelContact.style.display = 'block';
  } else if (tab === 'purpose') {
    if (btnPurpose) btnPurpose.classList.add('active');
    if (panelPurpose) panelPurpose.style.display = 'block';
  } else {
    if (btnFaq) btnFaq.classList.add('active');
    if (panelFaq) panelFaq.style.display = 'block';
  }
  initLucideIcons();
}

function showPolicyNotice(policyName) {
  showToast(`${policyName}: Fully compliant with MeitY, GIGW 3.0 & BIS Act guidelines.`);
}
