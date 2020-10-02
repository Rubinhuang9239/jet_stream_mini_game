// 1. include dependencies
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const port = 8080;

const io = socketIO.listen(httpServer);

// 2. define server (1)ip (2)port #
app.use(express.static('public'));
httpServer.listen(port, ()=>{
    console.log('---- listening on ' + port + '! ----');
});

let client;
io.on('connection', socket=>{
    client = socket;
});

// HID input
var hid = require('node-hid');
// var BitArray = require('node-bitarray');
// Logitech Extreme 3D Pro's vendorID and productID: 1133:49685 (i.e. 046d:c215)
var device = new hid.HID(1133, 49685);

device.on('data', function (buf) {
  var ch = buf.toString('hex').match(/.{1,2}/g).map(function (c) {
    return parseInt(c, 16);
  });
  var controls = {
    roll: ((ch[1] & 0x03) << 8) + ch[0],
    pitch: ((ch[2] & 0x0f) << 6) + ((ch[1] & 0xfc) >> 2),
    yaw: ch[3],
    view: (ch[2] & 0xf0) >> 4,
    throttle: -ch[5] + 255,
    buttons: [
      (ch[4] & 0x01) >> 0,
      (ch[4] & 0x02) >> 1,
      (ch[4] & 0x04) >> 2,
      (ch[4] & 0x08) >> 3,
      (ch[4] & 0x10) >> 4,
      (ch[4] & 0x20) >> 5,
      (ch[4] & 0x40) >> 6,
      (ch[4] & 0x80) >> 7,

      (ch[6] & 0x01) >> 0,
      (ch[6] & 0x02) >> 1,
      (ch[6] & 0x04) >> 2,
      (ch[6] & 0x08) >> 3
    ]
  };
  // var bits = BitArray.fromBuffer(buf).toJSON().join('').match(/.{1,8}/g).join(' ');
  // console.log(JSON.stringify(controls));
  sendToClient(filterData(controls));
});

function sendToClient(data){
    if(client && client.connected){
        client.emit('input', data);
    }
}

function filterData(data){
    const filteredData = {
        roll: data.roll,
        pitch: data.pitch,
        yaw: data.yaw,
        throttle: data.throttle,
        trigger: data.buttons[0],
        view: data.buttons[1]
    }
    return filteredData;
}