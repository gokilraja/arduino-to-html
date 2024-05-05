const serialPortLIB = require('serialport');
var SerialPort = serialPortLIB.SerialPort;
const { ReadlineParser } = require('@serialport/parser-readline')

const content = require('fs').readFileSync(__dirname + '/main.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});

const io = require('socket.io')(httpServer);

port = new SerialPort({
    path:'COM5',
    baudRate: 9600,

});

parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));



io.on('connect', (socket) => {
    socket.on('connect', () => {
        console.log("connected"); 
    });
    socket.on('clientData', function (data) {
        port.write(data);
      });

    port.on('open', function () {
        console.log('Serial Port is opened.');
    });

    parser.on('data', function (data) {
        console.log(data);
        socket.emit('data', data);
        
    });
});

httpServer.listen(5500, () => {
    console.log('go to http://localhost:5500');
});