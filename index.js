
var fsp = require('fs-promise');
var path = require('path');
var mkdirp = require('mkdirp-promise');
var process = require('process');

var _ = require('lodash');
var checkstyleVersion = '4.3'; // Why? Because that's what ESLint uses, I suppose

module.exports = function(css, stylelintResults) {
  const outputFile = path.resolve(process.cwd(), 'stylelint-checkstyle-report.xml');
  const outputDir = path.dirname(outputFile);
  
  var results = {};

  if(stylelintResults.stylelint.ignored === true) {
	return;
  }
	
  /**
   * Writes the Checkstyle report to a file.
   * @param  {String}  xmlString Checkstyle report.
   * @return {Promise}           Resolved if file has been successfully written.
   */
  function outputWriter(xmlString) {
	return mkdirp(outputDir)
	  .then(() => fsp.writeFile(outputFile, xmlString));
  }
	
	
  stylelintResults.messages.forEach(function(message) {
    if (message.type === 'warning' || message.type === 'error') {
	  if (typeof results[_.get(message.node, 'source.input.file')] === 'undefined') {
		results[_.get(message.node, 'source.input.file')] = new Array();
	  }
	  results[_.get(message.node, 'source.input.file')].push(message);
	}
  });

	
  var xml = '<?xml version="1.0" encoding="utf-8"?>';
  xml += '\n<checkstyle version="' + checkstyleVersion + '">';

  for (var file in results) {

    xml += '\n  <file name="' + _.escape(file) + '">';
    if (!results[file].length) {
      xml += '</file>';
      return;
    }
    results[file].forEach(function(warning) {

      xml += '\n    <error source="' + _.escape('stylelint.rules.' + warning.rule) + '" ';
      xml += 'line="' + _.escape(warning.line) + '" ';
      xml += 'column="' + _.escape(warning.column) + '" ';
      xml += 'severity="' + _.escape(warning.severity) + '" ';
      xml += 'message="' + _.escape(warning.text) + '" ';
      xml += '/>';
    });
    xml += '\n  </file>';
  };
  xml += '\n</checkstyle>';

  outputWriter(xml);

}
