(function () {
  'use strict';

  var deleteTargetId = null;

  document.addEventListener('DOMContentLoaded', function () {
    AppState.init();
    UI.init();
    applyTheme();
    UI.renderSettingsUI();
    UI.renderStats();
    UI.renderRecords();
    wireNavigation();
    wireForm();
    wireSearch();
    wireSort();
    wireSettings();
    wireDeleteModal();
    wireThemeToggle();
    wireKeyboardShortcuts();
    wireImportExport();

    AppState.subscribe(function (changeType) {
      if (changeType === 'records' || changeType === 'sort') {
        UI.renderRecords();
        UI.renderStats();
      }
      if (changeType === 'settings') {
        UI.renderSettingsUI();
        UI.renderStats();
        UI.renderRecords();
      }
    });
  });


  function applyTheme() {
    var theme = Storage.loadTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  function wireThemeToggle() {
    document.querySelector('.theme-toggle-btn').addEventListener('click', function () {
      var current = Storage.loadTheme();
      var next = current === 'dark' ? 'light' : 'dark';
      Storage.saveTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      UI.announcePolite('Switched to ' + next + ' theme.');
    });
  }


  function wireNavigation() {
    var links = document.querySelectorAll('.nav-link, .mobile-nav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        var section = this.getAttribute('data-nav');
        if (section) UI.navigateTo(section);
      });
    }

    document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
      var drawer = document.getElementById('mobile-nav-drawer');
      var isOpen = drawer.getAttribute('aria-hidden') === 'false';
      drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  }

  function showFieldValidation(fieldId, result, errorId) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(errorId);
    if (result.valid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      errorEl.textContent = '';
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
      errorEl.textContent = result.message;
    }
    return result.valid;
  }

  function wireForm() {
    var form = document.getElementById('transaction-form');
    var descField = document.getElementById('field-description');
    var amountField = document.getElementById('field-amount');
    var dateField = document.getElementById('field-date');
    var categoryField = document.getElementById('field-category');
    var cancelBtn = document.getElementById('form-cancel-btn');

    descField.addEventListener('blur', function () {
      showFieldValidation('field-description', Validators.validateDescription(descField.value), 'desc-error');
    });
    amountField.addEventListener('blur', function () {
      showFieldValidation('field-amount', Validators.validateAmount(amountField.value), 'amount-error');
    });
    dateField.addEventListener('blur', function () {
      showFieldValidation('field-date', Validators.validateDate(dateField.value), 'date-error');
    });
    categoryField.addEventListener('change', function () {
      showFieldValidation('field-category', Validators.validateCategory(categoryField.value), 'cat-error');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var v1 = showFieldValidation('field-description', Validators.validateDescription(descField.value), 'desc-error');
      var v2 = showFieldValidation('field-amount', Validators.validateAmount(amountField.value), 'amount-error');
      var v3 = showFieldValidation('field-date', Validators.validateDate(dateField.value), 'date-error');
      var v4 = showFieldValidation('field-category', Validators.validateCategory(categoryField.value), 'cat-error');

      if (!v1 || !v2 || !v3 || !v4) {
        UI.announceAssertive('Please fix the errors in the form before submitting.');
        return;
      }

      var data = {
        description: descField.value.trim(),
        amount: amountField.value.trim(),
        category: categoryField.value.trim(),
        date: dateField.value.trim()
      };

      var editId = document.getElementById('edit-id').value;

      if (editId) {
        AppState.updateRecord(editId, data);
        UI.announcePolite('Transaction updated successfully.');
      } else {
        AppState.addRecord(data);
        UI.announcePolite('Transaction added successfully.');
      }

      UI.resetForm();
      UI.navigateTo('records');
    });

    cancelBtn.addEventListener('click', function () {
      UI.resetForm();
      UI.announcePolite('Edit cancelled.');
    });
  }


  function wireSearch() {
    var searchInput = document.getElementById('search-input');
    var caseToggle = document.getElementById('search-case-toggle');
    var debounceTimer = null;

    function doSearch() {
      AppState.setSearchQuery(searchInput.value);
      UI.renderRecords();
    }

    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doSearch, 200);
    });

    caseToggle.addEventListener('change', function () {
      doSearch();
    });
  }


  function wireSort() {
    var sortSelect = document.getElementById('sort-select');

    sortSelect.addEventListener('change', function () {
      var val = sortSelect.value;
      var parts = val.split('-');
      var field, direction;

      if (parts[0] === 'date') {
        field = 'date';
        direction = parts[1];
      } else if (parts[0] === 'desc') {
        field = 'description';
        direction = parts[1];
      } else if (parts[0] === 'amount') {
        field = 'amount';
        direction = parts[1];
      } else {
        field = 'date';
        direction = 'desc';
      }

      AppState.setSort(field, direction);
    });

  
    var headers = document.querySelectorAll('.records-table th.sortable');
    for (var i = 0; i < headers.length; i++) {
      headers[i].addEventListener('click', function () {
        var sortField = this.getAttribute('data-sort');
        var current = AppState.getSort();
        var newDir = (current.field === sortField && current.direction === 'asc') ? 'desc' : 'asc';
        AppState.setSort(sortField, newDir);

    
        var selectVal = sortField;
        if (sortField === 'description') selectVal = 'desc';
        sortSelect.value = selectVal + '-' + newDir;
      });
    }
  }


  function wireSettings() {
 
    document.getElementById('save-cap-btn').addEventListener('click', function () {
      var capInput = document.getElementById('budget-cap');
      var capVal = parseFloat(capInput.value);
      if (isNaN(capVal) || capVal < 0) {
        capVal = 0;
      }
      AppState.updateSettings({ budgetCap: capVal });
      UI.announcePolite('Budget cap saved: ' + UI.formatMoney(capVal));
    });

   
    document.getElementById('base-currency').addEventListener('change', function () {
      AppState.updateSettings({ baseCurrency: this.value });
    });

    document.getElementById('rate-eur').addEventListener('change', function () {
      var settings = AppState.getSettings();
      var rate = parseFloat(this.value);
      if (!isNaN(rate) && rate > 0) {
        settings.rates.EUR = rate;
        AppState.updateSettings({ rates: settings.rates });
      }
    });

    document.getElementById('rate-rwf').addEventListener('change', function () {
      var settings = AppState.getSettings();
      var rate = parseFloat(this.value);
      if (!isNaN(rate) && rate > 0) {
        settings.rates.RWF = rate;
        AppState.updateSettings({ rates: settings.rates });
      }
    });

 
    document.getElementById('add-cat-btn').addEventListener('click', function () {
      var input = document.getElementById('new-category');
      var errorEl = document.getElementById('new-cat-error');
      var val = input.value.trim();
      var validation = Validators.validateCategory(val);

      if (!validation.valid) {
        errorEl.textContent = validation.message;
        return;
      }

      var settings = AppState.getSettings();
      var exists = false;
      for (var i = 0; i < settings.categories.length; i++) {
        if (settings.categories[i].toLowerCase() === val.toLowerCase()) {
          exists = true;
          break;
        }
      }

      if (exists) {
        errorEl.textContent = 'That category already exists.';
        return;
      }

      errorEl.textContent = '';
      settings.categories.push(val);
      AppState.updateSettings({ categories: settings.categories });
      input.value = '';
      UI.announcePolite('Category "' + val + '" added.');
    });

 
    document.getElementById('category-tags').addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-cat')) {
        var catName = e.target.getAttribute('data-cat');
        var settings = AppState.getSettings();
        settings.categories = settings.categories.filter(function (c) {
          return c !== catName;
        });
        AppState.updateSettings({ categories: settings.categories });
        UI.announcePolite('Category "' + catName + '" removed.');
      }
    });


    document.getElementById('clear-all-btn').addEventListener('click', function () {
      if (confirm('Are you sure you want to delete ALL transaction records? This cannot be undone.')) {
        AppState.clearAllRecords();
        UI.announceAssertive('All records have been cleared.');
      }
    });
  }

  
  function wireDeleteModal() {
    var modal = document.getElementById('delete-modal');
    var confirmBtn = document.getElementById('confirm-delete-btn');
    var cancelBtn = document.getElementById('cancel-delete-btn');

    function openModal(id) {
      deleteTargetId = id;
      modal.setAttribute('aria-hidden', 'false');
      confirmBtn.focus();
    }

    function closeModal() {
      deleteTargetId = null;
      modal.setAttribute('aria-hidden', 'true');
    }

    confirmBtn.addEventListener('click', function () {
      if (deleteTargetId) {
        AppState.deleteRecord(deleteTargetId);
        UI.announcePolite('Transaction deleted.');
      }
      closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

   
    document.addEventListener('click', function (e) {
      var editBtn = e.target.closest('.edit-btn');
      var deleteBtn = e.target.closest('.delete-btn');

      if (editBtn) {
        var editId = editBtn.getAttribute('data-id');
        var record = AppState.getRecord(editId);
        if (record) {
          UI.populateFormForEdit(record);
        }
      }

      if (deleteBtn) {
        var delId = deleteBtn.getAttribute('data-id');
        openModal(delId);
      }
    });
  }


  function wireImportExport() {
    document.getElementById('export-btn').addEventListener('click', function () {
      var records = AppState.getAllRecords();
      if (records.length === 0) {
        UI.announcePolite('No records to export.');
        return;
      }
      Storage.exportToJSON(records);
      UI.announcePolite('Records exported as JSON.');
    });

    document.getElementById('export-csv-btn').addEventListener('click', function () {
      var records = AppState.getAllRecords();
      if (records.length === 0) {
        UI.announcePolite('No records to export.');
        return;
      }
      Storage.exportToCSV(records);
      UI.announcePolite('Records exported as CSV.');
    });

    var importInput = document.getElementById('import-input');
    var importStatus = document.getElementById('import-status');


    var importLabel = importInput.closest('.import-label');
    if (importLabel) {
      importLabel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          importInput.click();
        }
      });
    }

    importInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;

      if (!file.name.endsWith('.json')) {
        importStatus.textContent = 'Please select a .json file.';
        importStatus.className = 'import-status error';
        return;
      }

      var reader = new FileReader();
      reader.onload = function (evt) {
        try {
          var data = JSON.parse(evt.target.result);
          var validation = Storage.validateImportData(data);

          if (!validation.valid) {
            importStatus.textContent = 'Invalid data: ' + validation.reason;
            importStatus.className = 'import-status error';
            return;
          }

       
          var now = new Date().toISOString();
          for (var i = 0; i < data.length; i++) {
            if (!data[i].createdAt) data[i].createdAt = now;
            if (!data[i].updatedAt) data[i].updatedAt = now;
          }

          AppState.setRecords(data);
          importStatus.textContent = 'Imported ' + data.length + ' records successfully!';
          importStatus.className = 'import-status success';
          UI.announcePolite('Imported ' + data.length + ' records.');
        } catch (err) {
          importStatus.textContent = 'Failed to parse JSON: ' + err.message;
          importStatus.className = 'import-status error';
        }
      };
      reader.readAsText(file);

   
      importInput.value = '';
    });
  }


  function wireKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
   
      if (e.key === 'Escape') {
        var modal = document.getElementById('delete-modal');
        if (modal.getAttribute('aria-hidden') === 'false') {
          modal.setAttribute('aria-hidden', 'true');
          return;
        }

        var drawer = document.getElementById('mobile-nav-drawer');
        if (drawer.getAttribute('aria-hidden') === 'false') {
          drawer.setAttribute('aria-hidden', 'true');
          document.querySelector('.mobile-menu-btn').setAttribute('aria-expanded', 'false');
          return;
        }

        if (AppState.getEditingId()) {
          UI.resetForm();
          UI.announcePolite('Edit cancelled.');
        }
        return;
      }

      
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    
      var sectionMap = { '1': 'dashboard', '2': 'records', '3': 'add', '4': 'settings', '5': 'about' };
      if (sectionMap[e.key]) {
        e.preventDefault();
        UI.navigateTo(sectionMap[e.key]);
      }
    });
  }

})();
