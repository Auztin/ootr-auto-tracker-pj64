SHA1 = require('SHA1.js');

function padLeft(str, pad, amt) {
  var padding = '';
  while (amt--) {
    padding += pad;
  }
  str = padding+str;
  return str.substr(str.length-padding.length);
}

function wsAccept(wsKey) {
  wsKey += "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  var hash = SHA1(wsKey);
  return Duktape.enc('base64', Duktape.dec('hex', hash));
}

function wsSendFrame(socket, opcode, data) {
  opcode = padLeft(opcode.toString(2), '0', 4);
  var buffer = [parseInt('1000'+opcode, 2)]
  var len = data.length;
  if (len > 125) {
    if (len > 65535) {
      buffer.push(parseInt('01111111', 2));
      var l = padLeft(len.toString(2), '0', 64);
      buffer.push(parseInt(l.substr(0*8, 8), 2));
      buffer.push(parseInt(l.substr(1*8, 8), 2));
      buffer.push(parseInt(l.substr(2*8, 8), 2));
      buffer.push(parseInt(l.substr(3*8, 8), 2));
      buffer.push(parseInt(l.substr(4*8, 8), 2));
      buffer.push(parseInt(l.substr(5*8, 8), 2));
      buffer.push(parseInt(l.substr(6*8, 8), 2));
      buffer.push(parseInt(l.substr(7*8, 8), 2));
    }
    else {
      buffer.push(parseInt('01111110', 2));
      var l = padLeft(len.toString(2), '0', 16);
      buffer.push(parseInt(l.substr(0*8, 8), 2));
      buffer.push(parseInt(l.substr(1*8, 8), 2));
    }
  }
  else {
    buffer.push(parseInt('0'+padLeft(len.toString(2), '0', 7), 2));
  }
  socket.write(new Buffer(buffer));
  socket.write(data);
}

function wsNew(socket, wsKey, uri) {
  var accepted = false;
  var declined = false;
  var state = 0;
  var fin = false;
  var opcode = 0;
  var mask = false;
  var payloadLen = 0;
  var bytes = 0;
  var payload = '';
  var bits;
  var recvFns = [];
  socket.on('data', function(data) {
    for (var i = 0; i < data.length; i++) {
      if (state < 4) {
        bits = '00000000'+data[i].toString(2);
        bits = bits.substr(bits.length-8);
      }
      if (state == 0) {
        fin = bits[0] == 1;
        opcode = parseInt(bits.substr(4), 2);
        state = 1;
      }
      else if (state == 1) {
        mask = bits[0] == 1;
        payloadLen = parseInt(bits.substr(1), 2);
        if (payloadLen == 126) {
          state = 2;
          payloadLen = '';
          bytes = 2;
        }
        else if (payloadLen == 127) {
          state = 3;
          payloadLen = '';
          bytes = 8;
        }
        else {
          if (mask) {
            state = 4;
            mask = [];
            bytes = 4;
          }
          else state = 5;
        }
      }
      else if (state == 2 || state == 3) {
        payloadLen += bits;
        bytes--;
        if (bytes == 0) {
          payloadLen = parseInt(payloadLen, 2);
          if (mask) {
            state = 4;
            mask = [];
            bytes = 4;
          }
          else state = 5;
        }
      }
      else if (state == 4) {
        mask.push(data[i]);
        bytes--;
        if (bytes == 0) {
          state = 5;
        }
      }
      else if (state == 5) {
        var c = data[i];
        if (mask) c = c ^ mask[bytes % 4];
        payload += String.fromCharCode(c);
        payloadLen--;
        bytes++;
        if (payloadLen == 0) {
          if (fin) {
            if (opcode == 0x8) socket.close();
            else if (opcode == 0x9) wsSendFrame(socket, 0xA, payload);
            else if (opcode == 0xA) console.log('pong');
            else {
              for (var n = 0; n < recvFns.length; n++) {
                recvFns[n](payload);
              }
            }
            payload = '';
          }
          state = 0;
          fin = false;
          opcode = 0;
          mask = false;
          payloadLen = 0;
          bytes = 0;
        }
      }
    }
  });
  return {
    uri: uri,
    accept: function() {
      if (!accepted && !declined) {
        socket.write('HTTP/1.1 101 Switching Protocols\r\n');
        socket.write('Upgrade: websocket\r\n');
        socket.write('Connection: Upgrade\r\n');
        socket.write('Sec-WebSocket-Accept: '+wsAccept(wsKey)+'\r\n');
        socket.write('\r\n');
        accepted = true;
      }
    },
    decline: function() {
      if (!accepted && !declined) {
        socket.end('HTTP/1.1 404 Not Found\r\n\r\n');
        declined = true;
      }
    },
    send: function(text) {
      wsSendFrame(socket, 0x1, text);
    },
    onData: function(fn) {
      recvFns.push(fn);
    },
    socket: socket
  }
}

module.exports = {
  wsNew: wsNew
};
