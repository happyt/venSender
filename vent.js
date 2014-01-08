/**
 * Created by Mortoni on 19/11/13.
 */
var readline = require('readline');
var rl;
var init = require('./config.js');
var config = init.Config;

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app, {log: false})
    , fs = require('fs');

app.listen(7777);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('dataIn', function (data) {
        console.log(data);
        vent.sendCommand(data.my);
    });
});

var vent = init.Vent;
vent.open();

console.log('Opening command line...');

rl = readline.createInterface(process.stdin, process.stdout, null);
rl.setPrompt('> ');
/*
rl.question('Which Vent?', function(answer) {
    me.name = answer;
    console.log('Hello', me.name);
})

   */
console.log('Wait for commands...("quit" to exit)');

rl.on('line', function(cmd) {

    if (cmd === 'quit') {
        rl.question('Are you sure? (y/n) ', function(answer) {
            if (answer === 'y') {
                vent.close();
                rl.close();
            } else {
                rl.prompt();
            }
        });
    } else {
        // parse the command
        //
        if (cmd === "v") {
            vent.version();
        } else if (cmd === "d") {
            vent.destroy();
        } else if (cmd === "e") {
            vent.end();
        } else if (cmd === "z") {
            vent.sendCommand("version");
        }
        //    console.log('You typed:', cmd);
        //    console.log('Type "quit" to exit');
        rl.prompt();
    }

});

rl.on('close', function() {
    console.log('Bye');
    process.exit();
});

rl.prompt();