📘 UniWallet – Student Finance Tracker
Software Specification Document
1. Project Overview

Project Name: UniWallet
Type: Client-side Web Application
Architecture: Modular Vanilla JavaScript
Storage: Browser localStorage
Deployment: GitHub Pages

UniWallet is an offline-first student finance tracking web application designed to help university students monitor daily spending, manage monthly budgets, and analyze financial habits without requiring an account or internet connection.

All data is stored locally in the user’s browser.

2. Objectives

The system is designed to:

Allow users to record daily expenses

Categorize transactions

Perform regex-powered search

Set monthly budget caps

View financial summaries and trends

Export/import data

Ensure accessibility compliance (WCAG 2.1 AA)

3. Functional Requirements
3.1 Navigation System

The application includes:

Desktop navigation bar

Mobile navigation drawer

Keyboard navigation support

Section-based page routing

Sections:

Dashboard

Records

Add Transaction

Settings

About

Navigation uses anchor-based section switching with active state highlighting.

3.2 Dashboard Module

Displays:

Total records

Total amount spent

Top spending category

Average transaction amount

7-day spending trend chart

Category breakdown

Monthly budget progress bar

Budget Cap Logic

User sets monthly limit in Settings

Spending percentage calculated dynamically

Visual progress bar updates width

Warning message shown when:

Approaching cap (e.g., 80%)

Exceeding cap

3.3 Records Module
Features:

Table-based transaction list

Responsive card view for mobile

Sorting by:

Date (ASC/DESC)

Description (A-Z / Z-A)

Amount (High-Low / Low-High)

Regex-powered search

Case sensitivity toggle

Delete confirmation modal

3.4 Add Transaction Module

Users can:

Add new transaction

Edit existing transaction

Cancel edit mode

Required Fields:
Field	Validation
Description	No leading/trailing spaces, no duplicate words
Amount	Positive number, max 2 decimals
Date	YYYY-MM-DD format
Category	Letters, spaces, hyphens only

Validation uses custom JavaScript regex patterns.

3.5 Settings Module
Currency System

Base currency selector (USD, EUR, RWF)

Manual exchange rate inputs

Real-time conversion display

Monthly Budget Cap

Numeric input

Stored in localStorage

Integrated into dashboard

Categories

Dynamic category list

Add custom categories

Regex validation on category input

Data Management

Export JSON

Export CSV

Import JSON

Clear all data

3.6 About Section

Includes:

Application description

Feature summary

Regex catalog

Keyboard shortcut documentation

Developer contact information

4. Non-Functional Requirements
4.1 Accessibility

The system must:

Support keyboard-only navigation

Provide ARIA live regions for updates

Use semantic HTML5 structure

Include screen-reader-only elements

Provide visible focus indicators

ARIA roles implemented:

role="banner"

role="navigation"

role="status"

role="alert"

role="dialog"

4.2 Performance

Lightweight (no external frameworks)

No server dependency

Non-blocking scripts (deferred loading recommended)

Efficient DOM updates

4.3 Security

No external data transmission

Data stored only in browser localStorage

JSON import validation before parsing

No use of eval()

4.4 Compatibility

Supported browsers:

Chrome 90+

Firefox 88+

Safari 14+

Edge 90+

5. System Architecture
5.1 File Structure
UniWallet/
│
├── index.html
├── test.html
│
├── scripts/
│   ├── storage.js
│   ├── validators.js
│   ├── state.js
│   ├── search.js
│   ├── ui.js
│   └── app.js
│
└── styles/
    ├── main.css
    ├── components.css
    └── responsive.css

5.2 Module Responsibilities
storage.js

Handles localStorage operations

Data persistence

Import/export logic

validators.js

Regex validation patterns

Field validation functions

Error message handling

state.js

Centralized application state

Record management

Derived statistics

search.js

Regex parsing

Case sensitivity toggle

Filtering logic

ui.js

DOM rendering

Table and card generation

Dashboard updates

Modal control

app.js

Application bootstrap

Event listeners

Section navigation control

6. Regex Specifications
Purpose	Pattern
Trim validation	/^\S(?:.*\S)?$/
Amount validation	`/^(0
Date validation	`/^\d{4}-(0[1-9]
Category validation	/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
Duplicate word detection	/\b(\w+)\s+\1\b/i
Advanced lookahead example	/(?=.*[A-Z])(?=.*\d).{6,}/
7. Data Model

Each transaction object follows:

{
  "id": "unique-id",
  "description": "Lunch",
  "amount": 12.50,
  "date": "2026-02-20",
  "category": "Food"
}

8. User Interaction Flow

User opens application

App loads data from localStorage

Dashboard renders summary

User:

Adds transaction

Searches records

Sorts records

Sets budget cap

Data updates immediately

Changes persist automatically

9. Constraints

No backend server

No database

No authentication system

Client-side only execution

10. Future Enhancements

Progressive Web App (PWA) support

IndexedDB for large datasets

Dark/light mode persistence

Chart.js integration

Multi-month analytics

Cloud sync option
