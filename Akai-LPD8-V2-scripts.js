var LPD8V2 = {};

// Define the three different codes that LPD sends from PROG1.
var _PAD   = 0x90;
var _PC    = 0xC0;
var _CC    = 0xB0;
var _KNOBS = _CC;

LPD8V2.init = function (id, debugging) {
  // Turn off all LEDs.
  for (var i = 9; i <= 16; i++) {
    midi.sendShortMsg(_CC, i, 0x00);
  }

  //init connects mainControl functions to get response from mixxx, if something changes
  //additionaly timers should keep eye on LEDs properly
  engine.makeConnection("[Channel1]", "play", syncButtonOutputCallback);
  engine.makeConnection("[Channel2]", "play", syncButtonOutputCallback);
  engine.makeConnection("[Channel1]", "pfl", syncButtonOutputCallback);
  engine.makeConnection("[Channel2]", "pfl", syncButtonOutputCallback);
}

var syncButtonOutputCallback = function (value, group, control) {

  status = _CC;

  switch(group) {
  	case '[Channel1]':
      switch(control) {
      	case 'play':
      	  control = 16;
      	  break;
      	case 'pfl':
      	  control = 13;
      	  break;
      }
  	  break;
  	case '[Channel2]':
      switch(control) {
      	case 'play':
      	  control = 12;
      	  break;
      	case 'pfl':
      	  control = 9;
      	  break;
      }
  	  break;
  	default:
  }

  midi.sendShortMsg(status, control, value); // see section below for an explanation of this example line
};

LPD8V2.shutdown = function() {
  // Turn off all LEDs.
  for (var i = 9; i <= 16; i++) {
    midi.sendShortMsg(_CC, i, 0x00);
  }
}

LPD8V2.play = function (channel, control, value, status, group) {
  if (value === 0) {
    // Toggle Play
    script.toggleControl(group, 'play');
    // Toggle Play button LED
    //midi.sendShortMsg(status, control, engine.getParameter(group, 'play'));

    midi.sendShortMsg(status, control, engine.getParameter(group, 'play'));
  }

}

LPD8V2.cue = function (channel, control, value, status, group) {
  // Toggle CUE
  script.toggleControl(group, 'cue_default'); 
}

LPD8V2.pfl = function (channel, control, value, status, group) {
  if (value === 0) {
    // Toggle PFL
    script.toggleControl(group, 'pfl');
    // Toggle button LED
    midi.sendShortMsg(status, control, engine.getParameter(group, 'pfl'));
  }
}
