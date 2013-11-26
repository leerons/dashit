// Client
if (Meteor.isClient) {

  Meteor.subscribe("bathroomsCurrentState");

  Meteor.startup(function() {    
    $(window).resize(Layout.resizeLayout);
  });

  Template.bathrooms.rooms = function(){
    var state = BathroomsState.findOne({floor: currentFloor});
    var roomsArray = [];
    for(var i = 0; i < state.rooms.length; i++){
      roomsArray[i] = { "index": i,
                        "indicatorState": (state.rooms[i] == OPEN) ? "green" : "red",
                        "doorState": state.rooms[i]};
    }
    return roomsArray;
  }

  function openRooms(){
    var open = 0;
    var rooms = BathroomsState.findOne({floor: currentFloor}).rooms;
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i] == OPEN){
        open++;
      }
    }
    return open;
  }

  Template.content.isBathroomsStateSet = function(){
    return BathroomsState.findOne({floor: currentFloor}) != undefined;
  }

  Template.message.title = function(){
    if(openRooms() > 0){
      return "woohoo";
    } else {
      return "oops";
    }
  }

  Template.message.content = function(){
    if(openRooms() > 0){
      return "bla";
    } else {
      return "ggg";
    }
  }

  Template.message.graphics = function(){
    if(openRooms() > 0){
      return "mr-turd";
    } else {
      return "shit-in-a-jar";
    }
  }

  Template.bathrooms.rendered = Layout.bathroomsLayout;
  Template.message.rendered = Layout.messageLayout;
  Template.content.rendered = Layout.resizeLayout;
}