var requiredComment = [
  /^Copyright [0-9]{4}-present runtime\.js project authors$/,
  '',
  'Licensed under the Apache License, Version 2.0 (the "License");',
  'you may not use this file except in compliance with the License.',
  'You may obtain a copy of the License at',
  '',
  '    http://www.apache.org/licenses/LICENSE-2.0',
  '',
  'Unless required by applicable law or agreed to in writing, software',
  'distributed under the License is distributed on an "AS IS" BASIS,',
  'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
  'See the License for the specific language governing permissions and',
  'limitations under the License.'
];


module.exports = function(context) {
  var linesRequiredCount = requiredComment.length;
  var linesFound = [];

  var comments = context.getAllComments();
  trimmed = requiredComment.map(function(x) {
    return (typeof x === 'string') ? x.trim() : x;
  });

  var extraOffset = 0;
  if (comments.length > 0 && comments[0].type === 'Line' &&
      comments[0].value === '/usr/bin/env node') {
    extraOffset = 1;
  }

  trimmed.forEach(function(line, index) {
    var match = comments.filter(function(comment) {
      if (comment.type !== 'Line') {
        return false;
      }

      var startLine = comment.loc.start.line;
      var value = comment.value.trim();

      if (line instanceof RegExp) {
        return line.test(value) && startLine === index + 1 + extraOffset;
      }

      return value === line && startLine === index + 1 + extraOffset;
    });

    if (match.length !== 1) {
      return context.report({
        loc: {
          start: { line: index + 1 + extraOffset, column: 0 },
          end: { line: index + 1 + extraOffset, column: 0 }
        }
      }, 'missing copyright comment "// ' + String(requiredComment[index]) + '"');
    }
  });

  return {};
};
