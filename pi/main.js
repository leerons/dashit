var gpio = require("gpio");

var LED_PORT = 17, SWITCH_PORT = 27;

var ledPort = gpio.export(LED_PORT, {direction: 'out'});
var switchPort = gpio.export(SWITCH_PORT, {direction: 'in', interval:400});

switchPort.on('change', function(val){
    console.log("switch value: " + val);
    ledPort.set(val);
    ddpclient.call('toiletRoomStateChange', {"value": val}, function(err, result) {
        console.log('called toiletRoomStateChange on server, result: ' + result);
    });
});




var DDPClient = require("ddp");

var ddpclient = new DDPClient({
  host: "192.168.28.15", 
  port: 3000,
  /* optional: */
  auto_reconnect: true,
  auto_reconnect_timer: 500,
  use_ejson: true,  // default is false
  use_ssl: false, //connect to SSL server,
  use_ssl_strict: true //Set to false if you have root ca trouble.
});

ddpclient.connect(function(error) {
  if (error) {
    console.log('DDP connection error!');
    return;
  }

  console.log('connected!');
});
