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