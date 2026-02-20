var AppState = (function () {
  'use strict';

  var records = [];
  var settings = {};
  var currentSort = { field: 'date', direction: 'desc' };
  var searchQuery = '';
  var editingId = null;


  var listeners = [];

  function init() {
    records = Storage.loadRecords();
    settings = Storage.loadSettings();
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify(changeType) {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](changeType);
    }
  }

  

  function generateId() {
    
    var maxNum = 0;
    for (var i = 0; i < records.length; i++) {
      var idStr = records[i].id;
      if (idStr && idStr.indexOf('txn_') === 0) {
        var num = parseInt(idStr.replace('txn_', ''), 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
    var nextNum = maxNum + 1;
    return 'txn_' + String(nextNum).padStart(4, '0');
  }

  function addRecord(data) {
    var now = new Date().toISOString();
    var record = {
      id: generateId(),
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      createdAt: now,
      updatedAt: now
    };

    records.push(record);
    Storage.saveRecords(records);
    notify('records');
    return record;
  }

  function updateRecord(id, data) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === id) {
        if (data.description !== undefined) records[i].description = data.description;
        if (data.amount !== undefined) records[i].amount = parseFloat(data.amount);
        if (data.category !== undefined) records[i].category = data.category;
        if (data.date !== undefined) records[i].date = data.date;
        records[i].updatedAt = new Date().toISOString();

        Storage.saveRecords(records);
        notify('records');
        return records[i];
      }
    }
    return null;
  }

  function deleteRecord(id) {
    var index = -1;
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === id) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      records.splice(index, 1);
      Storage.saveRecords(records);
      notify('records');
      return true;
    }
    return false;
  }

  function getRecord(id) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === id) return records[i];
    }
    return null;
  }

  function getAllRecords() {
    return records.slice(); 
  }

  function setRecords(newRecords) {
    records = newRecords;
    Storage.saveRecords(records);
    notify('records');
  }

  function clearAllRecords() {
    records = [];
    Storage.saveRecords(records);
    notify('records');
  }


  function getSortedRecords(filteredList) {
    var list = filteredList || records.slice();
    var field = currentSort.field;
    var dir = currentSort.direction === 'asc' ? 1 : -1;

    list.sort(function (a, b) {
      var valA, valB;

      if (field === 'date') {
        valA = a.date || '';
        valB = b.date || '';
        return valA < valB ? -dir : valA > valB ? dir : 0;
      }

      if (field === 'description') {
        valA = (a.description || '').toLowerCase();
        valB = (b.description || '').toLowerCase();
        return valA < valB ? -dir : valA > valB ? dir : 0;
      }

      if (field === 'amount') {
        valA = a.amount || 0;
        valB = b.amount || 0;
        return (valA - valB) * dir;
      }

      return 0;
    });

    return list;
  }

  function setSort(field, direction) {
    currentSort.field = field;
    currentSort.direction = direction;
    notify('sort');
  }

  function getSort() {
    return { field: currentSort.field, direction: currentSort.direction };
  }


  function getSettings() {
    return Object.assign({}, settings);
  }

  function updateSettings(newSettings) {
    settings = Object.assign({}, settings, newSettings);
    Storage.saveSettings(settings);
    notify('settings');
  }


  function setSearchQuery(q) {
    searchQuery = q;
  }

  function getSearchQuery() {
    return searchQuery;
  }

  function setEditingId(id) {
    editingId = id;
  }

  function getEditingId() {
    return editingId;
  }


  function getStats() {
    var total = records.length;
    var sum = 0;
    var categoryTotals = {};

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      sum += r.amount || 0;

      var cat = r.category || 'Other';
      if (!categoryTotals[cat]) categoryTotals[cat] = 0;
      categoryTotals[cat] += r.amount || 0;
    }
    var topCat = '—';
    var topAmount = 0;
    for (var key in categoryTotals) {
      if (categoryTotals.hasOwnProperty(key) && categoryTotals[key] > topAmount) {
        topAmount = categoryTotals[key];
        topCat = key;
      }
    }

    var avg = total > 0 ? sum / total : 0;

    return {
      totalRecords: total,
      totalSpent: sum,
      topCategory: topCat,
      average: avg,
      categoryTotals: categoryTotals
    };
  }

  function getLast7DaysData() {
  var days = [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var d = 6; d >= 0; d--) {
    var date = new Date(today);
    date.setDate(date.getDate() - d);

  
    var dateStr = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');

    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var label = dayNames[date.getDay()];

    var dayTotal = 0;
    for (var i = 0; i < records.length; i++) {
      if (records[i].date === dateStr) {
        dayTotal += records[i].amount || 0;
      }
    }

    days.push({ date: dateStr, label: label, total: dayTotal });
  }

  return days;
}

  return {
    init: init,
    subscribe: subscribe,
    addRecord: addRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    getRecord: getRecord,
    getAllRecords: getAllRecords,
    setRecords: setRecords,
    clearAllRecords: clearAllRecords,
    getSortedRecords: getSortedRecords,
    setSort: setSort,
    getSort: getSort,
    getSettings: getSettings,
    updateSettings: updateSettings,
    setSearchQuery: setSearchQuery,
    getSearchQuery: getSearchQuery,
    setEditingId: setEditingId,
    getEditingId: getEditingId,
    getStats: getStats,
    getLast7DaysData: getLast7DaysData
  };
})();
