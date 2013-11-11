var gpio = require("gpio");

var port_17 = gpio.export(17, {interval: 400, ready: function(){
    ledOn();
}});

function ledOn(){
    port_17.set();
    setTimeOut(ledOff, 1000);
}

function ledOff(){
    port_17.reset();
    setTimeOut(ledOn, 1000);
}