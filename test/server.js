var path = require('path');
var express = require('express');
var fallback = require('express-history-api-fallback');

var port = process.env.PORT || 3000;
var rootDir = process.env.ROOT_DIR || path.join(__dirname, 'studio', 'dist');

var app = express();
app.use(express.static(rootDir));
app.use(fallback('index.html', { root: rootDir }));

var server = app.listen(port, function () {
  console.log('Sanity studio listening on http://localhost:' + port);
});

module.exports = server;
