var UI = (function () {
  'use strict';

 
  var els = {};

  function cacheElements() {
    els.statCount = document.getElementById('stat-count');
    els.statSum = document.getElementById('stat-sum');
    els.statTopCat = document.getElementById('stat-top-cat');
    els.statAvg = document.getElementById('stat-avg');
    els.capBarFill = document.getElementById('cap-bar-fill');
    els.capSpentLabel = document.getElementById('cap-spent-label');
    els.capLimitLabel = document.getElementById('cap-limit-label');
    els.capMessage = document.getElementById('cap-message');
    els.trendChart = document.getElementById('trend-chart');
    els.categoryBreakdown = document.getElementById('category-breakdown');
    els.recordsTbody = document.getElementById('records-tbody');
    els.recordsCards = document.getElementById('records-cards');
    els.emptyState = document.getElementById('empty-state');
    els.searchInput = document.getElementById('search-input');
    els.searchCaseToggle = document.getElementById('search-case-toggle');
    els.searchHint = document.getElementById('search-hint');
    els.sortSelect = document.getElementById('sort-select');
    els.categoryTags = document.getElementById('category-tags');
    els.fieldCategory = document.getElementById('field-category');
    els.liveStatus = document.getElementById('live-status');
    els.liveAlert = document.getElementById('live-alert');
    els.convertedDisplay = document.getElementById('converted-display');
    els.currencySymbol = document.getElementById('currency-symbol');
  }

  

  var currencySymbols = { USD: '$', EUR: '€', RWF: 'FRw' };

  function getCurrencySymbol() {
    var settings = AppState.getSettings();
    return currencySymbols[settings.baseCurrency] || '$';
  }

  function formatMoney(amount) {
    var sym = getCurrencySymbol();
    return sym + amount.toFixed(2);
  }



  function announcePolite(message) {
    if (els.liveStatus) {
      els.liveStatus.textContent = '';

      setTimeout(function () {
        els.liveStatus.textContent = message;
      }, 50);
    }
  }

  function announceAssertive(message) {
    if (els.liveAlert) {
      els.liveAlert.textContent = '';
      setTimeout(function () {
        els.liveAlert.textContent = message;
      }, 50);
    }
  }



  function renderStats() {
    var stats = AppState.getStats();
    var sym = getCurrencySymbol();

    els.statCount.textContent = stats.totalRecords;
    els.statSum.textContent = sym + stats.totalSpent.toFixed(2);
    els.statTopCat.textContent = stats.topCategory;
    els.statAvg.textContent = sym + stats.average.toFixed(2);

    renderBudgetCap(stats.totalSpent);
    renderTrendChart();
    renderCategoryBreakdown(stats);
    renderConvertedTotals(stats.totalSpent);
  }

  function renderBudgetCap(totalSpent) {
    var settings = AppState.getSettings();
    var cap = settings.budgetCap || 0;
    var sym = getCurrencySymbol();

    els.capSpentLabel.textContent = sym + totalSpent.toFixed(2) + ' spent';
    els.capLimitLabel.textContent = 'of ' + sym + cap.toFixed(2);

    if (cap <= 0) {
      els.capBarFill.style.width = '0%';
      els.capBarFill.className = 'cap-bar-fill';
      els.capMessage.textContent = 'Set a budget cap in Settings to track your spending limit.';
      els.capMessage.className = 'cap-message';
      return;
    }

    var pct = Math.min((totalSpent / cap) * 100, 100);
    els.capBarFill.style.width = pct + '%';

    if (totalSpent > cap) {
      var over = totalSpent - cap;
      els.capBarFill.className = 'cap-bar-fill danger';
      els.capMessage.textContent = 'Over budget by ' + sym + over.toFixed(2) + '! Consider cutting back.';
      els.capMessage.className = 'cap-message over-budget';
      announceAssertive('Budget exceeded by ' + sym + over.toFixed(2));
    } else if (totalSpent >= cap * 0.8) {
      var remaining = cap - totalSpent;
      els.capBarFill.className = 'cap-bar-fill warning';
      els.capMessage.textContent = 'Almost there — ' + sym + remaining.toFixed(2) + ' remaining.';
      els.capMessage.className = 'cap-message near-budget';
      announcePolite('Approaching budget limit. ' + sym + remaining.toFixed(2) + ' remaining.');
    } else {
      var rem = cap - totalSpent;
      els.capBarFill.className = 'cap-bar-fill';
      els.capMessage.textContent = 'You have ' + sym + rem.toFixed(2) + ' left this month. Keep it up!';
      els.capMessage.className = 'cap-message under-budget';
    }
  }

  function renderTrendChart() {
    var days = AppState.getLast7DaysData();
    var maxVal = 0;

    for (var i = 0; i < days.length; i++) {
      if (days[i].total > maxVal) maxVal = days[i].total;
    }

    var sym = getCurrencySymbol();
    var html = '';

    for (var j = 0; j < days.length; j++) {
      var d = days[j];
      var heightPct = maxVal > 0 ? (d.total / maxVal) * 100 : 0;
      var barHeight = Math.max(heightPct, 2); 
      html += '<div class="chart-bar-group">';
      html += '<span class="chart-bar-value">' + (d.total > 0 ? sym + d.total.toFixed(0) : '') + '</span>';
      html += '<div class="chart-bar" style="height: ' + barHeight + '%" title="' + d.date + ': ' + sym + d.total.toFixed(2) + '"></div>';
      html += '<span class="chart-bar-label">' + d.label + '</span>';
      html += '</div>';
    }

    els.trendChart.innerHTML = html;
  }

  var catColors = ['cat-color-0', 'cat-color-1', 'cat-color-2', 'cat-color-3', 'cat-color-4', 'cat-color-5'];

  function renderCategoryBreakdown(stats) {
    var totals = stats.categoryTotals;
    var entries = [];

    for (var key in totals) {
      if (totals.hasOwnProperty(key)) {
        entries.push({ name: key, amount: totals[key] });
      }
    }


    entries.sort(function (a, b) { return b.amount - a.amount; });

    var maxAmount = entries.length > 0 ? entries[0].amount : 1;
    var sym = getCurrencySymbol();
    var html = '';

    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var pct = (e.amount / maxAmount) * 100;
      var colorClass = catColors[i % catColors.length];

      html += '<div class="breakdown-row">';
      html += '<span class="breakdown-name">' + Search.escapeHTML(e.name) + '</span>';
      html += '<div class="breakdown-bar-track"><div class="breakdown-bar-fill ' + colorClass + '" style="width: ' + pct + '%"></div></div>';
      html += '<span class="breakdown-amount">' + sym + e.amount.toFixed(2) + '</span>';
      html += '</div>';
    }

    els.categoryBreakdown.innerHTML = html || '<p style="color: var(--clr-text-muted);">No data yet.</p>';
  }

  function renderConvertedTotals(totalSpent) {
    var settings = AppState.getSettings();
    var base = settings.baseCurrency || 'USD';
    var rates = settings.rates || {};

    var lines = [];

    if (base === 'USD') {
      if (rates.EUR) lines.push('EUR: €' + (totalSpent * rates.EUR).toFixed(2));
      if (rates.RWF) lines.push('RWF: FRw ' + (totalSpent * rates.RWF).toFixed(0));
    } else if (base === 'EUR') {
    
      var eurRate = rates.EUR || 0.92;
      var usdEquiv = eurRate > 0 ? totalSpent / eurRate : 0;
      lines.push('USD: $' + usdEquiv.toFixed(2));
      if (rates.RWF) lines.push('RWF: FRw ' + (usdEquiv * rates.RWF).toFixed(0));
    } else if (base === 'RWF') {
      var rwfRate = rates.RWF || 1380;
      var usdEquiv2 = rwfRate > 0 ? totalSpent / rwfRate : 0;
      lines.push('USD: $' + usdEquiv2.toFixed(2));
      if (rates.EUR) lines.push('EUR: €' + (usdEquiv2 * rates.EUR).toFixed(2));
    }

    if (lines.length > 0) {
      els.convertedDisplay.innerHTML = '<strong>Converted totals:</strong><br>' + lines.join('<br>');
      els.convertedDisplay.style.display = 'block';
    } else {
      els.convertedDisplay.style.display = 'none';
    }
  }



  function renderRecords() {
    var allRecords = AppState.getAllRecords();
    var query = AppState.getSearchQuery();
    var caseInsensitive = els.searchCaseToggle.checked;
    var flags = caseInsensitive ? 'gi' : 'g';

    var regex = null;
    var filtered = allRecords;

    if (query) {
      regex = Search.compileRegex(query, flags);
      if (regex) {
        filtered = Search.filterRecords(allRecords, regex);
        els.searchHint.textContent = filtered.length + ' match' + (filtered.length !== 1 ? 'es' : '') + ' found.';
        els.searchHint.classList.remove('error');
      } else {
        els.searchHint.textContent = 'Invalid regex pattern.';
        els.searchHint.classList.add('error');
        filtered = allRecords;
      }
    } else {
      els.searchHint.textContent = '';
      els.searchHint.classList.remove('error');
    }

    var sorted = AppState.getSortedRecords(filtered);


    if (sorted.length === 0 && allRecords.length === 0) {
      els.emptyState.style.display = 'block';
    } else {
      els.emptyState.style.display = 'none';
    }

    renderTable(sorted, regex);
    renderCards(sorted, regex);
  }

  function renderTable(records, regex) {
    var sym = getCurrencySymbol();
    var html = '';

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var descHTML = regex ? Search.highlight(r.description, regex) : Search.escapeHTML(r.description);
      var catHTML = regex ? Search.highlight(r.category, regex) : Search.escapeHTML(r.category);
      var dateHTML = regex ? Search.highlight(r.date, regex) : Search.escapeHTML(r.date);
      var amtStr = r.amount.toFixed(2);
      var amtHTML = regex ? Search.highlight(amtStr, regex) : Search.escapeHTML(amtStr);

      html += '<tr data-id="' + r.id + '">';
      html += '<td>' + dateHTML + '</td>';
      html += '<td>' + descHTML + '</td>';
      html += '<td>' + sym + amtHTML + '</td>';
      html += '<td><span class="category-badge">' + catHTML + '</span></td>';
      html += '<td class="row-actions">';
      html += '<button class="btn btn-sm btn-secondary edit-btn" data-id="' + r.id + '" aria-label="Edit ' + Search.escapeHTML(r.description) + '">Edit</button>';
      html += '<button class="btn btn-sm btn-danger delete-btn" data-id="' + r.id + '" aria-label="Delete ' + Search.escapeHTML(r.description) + '">Delete</button>';
      html += '</td>';
      html += '</tr>';
    }

    els.recordsTbody.innerHTML = html;

    if (records.length === 0 && AppState.getAllRecords().length > 0) {
      els.recordsTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--clr-text-muted);">No records match your search.</td></tr>';
    }
  }

  function renderCards(records, regex) {
    var sym = getCurrencySymbol();
    var html = '';

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var descHTML = regex ? Search.highlight(r.description, regex) : Search.escapeHTML(r.description);
      var catHTML = regex ? Search.highlight(r.category, regex) : Search.escapeHTML(r.category);
      var dateHTML = regex ? Search.highlight(r.date, regex) : Search.escapeHTML(r.date);
      var amtStr = r.amount.toFixed(2);
      var amtHTML = regex ? Search.highlight(amtStr, regex) : Search.escapeHTML(amtStr);

      html += '<div class="record-card" data-id="' + r.id + '">';
      html += '<div class="record-card-header">';
      html += '<span class="record-card-desc">' + descHTML + '</span>';
      html += '<span class="record-card-amount">' + sym + amtHTML + '</span>';
      html += '</div>';
      html += '<div class="record-card-meta">';
      html += '<span>' + dateHTML + '</span>';
      html += '<span class="category-badge">' + catHTML + '</span>';
      html += '</div>';
      html += '<div class="record-card-actions">';
      html += '<button class="btn btn-sm btn-secondary edit-btn" data-id="' + r.id + '" aria-label="Edit ' + Search.escapeHTML(r.description) + '">Edit</button>';
      html += '<button class="btn btn-sm btn-danger delete-btn" data-id="' + r.id + '" aria-label="Delete ' + Search.escapeHTML(r.description) + '">Delete</button>';
      html += '</div>';
      html += '</div>';
    }

    els.recordsCards.innerHTML = html;

    if (records.length === 0 && AppState.getAllRecords().length > 0) {
      els.recordsCards.innerHTML = '<p class="empty-state">No records match your search.</p>';
    }
  }

 

  function renderCategories() {
    var settings = AppState.getSettings();
    var cats = settings.categories || [];


    var tagsHTML = '';
    for (var i = 0; i < cats.length; i++) {
      tagsHTML += '<span class="category-tag">';
      tagsHTML += Search.escapeHTML(cats[i]);
      tagsHTML += ' <button class="remove-cat" data-cat="' + Search.escapeHTML(cats[i]) + '" aria-label="Remove category ' + Search.escapeHTML(cats[i]) + '">&times;</button>';
      tagsHTML += '</span>';
    }
    els.categoryTags.innerHTML = tagsHTML;


    var optionsHTML = '<option value="">Select a category</option>';
    for (var j = 0; j < cats.length; j++) {
      optionsHTML += '<option value="' + Search.escapeHTML(cats[j]) + '">' + Search.escapeHTML(cats[j]) + '</option>';
    }
    els.fieldCategory.innerHTML = optionsHTML;
  }



  function renderSettingsUI() {
    var settings = AppState.getSettings();

    document.getElementById('base-currency').value = settings.baseCurrency || 'USD';
    document.getElementById('rate-eur').value = settings.rates.EUR || 0.92;
    document.getElementById('rate-rwf').value = settings.rates.RWF || 1380;
    document.getElementById('budget-cap').value = settings.budgetCap > 0 ? settings.budgetCap : '';


    els.currencySymbol.textContent = getCurrencySymbol();

    renderCategories();
  }



  function navigateTo(sectionName) {
    var sections = document.querySelectorAll('.page-section');
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
    }

    var target = document.getElementById(sectionName + '-section');
    if (target) {
      target.classList.add('active');
    
      target.style.animation = 'none';
      target.offsetHeight;
      target.style.animation = '';
    }


    var navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    for (var j = 0; j < navLinks.length; j++) {
      var link = navLinks[j];
      if (link.getAttribute('data-nav') === sectionName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }

   
    var drawer = document.getElementById('mobile-nav-drawer');
    drawer.setAttribute('aria-hidden', 'true');
    var menuBtn = document.querySelector('.mobile-menu-btn');
    menuBtn.setAttribute('aria-expanded', 'false');

    
    if (sectionName === 'dashboard') {
      renderStats();
    }
  }



  function populateFormForEdit(record) {
    document.getElementById('edit-id').value = record.id;
    document.getElementById('field-description').value = record.description;
    document.getElementById('field-amount').value = record.amount;
    document.getElementById('field-date').value = record.date;
    document.getElementById('field-category').value = record.category;

    document.getElementById('add-heading').textContent = 'Edit Transaction';
    document.getElementById('form-subtitle').textContent = 'Update this expense';
    document.getElementById('form-submit-btn').textContent = 'Save Changes';
    document.getElementById('form-cancel-btn').style.display = 'inline-flex';

    AppState.setEditingId(record.id);
    navigateTo('add');


    document.getElementById('field-description').focus();
  }

  function resetForm() {
    document.getElementById('transaction-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('add-heading').textContent = 'Add Transaction';
    document.getElementById('form-subtitle').textContent = 'Log a new expense';
    document.getElementById('form-submit-btn').textContent = 'Add Transaction';
    document.getElementById('form-cancel-btn').style.display = 'none';

    
    var errors = document.querySelectorAll('.form-error');
    for (var i = 0; i < errors.length; i++) {
      errors[i].textContent = '';
    }

    var inputs = document.querySelectorAll('.form-input');
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].classList.remove('invalid', 'valid');
    }

    AppState.setEditingId(null);
  }



  function init() {
    cacheElements();
  }

  return {
    init: init,
    renderStats: renderStats,
    renderRecords: renderRecords,
    renderCategories: renderCategories,
    renderSettingsUI: renderSettingsUI,
    navigateTo: navigateTo,
    populateFormForEdit: populateFormForEdit,
    resetForm: resetForm,
    announcePolite: announcePolite,
    announceAssertive: announceAssertive,
    formatMoney: formatMoney,
    getCurrencySymbol: getCurrencySymbol
  };
})();
