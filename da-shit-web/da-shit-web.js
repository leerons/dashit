CLOSE = "close", OPEN = "open", currentFloor = 2;

// Collection declerations
BathroomsState = new Meteor.Collection("bathrooms_state");

// Client
if (Meteor.isClient) {
  Meteor.subscribe("bathroomsCurrentState");

  Template.comming_soon.description = function () {
    return "DaShit utilizes the shit-E-zx-6000, a handcrafted bathroom door sensor. The door sensors are connected to a Raspberry Pi controller and updates a MongoDB + Node.js + Meteor.js web server. The daShit website is kept up-to-date using web socket technology for a real time Know if You Can Go (TM) information at all times.";
  };

  Template.comming_soon.rooms = function () {
    var roomsStr = "";
    var state = BathroomsState.findOne({floor: currentFloor});
    if(state){
      roomsStr = "Floor #" + state.floor + " | rooms: [";
      for(var i = 0; i < state.rooms.length; i++){
        roomsStr += state.rooms[i] + ", ";
      }
    }
    return roomsStr;
  };
}


// Server

if (Meteor.isServer) {
  Meteor.startup(function () {
    BathroomsState.upsert({floor:2}, {floor:2, rooms: [CLOSE, CLOSE, CLOSE]});
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
