if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to da-shit-web.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    toiletRoomStateChange: function(data){
      if(data.value == 1){
          console.log("Wax on!");
      } else {
          console.log("Wax off!");
      }

      return "value = " + data.value;
    }
  });
}
