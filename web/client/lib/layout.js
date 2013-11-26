Layout  = {};
// Main content
Layout.resizeLayout = function(){
  var body = $("body");
  var bodyHeight = body.height();
  var bodyWidth = body.width();

  // Content div
  var contentDiv = $("#content");
  if(bodyWidth > bodyHeight * 0.6){
    var contentDivWidth = Math.round(bodyHeight * 0.85);
    var contentDivHeight =  Math.round(bodyHeight * 0.65);
    var contentDivMarginLeft = Math.round((bodyWidth - contentDivWidth) / 2);
    contentDiv.height(contentDivHeight).width(contentDivWidth)
      .css("left", contentDivMarginLeft);
  } else {
    var contentDivWidth = bodyWidth;
    var contentDivHeight = Math.round(bodyWidth * 1.18);
    contentDiv.height(contentDivHeight).width(contentDivWidth).css("left", 0);  
  }
  $("#floor").css("top", contentDivHeight);

  // Logo
  var logoDiv = $("#logo");
  var logoDivHeight = Math.round(contentDivHeight * 0.22);
  var logoDivWidth = Math.round(logoDivHeight * 2.8);
  var logoLeft = Math.round((contentDivWidth - logoDivWidth) / 2);
  var logoDivTop = Math.round(contentDivHeight * 0.05);
  logoDiv.width(logoDivWidth).height(logoDivHeight).css({"left": logoLeft, "top": logoDivTop});

  Layout.bathroomsLayout(contentDiv);
}

// Bathrooms graphics
Layout.bathroomsLayout = function(parent){
  parent = parent || $("#content");
  var parentHeight = parent.height();
  var parentWidth = parent.width();
  var parentPosition = parent.position();

  var doorHeight = Math.round(parentHeight * 0.6);
  var doorWidth = Math.round(doorHeight * 0.496);
  var doorsGap = Math.round(parentWidth * 0.15); 

  // Indicator lights
  var indicatorLightWidth = Math.round(doorWidth * 0.163);
  var indicatorLightLeft = Math.round((doorWidth - indicatorLightWidth) / 2);
  $(".indicator-light").height(indicatorLightWidth).width(indicatorLightWidth)
    .css({"left": indicatorLightLeft});

  // Doors
  var doorsTop = Math.round(indicatorLightWidth * 1.166);
  $(".door").css("top", doorsTop).height(doorHeight).width(doorWidth);
  var doorsCount = Template.bathrooms.rooms().length;

  // Bathrooms
  for(var i = 0; i < doorsCount; i++){
    var left = i * (doorWidth + doorsGap);
    $("#room_"+i).css("left",left);
  }

  var doorsWidth = Math.round(doorsCount * doorWidth + (doorsCount - 1 ) * doorsGap);
  var doorsStartLeft = Math.round((parentWidth - doorsWidth) / 2);
  $("#bathrooms").height(doorsTop + doorHeight).width(doorsWidth).css("left", doorsStartLeft); 
}

// Messages
Layout.messageLayout = function(){
  var messageTop = Math.round($("#floor").position().top * 1.15);
  $("#message").css("top", messageTop);
}