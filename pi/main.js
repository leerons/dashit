var DDPClient = require("ddp");
var gpio = require("gpio");
var async = require("async");
var WEB_SERVER_URL = "192.168.2.1";

var ddpclient = new DDPClient({
  host: WEB_SERVER_URL, 
  port: 3000,
  auto_reconnect: true,
  auto_reconnect_timer: 500,
});

console.log("Trying to connect to Meteor server at " + WEB_SERVER_URL);
ddpclient.connect(function(error) {
  if (error) {
    console.log('DDP server connection error!\n' + JSON.stringify(error));
    return;
  }

  console.log('Connected to Meteor server at '+WEB_SERVER_URL);
  initPorts();
});

// Bathroom microswitch ports
var BATHROOM_PORTS = [{"index": 0, "portID": 2}, 
                      {"index": 1, "portID": 3}, 
                      {"index": 2, "portID": 4}];

var pendingPorts = BATHROOM_PORTS.length; 

// Export ports as inputs
var bathroomInputs = [];

function initPorts(){
  console.log("Initializing GPIO ports");
  async.each(BATHROOM_PORTS, function(item, callback){
    var i = item.index;
    var port = item.portID;
    // Initialize
    var input = bathroomInputs[i] = gpio.export(port, {direction: 'in', interval:200, 
      ready: function() {
        console.log("Initial value for input #" + i + ": " + input.value);
        sendStateUpdateToServer(i, input.value);
        callback();
      }
    });
    // Change event handler 
    input.on('change', function(value){
      console.log("Input #" + i + " value changed | new value: " + value);
      sendStateUpdateToServer(i, value);
    });
  },
  function(error){
    // Nothing here at the moment
  });
}

function sendStateUpdateToServer(index, value){
  var floor = 2; // Hard coded for the time being
  var room = index;
  var state = value ? "open" : "close";
  var data = {"floor": floor, "room": room, "state": state};
  console.log("Sending server update: " + JSON.stringify(data));
  ddpclient.call('toiletRoomStateChange', [data], function(err, result) {
      if(err){
        console.log("Server error: "+ err);
      } else {
        console.log('Server result: ' + result);
      }
  });
}
