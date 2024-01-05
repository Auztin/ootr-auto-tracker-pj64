wsNew = require('WebSocket.js').wsNew;

function sendLine(socket, line) {
  socket.write(line+'\r\n');
}

function listen(port, root, index, wsCallback) {
  var httpd = new Server();
  httpd.listen(port, '0.0.0.0');
  httpd.on('connection', function(c) {
    var method = '';
    var upgrade = '';
    var wsKey = '';
    var uri = [];
    var connection = [];
    var line = '';
    function parseData(data) {
      var d = data.toString();
      for (var i = 0; i < d.length; i++) {
        if (d[i] == '\r') continue;
        if (d[i] == '\n') {
          var args = line.split(' ');
          if (line.length) {
            if (args[0].toLowerCase() == 'get') {
              if (
                   args.length != 3
                || args[2].toLowerCase() != 'http/1.1'
                || method
              ) {
                sendLine(c, 'HTTP/1.1 400 Bad Request');
                c.end('\r\n');
                return;
              }
              method = 'get';
              var path = args[1].split('/');
              for (var i = 0; i < path.length; i++) {
                var p = path[i];
                if (
                     p != ''
                  && p != '.'
                  && p != '..'
                ) {
                  uri.push(p);
                }
              }
            }
            if (args[0].toLowerCase() == 'connection:') {
              var str = args.splice(1).join(' ');
              str = str.replace(/, /g, ',').toLowerCase();
              connection = str.split(',');
            }
            if (args[0].toLowerCase() == 'upgrade:') {
              upgrade = args[1];
            }
            if (args[0].toLowerCase() == 'sec-websocket-key:') {
              wsKey = args[1];
            }
          }
          else {
            if (method == 'get') {
              if (
                   connection.indexOf('upgrade') > -1
                && upgrade == 'websocket'
                && wsKey
              ) {
                wsCallback(wsNew(c, wsKey, uri.join('/')));
                c.off('data', parseData);
                return;
              }
              var path = root
              if (uri.length) path += uri.join('/');
              else path = index;
              try {
                var stat = fs.stat(path);
              } catch (e) {
                sendLine(c, 'HTTP/1.1 404 Not Found');
                c.end('\r\n');
                return;
              }
              if (stat.isDirectory()) {
                try {
                  stat = fs.stat(path+'/index.html');
                  if (stat.isDirectory()) sendLine(c, 'HTTP/1.1 403 Forbidden');
                  else path += '/index.html';
                } catch (e) {}
              }
              if (stat.isFile()) {
                var ext = path.split('.');
                ext = ext[ext.length-1];
                sendLine(c, 'HTTP/1.1 200 OK');
                if (ext == 'html') sendLine(c, 'content-type: text/html;');
                else if (ext == 'js') sendLine(c, 'content-type: application/javascript;');
                else if (ext == 'css') sendLine(c, 'content-type: text/css;');
                else if (ext == 'svg') sendLine(c, 'content-type: image/svg+xml;');
                else if (ext == 'png') sendLine(c, 'content-type: image/png;');
                else if (ext == 'json') sendLine(c, 'content-type: application/json;');
                else sendLine(c, 'content-type: text/plain;');
                sendLine(c, '');
                c.end(fs.readfile(path));
                return;
              }
            }
            else {
              sendLine(c, 'HTTP/1.1 501 Not Implemented');
            }
            c.end('\r\n');
            return;
          }
          line = '';
        }
        else line += d[i]
      }
    }
    c.on('data', parseData);
  });
  return httpd;
}

module.exports = {
  listen: listen
};
