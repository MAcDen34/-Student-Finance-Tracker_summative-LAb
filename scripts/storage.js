var Storage = (function () {
  'use strict';

  var RECORDS_KEY = 'UniWallet:records';
  var SETTINGS_KEY = 'UniWallet:settings';
  var THEME_KEY = 'UniWallet:theme';

 
  var defaultSettings = {
    categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
    baseCurrency: 'USD',
    rates: { EUR: 0.92, RWF: 1380 },
    budgetCap: 0
  };

  function loadRecords() {
    try {
      var raw = localStorage.getItem(RECORDS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.warn('Could not load records from storage:', err);
      return [];
    }
  }

  function saveRecords(records) {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Failed to save records:', err);
    }
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return Object.assign({}, defaultSettings);
      var parsed = JSON.parse(raw);
     
      return Object.assign({}, defaultSettings, parsed);
    } catch (err) {
      console.warn('Could not load settings:', err);
      return Object.assign({}, defaultSettings);
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }

  function loadTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  function validateImportData(data) {
    if (!Array.isArray(data)) {
      return { valid: false, reason: 'Data must be an array of records.' };
    }

    if (data.length === 0) {
      return { valid: false, reason: 'The file contains no records.' };
    }

    var requiredFields = ['id', 'description', 'amount', 'category', 'date'];

    for (var i = 0; i < data.length; i++) {
      var record = data[i];

      if (typeof record !== 'object' || record === null) {
        return { valid: false, reason: 'Record at position ' + (i + 1) + ' is not a valid object.' };
      }

      for (var f = 0; f < requiredFields.length; f++) {
        if (!(requiredFields[f] in record)) {
          return {
            valid: false,
            reason: 'Record "' + (record.id || 'at position ' + (i + 1)) + '" is missing field: ' + requiredFields[f]
          };
        }
      }

      if (typeof record.amount !== 'number' || record.amount < 0) {
        return {
          valid: false,
          reason: 'Record "' + record.id + '" has an invalid amount.'
        };
      }
    }

    return { valid: true, reason: '' };
  }

  function exportToJSON(records) {
    var blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'UniWallet-export-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportToCSV(records) {
    if (records.length === 0) return;

    var headers = ['id', 'description', 'amount', 'category', 'date', 'createdAt', 'updatedAt'];
    var rows = [headers.join(',')];

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var row = headers.map(function (h) {
        var val = (r[h] !== undefined && r[h] !== null) ? String(r[h]) : '';
        if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      });
      rows.push(row.join(','));
    }

    var blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'UniWallet-export-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return {
    loadRecords: loadRecords,
    saveRecords: saveRecords,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    loadTheme: loadTheme,
    saveTheme: saveTheme,
    validateImportData: validateImportData,
    exportToJSON: exportToJSON,
    exportToCSV: exportToCSV
  };
})();
