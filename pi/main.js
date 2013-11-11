var gpio = require("gpio");

var LED_PORT = 17, SWITCH_PORT = 25;

var ledPort = gpio.export(LED_PORT, {direction: 'out'});
var switchPort = gpio.export(SWITCH_PORT, {direction: 'in', interval:400});

switchPort.on('change', function(val){
    console.log("switch value: " + val);
    ledPort.set(val);
});


function ledOn(){
    port_17.set();
    setTimeout(ledOff, 1000);
}

function ledOff(){
    port_17.reset();
    setTimeout(ledOn, 1000);
}