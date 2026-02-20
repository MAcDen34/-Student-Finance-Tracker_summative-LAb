var Validators = (function () {
  'use strict';

  var descriptionPattern = /^\S(?:.*\S)?$/;


  var amountPattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

  
  var datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;


  var categoryPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

 
  var duplicateWordPattern = /\b(\w+)\s+\1\b/i;

  var strongPatternCheck = /(?=.*[A-Z])(?=.*\d).{6,}/;




  function validateDescription(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Description is required.' };
    }

    if (!descriptionPattern.test(value)) {
      return { valid: false, message: 'No leading or trailing spaces allowed.' };
    }

  
    if (duplicateWordPattern.test(value)) {
      var match = value.match(duplicateWordPattern);
      return {
        valid: false,
        message: 'Duplicate word detected: "' + match[1] + ' ' + match[1] + '". Please fix this.'
      };
    }

    if (value.length > 200) {
      return { valid: false, message: 'Description must be under 200 characters.' };
    }

    return { valid: true, message: '' };
  }

  function validateAmount(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Amount is required.' };
    }

    if (!amountPattern.test(value.trim())) {
      return { valid: false, message: 'Enter a valid amount (e.g., 12.50 or 100). Up to 2 decimal places.' };
    }

    var num = parseFloat(value);
    if (num <= 0) {
      return { valid: false, message: 'Amount must be greater than zero.' };
    }

    if (num > 999999.99) {
      return { valid: false, message: 'Amount seems too large. Please double-check.' };
    }

    return { valid: true, message: '' };
  }

  function validateDate(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Date is required.' };
    }

    if (!datePattern.test(value.trim())) {
      return { valid: false, message: 'Use YYYY-MM-DD format (e.g., 2025-02-15).' };
    }

    var parts = value.split('-');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);

    var dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== (month - 1) || dateObj.getDate() !== day) {
      return { valid: false, message: 'That date does not exist (e.g., Feb 30).' };
    }

    return { valid: true, message: '' };
  }

  function validateCategory(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Please select a category.' };
    }

    if (value !== value.trim()) {
      return { valid: false, message: 'No leading or trailing spaces allowed.' };
    }

    if (!categoryPattern.test(value)) {
      return { valid: false, message: 'Category can only contain letters, spaces, or hyphens.' };
    }

    return { valid: true, message: '' };
  }

  function validateRate(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Rate is required.' };
    }

    if (!amountPattern.test(value.trim())) {
      return { valid: false, message: 'Enter a valid rate number.' };
    }

    return { valid: true, message: '' };
  }

  return {
    patterns: {
      description: descriptionPattern,
      amount: amountPattern,
      date: datePattern,
      category: categoryPattern,
      duplicateWord: duplicateWordPattern,
      strongCheck: strongPatternCheck
    },
    validateDescription: validateDescription,
    validateAmount: validateAmount,
    validateDate: validateDate,
    validateCategory: validateCategory,
    validateRate: validateRate
  };
})();
