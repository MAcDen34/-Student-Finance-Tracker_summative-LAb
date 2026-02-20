UniWallet– Student Finance Tracker

A responsive web application for managing personal finances.
Built using vanilla HTML, CSS, and JavaScript, FinanceAha helps students track expenses, manage budgets, and analyze spending patterns — all stored locally in the browser.

Project Overview

FinanceAha is a client-side finance management system designed specifically for students. The application allows users to:

Record and categorize expenses

Set and monitor a monthly budget

Search transactions using regular expressions

Validate inputs using advanced regex patterns

Persist data using the browser’s localStorage

Run automated validation tests

The project follows modular JavaScript architecture and implements accessibility best practices aligned with WCAG 2.1 AA standards.

 Key Technologies

HTML5 – Semantic structure and accessibility landmarks

CSS3 – Flexbox, Grid, Responsive Design

JavaScript (ES6+) – Modular architecture & DOM manipulation

Regular Expressions – Form validation & search

localStorage API – Client-side data persistence

Live Application

GitHub Repository:
https://github.com/MAcDen34/-Student-Finance-Tracker_summative-LAb.git

Live Demo (GitHub Pages):
https://macden34.github.io/-Student-Finance-Tracker_summative-LAb/

🎥 Demo Video: https://drive.google.com/file/d/1o3-z5BaoW6gpcNv8lWjfM5f4HtWk2g4h/view?usp=sharing

Installation & Setup

Prerequisites

Modern web browser (Chrome, Firefox, Safari, Edge)

Git (for cloning)

VSCode + Live Server extension (recommended)

▶ Running Locally

Clone the repository:

git clone https://github.com/MAcDen34/-Student-Finance-Tracker_summative-LAb.git
cd YOUR-REPO


Open the application:

open index.html


Or:

Open the folder in VSCode

Right-click index.html

Select Open with Live Server

Testing

To run validation tests:

Open test.html in your browser

View automated validation results

This file includes multiple test cases covering:

Input validation

Regex accuracy

Edge cases

📁 Project Structure
financeaha/
├── index.html              # Main application entry point
├── test.html               # Automated validation tests
├── seed.json               # Sample data for import/export
│
├── scripts/
│   ├── app.js              # Core application controller
│   ├── state.js            # Application state management
│   ├── storage.js          # localStorage handling
│   ├── search.js           # Regex-based search functionality
│   ├── ui.js               # DOM rendering and UI updates
│   └── validators.js       # Form validation using RegEx
│
└── styles/
    ├── main.css            # Base styles & variables
    ├── components.css      # UI component styling
    └── responsive.css      # Responsive layout rules

🔎 Regex Validation Patterns

UniWallet uses the following regular expressions:

Field	Pattern	Purpose
Description	/^\S(?:.*\S)?$/	Prevents leading/trailing whitespace
Amount	`/^(0	[1-9]\d*)(.\d{1,2})?$/`
Date	`/^\d{4}-(0[1-9]	1[0-2])-(0[1-9]
Category	/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/	Letters, spaces & hyphens only
Duplicate Detection	/\b(\w+)\s+\1\b/i	Detects repeated words
Accessibility

The application supports:

Full keyboard navigation

ARIA live regions for dynamic updates

High contrast color ratios

Semantic HTML5 structure

Focus indicators for interactive elements

Browser Support

Chrome / Edge 90+

Firefox 88+

Safari 14+

Opera 76+


Features

Expense tracking with categories

Monthly budget management

Real-time spending updates

Regex-powered search functionality

Data persistence using localStorage

Sample data import via JSON

Automated validation testing

Author

Denzel NGABO


GitHub: https://github.com/MAcDen34

Email: d.ngabo@alustudent.com
