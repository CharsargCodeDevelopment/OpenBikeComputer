//require("https://github.com/CharsargCodeDevelopment/OpenBikeComputer/blob/main/Modules/plotter.js");

var StartTime = getTime();
var PreviousTime = getTime();
var RPM = 0;
var SPR = 0;
var RPS = 0;
var RunningTime = 0;
var StopMovingTimeout = 10;
var PreviousFrameTime = getTime();
var DeltaTime = getTime - PreviousFrameTime;
var MainloopSpeed = 0.1;
var MeasumerentMode = 0;
var AlignmentMode = 0;
var StartGoingDownTimer = 2;
var C = 2.18;
var TriggerPerRevolution = 1;
var SafeMode = true;
var IRON = false;
var TriggerRiseTime = 0;
require("Font7x11Numeric7Seg").add(Graphics);
require("Font8x12").add(Graphics);
//require("Storage").compact(true);
//require("Storage").optimise();
var f = require("Storage").open("log","a");
//var f1 = require("Storage").open("log","w");


f.write("ct:"+getTime()+"\n");

function OnTrigger() {
  StartGoingDownTimer = 1;
  StopMovingTimeout = 10;
  var PreviousFrameTime = getTime();
  currentTime = getTime();
  SPR = currentTime - PreviousTime;
  if (SPR == 0) {
    SPR = 0.00001;
  }
  RPS = 1 / SPR;
  RPM = RPS * 60;
  //f.write("dt:"+SPR+"\n");
  f.write("dt:"+Math.round(SPR*10000)*0.0001+"\n");
  PreviousTime = currentTime;
  TriggerRiseTime = currentTime;
}
function OnRelease(){
  Duration = getTime()-TriggerRiseTime;
  f.write("bt:"+Duration+"\n");

}




function ShiftMeasurmentMode(){
if (MeasumerentMode<6){
MeasumerentMode +=1;

}else{
MeasumerentMode = 0;
}
}
function ShiftAlignmentMode(){
if (AlignmentMode<3){
AlignmentMode +=1;

}else{
AlignmentMode = 0;
}

}



function UpdateDisplay() {
  g.clear();
  
  g.setFontAlign(-1, -1);
  g.setFontVector(15);
  g.drawString(RunningTime, 0, 0);


  g.setFontVector(1);
  g.setFont("8x12", 3);
  console.log(SpeedText);
  if (AlignmentMode==0 || AlignmentMode==2){
  g.setFontAlign(0, 0);
  g.drawString(SpeedText, 64, 32);
  }
  else if (AlignmentMode==1 || AlignmentMode==3){
  g.setFontAlign(-1, 0);
  g.drawString(SpeedText, 0, 32);
  }
  g.setFont("8x12", 1);
  g.setFontAlign(1, -1);
  if (MeasumerentMode == 0){
  g.drawString("RPS", 128, 0);
  }else if (MeasumerentMode == 1){
  g.drawString("RPM", 128, 0);
  }else if (MeasumerentMode == 2){
  g.drawString("M/S", 128, 0);
  }else if (MeasumerentMode == 3){
  g.drawString("M/M", 128, 0);
  }else if (MeasumerentMode == 4){
  g.drawString("M/H", 128, 0);
  }else if (MeasumerentMode == 5){
  g.drawString("K/H", 128, 0);
  }else if (MeasumerentMode == 6){
  g.drawString("MPH", 128, 0);
  }
  g.setFontAlign(1, 1);
  g.drawString("V0.0.2 Debug 2", 128, 64);




  g.flip();

}

function MainLoop() {
  var DeltaTime = getTime() - PreviousFrameTime;
  var PreviousFrameTime = getTime();
  RunningTime = Math.round(getTime() - StartTime);
  if (MeasumerentMode>1){
  mps = RPS*C;
  }
  if (MeasumerentMode == 0){
  speed = RPS;
  }
  else if (MeasumerentMode == 1){
  speed = RPM;
  }
  else if (MeasumerentMode == 2){
  speed = mps;
  }
  else if (MeasumerentMode == 3){
  speed = mps/60;
  }
  else if (MeasumerentMode == 4){
  speed = (mps/60)/60;
  }
  else if (MeasumerentMode == 5){
  speed = ((mps/60)/60)/1000;
  }
  else if (MeasumerentMode == 6){
  speed = 0.6213711922 *(((mps/60)/60)/1000);
  }
  
  if (AlignmentMode==0 || AlignmentMode==1){
    SpeedText = Math.round(speed*1000)*0.001;
  }else if (AlignmentMode==2 || AlignmentMode==3){
  SpeedText = Math.round(speed*1)*1;
  }
  
  
  
  UpdateDisplay();

  if (StopMovingTimeout <= 0) {
    RPM = 0;
    RPS = 0;
    StopMovingTimeout = 0;
    LED1.write(false);
  } else {
    LED1.write(true);
  }
  console.log(StopMovingTimeout);
  StopMovingTimeout = StopMovingTimeout - MainloopSpeed;
  StartGoingDownTimer -= MainloopSpeed;
  if (StartGoingDownTimer<=0){
  if (RPS > 0){
  RPS -= 1*MainloopSpeed;
  }
  if (RPS < 0){
  RPS = 0;
  }
  if ((RPS < 0)==false){
  RPM = RPS / 60;
  }
  }

}


function SlowProscess(){
//f.write("ct:"+getTime()+"\n");

}

function ClearLog(){
if (SafeMode == false){
require("Storage").write("log","\n");
}else{
IRON = IRON == false;
digitalWrite(D1,IRON);
}

}


setWatch(OnTrigger, BTN1, {
  edge: 'rising',
  debounce: 20,
  repeat: true
});
setWatch(OnRelease, BTN1, {
  edge: 'falling',
  debounce: 20,
  repeat: true
});

setWatch(ShiftMeasurmentMode, BTN2, {
  edge: 'rising',
  debounce: 50,
  repeat: true
});
setWatch(ShiftAlignmentMode, BTN3, {
  edge: 'rising',
  debounce: 50,
  repeat: true
});
setWatch(ClearLog, BTN4, {
  edge: 'rising',
  debounce: 50,
  repeat: true
});
setWatch(OnTrigger, D0, {
  edge: 'rising',
  debounce: 20,
  repeat: true
});
setWatch(OnRelease, D0, {
  edge: 'falling',
  debounce: 20,
  repeat: true
});


//setInterval(OnTrigger, 1000);
setInterval(MainLoop, MainloopSpeed * 1000);
setInterval(SlowProscess, 5000);
