function getCurrentMode() {
  //0 N64 Logo
  //1 Title Screen
  //2 File Select
  //3 Normal Gameplay
  //4 Cutscene
  //5 Paused
  //6 Dying
  //7 Dying Menu Start
  //8 Dead

  var mode = -1;
  if (pj64.romInfo == null) return mode;
  var logo_state = mem.u32[0x8011F200];
  if (logo_state == 0x802C5880 || logo_state == 0x00000000) {
    mode = 0;
  }
  else {
    var state_main = mem.u8[0x8011B92F];
    if (state_main == 1) mode = 1;
    else if (state_main == 2) mode = 2;
    else {
      var menu_state = mem.u8[0x801D8DD5];
      if (menu_state == 0) {
        if (mem.u32[0x801DB09C] & 0x000000F0 || mem.u16[0x8011a600] <= 0) mode = 6;
        else {
          if (mem.u8[0x8011B933] == 4) mode = 4;
          else mode = 3;
        }
      }
      else if ((0 < menu_state && menu_state < 9) || menu_state == 13 || menu_state == 18 || menu_state == 19) mode = 5;
      else if (menu_state == 9 || menu_state == 0xB) mode = 7;
      else mode = 8;
    }
  }
  return mode;
}

script.timeout(0);

var clients = [];
var is_ready = false;
var sendSpawn = false;
var pointerAddrs = [];//2
var pointerValue = [];//2
var pointerBytes = [];//2, 502 largest
var pointerMemory = [];//536
var monitorAddrs = [];//115
var monitorBytes = [];//115
var memory = [];//375
var defeatedGanon = false;
var lastEntranceIndex = mem.u16[0x801DA2BA];

function checkMemory() {
  if (is_ready) {
    var currentMode = getCurrentMode();
    if (currentMode < 3 && currentMode != -1) {
      is_ready = false;
      pointerAddrs = [];
      pointerBytes = [];
      pointerMemory = [];
      monitorAddrs = [];
      monitorBytes = [];
      memory = [];
      wsSend("unready");
      return;
    }
  }
  else {
    var currentMode = getCurrentMode();
    if (currentMode >= 3) {
      is_ready = true;
      wsSend("ready");
    }
    else sendSpawn = true;
    return;
  }
  var stateFrames = mem.u32[0x801C853C];
  var nextEntranceIndex = mem.u16[0x801DA2BA];
  if (lastEntranceIndex != nextEntranceIndex) {
    if (stateFrames > 20) return;
    lastEntranceIndex = nextEntranceIndex;
  }
  if (stateFrames < 20) return;
  var i = 0;
  var sent = false;
  for (var n in monitorAddrs) {
    var addr = monitorAddrs[n];
    var bytes = monitorBytes[n];
    while (bytes >= 0) {
      var value = mem.u8[addr];
      if (memory[i] != value) {
        // console.log("new mem", addr, memory[i], value);
        memory[i] = value;
        wsSend("mem "+addr+" "+value);
        sent = true;
      }
      addr++;
      bytes--;
      i++;
    }
  }
  i = 0;
  for (var n in pointerAddrs) {
    var ptr = pointerAddrs[n];
    if (ptr < 0x80000000 || ptr > 0x80800000) break;
    var addr = mem.u32[ptr];
    if (addr < 0x80000000 || addr > 0x80800000) addr = 0;
    var pointerChanged = 0;
    if (pointerValue[n] != addr) {
      pointerChanged |= 1;
      pointerValue[n] = addr;
    }
    var bytes = pointerBytes[n];
    while (bytes >= 0) {
      if (pointerChanged & 1) pointerMemory[i] = 0x100;
      if (addr != 0) {
        var value = mem.u8[addr];
        if (pointerMemory[i] != value) {
          pointerMemory[i] = value;
          wsSend("mem "+addr+" "+value);
          pointerChanged |= 2;
        }
        addr++;
      }
      bytes--;
      i++;
    }
    if (pointerChanged) {
      wsSend("mem "+(ptr+0)+" "+mem.u8[ptr+0]);
      wsSend("mem "+(ptr+1)+" "+mem.u8[ptr+1]);
      wsSend("mem "+(ptr+2)+" "+mem.u8[ptr+2]);
      wsSend("mem "+(ptr+3)+" "+mem.u8[ptr+3]);
      sent = true;
    }
  }
  if (sent) {
    wsSend("done");
    if (sendSpawn) {
      sendSpawn = false;
      wsSend("spawn");
    }
  }
  if (mem.u16[0x801C8544] == 0x004F && !defeatedGanon) {
    for (var actor = mem.u32[0x801CA11C]; actor; actor = mem.u32[actor+0x124]) {
      if (mem.u16[actor] == 0x017A && mem.s8[actor+0xAF] <= 0) {
        wsSend("ganon_defeated");
        defeatedGanon = true;
      }
    }
  }
}

setInterval(function() {
  checkMemory();
}, 50);

function wsSend(message) {
  for (var client in clients) {
    clients[client].send(message);
  }
}

console.clear();
console.log("Please enter the port for the tracker to listen on.");
// console.log("Use the same port number every time or else\n the tracker won\"t remember anything.");
console.log("Port 8080 is a good number.");
console.listen(function(input) {
// function temp(input) {
  var port = parseInt(input);
  if (port < 1000 || port == NaN) {
    console.log("Please use a port number over 1000.");
    return;
  }
  console.listen(null);
  console.log("Starting webserver on port "+port+"...");
  console.log("Connect using http://127.0.0.1:"+port+"/");
  var httpd = require("httpd.js").listen(port, pj64.scriptsDirectory+"modules/Tracker/tootr/", pj64.scriptsDirectory+"modules/Tracker/index.html", function(ws) {
    if (ws.uri) {
      clients.push(ws);
      ws.accept();
      if (is_ready) {
        ws.send("ready");
        var sent = false;
        var i = 0;
        for (var n in monitorAddrs) {
          var addr = monitorAddrs[n];
          var bytes = monitorBytes[n];
          while (bytes >= 0) {
            if (memory.length > i) {
              ws.send("mem "+addr+" "+memory[i]);
              sent = true;
            }
            addr++;
            bytes--;
            i++;
          }
        }
        i = 0;
        for (var n in pointerAddrs) {
          var ptr = pointerAddrs[n];
          if (ptr < 0x80000000 || ptr > 0x80800000) break;
          var addr = pointerValue[n];
          if (addr < 0x80000000 || addr > 0x80800000) addr = 0;
          var bytes = pointerBytes[n];
          while (bytes >= 0) {
            if (addr != 0) {
              ws.send("mem "+addr+" "+pointerMemory[i]);
              addr++;
            }
            bytes--;
            i++;
          }
          addr = pointerValue[n];
          ws.send("mem "+(ptr+0)+" "+((addr & 0xFF000000) >> 24));
          ws.send("mem "+(ptr+1)+" "+((addr & 0x00FF0000) >> 16));
          ws.send("mem "+(ptr+2)+" "+((addr & 0x0000FF00) >> 8));
          ws.send("mem "+(ptr+3)+" "+((addr & 0x000000FF)));
          sent = true;
        }
        if (sent) ws.send("done");
        if (defeatedGanon) ws.send("ganon_defeated");
      }
      ws.onData(function(data) {
        if (!is_ready) return;
        // console.log("received", data);
        var args = data.split(" ");
        if (args[0] == "monitor" && args.length == 3) {
          var newAddr = parseInt(args[1]);
          var newBytes = parseInt(args[2]);
          for (var n in monitorAddrs) {
            var addr = monitorAddrs[n];
            var bytes = monitorBytes[n];
            if (addr == newAddr) {
              if (bytes < newBytes) {
                monitorBytes[n] = newBytes;
              }
              newAddr = 0;
              break;
            }
          }
          if (newAddr != 0) {
            monitorAddrs.push(newAddr);
            monitorBytes.push(newBytes);
          }
        }
        if (args[0] == "monitor_pointer" && args.length == 3) {
          var newAddr = parseInt(args[1]);
          var newBytes = parseInt(args[2]);
          for (var n in pointerAddrs) {
            var addr = pointerAddrs[n];
            var bytes = pointerBytes[n];
            if (addr == newAddr) {
              if (bytes < newBytes) {
                pointerBytes[n] = newBytes;
              }
              newAddr = 0;
              break;
            }
          }
          if (newAddr != 0) {
            pointerAddrs.push(newAddr);
            pointerBytes.push(newBytes);
          }
        }
        if (args[0] == "u8" && args.length == 2) ws.send("mem8 "+args[1]+" "+mem.u8[parseInt(args[1])]);
        if (args[0] == "u16" && args.length == 2) ws.send("mem16 "+args[1]+" "+mem.u16[parseInt(args[1])]);
        if (args[0] == "u32" && args.length == 2) ws.send("mem32 "+args[1]+" "+mem.u32[parseInt(args[1])]);
        if (args[0] == "range" && args.length == 3) {
          var addr = parseInt(args[1]);
          var bytes = parseInt(args[2]);
          while (bytes > 0) {
            ws.send("mem "+addr+" "+mem.u8[addr]);
            addr++;
            bytes--;
          }
          ws.send("done");
        }
        if (args[0] == "actor" && args.length == 4) {
          var id = parseInt(args[1]);
          var num = parseInt(args[2]);
          var offset = parseInt(args[3]);
          // console.log("searching actors", id, num, offset);
          for (var i = 0; i < 12 && num; i++) {
            for (var actor = mem.u32[0x801CA0D4 + 0x08 * i]; actor && num; actor = mem.u32[actor+0x124]) {
              if (mem.u16[actor] == id) {
                var response = "actor "+actor
                for (var n = 0; n < 32; n+=0x04) {
                  response += " "+mem.u32[actor+n];
                }
                if (offset) response += " "+mem.u32[actor+offset];
                else response += " 0";
                // console.log("found", response);
                ws.send(response);
                num--;
              }
            }
          }
        }
      });
      ws.socket.on("close", function() {
        const index = clients.indexOf(ws);
        if (index > -1) {
          clients.splice(index, 1);
        }
        if (clients.length == 0) {
          pointerAddrs = [];
          pointerBytes = [];
          pointerMemory = [];
          monitorAddrs = [];
          monitorBytes = [];
          memory = [];
        }
      });
    }
    else ws.decline();
  });
// }
// temp("8080");
});
