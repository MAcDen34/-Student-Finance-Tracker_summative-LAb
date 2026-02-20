var Search = (function () {
  'use strict';

 
  function compileRegex(input, flags) {
    if (!input || input.trim().length === 0) return null;

    if (flags === undefined) flags = 'i';

    try {
      return new RegExp(input, flags);
    } catch (err) {
      return null;
    }
  }

  function highlight(text, regex) {
    if (!regex || !text) return escapeHTML(text || '');


    var escaped = escapeHTML(text);

   
    try {
      return escaped.replace(regex, function (match) {
        return '<mark>' + match + '</mark>';
      });
    } catch (err) {
      return escaped;
    }
  }

 
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  function filterRecords(records, regex) {
    if (!regex) return records.slice();

    var results = [];
    for (var i = 0; i < records.length; i++) {
      var r = records[i];

      if (
        regex.test(r.description || '') ||
        regex.test(r.category || '') ||
        regex.test(r.date || '') ||
        regex.test(String(r.amount))
      ) {
        results.push(r);
      }
    }
    return results;
  }


  var examplePatterns = [
    { label: 'Cents present', pattern: '\\.\\d{2}\\b' },
    { label: 'Beverages', pattern: '(coffee|tea)' },
    { label: 'Duplicate words', pattern: '\\b(\\w+)\\s+\\1\\b' },
    { label: 'Food category', pattern: '^Food$' },
    { label: 'Large amounts (100+)', pattern: '\\b[1-9]\\d{2,}' }
  ];

  return {
    compileRegex: compileRegex,
    highlight: highlight,
    escapeHTML: escapeHTML,
    filterRecords: filterRecords,
    examplePatterns: examplePatterns
  };
})();
