Student Finance Tracker 

A lightweight, offline-first finance tracker built for students to manage campus spending. 

 Chosen Theme 
Student Finance Tracker — Track daily expenses across categories like Food, Books, Transport,  Entertainment, Fees, and more. 

Live Demo 
 [https://github.com/MAcDen34/-Student-Finance-Tracker_summative-LAb.git] 

Features 
• Add/Edit/Delete Transactions — Full CRUD with inline editing support and confirmation dialogs  for deletes 
• Regex-Powered Search — Type any regex pattern to search across descriptions, categories,  dates, and amounts. Toggle case sensitivity. Invalid patterns are caught gracefully. 
• Multi-Column Sorting — Sort by date, description (A–Z / Z–A), or amount (high/low). Click table  headers or use the dropdown. 
• Dashboard Stats — Total records, total spent, top category, and average transaction at a glance • 7-Day Trend Chart — Pure CSS/JS bar chart showing your spending over the last week • Category Breakdown — Visual bars showing how much you spend in each category 
• Budget Cap System — Set a monthly limit in Settings. The progress bar changes color (green →  yellow → red) and ARIA live regions announce when you're near or over budget. 
• Multi-Currency Support — Base currency (USD, EUR, RWF) with manual exchange rates.  Converted totals shown in Settings. 
• Import/Export — Export records as JSON or CSV. Import JSON with full structural validation. 
• Editable Categories — Default set (Food, Books, Transport, Entertainment, Fees, Other) plus  add/remove custom categories 
• Dark/Light Theme — Toggle persisted in localStorage 
• Fully Accessible — Semantic HTML, ARIA landmarks, keyboard navigation, screen reader  announcements, visible focus styles 
• Mobile-First Responsive — Card layout on mobile, table on desktop. Three breakpoints: 360px,  768px, 1024px. 

Regex Catalog
Pattern Purpose Example Match /^\S(?:.*\S)?$/ No leading/trailing spaces "Lunch" " Lunch " /^(0|[1-9]\d*)(\.\d{1,2})?$/ Valid amount (up to 2 decimals) "12.50" "12.999" 
/^\d{4}-(0[1-9]|1[0-2])-(0[1- 
9]|[12]\d|3[01])$/ Date YYYY-MM-DD "2025-02-15" "15- 02-2025" 
/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ Category (letters, spaces, hyphens) "Self-Care"  "Food123" 

/\b(\w+)\s+\1\b/i Advanced: Duplicate consecutive  words (back-reference) 
/(?=.*[A-Z])(?=.*\d).{6,}/ Advanced: Lookahead — 1+  uppercase, 1+ digit, 6+ chars 
Search Pattern Examples 
• \.\d{2}\b — Find amounts with cents 
• (coffee|tea) — Find beverage purchases 
• \b(\w+)\s+\1\b — Find duplicate words in descriptions • ^Food$ — Exact category match 
• \b[1-9]\d{2,} — Amounts of 100 or more 

Keyboard Map 
Key Action 
Tab / Shift+Tab Navigate through interactive elements Enter Activate buttons and links 
Escape Close modal / mobile menu / cancel edit 
 "the the" "then  the" 
 "Hello1World"  "alllowercase" 

1 – 5 Quick-navigate sections (Dashboard, Records, Add, Settings, About) Number shortcuts only work when not focused on a text input. 

Accessibility Notes 
• Semantic landmarks: <header>, <nav>, <main>, <section>, <footer> throughout • Headings: Proper h1 → h2 → h3 hierarchy within each section • Skip link: "Skip to main content" link visible on Tab focus
• Labels: Every <input> and <select> has an associated <label> (visible or .sr-only) • Focus styles: Visible 3px outline on :focus-visible for all interactive elements 
• ARIA live regions: role="status" (polite) for success messages, role="alert" (assertive) for budget  exceeded warnings 
• Error announcements: Form errors use role="alert" and aria-describedby linking • Modal: Proper role="dialog", aria-labelledby, aria-describedby 
• Mobile menu: aria-expanded and aria-controls on hamburger button 


File Structure 
├── index.html # Main app page 
├── tests.html # Validation test assertions 
├── seed.json # 12 sample records for testing 
├── README.md # This file 
├── styles/ 
│ ├── main.css # Base styles, CSS variables, layout 
│ ├── components.css # Cards, forms, tables, buttons, charts 
│ └── responsive.css # Mobile-first breakpoints (360, 768, 1024) 
└── scripts/ 
 ├── storage.js # localStorage, import/export, validation 
 ├── validators.js # Regex patterns and validation functions 
 ├── state.js # Central state management, CRUD, stats 
 ├── search.js # Regex compiler, highlighting, filtering 
 ├── ui.js # DOM rendering and updates 
 └── app.js # Event wiring and initialization 


How to Run 
1. Clone the repository 
2. Open index.html in a browser — no build step required 
3. To load sample data, go to Settings → Import JSON → select seed.json 
4. To run tests, open tests.html in a browser 


How to Run Tests
Open tests.html directly in your browser. It runs 40+ assertions covering: • Description validation (spaces, duplicates, empty) 
• Amount validation (decimals, negatives, leading zeros) • Date validation (format, impossible dates) 
• Category validation (special characters, spaces) 
• Regex pattern tests (back-references, lookaheads) 
• Search compiler (valid/invalid patterns) 
• Highlight function (XSS safety, match wrapping) 
• Filter function (multi-field matching) 
• Import validation (schema checks)
