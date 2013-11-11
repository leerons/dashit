var gpio = require("gpio");

var port_17 = gpio.export(17, {interval: 400, ready: function(){
    port_17.set();
}});