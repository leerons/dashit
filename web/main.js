CLOSE = "close", OPEN = "open", currentFloor = 2;

// Collection declerations
BathroomsState = new Meteor.Collection("bathrooms_state");

// Client
if (Meteor.isClient) {

  Meteor.subscribe("bathroomsCurrentState");

  Meteor.startup(function() {    
    $(window).resize(resizeLayout);
  });

  function resizeLayout(){
    var body = $("body");
    var bodyHeight = body.height();
    var bodyWidth = body.width();

    // Content div
    var contentDiv = $("#content");
    if(bodyWidth > bodyHeight * 0.6){
      var contentDivWidth = bodyHeight * 0.85;
      var contentDivHeight =  bodyHeight * 0.7;
      var contentDivMarginLeft = (bodyWidth - contentDivWidth) / 2;
      contentDiv.height(contentDivHeight).width(contentDivWidth)
        .css("left", contentDivMarginLeft);
    } else {
      var contentDivWidth = bodyWidth;
      var contentDivHeight = bodyWidth * 1.18;
      contentDiv.height(contentDivHeight).width(contentDivWidth).css("left", 0);  
    }
    $("#floor").css("top", contentDivHeight);

    // Logo
    var logoDiv = $("#logo");
    var logoDivHeight = contentDivHeight * 0.22;
    var logoDivWidth = logoDivHeight * 2.8;
    var logoLeft = (contentDivWidth - logoDivWidth) / 2;
    var logoDivTop = contentDivHeight * 0.05;
    logoDiv.width(logoDivWidth).height(logoDivHeight).css({"left": logoLeft, "top": logoDivTop});

    bathroomsLayout(contentDiv);
  }

  function messageLayout(){
    var messageTop = $("#floor").position().top * 1.15;
    $("#message").css("top", messageTop);
  }

  function bathroomsLayout(parent){
    parent = parent || $("#content");
    var parentHeight = parent.height();
    var parentWidth = parent.width();
    var parentPosition = parent.position();

    var doorHeight = parentHeight * 0.57;
    var doorWidth = doorHeight * 0.496;
    var doorsGap = parentWidth * 0.1; 

    // Indicator lights
    var indicatorLightWidth = doorWidth * 0.163;
    var indicatorLightLeft = (doorWidth - indicatorLightWidth) / 2;
    $(".indicator-light").height(indicatorLightWidth).width(indicatorLightWidth)
      .css({"left": indicatorLightLeft});

    // Doors
    var doorsTop = indicatorLightWidth * 1.166;
    $(".door").css("top", doorsTop).height(doorHeight).width(doorWidth);
    var doorsCount = 3;

    // Bathrooms
    for(var i = 0; i < doorsCount; i++){
      var left = i * (doorWidth + doorsGap);
      $("#room_"+i).css("left",left);
    }

    var doorsWidth = doorsCount * doorWidth + (doorsCount - 1 ) * doorsGap;
    var doorsStartLeft = (parentWidth - doorsWidth) / 2;
    $("#bathrooms").height(doorsTop + doorHeight).width(doorsWidth).css("left", doorsStartLeft); 
  }

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

  Template.bathrooms.rendered = bathroomsLayout;
  Template.message.rendered = messageLayout;
  Template.content.rendered = resizeLayout;
}


// Server

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(BathroomsState.find({floor:currentFloor}).count() == 0){
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
