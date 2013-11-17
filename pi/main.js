var DDPClient = require("ddp");

var ddpclient = new DDPClient({
  host: WEB_SERVER_URL, 
  port: 3000,
  auto_reconnect: true,
  auto_reconnect_timer: 500,
});

ddpclient.connect(function(error) {
  if (error) {
    console.log('DDP server connection error!\n' + JSON.stringify(error));
    return;
  }

  console.log('Connected to Meteor server at '+WEB_SERVER_URL);
});


var gpio = require("gpio");
var async = require("async");
var WEB_SERVER_URL = "192.168.28.15";

// Bathroom microswitch ports
var BATHROOM_PORTS = [{"index": 0, "portID": 2}, 
                      {"index": 1, "portID": 3}, 
                      {"index": 2, "portID": 4}];

var currentSate = [];
var pendingPorts = BATHROOM_PORTS.length; 

// Export ports as inputs
var bathroomInputs = [];


async.each(BATHROOM_PORTS, function(item, callback){
  var i = item.index;
  var port = item.portID;
  // Initialize
  var input = bathroomInputs[i] = gpio.export(port, {direction: 'in', interval:200, 
    ready: function() {
      currentSate[i] = input.value;
      console.log("Initial value for input #" + i + ": " + value);
      sendStateUpdateToServer(i, value);
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

function sendStateUpdateToServer(index, value){
  var floor = 2; // Hard coded for the time being
  var room = index;
  var state = value ? "open" : "close";
  var data = {"floor": floor, "room": room, "state": state};
  console.log("Sending server update: " + JSON.stingify(data));
  ddpclient.call('toiletRoomStateChange', [data], function(err, result) {
      if(err){
        console.log("Server error: "+ err);
      } else {
        console.log('Server result: ' + result);
      }
  });
}
