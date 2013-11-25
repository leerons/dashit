CLOSE = "close", OPEN = "open", currentFloor = 2;

// Collection declerations
BathroomsState = new Meteor.Collection("bathrooms_state");

// Client
if (Meteor.isClient) {
  $( document ).ready(function() {
    resizeLayout();    
    $( window ).resize(resizeLayout);
  });

  function resizeLayout(){
    var body = $("body");
    var bodyHeight = body.height();
    var bodyWidth = body.width();

    // Content div
    var contentDiv = $("#content");
    var contentDivWidth = bodyHeight * 0.8333;
    var contentDivMarginLeft = (bodyWidth - contentDivWidth) / 2;
    contentDiv.width(contentDivWidth);
    contentDiv.css("margin-left", contentDivMarginLeft);

    bathroomsLayout(bodyHeight, bodyWidth);

    
  }

  function messageLayout(){
    var messageTop = $("#floor").position().top * 1.15;
    $("#message").css("top", messageTop)
  }

  function bathroomsLayout(bodyHeight, bodyWidth){
    if(bodyHeight == null){
      var body = $("body");
      var bodyHeight = body.height();
      var bodyWidth = body.width();
    }

    
    var doorHeight = bodyHeight * 0.4;
    var doorWidth = doorHeight * 0.496;
    var doorsGap = bodyWidth * 0.1; 

    // Indicator lights
    var indicatorLightWidth = doorWidth * 0.163;
    var indicatorLightLeft = (doorWidth - indicatorLightWidth) / 2;
    var indicatorLightTop = indicatorLightWidth * 1.166;
    $(".indicator-light").height(indicatorLightWidth).width(indicatorLightWidth)
    .css({"left": indicatorLightLeft}).css({"top": - indicatorLightTop});

    // Doors
    $(".door").height(doorHeight).width(doorWidth);

    // Bathrooms
    for(var i = 0; i < 3; i++){
      var left = i * (doorWidth + doorsGap);
      $("#room_"+i).css("left",left)
    }

    var bathroomsBottom = $("#floor").position().top - 3;
    var bathroomsDiv = $("#bathrooms");
    bathroomsDiv.css("bottom", bathroomsBottom);
  }

  Meteor.subscribe("bathroomsCurrentState");

  Template.bathrooms.rooms = function(){
    var state = BathroomsState.findOne({floor: currentFloor});
    console.log("rooms: "+state.rooms);
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

  Template.bathrooms.rendered = bathroomsLayout;
  Template.message.rendered = messageLayout;
}


// Server

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(BathroomsState.find({floor:currentFloor}).count == 0){
      BathroomsState.insert({floor:currentFloor, rooms: [CLOSE, CLOSE, CLOSE]});  
    }   
  });

  Meteor.publish("bathroomsCurrentState", function(){
    return BathroomsState.find({floor: currentFloor});
  });

  //Usage: Meteor.call("toiletRoomStateChange", {"floor": 2, "room":0, "state":CLOSE});
  Meteor.methods({
    toiletRoomStateChange: function(data){
      var oldState = BathroomsState.findOne({floor:data.floor});
      oldState.rooms[data.room] = data.state;
      BathroomsState.update({_id: oldState._id}, {$set: {rooms: oldState.rooms}});
    }
  });
}
