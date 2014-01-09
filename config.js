/**
 * Created by Mortoni on 19/11/13.
 */
/*!
 * configuration data
 */

var net = require('net');

var Config =  {

    // target vent configuration
    engine: {
        viz: '172.20.222.58',
        vport: 6100,
        trio: '172.20.69.17',
        tport: 6200
    },

    // chat socket configuration
    chatserver: {
        ip: '172.20.69.17',
        port: 7777
    }
}

var Vent = {

    ip: '172.20.69.56',  //  ip: '127.0.0.1',
    port: 19201,
    live: true,
    socket: 0,

    open: function() {
        dlog('Opening a port to Vent...' + this.ip + ", " + this.port);

        var _this = this;

        this.socket = net.connect({host: this.ip, port: this.port},
            function() { //'connect' listener
                _this.live = true;
                dlog('client open');
            });

        this.socket.on('data', function(data) {
            dlog('received: ' + data);
        });

        this.socket.on('end', function() {
            this.live = false;
            dlog('client ended');
        });

        this.socket.on('close', function() {
            this.live = false;
            dlog('client closed');
        });

        this.socket.on('timeout', function() {
            dlog('client timed out');
        });

        this.socket.on('error', function() {
            dlog('client error');
        });

        this.socket.on('connect', function() {
            dlog('client connected');
        });
    },

    version: function() {
        this.sendCommand("v.version");
    },

    ping: function() {
        this.sendCommand("ventuz.ping");
    },

    sendCommand: function(cmd) {

     //   dlog('Live?: ' + this.live);

        if (!this.live) {
            dlog('Re-opening a port to Vent...' + this.ip + ", " + this.port);
            this.open();
        }

        this.socket.write(cmd + "\r\n");
//        dlog("sent...: " + cmd);
    },

    close: function() {
        this.live = false;
        this.socket.end();
    },

    end: function() {
        this.live = false;
        this.socket.end();
    },

    destroy: function() {
        this.live = false;
        this.socket.destroy();
    }
}

module.exports.Config = Config;
module.exports.Vent = Vent;

function dlog(data) {
    console.log(">>> " + data);
}